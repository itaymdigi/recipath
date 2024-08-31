import React, { useState } from 'react';
import { Meal, Recipe } from '../types';

const MealPlanner: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Dummy data for recipes
  React.useEffect(() => {
    setRecipes([
      { id: 1, name: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'ground beef', 'tomato sauce'], instructions: 'Cook spaghetti...', prepTime: 15, cookTime: 30, servings: 4, category: 'Dinner' },
      { id: 2, name: 'Chicken Curry', ingredients: ['chicken', 'curry powder', 'coconut milk'], instructions: 'Cut chicken...', prepTime: 20, cookTime: 40, servings: 4, category: 'Dinner' },
      { id: 3, name: 'Pancakes', ingredients: ['flour', 'milk', 'eggs'], instructions: 'Mix ingredients...', prepTime: 10, cookTime: 15, servings: 2, category: 'Breakfast' },
    ]);
  }, []);

  const addMealToPlan = (day: string, recipeId: number) => {
    const newMeal: Meal = {
      id: mealPlan.length + 1,
      recipeId: recipeId,
      date: new Date(day),
    };
    setMealPlan([...mealPlan, newMeal]);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div>
      <h2>Meal Planner</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Meal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              <td>
                {mealPlan.find((meal) => meal.date.toDateString() === new Date(day).toDateString())
                  ? recipes.find((recipe) => recipe.id === mealPlan.find((meal) => meal.date.toDateString() === new Date(day).toDateString())?.recipeId)?.name
                  : 'No meal planned'}
              </td>
              <td>
                <select onChange={(e) => addMealToPlan(day, parseInt(e.target.value))}>
                  <option value="">Select a recipe</option>
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlanner;