import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Google Sign-In Configuration
GoogleSignin.configure({
    webClientId: '686062898858-jiph5n32r1ihvoborp5o2goj3aadoo2f.apps.googleusercontent.com', // Add the Web Client ID from Firebase Console
});

// Function for Google Sign-In
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices(); // Ensure Google Play Services are available
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = userInfo; // Get the idToken

    // Use the idToken to authenticate with Firebase
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return await auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Function for Email Sign-Up
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    return await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Email Sign-Up Error:', error);
    throw error;
  }
};

// Function for Email Sign-In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Email Sign-In Error:', error);
    throw error;
  }
};

// Monitor authentication state
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth().onAuthStateChanged(callback);
};
