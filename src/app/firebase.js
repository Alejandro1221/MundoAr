// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {  getAuth} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfkayuiS5PKsnI8wsDNO53xxdd5GTbV7c",
  authDomain: "mundoar-146fb.firebaseapp.com",
  projectId: "mundoar-146fb",
  storageBucket: "mundoar-146fb.firebasestorage.app",
  messagingSenderId: "734509520863",
  appId: "1:734509520863:web:fbcd80b5cf64d5866f966a",
  measurementId: "G-SJQ4WB9PXN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);