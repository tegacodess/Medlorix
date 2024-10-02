import { auth, db } from "/static/js/firebase_config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

async function adminLogin(email, password) {
  try {
    console.log("Starting admin login process");

    // Authenticate the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User Credential:", userCredential);
    const user = userCredential.user;
    console.log("User logged in:", user.email);

    // Check if the user is an admin
    const adminsRef = collection(db, "admins");
    const q = query(adminsRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    console.log("Query Snapshot:", querySnapshot);

    if (!querySnapshot.empty) {
      console.log("Admin login successful");
      window.location.href = "/admin-appointment";
    } else {
      console.log("User is not an admin");
    }
  } catch (error) {
    console.error("Error during admin login:", error.message);
  }
}

// Add event listener to the login form
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      adminLogin(email, password);
    });
  } else {
    console.error('Login form not found');
  }
});