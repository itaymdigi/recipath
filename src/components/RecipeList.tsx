import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { Recipe } from '../types';
import { FaClock, FaUtensils, FaSearch, FaTag, FaEdit, FaTrashAlt, FaGlobeAmericas } from 'react-icons/fa';
import EditRecipe from './EditRecipe';

const RecipeList: React.FC = () => {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [apiSearchTerm, setApiSearchTerm] = useState('');
  const [apiSuggestions, setApiSuggestions] = useState<Partial<Recipe>[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (user) {
        console.log("Fetching recipes for user:", user.uid);
        const recipesCollection = collection(db, 'recipes');
        const userRecipesQuery = query(recipesCollection, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(userRecipesQuery);
        const fetchedRecipes: Recipe[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRecipes.push({ id: doc.id, ...doc.data() } as Recipe);
        });
        console.log("Fetched recipes:", fetchedRecipes);
        setRecipes(fetchedRecipes);
      }
    };

    fetchRecipes();
  }, [user]);

  useEffect(() => {
    console.log("Recipes state updated:", recipes);
  }, [recipes]);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase())) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Filtered recipes:", filteredRecipes);

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

  const handleUpdateRecipe = async (updatedRecipe: Recipe) => {
    if (user) {
      try {
        const recipeRef = doc(db, 'recipes', updatedRecipe.id);
        await updateDoc(recipeRef, updatedRecipe);
        setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
        setSelectedRecipe(updatedRecipe);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating recipe:', error);
        alert('Failed to update recipe. Please try again.');
      }
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteDoc(doc(db, 'recipes', recipeId));
        setRecipes(recipes.filter(r => r.id !== recipeId));
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };

  const searchRecipesFromAPI = async () => {
    const apiKey = 'aad7adfc04cd492d937a6d50f0fbc002'; // Replace with your actual Spoonacular API key
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${apiSearchTerm}&addRecipeInformation=true&number=5`;

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
      setApiSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleAddRecipeFromAPI = async (recipe: Partial<Recipe>) => {
    if (user) {
      try {
        const newRecipe = {
          ...recipe,
          userId: user.uid,
          cookTime: 0, // You might want to add this field to the API response or set a default value
          photoURL: '', // We'll update this after uploading the image
        };
        const docRef = await addDoc(collection(db, 'recipes'), newRecipe);
        const addedRecipe = { id: docRef.id, ...newRecipe } as Recipe;
        setRecipes([...recipes, addedRecipe]);
        setApiSuggestions([]);
        setApiSearchTerm('');

        // If there's an image URL from the API, download and upload it to Firebase Storage
        if (recipe.photoURL) {
          const response = await fetch(recipe.photoURL);
          const blob = await response.blob();
          const imageRef = ref(storage, `recipes/${user.uid}/${docRef.id}`);
          await uploadBytes(imageRef, blob);
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(docRef, { photoURL: downloadURL });
          addedRecipe.photoURL = downloadURL;
          setRecipes(recipes.map(r => r.id === addedRecipe.id ? addedRecipe : r));
        }
      } catch (error) {
        console.error('Error adding recipe:', error);
        alert('Failed to add recipe. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
      <div className="flex space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search your recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search online recipes..."
            value={apiSearchTerm}
            onChange={(e) => setApiSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FaGlobeAmericas className="absolute left-3 top-3 text-gray-400" />
          <button
            onClick={searchRecipesFromAPI}
            className="absolute right-2 top-2 bg-green-500 text-white px-4 py-1 rounded-full"
          >
            Search Online
          </button>
        </div>
      </div>
      {apiSuggestions.length > 0 && (
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Online Recipe Suggestions:</h2>
          <ul>
            {apiSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <span>{suggestion.name}</span>
                <button
                  onClick={() => handleAddRecipeFromAPI(suggestion)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Add to My Recipes
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {filteredRecipes.length === 0 ? (
        <p>No recipes found. Try adding some recipes or adjusting your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onView={handleViewRecipe} 
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      )}
      {selectedRecipe && !isEditing && (
        <RecipeModal recipe={selectedRecipe} onClose={handleCloseRecipe} onEdit={handleEditRecipe} />
      )}
      {isEditing && selectedRecipe && (
        <EditRecipe recipe={selectedRecipe} onClose={handleCloseRecipe} onUpdate={handleUpdateRecipe} />
      )}
    </div>
  );
};

const RecipeCard: React.FC<{ 
  recipe: Recipe; 
  onView: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
}> = ({ recipe, onView, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{recipe.name}</h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(recipe.id);
          }} 
          className="text-red-500 hover:text-red-700 transition duration-300"
        >
          <FaTrashAlt />
        </button>
      </div>
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