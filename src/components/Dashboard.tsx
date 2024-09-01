import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaCalendarAlt, FaShoppingBasket, FaPlusCircle } from 'react-icons/fa';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Recipe } from '../types';

const Dashboard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (user) {
        setLoading(true);
        const recipesCollection = collection(db, 'recipes');
        const userRecipesQuery = query(recipesCollection, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(userRecipesQuery);
        const fetchedRecipes = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Recipe));
        setRecipes(fetchedRecipes);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Recipath</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard to="/recipes" icon={<FaUtensils />} title="My Recipes" description={`You have ${recipes.length} recipes`} />
        <DashboardCard to="/meal-planner" icon={<FaCalendarAlt />} title="Meal Planner" description="Plan your meals for the week" />
        <DashboardCard to="/shopping-list" icon={<FaShoppingBasket />} title="Shopping List" description="Manage your shopping list" />
        <DashboardCard to="/add-recipe" icon={<FaPlusCircle />} title="Add Recipe" description="Create a new recipe" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Your Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600">You haven't added any recipes yet. Click "Add Recipe" to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
  <Link to={to} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <div className="text-4xl text-green-500 mb-4">{icon}</div>
    <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </Link>
);

const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const getFirstIngredient = (ingredients: string | string[] | undefined) => {
    if (typeof ingredients === 'string') {
      return ingredients.split('\n')[0];
    } else if (Array.isArray(ingredients)) {
      return ingredients[0];
    }
    return 'No ingredients listed';
  };

  return (
    <Link to={`/recipes/${recipe.id}`} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      {recipe.photoURL && (
        <img src={recipe.photoURL} alt={recipe.title} className="w-full h-48 object-cover rounded-md mb-4" />
      )}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{recipe.title}</h3>
      <p className="text-gray-600 truncate">{getFirstIngredient(recipe.ingredients)}</p>
    </Link>
  );
};

export default Dashboard;