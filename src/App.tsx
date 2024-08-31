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
import RecipeForm from './components/RecipeForm';
import './index.css';  // Updated import

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {user && <Navbar />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Welcome />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
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