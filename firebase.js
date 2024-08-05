// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmLQRE_Sn_1f-XW332wMwpMmuPhEj7Po0",
  authDomain: "inventory-management-d9619.firebaseapp.com",
  projectId: "inventory-management-d9619",
  storageBucket: "inventory-management-d9619.appspot.com",
  messagingSenderId: "983528129102",
  appId: "1:983528129102:web:fccf0ecb853571483b391f",
  measurementId: "G-75C7C4P0TK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}




