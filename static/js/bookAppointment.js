const countrySelect = document.querySelector("#country");
const stateSelect = document.querySelector("#state");
const citySelect = document.querySelector("#local-government");

// Function to load the list of countries
function loadCountries() {
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

  stateSelect.disabled = true;
  citySelect.disabled = true;
}

// Function to load the list of states based on the selected country
function loadStates() {
  const selectedCountryCode = countrySelect.value;

  stateSelect.disabled = false;
  stateSelect.innerHTML = '<option value="">Select State</option>';

  citySelect.disabled = true;
  citySelect.innerHTML = '<option value="">Select City</option>';

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
  const selectedCountryCode = countrySelect.value;
  const selectedStateCode = stateSelect.value;

  citySelect.disabled = false;
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

// Load countries when the window is loaded
window.onload = loadCountries;

// Event listeners to load states and cities when a country/state is selected
countrySelect.addEventListener("change", loadStates);
stateSelect.addEventListener("change", loadCities);

// Export the functions to be used in hospitalSearch.js
export { loadCountries, loadStates, loadCities };

// To ensure all input and select fields are filled before the user can proceed to step 2 of 2
// For the first form (bookAppointment.html)
// Constants for debugging and configuration
const DEBUG = true;
const ROUTES = {
  STEP_2: "/bookAppointment2",
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

// Step 1: Handle initial form submission
function initializeStep1() {
  const form = document.getElementById("appointmentForm");
  if (!form) {
    log("Step 1 form not found - not on step 1 page");
    return;
  }

  log("Initializing step 1 form handler");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      log("Step 1 form submitted");

      const formData = new FormData(form);
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });

      log("Form data collected:", jsonData);

      // Store data for step 2
      sessionStorage.setItem("appointmentData", JSON.stringify(jsonData));
      log("Data stored in sessionStorage");

      // Navigate to step 2
      window.location.href = ROUTES.STEP_2;
    } catch (error) {
      handleError(error, "Could not process form submission");
    }
  });
}

// Step 2: Handle doctor selection and final submission
function initializeStep2() {
  const doctorCards = document.querySelectorAll(".doctor-card");
  if (doctorCards.length === 0) {
    log("Doctor cards not found - not on step 2 page");
    return;
  }

  log("Initializing step 2 handlers");
  doctorCards.forEach((card) => {
    const bookButton = card.querySelector(".book-now");
    if (bookButton) {
      bookButton.addEventListener("click", async () => {
        try {
          log("Doctor selection button clicked");

          // Get stored data from step 1
          const storedData = JSON.parse(
            sessionStorage.getItem("appointmentData") || "{}"
          );
          log("Retrieved stored data:", storedData);

          // Add selected doctor info
          const doctorName = card.querySelector(".doctor-name").textContent;
          const specialty = card.querySelector(".specialty").textContent;

          const finalData = {
            ...storedData,
            doctor: doctorName,
            specialty: specialty,
          };

          log("Submitting final data:", finalData);

          // Submit to server
          const response = await fetch("/book-appointment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalData),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Server error");
          }

          log("Submission successful:", result);

          // Clear stored data
          sessionStorage.removeItem("appointmentData");

          // Navigate to confirmation
          window.location.href = ROUTES.CONFIRMATION;
        } catch (error) {
          handleError(error, "Could not complete appointment booking");
        }
      });
    }
  });
}

// Initialize handlers based on current page
document.addEventListener("DOMContentLoaded", () => {
  log("Page loaded, initializing handlers");
  initializeStep1();
  initializeStep2();
});
