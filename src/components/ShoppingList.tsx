import React, { useState, useEffect } from 'react';

const ShoppingList: React.FC = () => {
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Generate shopping list based on meal plan
    const dummyList = ['Spaghetti', 'Ground beef', 'Tomato sauce', 'Chicken', 'Curry powder', 'Coconut milk'];
    setShoppingList(dummyList);
  }, []);

  return (
    <div>
      <h2>Shopping List</h2>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;