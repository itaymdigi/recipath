import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import RecipeList from './components/RecipeList';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';
import AddRecipe from './components/AddRecipe';
import './index.css';

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {user && <Navbar />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Welcome />} />
            <Route path="/recipes" element={user ? <RecipeList /> : <Navigate to="/" replace />} />
            <Route path="/add-recipe" element={user ? <AddRecipe /> : <Navigate to="/" replace />} />
            <Route path="/meal-planner" element={user ? <MealPlanner /> : <Navigate to="/" replace />} />
            <Route path="/shopping-list" element={user ? <ShoppingList /> : <Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;