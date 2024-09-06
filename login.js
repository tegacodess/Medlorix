import { auth } from './firebase_config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


const form = document.querySelector('form');

form.addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
     
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential, userCredential.user)
        const user = userCredential.user;

        
        window.location.href = '/src/chatbot.html'; 

    } catch (error) {
        console.error("Error signing in:", error);
        alert(`Error: ${error.message}`);
    }
});
