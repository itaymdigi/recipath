import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';

interface ShoppingListItem {
  name: string;
  checked: boolean;
}

const ShoppingList: React.FC = () => {
  const [user] = useAuthState(auth);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    const fetchShoppingList = async () => {
      if (user) {
        const shoppingListRef = doc(db, 'shoppingLists', user.uid);
        const shoppingListDoc = await getDoc(shoppingListRef);
        if (shoppingListDoc.exists()) {
          const data = shoppingListDoc.data();
          setShoppingList(data.items.map((item: string) => ({ name: item, checked: false })));
        }
      }
    };

    fetchShoppingList();
  }, [user]);

  const toggleItem = async (index: number) => {
    const newList = [...shoppingList];
    newList[index].checked = !newList[index].checked;
    setShoppingList(newList);

    if (user) {
      const shoppingListRef = doc(db, 'shoppingLists', user.uid);
      await updateDoc(shoppingListRef, {
        items: newList.map(item => item.name)
      });
    }
  };

  const removeItem = async (index: number) => {
    const itemToRemove = shoppingList[index].name;
    const newList = shoppingList.filter((_, i) => i !== index);
    setShoppingList(newList);

    if (user) {
      const shoppingListRef = doc(db, 'shoppingLists', user.uid);
      await updateDoc(shoppingListRef, {
        items: arrayRemove(itemToRemove)
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shopping List</h2>
      <ul className="space-y-2">
        {shoppingList.map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(index)}
                className="mr-2"
              />
              <span className={item.checked ? 'line-through text-gray-500' : ''}>{item.name}</span>
            </div>
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;