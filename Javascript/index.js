let currentInterval;

function formatCityName(timezone) {
  return timezone.split("/")[1].replace("_", " ");
}

function getFlagEmoji(timezone) {
  const region = timezone.split("/")[0];
  const flags = {
    America: "🇺🇸",
    Europe: "🇬🇧",
    Australia: "🇦🇺",
    Asia: "🇨🇳",
  };
  return flags[region] || "🌍";
}

// Render a single city block
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

// Update time for all city blocks on the page
function updateAllTimes() {
  document.querySelectorAll(".city").forEach((city) => {
    const tz = city.getAttribute("data-timezone");
    const now = moment().tz(tz);
    city.querySelector(".date").innerText = now.format("MMMM Do, YYYY");
    city.querySelector(".time").innerText = now.format("hh:mm:ss A");
  });
}

// Initial default cities
const defaultCities = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Australia/Sydney",
];

function showDefaultCities() {
  const cityDisplay = document.getElementById("city-display");
  cityDisplay.innerHTML = defaultCities.map(renderCityBlock).join("");

  if (currentInterval) clearInterval(currentInterval);
  updateAllTimes();
  currentInterval = setInterval(updateAllTimes, 1000);
}

// Update display with a single selected city
function updateCityUI(timezone) {
  const cityDisplay = document.getElementById("city-display");
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

// Handle dropdown changes
document.getElementById("city-select").addEventListener("change", function () {
  const timezone = this.value;

  if (timezone) {
    updateCityUI(timezone);
  } else {
    showDefaultCities(); // Reset to default cities
  }
});

// On first load
showDefaultCities();
