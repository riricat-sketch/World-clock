function updateTime() {
  // Los Angeles
  const laTime = moment().tz("America/Los_Angeles");
  document.querySelector(".city:nth-of-type(1) .date").innerText =
    laTime.format("MMMM Do, YYYY");
  document.querySelector(".city:nth-of-type(1) .time").innerText =
    laTime.format("hh:mm:ss A");

  // Sydney
  const sydTime = moment().tz("Australia/Sydney");
  document.querySelector(".city:nth-of-type(2) .date").innerText =
    sydTime.format("MMMM Do, YYYY");
  document.querySelector(".city:nth-of-type(2) .time").innerText =
    sydTime.format("hh:mm:ss A");
}

// Initial call
updateTime();

// Update every second
setInterval(updateTime, 1000);
