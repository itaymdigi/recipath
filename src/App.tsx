import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';
import RecipeForm from './components/RecipeForm';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <div className="App">
        <Header />
        <Auth />
        {user ? (
          <main>
            <Routes>
              <Route path="/" element={<RecipeList />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/shopping-list" element={<ShoppingList />} />
              <Route path="/add-recipe" element={<RecipeForm />} />
            </Routes>
          </main>
        ) : (
          <Navigate to="/" replace />
        )}
      </div>
    </Router>
  );
};

export default App;