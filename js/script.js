`api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`

// SELECT ELEMENT
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.city-title');
const notificationElement = document.querySelector('.notification');
const windElement = document.querySelector(".wind p");
const maxTempElement = document.querySelector(".max p");
const minTempElement = document.querySelector(".min p");
const humidityElement = document.querySelector(".humidity p");

// App data 
const weather = {}

weather.temperature = {
  unit: 'celsius'
}

// APP const and vars 
const KELVIN = 273

// API KEY
const KEY = 'e932d2fb6a978a4f00abe9a160e3761f';

// Check if browser support geolocation
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError)
} else {
  notificationElement.innerHTML = '<p>Ваш браузер не поддерживает геолакацию</p>'
}

// Set user's position 
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude)
}

// Show error when thire is an issue with geolocation service 
function showError(error) {
  notificationElement.innerHTML = `<p>${error.message}</p>`
}

// Get weather from API provider
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}&lang=ru&units=imperial`

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data
    })
    .then(function (data) {
      console.log(data)
      weather.temperature.value = Math.floor((data.main.temp - 32) * 5 / 9);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.wind = Math.floor(data.wind.speed * 1.609);
      weather.temperature.maxValue = Math.floor((data.main['temp_max'] - 32) * 5 / 9);
      weather.temperature.minValue = Math.floor((data.main['temp_min'] - 32) * 5 / 9);
      weather.humidity = data.main.humidity;
    })
    .then(function () {
      displayWeather()
    })
}

// Display Weather to UI
function displayWeather() {
  tempElement.textContent = `${weather.temperature.value} °c`;
  descElement.innerHTML = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);
  locationElement.textContent = `${weather.city}, ${weather.country}`;
  windElement.textContent = `${weather.wind} км/ч`;
  maxTempElement.textContent = `${weather.temperature.maxValue} °c`;
  minTempElement.textContent = `${weather.temperature.minValue} °c`;
  humidityElement.textContent = `${weather.humidity}%`;

  if (weather.iconId === '01d') {
    iconElement.innerHTML = `<div class="sunny"></div>`;
  } else if (weather.iconId === '04d' || weather.iconId === '04n' || weather.iconId === '03d' || weather.iconId === '03n' || weather.iconId === '02n' || weather.iconId === '02d') {
    iconElement.innerHTML = `<div class="cloudy"></div>`;
  } else if (weather.iconId === '09d' || weather.iconId === '09n' || weather.iconId === '10d' || weather.iconId === '10n') {
    iconElement.innerHTML = `<div class="rainy"></div>`;
  } else if (weather.iconId === '11d' || weather.iconId === '11n') {
    iconElement.innerHTML = `<div class="stormy"></div>`;
  } else if (weather.iconId === '01n') {
    iconElement.innerHTML = `<div class="starry"></div>`;
  } else if (weather.iconId === '50n' || weather.iconId === '50d') {
    iconElement.innerHTML = `<img src="img/weather/${weather.iconId}.png"  />`;
  }
}

// C to F conversation
function celsiusToFahrenheit(temperature) {
  return (temperature * 9 / 5) + 32
}

// When the use clicks on the temparature element

function setCelsiusToFahrenheit() {
  if (weather.temperature.value === undefined) return;
  if (weather.temperature.maxValue === undefined) return;
  if (weather.temperature.minValue === undefined) return;

  if (weather.temperature.unit == 'celsius') {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    let maxFahrenheit = celsiusToFahrenheit(weather.temperature.maxValue);
    let minFahrenheit = celsiusToFahrenheit(weather.temperature.minValue);
    fahrenheit = Math.floor(fahrenheit);
    maxFahrenheit = Math.floor(maxFahrenheit);
    minFahrenheit = Math.floor(minFahrenheit);

    tempElement.textContent = `${fahrenheit} °F`;
    maxTempElement.textContent = `${maxFahrenheit} °F`;
    minTempElement.textContent = `${minFahrenheit} °F`;
    weather.temperature.unit = 'fahrenheit';
  } else {
    tempElement.textContent = `${weather.temperature.value} °c`;
    maxTempElement.textContent = `${weather.temperature.maxValue} °c`;
    minTempElement.textContent = `${weather.temperature.minValue} °c`;
    weather.temperature.unit = 'celsius';
  }
}

tempElement.addEventListener('click', setCelsiusToFahrenheit)
maxTempElement.addEventListener('click', setCelsiusToFahrenheit)
minTempElement.addEventListener('click', setCelsiusToFahrenheit)

