import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaCalendarAlt, FaShoppingBasket, FaPlusCircle } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Recipath</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard to="/recipes" icon={<FaUtensils />} title="My Recipes" description="View and manage your recipes" />
        <DashboardCard to="/meal-planner" icon={<FaCalendarAlt />} title="Meal Planner" description="Plan your meals for the week" />
        <DashboardCard to="/shopping-list" icon={<FaShoppingBasket />} title="Shopping List" description="Manage your shopping list" />
        <DashboardCard to="/add-recipe" icon={<FaPlusCircle />} title="Add Recipe" description="Create a new recipe" />
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
  <Link to={to} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <div className="text-4xl text-green-500 mb-4">{icon}</div>
    <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </Link>
);

export default Dashboard;