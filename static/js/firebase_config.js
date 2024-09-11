// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxAM2o_i3932vdqu_pWbep8ONmVECVZ5A",
  authDomain: "auth-for-medlorix.firebaseapp.com",
  projectId: "auth-for-medlorix",
  storageBucket: "auth-for-medlorix.appspot.com",
  messagingSenderId: "392444004453",
  appId: "1:392444004453:web:2a3f55d13805fe1244de8c",
  measurementId: "G-77T5HNCFCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase initialized:", app);
console.log("Firestore instance:", db);
console.log("Auth instance:", auth);

export { auth, db };