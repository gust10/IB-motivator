// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC526ARBKrHei_8LASxVB1anIGbFkiqNU",
  authDomain: "ib-motivator.firebaseapp.com",
  databaseURL: "https://ib-motivator-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ib-motivator",
  storageBucket: "ib-motivator.appspot.com",
  messagingSenderId: "467330705525",
  appId: "1:467330705525:web:a53665b62db6dec4c1703c",
  measurementId: "G-FRD8QR5XXF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;