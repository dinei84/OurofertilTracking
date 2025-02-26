import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyByDgJPA0wP9lFBzFIGDMFPo1uZFsoo_g4",
  authDomain: "controle-de-frete-21c73.firebaseapp.com",
  projectId: "controle-de-frete-21c73",
  storageBucket: "controle-de-frete-21c73.appspot.com",
  messagingSenderId: "8256813156",
  appId: "1:8256813156:web:0fe3fb45c4dcfb0782c771",
  measurementId: "G-QHN2TXVWPQ"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
