import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5gwUVX42EhXw5GOXLtCtbd_HVsbGh0v8",
  authDomain: "compiler-221e1.firebaseapp.com",
  projectId: "compiler-221e1",
  storageBucket: "compiler-221e1.appspot.com",
  messagingSenderId: "417987432944",
  appId: "1:417987432944:web:28e7f52f4fbf750fe2cd35",
  measurementId: "G-4TFKHZXMM5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Google Provider
const provider = new GoogleAuthProvider();

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
    return result.user; // Returns user details
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
};

/**
 * Check if a user is logged in
 * @param callback - Function that receives the user object (or null if not logged in)
 */
export const checkUserLogin = (callback: (user: User | null) => void) => {
  onAuthStateChanged(auth, callback);
};

// Export auth instance
export { auth };
