import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Welcome from './components/Welcome';
import RecipeList from './components/RecipeList';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';
import RecipeForm from './components/RecipeForm';
import { FaUtensils, FaCalendarAlt, FaShoppingBasket, FaPlusCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';

const App: React.FC = () => {
  const [user] = useAuthState(auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 font-sans">
        {user && (
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {user && (
            <header className="bg-white shadow-sm z-10">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 focus:outline-none focus:text-gray-600 lg:hidden"
                >
                  <FaBars className="h-6 w-6" />
                </button>
              </div>
            </header>
          )}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={user ? <Navigate to="/home" replace /> : <Welcome />} />
                <Route path="/home" element={user ? <RecipeList /> : <Navigate to="/" replace />} />
                <Route path="/recipes" element={user ? <RecipeList /> : <Navigate to="/" replace />} />
                <Route path="/meal-planner" element={user ? <MealPlanner /> : <Navigate to="/" replace />} />
                <Route path="/shopping-list" element={user ? <ShoppingList /> : <Navigate to="/" replace />} />
                <Route path="/add-recipe" element={user ? <RecipeForm /> : <Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

const Sidebar: React.FC<{ open: boolean; setOpen: (open: boolean) => void }> = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <div className={`lg:flex ${open ? 'block' : 'hidden'} flex-col w-64 bg-gray-800 text-white`}>
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-xl font-semibold">Recipath</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <NavButton to="/recipes" icon={<FaUtensils />}>My Recipes</NavButton>
        <NavButton to="/meal-planner" icon={<FaCalendarAlt />}>Meal Planner</NavButton>
        <NavButton to="/shopping-list" icon={<FaShoppingBasket />}>Shopping List</NavButton>
        <NavButton to="/add-recipe" icon={<FaPlusCircle />}>Add Recipe</NavButton>
      </nav>
      <div className="px-2 py-4">
        <button 
          onClick={() => auth.signOut()} 
          className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <FaSignOutAlt />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(to)}
      className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default App;