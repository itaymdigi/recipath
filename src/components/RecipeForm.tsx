import React, { useState } from 'react';
import { Recipe } from '../types';

const RecipeForm: React.FC = () => {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: '',
    ingredients: [],
    instructions: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save recipe to API or local storage
    console.log('Recipe submitted:', recipe);
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