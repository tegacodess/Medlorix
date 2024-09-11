// import { auth, db } from '../firebase_config.js';
// import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// // Get the form element
// const signupForm = document.getElementById('signupForm');

// signupForm.addEventListener('submit', async function (event) {
//     event.preventDefault(); // Prevent the default form submission

//     const firstName = document.getElementById('firstName').value;
//     const lastName = document.getElementById('lastName').value;
//     const email = document.getElementById('email').value;
//     const phone = document.getElementById('phone').value;
//     const gender = document.getElementById('gender').value;
//     const country = document.getElementById('country').value;

//     // Store the data in localStorage to pass to the next step
//     localStorage.setItem('firstName', firstName);
//     localStorage.setItem('lastName', lastName);
//     localStorage.setItem('email', email);
//     localStorage.setItem('phone', phone);
//     localStorage.setItem('gender', gender);
//     localStorage.setItem('country', country);

//     // Redirect to the second sign-up page
//     window.location.href = '/src/sign-up2.html';
// });


import { auth, db } from '/static/js/firebase_config.js';
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Get the form element
const signupForm = document.getElementById('signupForm');

// Function to display error messages
function showError(inputElement, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8em';
    errorElement.style.marginTop = '5px';
    inputElement.parentNode.appendChild(errorElement);
}

// Function to clear error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}

// Function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

signupForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission
    clearErrors(); // Clear any existing error messages

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const gender = document.getElementById('gender');
    const country = document.getElementById('country');

    let isValid = true;

    // Validate First Name
    if (!firstName.value.trim()) {
        showError(firstName, 'Please enter your first name.');
        isValid = false;
    }

    // Validate Last Name
    if (!lastName.value.trim()) {
        showError(lastName, 'Please enter your last name.');
        isValid = false;
    }

    // Validate Email
    if (!email.value.trim()) {
        showError(email, 'Please enter an email address.');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
    }

    // Validate Phone (optional, add your specific validation if needed)


    if (isValid) {
        localStorage.setItem('firstName', firstName.value);
        localStorage.setItem('lastName', lastName.value);
        localStorage.setItem('email', email.value);
        localStorage.setItem('phone', phone.value);
        localStorage.setItem('gender', gender.value);
        localStorage.setItem('country', country.value);

        window.location.href = '/sign-up2';
    }
});

