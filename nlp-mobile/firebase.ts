import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDeS5bLAHZe3faYi2zdxZ6rwzBmB0fCiB8",
  authDomain: "nlp-app-674b6.firebaseapp.com",
  projectId: "nlp-app-674b6",
  storageBucket: "nlp-app-674b6.firebasestorage.app",
  messagingSenderId: "1037430795252",
  appId: "1:1037430795252:web:dd2da3910a36840ebca7a1",
  measurementId: "G-R0LQVC56T6"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);