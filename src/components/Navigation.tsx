import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/recipes">My Recipes</Link></li>
        <li><Link to="/add-recipe">Add Recipe</Link></li>
        <li><Link to="/meal-planner">Meal Planner</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;