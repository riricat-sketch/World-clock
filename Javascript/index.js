let currentInterval;

const defaultCities = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Australia/Sydney",
];

const mainTimezones = [
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

// Extract city name from timezone string
function formatCityName(timezone) {
  const parts = timezone.split("/");
  return parts[parts.length - 1].replace(/_/g, " ");
}

// Populate dropdown menu
function populateTimezoneSelect() {
  const select = document.getElementById("city-select");
  select.innerHTML = '<option value="">Choose a city</option>';

  mainTimezones.forEach((tz) => {
    const cityName = formatCityName(tz);
    const option = document.createElement("option");
    option.value = tz;
    option.textContent = cityName;
    select.appendChild(option);
  });
}

// Create a city time block
function renderCityBlock(timezone) {
  const cityName = formatCityName(timezone);

  return `
    <div class="city" data-timezone="${timezone}">
      <h2>${cityName}</h2>
      <div class="date"></div>
      <div class="time"></div>
    </div>
  `;
}

// Update all cities shown
function updateAllTimes() {
  document.querySelectorAll(".city").forEach((city) => {
    const tz = city.getAttribute("data-timezone");
    const now = moment().tz(tz);
    city.querySelector(".date").innerText = now.format("MMMM Do, YYYY");
    city.querySelector(".time").innerText = now.format("hh:mm:ss A");
  });
}

// Show default cities at start
function showDefaultCities() {
  const cityDisplay = document.getElementById("city-display");
  const errorMsg = document.getElementById("error-message");
  errorMsg.classList.add("hidden");
  cityDisplay.innerHTML = defaultCities.map(renderCityBlock).join("");

  if (currentInterval) clearInterval(currentInterval);
  updateAllTimes();
  currentInterval = setInterval(updateAllTimes, 1000);
}

// Show selected city
function updateCityUI(timezone) {
  const cityDisplay = document.getElementById("city-display");
  const errorMsg = document.getElementById("error-message");
  errorMsg.classList.add("hidden");

  cityDisplay.innerHTML = renderCityBlock(timezone);

  if (currentInterval) clearInterval(currentInterval);

  function updateTime() {
    const now = moment().tz(timezone);
    const city = cityDisplay.querySelector(".city");
    city.querySelector(".date").innerText = now.format("MMMM Do, YYYY");
    city.querySelector(".time").innerText = now.format("hh:mm:ss A");
  }

  updateTime();
  currentInterval = setInterval(updateTime, 1000);
}

// Search city input validation
function isValidTimezone(cityInput) {
  const zoneNames = moment.tz.names();
  return zoneNames.find((name) =>
    name.toLowerCase().includes(cityInput.toLowerCase())
  );
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  populateTimezoneSelect();
  showDefaultCities();

  // Search button
  document.getElementById("search-btn").addEventListener("click", () => {
    const input = document.getElementById("city-input").value.trim();
    if (!input) return;

    const match = isValidTimezone(input);
    const errorMsg = document.getElementById("error-message");

    if (match) {
      updateCityUI(match);
    } else {
      errorMsg.textContent = `City "${input}" not found. Please try again.`;
      errorMsg.classList.remove("hidden");
    }
  });

  // Enter key triggers search
  document
    .getElementById("city-input")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        document.getElementById("search-btn").click();
      }
    });

  // Dropdown select
  document
    .getElementById("city-select")
    .addEventListener("change", function () {
      const tz = this.value;
      if (tz) {
        updateCityUI(tz);
      } else {
        showDefaultCities();
      }
    });

  // My Location button
  document.getElementById("my-location-btn").addEventListener("click", () => {
    const errorMsg = document.getElementById("error-message");
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";

    if (!navigator.geolocation) {
      errorMsg.textContent = "Geolocation is not supported by your browser.";
      errorMsg.classList.remove("hidden");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        const userTz = moment.tz.guess();
        if (userTz) {
          updateCityUI(userTz);
        } else {
          errorMsg.textContent = "Could not determine your timezone.";
          errorMsg.classList.remove("hidden");
        }
      },
      (error) => {
        errorMsg.textContent = `Unable to retrieve your location: ${error.message}`;
        errorMsg.classList.remove("hidden");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
});
