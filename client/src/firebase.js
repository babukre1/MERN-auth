// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth1.firebaseapp.com",
  projectId: "mern-auth1",
  storageBucket: "mern-auth1.appspot.com",
  messagingSenderId: "983940978204",
  appId: "1:983940978204:web:1912a2c05df6454c9731d9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);