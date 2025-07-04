// firebase/index.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdT5K7AlXXJCw8FDgG-_xRoQFphko5S5s",
  authDomain: "medical-31fef.firebaseapp.com",
  projectId: "medical-31fef",
  storageBucket: "medical-31fef.appspot.com",
  messagingSenderId: "673424248063",
  appId: "1:673424248063:web:8da5010dfb17bbe10290ca",
  measurementId: "G-VZ36LTF1C7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };