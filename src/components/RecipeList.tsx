import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Recipe } from '../types';
import { FaClock, FaUtensils, FaSearch } from 'react-icons/fa';
import Masonry from 'react-masonry-css';

const RecipeList: React.FC = () => {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase())) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">My Recipes</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      <Masonry
        breakpointCols={{default: 3, 1100: 2, 700: 1}}
        className="flex w-auto"
        columnClassName="bg-clip-padding px-2"
      >
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 break-inside-avoid">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Category: {recipe.category}</p>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FaClock className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Prep: {recipe.prepTime} min</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Cook: {recipe.cookTime} min</span>
                </div>
                <div className="flex items-center">
                  <FaUtensils className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Servings: {recipe.servings}</span>
                </div>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                  <li key={index} className="text-sm text-gray-600">{ingredient}</li>
                ))}
                {recipe.ingredients.length > 3 && (
                  <li className="text-sm text-gray-600">And {recipe.ingredients.length - 3} more...</li>
                )}
              </ul>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 w-full">
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default RecipeList;