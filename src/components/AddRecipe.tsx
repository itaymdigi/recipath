import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Recipe } from '../types';
import { FaSearch } from 'react-icons/fa';

const AddRecipe: React.FC = () => {
  const [user] = useAuthState(auth);
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
    console.log('Environment variables:', import.meta.env);
    const key = import.meta.env.VITE_SPOONACULAR_API_KEY;
    console.log('API Key:', key);
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
      const formattedSuggestions = data.results.map((item: any) => ({
        name: item.title,
        prepTime: item.readyInMinutes,
        cookTime: item.cookingMinutes || 0,
        servings: item.servings,
        ingredients: item.extendedIngredients.map((ing: any) => ing.original).join('\n'),
        instructions: item.analyzedInstructions[0]?.steps.map((step: any) => step.step).join('\n') || item.instructions,
        category: item.dishTypes[0] || 'Uncategorized',
      }));
      console.log('Formatted Suggestions:', formattedSuggestions);
      setSuggestions(formattedSuggestions);
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
        await addDoc(collection(db, 'recipes'), {
          ...recipe,
          userId: user.uid,
          ingredients: recipe.ingredients?.split('\n'),
        });
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
        alert('Failed to add recipe. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Add New Recipe</h1>
      <div className="relative">
        <input
          type="text"
          id="searchInput"
          name="searchInput"
          placeholder="Search for recipe suggestions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          autoComplete="off"
        />
        <label htmlFor="searchInput" className="sr-only">Search for recipe suggestions</label>
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
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
        <div>
          <label htmlFor="name" className="sr-only">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name || ''}
            onChange={handleInputChange}
            placeholder="Recipe Name"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="category" className="sr-only">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={recipe.category || ''}
            onChange={handleInputChange}
            placeholder="Category"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="prepTime" className="sr-only">Prep Time</label>
          <input
            type="number"
            id="prepTime"
            name="prepTime"
            value={recipe.prepTime || ''}
            onChange={handleInputChange}
            placeholder="Prep Time (minutes)"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="cookTime" className="sr-only">Cook Time</label>
          <input
            type="number"
            id="cookTime"
            name="cookTime"
            value={recipe.cookTime || ''}
            onChange={handleInputChange}
            placeholder="Cook Time (minutes)"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="servings" className="sr-only">Servings</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={recipe.servings || ''}
            onChange={handleInputChange}
            placeholder="Servings"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="sr-only">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={recipe.ingredients || ''}
            onChange={handleInputChange}
            placeholder="Ingredients (one per line)"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={5}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="instructions" className="sr-only">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions || ''}
            onChange={handleInputChange}
            placeholder="Instructions"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={5}
            autoComplete="off"
          />
        </div>
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