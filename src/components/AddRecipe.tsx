import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Recipe } from '../types';
import { FaSearch } from 'react-icons/fa';

const AddRecipe: React.FC = () => {
  const [user] = useAuthState(auth);
  const [recipe, setRecipe] = useState<Partial<Recipe>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Partial<Recipe>[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const searchRecipes = async () => {
    // Replace 'YOUR_API_KEY' with your actual API key
    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchTerm}&addRecipeInformation=true&number=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const formattedSuggestions = data.results.map((item: any) => ({
        name: item.title,
        prepTime: item.readyInMinutes,
        servings: item.servings,
        ingredients: item.extendedIngredients.map((ing: any) => ing.original),
        instructions: item.instructions,
        category: item.dishTypes[0] || 'Uncategorized',
      }));
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching recipes:', error);
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
        });
        setRecipe({});
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
          placeholder="Search for recipe suggestions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
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
          value={recipe.ingredients?.join('\n') || ''}
          onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value.split('\n') })}
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