// import { auth, db } from '../firebase_config.js';
// import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
// import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// // Retrieve the stored data from localStorage
// const firstName = localStorage.getItem('firstName');
// const lastName = localStorage.getItem('lastName');
// const email = localStorage.getItem('email');
// const phone = localStorage.getItem('phone');
// const gender = localStorage.getItem('gender');
// const country = localStorage.getItem('country');

// // Handle form submission for creating the account
// const form = document.querySelector('form');

// form.addEventListener('submit', async function (event) {
//     event.preventDefault(); // Prevent default form submission

//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirm-password').value;

//     if (password !== confirmPassword) {
//         alert("Passwords do not match!");
//         return;
//     }

//     const maxRetries = 3;
//     let retries = 0;

//     while (retries < maxRetries) {
//         try {
//             // Create user with email and password in Firebase
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;

//             console.log("User created successfully:", user.uid);

//             // Update user profile with first and last name
//             await updateProfile(user, {
//                 displayName: `${firstName} ${lastName}`
//             });

//             console.log("User profile updated successfully");

//             // Check if user is authenticated
//             if (!auth.currentUser) {
//                 throw new Error('User is not authenticated after creation');
//             }

//             // Save additional user information in Firestore
//             const userDocRef = doc(db, "users", user.uid);
//             await setDoc(userDocRef, {
//                 firstName,
//                 lastName,
//                 email,
//                 phone,
//                 gender,
//                 country,
//                 createdAt: new Date()
//             });

//             console.log("User document created successfully in Firestore");

//             // Clear localStorage
//             localStorage.clear();

//             // Redirect to a welcome page or dashboard
//             window.location.href = '/src/chatbot.html'; // Ensure the path is correct
//             return; // Exit the function if successful

//         } catch (error) {
//             console.error(`Attempt ${retries + 1} failed. Error:`, error);

//             if (error.code === 'auth/network-request-failed') {
//                 retries++;
//                 if (retries < maxRetries) {
//                     console.log(`Retrying... Attempt ${retries + 1} of ${maxRetries}`);
//                     await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
//                 } else {
//                     alert(`Network error persists after ${maxRetries} attempts. Please check your internet connection and try again later.`);
//                 }
//             } else if (error.code === 'permission-denied') {
//                 alert('Permission denied. Please check Firestore rules.');
//                 return; // Exit the function for permission errors
//             } else {
//                 alert(`Error: ${error.message}`);
//                 return; // Exit the function for other errors
//             }
//         }
//     }
// });

// // Optional: Add event listeners for password input fields to check match in real-time
// const passwordInput = document.getElementById('password');
// const confirmPasswordInput = document.getElementById('confirm-password');
// const submitButton = document.querySelector('button[type="submit"]');

// function checkPasswordMatch() {
//     if (passwordInput.value === confirmPasswordInput.value) {
//         confirmPasswordInput.setCustomValidity('');
//         submitButton.disabled = false;
//     } else {
//         confirmPasswordInput.setCustomValidity('Passwords do not match');
//         submitButton.disabled = true;
//     }
// }

// passwordInput.addEventListener('input', checkPasswordMatch);
// confirmPasswordInput.addEventListener('input', checkPasswordMatch);

import { auth, db } from './firebase_config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Function to safely get elements and log errors if they're missing
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id "${id}" not found`);
    }
    return element;
}

// Get the form elements
const signupForm = safeGetElement('signupForm');
const passwordInput = safeGetElement('password');
const confirmPasswordInput = safeGetElement('confirm-password');
const submitButton = document.querySelector('button[type="submit"]');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

// Function to display error messages
function showError(inputElement, message) {
    if (!inputElement) {
        console.error("Cannot show error: input element is null");
        return;
    }
    const errorElement = document.createElement('p');
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

// Function to check password strength
function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}

// Function to check if passwords match
function doPasswordsMatch() {
    return passwordInput && confirmPasswordInput && passwordInput.value === confirmPasswordInput.value;
}

// Function to validate passwords
function validatePasswords() {
    clearErrors();
    let isValid = true;

    if (passwordInput && !isPasswordStrong(passwordInput.value)) {
        showError(passwordInput, 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.');
        isValid = false;
    }

    if (!doPasswordsMatch()) {
        showError(confirmPasswordInput, 'Passwords do not match.');
        isValid = false;
    }

    if (submitButton) {
        submitButton.disabled = !isValid;
    }
    return isValid;
}

// Function to toggle password visibility
function togglePasswordVisibility(inputElement, buttonElement) {
    if (!inputElement || !buttonElement) {
        console.error("Cannot toggle password visibility: input or button element is missing");
        return;
    }
    const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
    inputElement.setAttribute('type', type);
    buttonElement.textContent = type === 'password' ? 'Show' : 'Hide';
}

// Add event listeners for password visibility toggle
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        togglePasswordVisibility(input, this);
    });
});

// Add event listeners for real-time validation
if (passwordInput) {
    passwordInput.addEventListener('input', validatePasswords);
}
if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', validatePasswords);
}

// Only add the submit event listener if the form exists
if (signupForm) {
    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        clearErrors();

        if (!validatePasswords()) {
            return;
        }

        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const email = localStorage.getItem('email');
        const phone = localStorage.getItem('phone');
        const gender = localStorage.getItem('gender');
        const country = localStorage.getItem('country');
        const password = passwordInput.value;

        const maxRetries = 3;
        let retries = 0;
        let accountCreated = false;

        while (retries < maxRetries && !accountCreated) {
            try {
                // Create user with email and password in Firebase
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                console.log("User created successfully:", user.uid);

                // Update user profile with first and last name
                await updateProfile(user, {
                    displayName: `${firstName} ${lastName}`
                });

                console.log("User profile updated successfully");

                // Check if user is authenticated
                if (!auth.currentUser) {
                    throw new Error('User is not authenticated after creation');
                }

                // Save additional user information in Firestore
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, {
                    firstName,
                    lastName,
                    email,
                    phone,
                    gender,
                    country,
                    createdAt: new Date()
                });

                console.log("User document created successfully in Firestore");
                accountCreated = true;

            } catch (error) {
                console.error(`Attempt ${retries + 1} failed. Error:`, error);

                if (error.code === 'auth/network-request-failed') {
                    retries++;
                    if (retries < maxRetries) {
                        console.log(`Retrying... Attempt ${retries + 1} of ${maxRetries}`);
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
                    } else {
                        showError(submitButton, `Network error persists after ${maxRetries} attempts. Please check your internet connection and try again later.`);
                    }
                } else if (error.code === 'auth/email-already-in-use') {
                    showError(submitButton, 'An account with this email already exists. Please use a different email or try logging in.');
                    return;
                } else {
                    showError(submitButton, `Error: ${error.message}`);
                    return;
                }
            }
        }

        if (accountCreated) {
            // Clear localStorage
            localStorage.clear();
            
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Sign up successful! Redirecting...';
            successMessage.style.color = 'green';
            submitButton.parentNode.appendChild(successMessage);                    

            // Redirect to a welcome page or dashboard
            setTimeout(() => {
                window.location.href = '/src/chatbot.html'; // Ensure the path is correct
            }, 100); // Redirect after 0.5 seconds (adjust timing as needed)
        }
    });
} else {
    console.error("Signup form not found");
}