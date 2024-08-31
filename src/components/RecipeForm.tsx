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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const recipeWithUserId = { ...recipe, userId: user.uid };
        const docRef = await addDoc(collection(db, 'recipes'), recipeWithUserId);
        console.log('Recipe added with ID: ', docRef.id);
        // Reset form or navigate to recipe list
        setRecipe({
          name: '',
          ingredients: [],
          instructions: '',
          prepTime: 0,
          cookTime: 0,
          servings: 0,
          category: '',
        });
      } catch (error) {
        console.error('Error adding recipe: ', error);
      }
    }
  };

  return (
    <div>
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Recipe Name:</label>
          <input
            type="text"
            id="name"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            value={recipe.category}
            onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="prepTime">Prep Time (minutes):</label>
          <input
            type="number"
            id="prepTime"
            value={recipe.prepTime}
            onChange={(e) => setRecipe({ ...recipe, prepTime: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <label htmlFor="cookTime">Cook Time (minutes):</label>
          <input
            type="number"
            id="cookTime"
            value={recipe.cookTime}
            onChange={(e) => setRecipe({ ...recipe, cookTime: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <label htmlFor="servings">Servings:</label>
          <input
            type="number"
            id="servings"
            value={recipe.servings}
            onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients (comma-separated):</label>
          <input
            type="text"
            id="ingredients"
            value={recipe.ingredients?.join(', ')}
            onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value.split(',').map(i => i.trim()) })}
            required
          />
        </div>
        <div>
          <label htmlFor="instructions">Instructions:</label>
          <textarea
            id="instructions"
            value={recipe.instructions}
            onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
            required
          />
        </div>
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;