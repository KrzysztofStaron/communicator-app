// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAV3quMbg_2MLWNllOsBwhzgr7eRZu7TY",
  authDomain: "nextjs-messanger-ae449.firebaseapp.com",
  projectId: "nextjs-messanger-ae449",
  storageBucket: "nextjs-messanger-ae449.appspot.com",
  messagingSenderId: "731584483024",
  appId: "1:731584483024:web:5a7e6d96e1986519cc58d5",
  measurementId: "G-JG2WETM986",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});

export { db };
