import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Recipes</Link></li>
          <li><Link to="/meal-planner">Meal Planner</Link></li>
          <li><Link to="/shopping-list">Shopping List</Link></li>
          <li><Link to="/add-recipe">Add Recipe</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;