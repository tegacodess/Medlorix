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
