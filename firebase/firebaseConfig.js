// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFg9IJUhrS95wmKobv1EDyrbZfue_dMSA",
  authDomain: "cloudkanban.firebaseapp.com",
  projectId: "cloudkanban",
  storageBucket: "cloudkanban.appspot.com",
  messagingSenderId: "952597380752",
  appId: "1:952597380752:web:f320dc8fd3778e991ea215",
  measurementId: "G-1PX7408DY0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export app, auth, and db
export { app, auth, db };
