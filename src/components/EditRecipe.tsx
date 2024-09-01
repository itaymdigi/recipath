import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { Recipe } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';

interface EditRecipeProps {
  recipe: Recipe;
  onClose: () => void;
  onUpdate: (updatedRecipe: Recipe) => void;
}

const EditRecipe: React.FC<EditRecipeProps> = ({ recipe, onClose, onUpdate }) => {
  const [user] = useAuthState(auth);
  const [editedRecipe, setEditedRecipe] = useState<Recipe>(recipe);
  const [photo, setPhoto] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user.uid === recipe.userId) {
      try {
        let photoURL = editedRecipe.photoURL;
        if (photo) {
          const photoRef = ref(storage, `recipes/${user.uid}/${Date.now()}_${photo.name}`);
          await uploadBytes(photoRef, photo);
          photoURL = await getDownloadURL(photoRef);
        }

        const recipeRef = doc(db, 'recipes', editedRecipe.id);
        await updateDoc(recipeRef, { ...editedRecipe, photoURL });
        setSuccessMessage('Recipe updated successfully!');
        onUpdate({ ...editedRecipe, photoURL });
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Error updating recipe: ', error);
        setSuccessMessage('Error updating recipe. Please try again.');
      }
    } else {
      setSuccessMessage('You do not have permission to edit this recipe.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Recipe</h3>
        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={editedRecipe.title}
            onChange={handleInputChange}
            placeholder="Recipe Title"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="ingredients"
            value={editedRecipe.ingredients}
            onChange={handleInputChange}
            placeholder="Ingredients (one per line)"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="instructions"
            value={editedRecipe.instructions}
            onChange={handleInputChange}
            placeholder="Instructions"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="file"
            onChange={handlePhotoChange}
            accept="image/*"
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update Recipe
          </button>
        </form>
        <button onClick={onClose} className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditRecipe;