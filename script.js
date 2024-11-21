function getWeather() {
  const apiKey = "49849bc518290ef5bc0d2206353d56b8";
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch current weather data.");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching current weather:", error);
      alert("Error fetching current weather data. Please try again.");
    });

  fetch(forecastUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch forecast data.");
      }
      return response.json();
    })
    .then((data) => {
      displayHourlyForecast(data);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  // Clear the previous data
  tempDivInfo.innerHTML = "";
  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    return;
  } else {
    const cityName = data.name;
    const temprature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const tempratureHTML = `
            <p>Temperature: ${temprature}°C</p>`;

    const weatherHTML = `
            <p>${cityName}</p>
            <p>${description}</p>`;

    tempDivInfo.innerHTML = tempratureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = "block";

    showImage();
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  hourlyForecastDiv.innerHTML = ""; // Clear previous data

  const next24Hours = hourlyData.list.slice(0, 8); // Access list of hourly forecasts

  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Higher resolution for hourly icons
    const temprature = Math.round(item.main.temp - 273.15);

    const hourlyItemHTML = `
            <div class="hourly-item">
                <p>${hour}:00</p>
                <img src="${iconUrl}" alt="Hourly Weather Icon" style="max-width: 50px; height: auto;">
                <p>${temprature}°C</p>
            </div>
        `;
    hourlyForecastDiv.innerHTML += hourlyItemHTML;
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}
