import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Recipe } from '../types';
import { FaClock, FaUtensils, FaSearch, FaTag, FaEdit } from 'react-icons/fa';
import EditRecipe from './EditRecipe';

const RecipeList: React.FC = () => {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseRecipe = () => {
    setSelectedRecipe(null);
    setIsEditing(false);
  };

  const handleEditRecipe = () => {
    setIsEditing(true);
  };

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
    setSelectedRecipe(updatedRecipe);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onView={handleViewRecipe} />
        ))}
      </div>
      {selectedRecipe && !isEditing && (
        <RecipeModal recipe={selectedRecipe} onClose={handleCloseRecipe} onEdit={handleEditRecipe} />
      )}
      {isEditing && selectedRecipe && (
        <EditRecipe recipe={selectedRecipe} onClose={handleCloseRecipe} onUpdate={handleUpdateRecipe} />
      )}
    </div>
  );
};

const RecipeCard: React.FC<{ recipe: Recipe; onView: (recipe: Recipe) => void }> = ({ recipe, onView }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.name}</h3>
      <div className="flex items-center mb-4">
        <FaTag className="text-green-500 mr-2" />
        <span className="text-sm text-gray-600">{recipe.category}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaClock className="text-green-500 mr-2" />
          <span className="text-sm text-gray-600">Prep: {recipe.prepTime} min</span>
        </div>
        <div className="flex items-center">
          <FaClock className="text-green-500 mr-2" />
          <span className="text-sm text-gray-600">Cook: {recipe.cookTime} min</span>
        </div>
        <div className="flex items-center">
          <FaUtensils className="text-green-500 mr-2" />
          <span className="text-sm text-gray-600">Servings: {recipe.servings}</span>
        </div>
      </div>
      <button 
        onClick={() => onView(recipe)} 
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 w-full"
      >
        View Recipe
      </button>
    </div>
  </div>
);

const RecipeModal: React.FC<{ recipe: Recipe; onClose: () => void; onEdit: () => void }> = ({ recipe, onClose, onEdit }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{recipe.name}</h3>
      {recipe.photoURL && <img src={recipe.photoURL} alt={recipe.name} className="w-full h-48 object-cover mb-4" />}
      <p><strong>Category:</strong> {recipe.category}</p>
      <p><strong>Prep Time:</strong> {recipe.prepTime} minutes</p>
      <p><strong>Cook Time:</strong> {recipe.cookTime} minutes</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>
      <h4 className="font-semibold mt-4">Ingredients:</h4>
      <ul className="list-disc list-inside">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h4 className="font-semibold mt-4">Instructions:</h4>
      <p>{recipe.instructions}</p>
      <div className="mt-4 flex justify-between">
        <button onClick={onEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <FaEdit className="inline-block mr-2" /> Edit
        </button>
        <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  </div>
);

export default RecipeList;