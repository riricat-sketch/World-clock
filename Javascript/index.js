let currentInterval;

const defaultCities = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Australia/Sydney",
];

// Proper emojis using Unicode escapes to avoid encoding issues
const flagMap = {
  America: "\u{1F1FA}\u{1F1F8}", // 🇺🇸
  Europe: "\u{1F1EC}\u{1F1E7}", // 🇬🇧
  Australia: "\u{1F1E6}\u{1F1FA}", // 🇦🇺
  Asia: "\u{1F1E8}\u{1F1F3}", // 🇨🇳
};

function formatCityName(timezone) {
  return timezone.split("/")[1].replace("_", " ");
}

function getFlagEmoji(timezone) {
  const region = timezone.split("/")[0];
  return flagMap[region] || "\u{1F30D}"; // 🌍 fallback globe
}

function renderCityBlock(timezone) {
  const cityName = formatCityName(timezone);
  const flag = getFlagEmoji(timezone);

  return `
    <div class="city" data-timezone="${timezone}">
      <h2>${cityName} ${flag}</h2>
      <div class="date"></div>
      <div class="time"></div>
    </div>
  `;
}

function updateAllTimes() {
  document.querySelectorAll(".city").forEach((city) => {
    const tz = city.getAttribute("data-timezone");
    const now = moment().tz(tz);
    city.querySelector(".date").innerText = now.format("MMMM Do, YYYY");
    city.querySelector(".time").innerText = now.format("hh:mm:ss A");
  });
}

function showDefaultCities() {
  const cityDisplay = document.getElementById("city-display");
  const errorMsg = document.getElementById("error-message");
  errorMsg.classList.add("hidden");
  cityDisplay.innerHTML = defaultCities.map(renderCityBlock).join("");

  if (currentInterval) clearInterval(currentInterval);
  updateAllTimes();
  currentInterval = setInterval(updateAllTimes, 1000);
}

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

function isValidTimezone(cityInput) {
  const zoneNames = moment.tz.names();
  return zoneNames.find((name) =>
    name.toLowerCase().includes(cityInput.toLowerCase())
  );
}

// On load, show default cities
showDefaultCities();

// Search button listener
document.getElementById("search-btn").addEventListener("click", () => {
  const input = document.getElementById("city-input").value.trim();
  if (!input) return; // ignore empty input

  const match = isValidTimezone(input);

  if (match) {
    updateCityUI(match);
  } else {
    const errorMsg = document.getElementById("error-message");
    errorMsg.textContent = `City "${input}" not found. Please try again.`;
    errorMsg.classList.remove("hidden");
  }
});

// Enter key triggers search
document.getElementById("city-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.getElementById("search-btn").click();
  }
});
