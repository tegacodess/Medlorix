import config from "./config.js";

const countrySelect = document.querySelector("#country"),
  stateSelect = document.querySelector("#state"),
  citySelect = document.querySelector("#local-government");

// Function to load the list of countries
function loadCountries() {
  fetch(config.cUrl, {
    headers: { "X-CSCAPI-KEY": config.ckey },
  })
    .then((response) => response.json())
    .then((data) => {
      // Populate the country dropdown with fetched data
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
  stateSelect.style.pointerEvents = "none";
  citySelect.style.pointerEvents = "none";
}

function loadStates() {
  const selectedCountryCode = countrySelect.value;

  stateSelect.disabled = false;
  stateSelect.innerHTML = '<option value="">Select State</option>';

  // Disable and reset the city dropdown
  citySelect.disabled = true;
  citySelect.innerHTML = '<option value="">Select City</option>';

  stateSelect.style.pointerEvents = "auto";
  citySelect.style.pointerEvents = "none";

  // Fetch states based on the selected country code
  fetch(`${config.cUrl}/${selectedCountryCode}/states`, {
    headers: { "X-CSCAPI-KEY": config.ckey },
  })
    .then((response) => response.json())
    .then((data) => {
      // Populate the state dropdown with fetched data
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
  citySelect.style.pointerEvents = "auto";

  // Fetch cities based on the selected country and state codes
  fetch(
    `${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`,
    {
      headers: { "X-CSCAPI-KEY": config.ckey },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      data.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.name;
        option.textContent = city.name;
        citySelect.appendChild(option); // Add option to the city dropdown
      });
    })
    .catch((error) => console.error("Error loading cities:", error));
}

// Load countries when the window is loaded
window.onload = loadCountries;

// Event listeners to load states and cities when a country/state is selected
countrySelect.addEventListener("change", loadStates);
stateSelect.addEventListener("change", loadCities);
