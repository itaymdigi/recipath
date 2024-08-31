import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Welcome from './components/Welcome';
import RecipeList from './components/RecipeList';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';
import RecipeForm from './components/RecipeForm';

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && (
          <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex justify-between">
                <div className="flex space-x-7">
                  <div>
                    <Link to="/home" className="flex items-center py-4 px-2">
                      <span className="font-semibold text-gray-500 text-lg">RecipEase</span>
                    </Link>
                  </div>
                  <div className="hidden md:flex items-center space-x-1">
                    <Link to="/recipes" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">My Recipes</Link>
                    <Link to="/meal-planner" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Meal Planner</Link>
                    <Link to="/shopping-list" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Shopping List</Link>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-3">
                  <button onClick={() => auth.signOut()} className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Log Out</button>
                </div>
              </div>
            </div>
          </nav>
        )}
        <main className="max-w-6xl mx-auto mt-6 px-4">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/home" replace /> : <Welcome />} />
            <Route path="/home" element={user ? <RecipeList /> : <Navigate to="/" replace />} />
            <Route path="/recipes" element={user ? <RecipeList /> : <Navigate to="/" replace />} />
            <Route path="/meal-planner" element={user ? <MealPlanner /> : <Navigate to="/" replace />} />
            <Route path="/shopping-list" element={user ? <ShoppingList /> : <Navigate to="/" replace />} />
            <Route path="/add-recipe" element={user ? <RecipeForm /> : <Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;