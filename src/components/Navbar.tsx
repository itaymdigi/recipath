import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaCalendarAlt, FaShoppingBasket, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../firebase';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/dashboard" className="flex items-center py-4 px-2">
                <FaUtensils className="text-green-500 text-2xl mr-2" />
                <span className="font-semibold text-gray-500 text-lg">Recipath</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/dashboard" icon={<FaHome />} isActive={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink to="/recipes" icon={<FaUtensils />} isActive={isActive('/recipes')}>Recipes</NavLink>
              <NavLink to="/meal-planner" icon={<FaCalendarAlt />} isActive={isActive('/meal-planner')}>Meal Planner</NavLink>
              <NavLink to="/shopping-list" icon={<FaShoppingBasket />} isActive={isActive('/shopping-list')}>Shopping List</NavLink>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/add-recipe" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">
              <FaPlusCircle className="inline-block mr-1" /> Add Recipe
            </Link>
            <button onClick={() => auth.signOut()} className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300">
              <FaSignOutAlt className="inline-block mr-1" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; isActive: boolean; children: React.ReactNode }> = ({ to, icon, isActive, children }) => (
  <Link
    to={to}
    className={`py-4 px-2 font-semibold ${
      isActive ? 'text-green-500 border-b-4 border-green-500' : 'text-gray-500 hover:text-green-500 transition duration-300'
    }`}
  >
    {icon}
    <span className="ml-1">{children}</span>
  </Link>
);

export default Navbar;