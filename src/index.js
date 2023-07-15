import './style.css';

// Weather related Dom Elements
const regionElem = document.querySelector('.region');
const iconElem = document.querySelector('.weather');
const temperatureElem = document.querySelector('.temperature');
const weatherDescElem = document.querySelector('.weatherDescription');
const feelsLikeTempElem = document.querySelector('.feelsLikeTemp');
const humidityElem = document.querySelector('.humidity');
const windSpeedElem = document.querySelector('.windSpeed');
const airQualityElem = document.querySelector('.airQuality');

// Form related Dom Elements
const formElem = document.querySelector('form');
const inputElem = document.querySelector('.inputLocation');
const inputErrorMsgElem = document.querySelector('.inputErrorMsg');

// Button related Dom Elements
const celsiusBtmElem = document.querySelector('.celsius');
const fahrenheitBtmElem = document.querySelector('.fahrenheit');

// Data to be put in after fetched
let weatherData;

function displayWeather() {
    regionElem.textContent = `${weatherData.locationName}, ${weatherData.country}`;
    iconElem.src = weatherData.weatherIcon;
    temperatureElem.textContent = weatherData.tempCelsius;
    weatherDescElem.textContent = weatherData.weatherDescription;
    feelsLikeTempElem.textContent = weatherData.feelsLikeCelsius;
    humidityElem.textContent = `${weatherData.humidity}%`;
    windSpeedElem.textContent = `${weatherData.windSpeedKph} km/h`;
    airQualityElem.textContent = weatherData.airQuality;
}

function addClassForFadeInOut() {
    inputErrorMsgElem.className = 'inputErrorMsg show';
    setTimeout(() => {
        inputErrorMsgElem.className = 'inputErrorMsg';
    }, 2000);
}

function switchTemperatureUnit(e) {
    if (e.target === celsiusBtmElem) {
        temperatureElem.textContent = weatherData.tempCelsius;
        feelsLikeTempElem.textContent = weatherData.feelsLikeCelsius;
        windSpeedElem.textContent = `${weatherData.windSpeedKph} km/h`;
    }
    if (e.target === fahrenheitBtmElem) {
        temperatureElem.textContent = weatherData.tempFahrenheit;
        feelsLikeTempElem.textContent = weatherData.feelsLikeFahrenheit;
        windSpeedElem.textContent = `${weatherData.windSpeedMph} mi/h`;
    }
}

async function getCurrentWeatherObject(inputLocation) {
    const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=684e3ea9e9b24bad94390305231207&q=${inputLocation}&aqi=yes`,
        { mode: 'cors' }
    );
    const json = await response.json();
    if (!response.ok) throw json.error.message;
    return json;
}

async function extractCurrentWeatherData(inputLocation = 'kuala lumpur') {
    try {
        const { current, location } = await getCurrentWeatherObject(inputLocation);
        // Location
        const { name: locationName, country } = location;
        // Weather
        const weatherIcon = current.condition.icon;
        const tempCelsius = current.temp_c;
        const tempFahrenheit = current.temp_f;
        const weatherDescription = current.condition.text;
        const feelsLikeCelsius = current.feelslike_c;
        const feelsLikeFahrenheit = current.feelslike_f;
        const windSpeedMph = current.wind_mph;
        const windSpeedKph = current.wind_kph;
        const airQuality = current.air_quality['us-epa-index'];
        const { humidity } = current;
        weatherData = {
            locationName,
            country,
            weatherIcon,
            tempCelsius,
            tempFahrenheit,
            weatherDescription,
            feelsLikeCelsius,
            feelsLikeFahrenheit,
            humidity,
            windSpeedMph,
            windSpeedKph,
            airQuality,
        };
        displayWeather();
    } catch (err) {
        if (err instanceof Error) {
            alert(err);
            return;
        }
        inputErrorMsgElem.textContent = err;
        addClassForFadeInOut();
    }
}

function checkFormValidityAndDisplayResult(e) {
    e.preventDefault();
    if (inputElem.validity.valueMissing) {
        inputErrorMsgElem.textContent = 'Please fill in this field';
        addClassForFadeInOut();
        return;
    }
    extractCurrentWeatherData(inputElem.value);
    formElem.reset();
}

extractCurrentWeatherData();
formElem.addEventListener('submit', checkFormValidityAndDisplayResult);
celsiusBtmElem.addEventListener('click', switchTemperatureUnit);
fahrenheitBtmElem.addEventListener('click', switchTemperatureUnit);
