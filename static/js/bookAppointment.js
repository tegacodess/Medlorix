// const countrySelect = document.querySelector("#country");
// const stateSelect = document.querySelector("#state");
// const citySelect = document.querySelector("#local-government");

// // Function to load the list of countries
// function loadCountries() {
//   fetch("/api/countries")
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((country) => {
//         const option = document.createElement("option");
//         option.value = country.iso2;
//         option.textContent = country.name;
//         countrySelect.appendChild(option);
//       });
//     })
//     .catch((error) => console.error("Error loading countries:", error));

//   stateSelect.disabled = true;
//   citySelect.disabled = true;
// }

// // Function to load the list of states based on the selected country
// function loadStates() {
//   const selectedCountryCode = countrySelect.value;

//   stateSelect.disabled = false;
//   stateSelect.innerHTML = '<option value="">Select State</option>';

//   citySelect.disabled = true;
//   citySelect.innerHTML = '<option value="">Select City</option>';

//   fetch(`/api/states/${selectedCountryCode}`)
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((state) => {
//         const option = document.createElement("option");
//         option.value = state.iso2;
//         option.textContent = state.name;
//         stateSelect.appendChild(option);
//       });
//     })
//     .catch((error) => console.error("Error loading states:", error));
// }

// // Function to load the list of cities based on the selected state
// function loadCities() {
//   const selectedCountryCode = countrySelect.value;
//   const selectedStateCode = stateSelect.value;

//   citySelect.disabled = false;
//   citySelect.innerHTML = '<option value="">Select City</option>';

//   fetch(`/api/cities/${selectedCountryCode}/${selectedStateCode}`)
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((city) => {
//         const option = document.createElement("option");
//         option.value = city.name;
//         option.textContent = city.name;
//         citySelect.appendChild(option);
//       });
//     })
//     .catch((error) => console.error("Error loading cities:", error));
// }

// // Load countries when the window is loaded
// window.onload = loadCountries;

// // Event listeners to load states and cities when a country/state is selected
// countrySelect.addEventListener("change", loadStates);
// stateSelect.addEventListener("change", loadCities);

// // To ensure all input and select fields are filled before the user can proceed to step 2 of 2
// // For the first form (bookAppointment.html)
// // Constants for debugging and configuration
// const DEBUG = true;
// const ROUTES = {
//   STEP_2: "/bookAppointment2",
//   CONFIRMATION: "/appointment-confirmation",
// };

// // Utility functions
// function log(...args) {
//   if (DEBUG) console.log("[Appointment Booking]:", ...args);
// }

// function handleError(error, customMessage = "An error occurred") {
//   log("Error:", error);
//   alert(`${customMessage}. Please try again.`);
// }

// // Step 1: Handle initial form submission
// function initializeStep1() {
//   const form = document.getElementById("appointmentForm");
//   if (!form) {
//     log("Step 1 form not found - not on step 1 page");
//     return;
//   }

//   log("Initializing step 1 form handler");
//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     try {
//       log("Step 1 form submitted");

//       const formData = new FormData(form);
//       const jsonData = {};
//       formData.forEach((value, key) => {
//         jsonData[key] = value;
//       });

//       log("Form data collected:", jsonData);

//       // Store data for step 2
//       sessionStorage.setItem("appointmentData", JSON.stringify(jsonData));
//       log("Data stored in sessionStorage");

//       // Navigate to step 2
//       window.location.href = ROUTES.STEP_2;
//     } catch (error) {
//       handleError(error, "Could not process form submission");
//     }
//   });
// }

// // Step 2: Handle doctor selection and final submission
// function initializeStep2() {
//   const doctorCards = document.querySelectorAll(".doctor-card");
//   if (doctorCards.length === 0) {
//     log("Doctor cards not found - not on step 2 page");
//     return;
//   }

//   log("Initializing step 2 handlers");
//   doctorCards.forEach((card) => {
//     const bookButton = card.querySelector(".book-now");
//     if (bookButton) {
//       bookButton.addEventListener("click", async () => {
//         try {
//           log("Doctor selection button clicked");

//           // Get stored data from step 1
//           const storedData = JSON.parse(
//             sessionStorage.getItem("appointmentData") || "{}"
//           );
//           log("Retrieved stored data:", storedData);

//           // Add selected doctor info
//           const doctorName = card.querySelector(".doctor-name").textContent;
//           const specialty = card.querySelector(".specialty").textContent;

//           const finalData = {
//             ...storedData,
//             doctor: doctorName,
//             specialty: specialty,
//           };

//           log("Submitting final data:", finalData);

//           // Submit to server
//           const response = await fetch("/book-appointment", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(finalData),
//           });

//           const result = await response.json();

//           if (!response.ok) {
//             throw new Error(result.error || "Server error");
//           }

//           log("Submission successful:", result);

//           // Clear stored data
//           sessionStorage.removeItem("appointmentData");

//           // Navigate to confirmation
//           window.location.href = ROUTES.CONFIRMATION;
//         } catch (error) {
//           handleError(error, "Could not complete appointment booking");
//         }
//       });
//     }
//   });
// }

// // Initialize handlers based on current page
// document.addEventListener("DOMContentLoaded", () => {
//   log("Page loaded, initializing handlers");
//   initializeStep1();
//   initializeStep2();
// });

// // Export the functions to be used in hospitalSearch.js
// // export { loadCountries, loadStates, loadCities };
// // window.loadCountries = loadCountries;
// // window.loadStates = loadStates;
// // window.loadCities = loadCities;





// Constants for debugging and configuration
const DEBUG = true;
const ROUTES = {
  CONFIRMATION: "/appointment-confirmation",
};

// Utility functions
function log(...args) {
  if (DEBUG) console.log("[Appointment Booking]:", ...args);
}

function handleError(error, customMessage = "An error occurred") {
  log("Error:", error);
  alert(`${customMessage}. Please try again.`);
}

// Function to load the list of countries
function loadCountries() {
  const countrySelect = document.querySelector("#country");
  fetch("/api/countries")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.iso2;
        option.textContent = country.name;
        countrySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error loading countries:", error));
}

// Function to load the list of states based on the selected country
function loadStates() {
  const countrySelect = document.querySelector("#country");
  const stateSelect = document.querySelector("#state");
  const selectedCountryCode = countrySelect.value;

  stateSelect.innerHTML = '<option value="">Select State</option>';

  fetch(`/api/states/${selectedCountryCode}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.iso2;
        option.textContent = state.name;
        stateSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error loading states:", error));
}

// Function to load the list of cities based on the selected state
function loadCities() {
  const countrySelect = document.querySelector("#country");
  const stateSelect = document.querySelector("#state");
  const citySelect = document.querySelector("#local-government");
  const selectedCountryCode = countrySelect.value;
  const selectedStateCode = stateSelect.value;

  citySelect.innerHTML = '<option value="">Select City</option>';

  fetch(`/api/cities/${selectedCountryCode}/${selectedStateCode}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.name;
        option.textContent = city.name;
        citySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error loading cities:", error));
}

// Function to handle form submission
function handleFormSubmission(event) {
  event.preventDefault();
  log("Form submitted");

  const form = event.target;
  const formData = new FormData(form);
  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  log("Form data collected:", jsonData);

  // Add doctor information (you may want to modify this part based on your needs)
  jsonData.doctor = "Selected Doctor Name";
  jsonData.specialty = "Selected Specialty";
  // jsonData.lg = document.querySelector("#local-government").value; 

  submitAppointment(jsonData);
}

// Function to submit the appointment data
async function submitAppointment(appointmentForm) {
  try {
    log("Submitting appointment data:", appointmentForm);

    const response = await fetch("/book-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentForm),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Server error");
    }

    log("Submission successful:", result);

    // Navigate to confirmation page
    window.location.href = ROUTES.CONFIRMATION;
  } catch (error) {
    handleError(error, "Could not complete appointment booking");
  }
}

// Initialize the page
function initializePage() {
  log("Initializing page");

  // Load countries when the page loads
  loadCountries();

  // Add event listeners for country and state selection
  const countrySelect = document.querySelector("#country");
  const stateSelect = document.querySelector("#state");
  
  if (countrySelect) {
    countrySelect.addEventListener("change", loadStates);
  }
  
  if (stateSelect) {
    stateSelect.addEventListener("change", loadCities);
  }

  // Add form submission event listener
  const form = document.getElementById("appointmentForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmission);
  }
}

// Initialize the page when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);


// For Email alert notification
function sendMail() {
  var params = {
    first_name : document.getElementById("first-name").value,
    last_name : document.getElementById("last-name").value,
    email : document.getElementById("email").value,
    doctor : document.getElementById("doctor").value,
    specialty : document.getElementById("specialty").value,
    number : document.getElementById("phone-number").value,
    address : document.getElementById("address").value
  };
  
  const serviceID = "service_d3ea1r5";
  const templateID = "template_mj9t41f";
  
  emailjs
    .send(serviceID, templateID, params)
    .then((res)  => {
      document.getElementById("first-name").value = "";
      document.getElementById("last-name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("doctor").value = "";
      document.getElementById("specialty").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("address").value = "";
      console.log(res);
      alert("Your message sent successfully!!!");
    })
    .catch((err) => console.log(err));
};




// // Constants for debugging and configuration
// const DEBUG = true;
// const ROUTES = {
//   CONFIRMATION: "/appointment-confirmation",
// };

// // Utility functions
// function log(...args) {
//   if (DEBUG) console.log("[Appointment Booking]:", ...args);
// }

// function handleError(error, customMessage = "An error occurred") {
//   log("Error:", error);
//   alert(`${customMessage}. Please try again.`);
// }

// // Function to load the list of countries
// function loadCountries() {
//   const countrySelect = document.querySelector("#country");
//   fetch("/api/countries")
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((country) => {
//         const option = document.createElement("option");
//         option.value = country.name;  // Changed from iso2 to name
//         option.textContent = country.name;
//         countrySelect.appendChild(option);
//       });
//     })
//     .catch((error) => console.error("Error loading countries:", error));
// }

// // Function to load the list of states based on the selected country
// function loadStates() {
//   const countrySelect = document.querySelector("#country");
//   const stateSelect = document.querySelector("#state");
//   const selectedCountry = countrySelect.value;

//   stateSelect.innerHTML = '<option value="">Select State</option>';

//   fetch(`/api/states/${selectedCountry}`)
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((state) => {
//         const option = document.createElement("option");
//         option.value = state.name;  // Changed from iso2 to name
//         option.textContent = state.name;
//         stateSelect.appendChild(option);
//       });
//     })
//     .catch((error) => console.error("Error loading states:", error));
// }

// // Function to load the list of cities based on the selected state
// function loadCities() {
//   const countrySelect = document.querySelector("#country");
//   const stateSelect = document.querySelector("#state");
//   const citySelect = document.querySelector("#local-government");
//   const selectedCountry = countrySelect.value;
//   const selectedState = stateSelect.value;

//   citySelect.innerHTML = '<option value="">Select City</option>';

//   fetch(`/api/cities/${selectedCountry}/${selectedState}`)
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((city) => {
//         const option = document.createElement("option");
//         option.value = city.name;
//         option.textContent = city.name;
//         citySelect.appendChild(option);
//       });
//     })
//     .catch((error) => console.error("Error loading cities:", error));
// }

// // Function to validate the form
// function validateForm(formData) {
//   const requiredFields = [
//     'doctor', 'specialty', 'first_name', 'last_name', 'address', 
//     'country', 'state', 'local-government', 'phone_number', 'email', 
//     'existing_patient', 'appointment_date', 'reason'
//   ];

//   for (const field of requiredFields) {
//     if (!formData.get(field)) {
//       throw new Error(`${field.replace('-', ' ')} is required`);
//     }
//   }
// }

// // Function to handle form submission
// function handleFormSubmission(event) {
//   event.preventDefault();
//   log("Form submitted");

//   const form = event.target;
//   const formData = new FormData(form);

//   try {
//     validateForm(formData);

//     const jsonData = {};
//     formData.forEach((value, key) => {
//       jsonData[key] = value;
//     });

//     // Ensure 'lg' field is set (assuming 'local-government' is the form field name)
//     jsonData.lg = jsonData['local-government'];
//     delete jsonData['local-government'];

//     // Convert existing_patient to integer
//     jsonData.existing_patient = jsonData.existing_patient === 'on' ? 1 : 0;

//     log("Form data collected:", jsonData);

//     submitAppointment(jsonData);
//   } catch (error) {
//     handleError(error, error.message);
//   }
// }

// // Function to submit the appointment data
// async function submitAppointment(appointmentData) {
//   try {
//     log("Submitting appointment data:", appointmentData);

//     const response = await fetch("/book-appointment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(appointmentData),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.error || "Server error");
//     }

//     log("Submission successful:", result);

//     // Navigate to confirmation page
//     window.location.href = ROUTES.CONFIRMATION;
//   } catch (error) {
//     handleError(error, "Could not complete appointment booking");
//   }
// }

// // Initialize the page
// function initializePage() {
//   log("Initializing page");

//   // Load countries when the page loads
//   loadCountries();

//   // Add event listeners for country and state selection
//   const countrySelect = document.querySelector("#country");
//   const stateSelect = document.querySelector("#state");
  
//   if (countrySelect) {
//     countrySelect.addEventListener("change", loadStates);
//   }
  
//   if (stateSelect) {
//     stateSelect.addEventListener("change", loadCities);
//   }

//   // Add form submission event listener
//   const form = document.getElementById("appointmentForm");
//   if (form) {
//     form.addEventListener("submit", handleFormSubmission);
//   }
// }

// // Initialize the page when the DOM is fully loaded
// document.addEventListener("DOMContentLoaded", initializePage);