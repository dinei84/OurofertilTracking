import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyByDgJPA0wP9lFBzFIGDMFPo1uZFsoo_g4",
  authDomain: "controle-de-frete-21c73.firebaseapp.com",
  projectId: "controle-de-frete-21c73",
  storageBucket: "controle-de-frete-21c73.appspot.com",
  messagingSenderId: "8256813156",
  appId: "1:8256813156:web:0fe3fb45c4dcfb0782c771",
  measurementId: "G-QHN2TXVWPQ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { collection, addDoc };
