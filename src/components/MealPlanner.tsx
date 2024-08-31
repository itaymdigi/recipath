import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Meal, Recipe } from '../types';

const MealPlanner: React.FC = () => {
  const [user] = useAuthState(auth);
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (user) {
        const recipesCollection = collection(db, 'recipes');
        const userRecipesQuery = query(recipesCollection, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(userRecipesQuery);
        const fetchedRecipes: Recipe[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRecipes.push({ id: doc.id, ...doc.data() } as Recipe);
        });
        setRecipes(fetchedRecipes);
      }
    };

    fetchRecipes();
  }, [user]);

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