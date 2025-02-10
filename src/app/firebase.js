// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js"; // 🔹 IMPORTAR STORAGE

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfkayuiS5PKsnI8wsDNO53xxdd5GTbV7c",
  authDomain: "mundoar-146fb.firebaseapp.com",
  projectId: "mundoar-146fb",
  storageBucket: "mundoar-146fb.appspot.com", // 🔹 CORREGIDO
  messagingSenderId: "734509520863",
  appId: "1:734509520863:web:fbcd80b5cf64d5866f966a",
  measurementId: "G-SJQ4WB9PXN"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 🔹 EXPORTAR STORAGE
