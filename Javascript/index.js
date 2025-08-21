let currentInterval;

const defaultCities = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
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

function formatCityName(timezone) {
  const parts = timezone.split("/");
  return parts[parts.length - 1].replace(/_/g, " ");
}

function populateTimezoneSelect() {
  const select = document.getElementById("city-select");
  select.innerHTML = '<option value="">Choose a city</option>';
  mainTimezones.forEach((tz) => {
    const option = document.createElement("option");
    option.value = tz;
    option.textContent = formatCityName(tz);
    select.append(option);
  });
}

function renderCityBlock(tz) {
  return `
    <div class="city" data-timezone="${tz}">
      <h2>${formatCityName(tz)}</h2>
      <div class="date"></div>
      <div class="time"></div>
    </div>`;
}

function updateAllTimes() {
  document.querySelectorAll(".city").forEach((el) => {
    const time = moment().tz(el.dataset.timezone);
    el.querySelector(".date").innerText = time.format("MMMM Do, YYYY");
    el.querySelector(".time").innerText = time.format("hh:mm:ss A");
  });
}

function showDefaultCities() {
  const disp = document.getElementById("city-display");
  document.getElementById("error-message").classList.add("hidden");
  disp.innerHTML = defaultCities.map(renderCityBlock).join("");
  if (currentInterval) clearInterval(currentInterval);
  updateAllTimes();
  currentInterval = setInterval(updateAllTimes, 1000);
}

function showSingleCity(tz) {
  const disp = document.getElementById("city-display");
  document.getElementById("error-message").classList.add("hidden");
  disp.innerHTML = `
    <a href="#" id="back-to-home">← Back to homepage</a>
    ${renderCityBlock(tz)}`;
  document.getElementById("back-to-home").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("city-select").value = "";
    document.getElementById("city-input").value = "";
    showDefaultCities();
  });
  if (currentInterval) clearInterval(currentInterval);
  updateAllTimes();
  currentInterval = setInterval(updateAllTimes, 1000);
}

function isValidTimezone(input) {
  return moment.tz
    .names()
    .find((name) => name.toLowerCase().includes(input.toLowerCase()));
}

document.addEventListener("DOMContentLoaded", () => {
  populateTimezoneSelect();
  showDefaultCities();

  document.getElementById("search-btn").addEventListener("click", () => {
    const val = document.getElementById("city-input").value.trim();
    if (!val) return;
    const tz = isValidTimezone(val);
    if (tz) return showSingleCity(tz);
    const err = document.getElementById("error-message");
    err.textContent = `City "${val}" not found. Please try again.`;
    err.classList.remove("hidden");
  });

  document.getElementById("city-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("search-btn").click();
  });

  document.getElementById("city-select").addEventListener("change", (e) => {
    if (e.target.value) showSingleCity(e.target.value);
    else showDefaultCities();
  });

  document.getElementById("my-location-btn").addEventListener("click", () => {
    const err = document.getElementById("error-message");
    err.classList.add("hidden");
    if (!navigator.geolocation) {
      err.textContent = "Geolocation not supported.";
      err.classList.remove("hidden");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => showSingleCity(moment.tz.guess()),
      (error) => {
        err.textContent = `Unable to retrieve location: ${error.message}`;
        err.classList.remove("hidden");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
});
