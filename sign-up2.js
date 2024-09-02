import { auth, db } from './firebase_config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Retrieve the stored data from localStorage
const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
const email = localStorage.getItem('email');
const phone = localStorage.getItem('phone');
const gender = localStorage.getItem('gender');
const country = localStorage.getItem('country');

// Handle form submission for creating the account
const form = document.querySelector('form');

form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
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

            // Clear localStorage
            localStorage.clear();

            // Redirect to a welcome page or dashboard
            window.location.href = '/src/chatbot.html'; // Ensure the path is correct
            return; // Exit the function if successful

        } catch (error) {
            console.error(`Attempt ${retries + 1} failed. Error:`, error);

            if (error.code === 'auth/network-request-failed') {
                retries++;
                if (retries < maxRetries) {
                    console.log(`Retrying... Attempt ${retries + 1} of ${maxRetries}`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
                } else {
                    alert(`Network error persists after ${maxRetries} attempts. Please check your internet connection and try again later.`);
                }
            } else if (error.code === 'permission-denied') {
                alert('Permission denied. Please check Firestore rules.');
                return; // Exit the function for permission errors
            } else {
                alert(`Error: ${error.message}`);
                return; // Exit the function for other errors
            }
        }
    }
});

// Optional: Add event listeners for password input fields to check match in real-time
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitButton = document.querySelector('button[type="submit"]');

function checkPasswordMatch() {
    if (passwordInput.value === confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity('');
        submitButton.disabled = false;
    } else {
        confirmPasswordInput.setCustomValidity('Passwords do not match');
        submitButton.disabled = true;
    }
}

passwordInput.addEventListener('input', checkPasswordMatch);
confirmPasswordInput.addEventListener('input', checkPasswordMatch);