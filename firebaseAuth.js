// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js"
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy6lEh1uOhj79F99cJ0G2gCz9OhB317no",
  authDomain: "medlorix-authentication.firebaseapp.com",
  projectId: "medlorix-authentication",
  storageBucket: "medlorix-authentication.appspot.com",
  messagingSenderId: "547566668661",
  appId: "1:547566668661:web:c2cb0e1e9df634ef5ca13c",
  measurementId: "G-WE37DF4C94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const signUp = document.getElementById("submitsignup")
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phone = document.getElementById("phone").value;
  const gender = document.getElementById("gender").value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password).then((userCredential)=>{
    const user = userCredential.user;
    const userData={
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      gender: gender
    };
    const docRef=doc(db, "users", user.uid);
    setDoc(docRef,userData)
    .then(()=>{
      window.location.href="login.html";
    })
    .catch(()=>{
      console.error("error writing document", error);
    });
  })
  .catch((error)=>{
    const errorCode=error.code;
    if(errorCode=="auth/email-already-in-use"){
      showMessage("Email Address Already Exists !!!", "signUpMessage");
    }
    else{
      showMessage("Unable to create User", "signUpMessage")
    }
  })
})