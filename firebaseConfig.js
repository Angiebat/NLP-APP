// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBz2eTeJzHjS1Y7spu-3_AFTnVmYXQYrM4",
  authDomain: "goalplanner-70f5b.firebaseapp.com",
  projectId: "goalplanner-70f5b",
  storageBucket: "goalplanner-70f5b.firebasestorage.app",
  messagingSenderId: "625364322074",
  appId: "1:625364322074:web:47d197bb621e3eb78ecea3",
  measurementId: "G-NK4BSGGY8R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);