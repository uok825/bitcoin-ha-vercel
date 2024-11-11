// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcF8yOq0EUbEGgaTB25zuNooVOEHJK804",
  authDomain: "citbet-a4927.firebaseapp.com",
  projectId: "citbet-a4927",
  storageBucket: "citbet-a4927.firebasestorage.app",
  messagingSenderId: "579067753270",
  appId: "1:579067753270:web:928ad09030180e16667997",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
