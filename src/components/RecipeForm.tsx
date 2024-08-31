import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Recipe } from '../types';

const RecipeForm: React.FC = () => {
  const [user] = useAuthState(auth);
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: '',
    ingredients: [],
    instructions: '',
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    category: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const recipeWithUserId = { ...recipe, userId: user.uid };
        const docRef = await addDoc(collection(db, 'recipes'), recipeWithUserId);
        console.log('Recipe added with ID: ', docRef.id);
        setSuccessMessage('Recipe added successfully!');
        // Reset form
        setRecipe({
          name: '',
          ingredients: [],
          instructions: '',
          prepTime: 0,
          cookTime: 0,
          servings: 0,
          category: '',
        });
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error adding recipe: ', error);
        setSuccessMessage('Error adding recipe. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Recipe</h2>
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Recipe Name:</label>
          <input
            type="text"
            id="name"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
          <input
            type="text"
            id="category"
            value={recipe.category}
            onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">Prep Time (minutes):</label>
          <input
            type="number"
            id="prepTime"
            value={recipe.prepTime}
            onChange={(e) => setRecipe({ ...recipe, prepTime: parseInt(e.target.value) })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">Cook Time (minutes):</label>
          <input
            type="number"
            id="cookTime"
            value={recipe.cookTime}
            onChange={(e) => setRecipe({ ...recipe, cookTime: parseInt(e.target.value) })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-gray-700">Servings:</label>
          <input
            type="number"
            id="servings"
            value={recipe.servings}
            onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients (comma-separated):</label>
          <input
            type="text"
            id="ingredients"
            value={recipe.ingredients?.join(', ')}
            onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value.split(',').map(i => i.trim()) })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions:</label>
          <textarea
            id="instructions"
            value={recipe.instructions}
            onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;