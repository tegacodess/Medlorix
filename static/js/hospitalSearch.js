async function getLatLngFromGeocoding(city, landmark) {
  const response = await fetch("/geocode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city, landmark }),
  });

  if (!response.ok) {
    throw new Error("Geocoding failed");
  }

  return response.json();
}

async function fetchNearbyPlaces(location, type) {
  const response = await fetch("/nearby-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location: `${location.lat},${location.lng}`, type }),
  });

  if (!response.ok) {
    throw new Error("Nearby search failed");
  }

  return response.json();
}

async function fetchPlaceDetails(placeId) {
  const response = await fetch("/place-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ place_id: placeId }),
  });

  if (!response.ok) {
    throw new Error("Place details fetch failed");
  }

  return response.json();
}

function filterRelevantPlaces(places) {
  const healthKeywords = ["hospital", "clinic", "doctor"];
  return places.filter((place) =>
    place.types.some((type) => healthKeywords.includes(type.toLowerCase()))
  );
}

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
  )} (${place.rating || "No Rating Available"})
          </div>
        </div>
        <div class="direction">
          <img src="/static/images/ClinicSearchPage/ri_direction-line.png" alt="" />
          <p><a href="https://www.google.com/maps/dir/?api=1&destination=${
            place.geometry.location.lat
          },${
    place.geometry.location.lng
  }" class="directions" target="_blank">Directions</a></p>
        </div>
      </div>
      <div class="card-secondlayer">
        <p>${
          place.types[0].charAt(0).toUpperCase() + place.types[0].slice(1)
        }</p>
        <img src="/static/images/ClinicSearchPage/icon.png" alt="" />
        <p>
          <span>${place.formatted_address || place.vicinity}</span>
        </p>
      </div>
      <div class="card-thirdlayer">
        <div class="no-card">
          <div class="phone-no">
            <img src="/static/images/ClinicSearchPage/Phonecall.png" alt="" />
            <p>${
              place.formatted_phone_number || "No Phone Number Available"
            }</p>
          </div>
        <div class="available ">
                  <p><span>${
                    place.business_status === "OPERATIONAL"
                      ? "Available"
                      : "Closed"
                  }</span></p>
                </div>
        </div>
        <div class="book-appointment">
          <button data-place-id="${place.place_id}">BOOK APPOINTMENT</button>
        </div>
      </div>
    </div>
  `;
}

// Main search function
async function performSearch() {
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const city = document.getElementById("local-government").value;
  const landmark = document.getElementById("landmark").value;
  const resultGridDiv = document.getElementById("resultGrid");
  const resultsCountDiv = document.getElementById("resultsCount");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const resultsDiv = document.querySelector(".results");

  if (!country || !state || !landmark) {
    alert("Please fill in all location fields");
    return;
  }

  loadingIndicator.style.display = "block";
  resultGridDiv.innerHTML = "";
  resultsCountDiv.textContent = "Results: (0)";
  resultsDiv.style.display = "none";

  try {
    const location = await getLatLngFromGeocoding(
      `${country}, ${state}, ${city}`,
      landmark
    );
    const hospitalsResponse = await fetchNearbyPlaces(location, "hospital");
    const clinicsResponse = await fetchNearbyPlaces(location, "clinic");

    const allPlaces = [
      ...hospitalsResponse.results,
      ...clinicsResponse.results,
    ];
    const relevantPlaces = filterRelevantPlaces(allPlaces);
    if (relevantPlaces.length === 0) {
      // No hospitals found
      resultGridDiv.innerHTML = `
        <div class="no-results-message">
          <p>No hospitals or clinics found in the specified location.</p>
          <p>Please try a different location or expand your search area.</p>
        </div>
      `;
      resultsCountDiv.textContent = "Results: (0)";
    } else {
      for (const place of relevantPlaces) {
        const detailsResponse = await fetchPlaceDetails(place.place_id);
        const placeWithDetails = { ...place, ...detailsResponse.result };
        resultGridDiv.innerHTML += createResultCard(placeWithDetails);
      }

      resultsCountDiv.textContent = `Results: (${relevantPlaces.length})`;
      resultsDiv.style.display = "flex";

      // Add event listeners to "BOOK APPOINTMENT" buttons
      document
        .querySelectorAll(".book-appointment button")
        .forEach((button) => {
          button.addEventListener("click", () => {
            const placeId = button.getAttribute("data-place-id");
            // Implement booking functionality or navigation to booking page
            console.log(`Booking appointment for place ID: ${placeId}`);
            // For now, just show an alert
            alert("Booking functionality coming soon!");
          });
        });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    if (error.message.includes("ZERO_RESULTS")) {
      resultGridDiv.innerHTML = `
        <div class="no-results-message">
          <p>No hospitals or clinics found in the specified location.</p>
          <p>Please try a different location or expand your search area.</p>
        </div>
      `;
    } else {
      resultGridDiv.innerHTML =
        "<p>An error occurred while searching for healthcare facilities. Please try again.</p>";
    }
    resultsCountDiv.textContent = "Results: (0)";
  } finally {
    loadingIndicator.style.display = "none";
    resultsDiv.style.display = "flex";
  }
}

// Event listener for search button
document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".book-button");
  if (searchButton) {
    searchButton.addEventListener("click", performSearch);
  } else {
    console.error("Search button not found");
  }
});
