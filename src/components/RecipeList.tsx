import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // TODO: Fetch recipes from API or local storage
    const dummyRecipes: Recipe[] = [
      { id: 1, name: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'ground beef', 'tomato sauce'], instructions: 'Cook spaghetti...' },
      { id: 2, name: 'Chicken Curry', ingredients: ['chicken', 'curry powder', 'coconut milk'], instructions: 'Cut chicken...' },
    ];
    setRecipes(dummyRecipes);
  }, []);

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.name}</h3>
            <p>Ingredients: {recipe.ingredients.join(', ')}</p>
            <p>Instructions: {recipe.instructions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;