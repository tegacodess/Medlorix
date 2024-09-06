import { auth } from './firebase_config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id "${id}" not found`);
    }
    return element;
}

// Get form elements
const form = document.querySelector('form');
const emailInput = safeGetElement('email');
const passwordInput = safeGetElement('password');
const submitButton = form.querySelector('button[type="submit"]');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

// Function to display error messages
function showError(message) {
    clearErrors(); 
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8em';
    errorElement.style.marginTop = '5px';
    submitButton.parentNode.insertBefore(errorElement, submitButton);
}

// Function to clear error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}

function togglePasswordVisibility(inputElement, buttonElement) {
    if (!inputElement || !buttonElement) {
        console.error("Cannot toggle password visibility: input or button element is missing");
        return;
    }
    const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
    inputElement.setAttribute('type', type);
    buttonElement.textContent = type === 'password' ? 'Show' : 'Hide';
}


togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        togglePasswordVisibility(input, this);
    });
});


form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Please enter both email and password.');
        return;
    }


    submitButton.disabled = true;
    submitButton.classList.add('button-disabled');
    submitButton.textContent = 'Signing In...';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential, userCredential.user)
        const user = userCredential.user;
        
        localStorage.clear();


        const successMessage = document.createElement('p');
        successMessage.textContent = 'Login successful! Redirecting...';
        successMessage.style.color = 'green';
        submitButton.parentNode.insertBefore(successMessage, submitButton);

        setTimeout(() => {
            window.location.href = '/src/chatbot.html';
        }, 500);

    } catch (error) {
        console.error("Error signing in:", error);
        
        
        showError('Unable to sign in. Please check your email and password and try again.');

      
        submitButton.disabled = false;
        submitButton.classList.remove('button-disabled');
        submitButton.textContent = 'Sign In';
    }
});