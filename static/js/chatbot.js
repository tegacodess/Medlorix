import { auth, db } from './firebase_config.js';
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const userGreeting = document.getElementById('userGreeting');

    // Ensure Firebase is loaded
    if (!auth) {
        console.error("Firebase auth is not initialized.");
        return;
    }

    // Check if the user is logged in
    auth.onAuthStateChanged(user => {
        console.log(user)
        if (user) {
            // User is logged in
            const fullName = user.displayName || 'User'; // Use displayName if available, otherwise fallback to 'User'

            // Update the greeting message
            if (userGreeting) {
                userGreeting.textContent = `Hi, ${fullName}`;
            }
        } else {
            // User is not logged in
            if (userGreeting) {
                userGreeting.textContent = `Hi, Guest`;
            }
        }
    });
});

const sendSymptomButton = document.getElementById("symptomSearchBox");
const symptomSearchBox = document.getElementById("sendSymptom");

sendSymptomButton.addEventListener("click", function () {
    const symptoms = symptomSearchBox.value;
    if (symptoms.trim() === "") {
        alert("Please enter your symptoms.");
        return;
    }

    // Disable the input field and button
    symptomSearchBox.disabled = true;
    sendSymptomButton.style.pointerEvents = "none";

//     fetch("https://symptomai-y0zm.onrender.com/diagnose", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ symptoms: symptoms }),
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 return response.text().then(text => { throw new Error(text) });
//             }
//             return response.json();
//         })
//         .then((data) => {
//             if (data.error) {
//                 alert(data.error);
//                 return;
//             }
//             const main = document.getElementById("main");
//             const diagnosisDiv = document.createElement("div");
//             diagnosisDiv.classList.add("diagnosis-result");
//             diagnosisDiv.innerHTML = `
//                 <p>${data.diagnosis}</p>
//                 <img src="${data.confidence_score_image}" alt="Confidence Score" />
//             `;
//             main.appendChild(diagnosisDiv);
//             symptomSearchBox.value = "";
//         })
//         .catch((error) => {
//             console.error("Error:", error.message || error);
//             alert("An error occurred while diagnosing: " + (error.message || error));
//         })
//         .finally(() => {
//             // Re-enable the input field and button
//             symptomSearchBox.disabled = false;
//             sendSymptomButton.style.pointerEvents = "auto";
//         });
// });

fetch("https://symptomai-y0zm.onrender.com/diagnose", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symptoms: symptoms }),
})
.then((response) => {
    if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });
    }
    return response.json();
})
.then((data) => {
    if (data.error) {
        alert(data.error);
        return;
    }
    const main = document.getElementById("main");
    const diagnosisDiv = document.createElement("div");
    diagnosisDiv.classList.add("diagnosis-result");
    diagnosisDiv.innerHTML = `
        <p>${data.diagnosis}</p>
        
    `;
    main.appendChild(diagnosisDiv);
    symptomSearchBox.value = "";
})
.catch((error) => {
    console.error("Error:", error.message || error);
    alert("An error occurred while diagnosing: " + error.message || error);
})
.finally(() => {
    symptomSearchBox.disabled = false;
    sendSymptomButton.style.pointerEvents = "auto";
});
})

// Event listener for chatbot send button
sendSymptomButton.addEventListener('click', function(){
  symptomSearchBox.value= "...";
  console.log("Search button clicked" );
}) 
