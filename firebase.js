// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgl2kEd7S-G2KFKiJ7JZzL2eqbXexvvJE",
  authDomain: "simple-notes-app-d11aa.firebaseapp.com",
  projectId: "simple-notes-app-d11aa",
  storageBucket: "simple-notes-app-d11aa.appspot.com",
  messagingSenderId: "297298476206",
  appId: "1:297298476206:web:fe969ebbcad611f73ec13f"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");