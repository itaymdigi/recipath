import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';
import RecipeForm from './components/RecipeForm';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/add-recipe" element={<RecipeForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;