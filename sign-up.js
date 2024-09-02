import { auth, db } from './firebase_config.js';
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Get the form element
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const gender = document.getElementById('gender').value;
    const country = document.getElementById('country').value;

    // Store the data in localStorage to pass to the next step
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('email', email);
    localStorage.setItem('phone', phone);
    localStorage.setItem('gender', gender);
    localStorage.setItem('country', country);

    // Redirect to the second sign-up page
    window.location.href = '/src/sign-up2.html';
});
