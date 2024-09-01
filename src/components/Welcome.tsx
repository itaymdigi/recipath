import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      login_hint: '',
      access_type: 'offline',
      include_granted_scopes: 'true'
    });

    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Recipath</h1>
        <p className="text-xl mb-8 text-gray-600">Your personal recipe organizer and meal planner</p>
        <button
          onClick={signInWithGoogle}
          className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-600 transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Welcome;