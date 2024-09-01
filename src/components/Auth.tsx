import React from 'react';
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Auth: React.FC = () => {
  const [user] = useAuthState(auth);

  const signInWithGoogle = async () => {
    // Sign out and clear any existing auth state
    await auth.signOut();
    
    // Create a new instance of GoogleAuthProvider for each sign-in attempt
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      login_hint: '',
      access_type: 'offline',
      include_granted_scopes: 'true'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Signed in successfully', result.user);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Signed out successfully');
      // Clear any cached credentials
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
};

export default Auth;