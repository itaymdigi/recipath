import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Recipe } from '../types';
import { FaSearch } from 'react-icons/fa';

const AddRecipe: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Redirect to login page or show login prompt
      console.log('User not logged in');
    }
  }, [user, loading]);

  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: '',
    category: '',
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    ingredients: '',
    instructions: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Partial<Recipe>[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const key = import.meta.env.VITE_SPOONACULAR_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.error('Spoonacular API key is not set in environment variables');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const searchRecipes = async () => {
    if (!apiKey) {
      console.error('API key is not available');
      alert('API key is not available. Please check your environment variables.');
      return;
    }

    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchTerm}&addRecipeInformation=true&number=5`;

    try {
      console.log('Fetching recipes from:', url.replace(apiKey, 'REDACTED'));
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      console.log('API Response:', data);

      const detailedSuggestions = await Promise.all(
        data.results.map(async (item: any) => {
          const detailUrl = `https://api.spoonacular.com/recipes/${item.id}/information?apiKey=${apiKey}`;
          const detailResponse = await fetch(detailUrl);
          const detailData = await detailResponse.json();
          return {
            name: detailData.title,
            prepTime: detailData.preparationMinutes || 0,
            cookTime: detailData.cookingMinutes || 0,
            servings: detailData.servings || 0,
            ingredients: detailData.extendedIngredients
              ? detailData.extendedIngredients.map((ing: any) => ing.original).join('\n')
              : '',
            instructions: detailData.instructions || '',
            category: detailData.dishTypes && detailData.dishTypes.length > 0 ? detailData.dishTypes[0] : 'Uncategorized',
          };
        })
      );

      console.log('Detailed Suggestions:', detailedSuggestions);
      setSuggestions(detailedSuggestions);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to fetch recipes. Please try again.');
    }
  };

  const handleSuggestionSelect = (suggestion: Partial<Recipe>) => {
    setRecipe(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && recipe.name) {
      try {
        console.log('Current user:', user);
        console.log('User ID:', user.uid);
        console.log('Attempting to add recipe:', recipe);
        const recipeToAdd = {
          ...recipe,
          userId: user.uid,
          ingredients: recipe.ingredients?.split('\n').filter(ingredient => ingredient.trim() !== ''),
          prepTime: Number(recipe.prepTime),
          cookTime: Number(recipe.cookTime),
          servings: Number(recipe.servings),
          createdAt: new Date(),
        };
        console.log('Formatted recipe to add:', recipeToAdd);
        
        const docRef = await addDoc(collection(db, 'recipes'), recipeToAdd);
        console.log('Recipe added with ID: ', docRef.id);
        
        setRecipe({
          name: '',
          category: '',
          prepTime: 0,
          cookTime: 0,
          servings: 0,
          ingredients: '',
          instructions: '',
        });
        alert('Recipe added successfully!');
      } catch (error) {
        console.error('Error adding recipe:', error);
        alert(`Failed to add recipe. Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      console.log('User:', user);
      console.log('Recipe name:', recipe.name);
      alert('Please fill in the recipe name and make sure you are logged in.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Add New Recipe</h1>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for recipe suggestions..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={searchRecipes}
          className="absolute right-2 top-2 bg-green-500 text-white px-4 py-1 rounded-full"
        >
          Search
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Suggestions:</h2>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={recipe.name || ''}
          onChange={handleInputChange}
          placeholder="Recipe Name"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="category"
          value={recipe.category || ''}
          onChange={handleInputChange}
          placeholder="Category"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="number"
          name="prepTime"
          value={recipe.prepTime || ''}
          onChange={handleInputChange}
          placeholder="Prep Time (minutes)"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="number"
          name="cookTime"
          value={recipe.cookTime || ''}
          onChange={handleInputChange}
          placeholder="Cook Time (minutes)"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="number"
          name="servings"
          value={recipe.servings || ''}
          onChange={handleInputChange}
          placeholder="Servings"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          name="ingredients"
          value={recipe.ingredients || ''}
          onChange={handleInputChange}
          placeholder="Ingredients (one per line)"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={5}
        />
        <textarea
          name="instructions"
          value={recipe.instructions || ''}
          onChange={handleInputChange}
          placeholder="Instructions"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={5}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;