// import config from "./config.js";

const openCageApiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const configuration = {
  radius: 1500,
  types: ["hospital", "clinic"],
  healthKeywords: ["hospital", "clinic"],
};

// Geocoding function
async function getLatLngFromGeocoding(city, landmark) {
  const query = `${city} ${landmark}`;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${openCageApiKey}`;
  // )}&key=${config.openCageApiKey}`;

  try {
    console.log("Fetching geocoding data...");
    const response = await axios.get(url);
    console.log("Geocoding response:", response.data);
    if (response.data.results && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      console.log(`Location: ${lat}, ${lng}`);
      return { lat, lng };
    } else {
      throw new Error("No results found for the given location");
    }
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    throw new Error("Failed to get location data: " + error.message);
  }
}

// URL building functions
function buildNearbySearchUrl(location, type) {
  return `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${configuration.radius}&type=${type}&key=${googleApiKey}`;
  // return `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${configuration.radius}&type=${type}&key=${config.googleApiKey}`;
}

function buildPlaceDetailsUrl(placeId) {
  return `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,formatted_address,opening_hours,geometry&key=${googleApiKey}`;
  // return `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,formatted_address,opening_hours,geometry&key=${config.googleApiKey}`;
}

// Fetching functions
async function fetchPlacesByType(location, type) {
  try {
    console.log(`Fetching ${type} places...`);
    const response = await axios.get(buildNearbySearchUrl(location, type));
    console.log(`${type} places response:`, response.data);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
}

async function fetchPlaceDetails(placeId) {
  try {
    console.log(`Fetching details for place ${placeId}...`);
    const response = await axios.get(buildPlaceDetailsUrl(placeId));
    console.log("Place details response:", response.data);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching place details:`, error);
    return null;
  }
}

// Data transformation function
function transformPlaceDetails(place, details) {
  return {
    name: place.name,
    types: place.types[0],
    address: place.vicinity,
    rating: place.rating || "No Rating Available",
    availability:
      place.business_status === "OPERATIONAL" ? "Available" : "Closed",
    phone: details?.formatted_phone_number || "No Phone Number Available",
    directions: `https://www.google.com/maps/dir/?api=1&destination=${details?.geometry?.location?.lat},${details?.geometry?.location?.lng}`,
  };
}

// Fetch and filter functions
async function fetchAllPlaces(location) {
  const allPlacesPromises = configuration.types.map((type) =>
    fetchPlacesByType(location, type)
  );
  const results = await Promise.all(allPlacesPromises);
  return results.flat();
}

function filterRelevantPlaces(places) {
  return places.filter((place) =>
    place.types.some((type) => configuration.healthKeywords.includes(type))
  );
}

// Result card creation function
function createResultCard(place) {
  return `
      <div class="searched-cardpreview">
          <div class="card-firstlayer">
              <div class="hospital-name-card">
                <div class="hospital-name">
                  <p>${place.name}</p>
                  </div>
                <div class="rating">
                ${"★".repeat(Math.round(place.rating))}${"☆".repeat(
    5 - Math.round(place.rating)
  )} (${place.rating})
                </div>
              </div>
              <div class="direction">
                <img
                  src="/images/Clinic Search Page/ri_direction-line.png"
                  alt=""
                />
                <p><a href="${
                  place.directions
                }" class="directions" target="_blank">Directions</a></p>
              </div>
            </div>
            <div class="card-secondlayer">
              <p>Hospital</p>
              <img src="/images/Clinic Search Page/icon.png" alt="" />
              <p>
                <span>${place.address}</span>
              </p>
            </div>
            <div class="card-thirdlayer">
              <div class="no-card">
                <div class="phone-no">
                  <img src="/images/Clinic Search Page/Phone call.png" alt="" />
                  <p>${place.phone}</p>
                </div>
                <div class="available ${place.availability.toLowerCase()}">
                  <p><span>${place.availability}</span></p>
                </div>
              </div>
              <div class="book-appointment">
                <button id="book-appointment-${
                  place.place_id
                }">BOOK APPOINTMENT</button>
              </div>
            </div>
          </div>
      `;
}

function setupAppointmentButtons() {
  document.querySelectorAll(".book-appointment button").forEach((button) => {
    button.addEventListener("click", () => {
      alert("This feature is coming soon!");
    });
  });
}
// Main search function
async function performSearch() {
  const cityElement = document.getElementById("local-government");
  const landmarkElement = document.getElementById("landmark");
  const resultGridDiv = document.getElementById("resultGrid");
  const resultsCountDiv = document.getElementById("resultsCount");
  const loadingIndicator = document.getElementById("loadingIndicator");

  if (
    !cityElement ||
    !landmarkElement ||
    !resultGridDiv ||
    !resultsCountDiv ||
    !loadingIndicator
  ) {
    console.error("One or more required elements are missing");
    return;
  }

  const city = cityElement.value;
  const landmark = landmarkElement.value;

  if (!city || !landmark) {
    alert("Please enter both city and landmark");
    return;
  }

  loadingIndicator.style.display = "block";
  resultGridDiv.innerHTML = "";
  resultsCountDiv.textContent = "";

  try {
    const { lat, lng } = await getLatLngFromGeocoding(city, landmark);
    const location = `${lat},${lng}`;

    const allPlaces = await fetchAllPlaces(location);
    console.log("All places:", allPlaces);
    const relevantPlaces = filterRelevantPlaces(allPlaces);
    console.log("Relevant places:", relevantPlaces);

    for (const place of relevantPlaces) {
      const fullDetails = await fetchPlaceDetails(place.place_id);
      const transformedDetails = transformPlaceDetails(place, fullDetails);
      resultGridDiv.innerHTML += createResultCard(transformedDetails);
    }
    setupAppointmentButtons();

    resultsCountDiv.textContent = `Results (${relevantPlaces.length})`;
    resultsCountDiv.style.display = "block";
  } catch (error) {
    console.error("An error occurred:", error);
    resultGridDiv.innerHTML =
      "<p>An error occurred while searching for hospitals. Please try again.</p>";
  } finally {
    loadingIndicator.style.display = "none";
  }
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced search function
const debouncedPerformSearch = debounce(performSearch, 300);

// Initialize CORS Anywhere
(function () {
  var cors_api_host = "cors-anywhere.herokuapp.com";
  var cors_api_url = "https://" + cors_api_host + "/";
  var slice = [].slice;
  var origin = window.location.protocol + "//" + window.location.host;
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    var args = slice.call(arguments);
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
    if (
      targetOrigin &&
      targetOrigin[0].toLowerCase() !== origin &&
      targetOrigin[1] !== cors_api_host
    ) {
      args[1] = cors_api_url + args[1];
    }
    return open.apply(this, args);
  };
})();

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.querySelector(".book-button");
  if (searchButton) {
    searchButton.addEventListener("click", debouncedPerformSearch);
  } else {
    console.error("Search button not found");
  }
});
