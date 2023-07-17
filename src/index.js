import './style.css';

const regionElem = document.querySelector('.region');
const iconElem = document.querySelector('.weather');
const temperatureElem = document.querySelector('.temperature');
const weatherDescElem = document.querySelector('.weatherDescription');
const feelsLikeTempElem = document.querySelector('.feelsLikeTemp');
const humidityElem = document.querySelector('.humidity');
const windSpeedElem = document.querySelector('.windSpeed');
const airQualityElem = document.querySelector('.airQuality');
const formElem = document.querySelector('form');
const inputElem = document.querySelector('.inputLocation');
const inputErrorMsgElem = document.querySelector('.inputErrorMsg');
const celsiusBtmElem = document.querySelector('.celsius');
const fahrenheitBtmElem = document.querySelector('.fahrenheit');
const apiKey = '684e3ea9e9b24bad94390305231207';
const setTimeoutID = [];
let weatherData;
let count = 0;

function interpretAirQualityData(airQuality) {
    const airQualityMap = new Map();
    airQualityMap.set(1, '1-Good');
    airQualityMap.set(2, '2-Moderate');
    airQualityMap.set(3, '3-Unhealthy for sensitive group');
    airQualityMap.set(4, '4-Unhealthy');
    airQualityMap.set(5, '5-Very unhealthy');
    airQualityMap.set(6, '6-Hazardous');
    return airQualityMap.get(airQuality);
}

function displayWeather() {
    regionElem.textContent = `${weatherData.locationName}, ${weatherData.country}`;
    iconElem.src = weatherData.weatherIcon;
    temperatureElem.textContent = weatherData.tempCelsius;
    weatherDescElem.textContent = weatherData.weatherDescription;
    feelsLikeTempElem.textContent = `${weatherData.feelsLikeCelsius}°C`;
    humidityElem.textContent = `${weatherData.humidity}%`;
    windSpeedElem.textContent = `${weatherData.windSpeedKph} km/h`;
    airQualityElem.textContent = weatherData.airQuality;
}

function showErrorMsg() {
    inputErrorMsgElem.classList.remove('hidden');
    inputErrorMsgElem.classList.add('show');
    setTimeoutID.push(
        setTimeout(() => {
            inputErrorMsgElem.classList.remove('show');
            inputErrorMsgElem.classList.add('hidden');
            setTimeoutID.length = 0;
            count = 0;
        }, 2000)
    );
    count += 1;
    if (count > 1) {
        clearTimeout(setTimeoutID[0]);
        setTimeoutID.shift();
    }
}

function switchTemperatureUnit(e) {
    if (e.target === celsiusBtmElem) {
        celsiusBtmElem.classList.add('active');
        fahrenheitBtmElem.classList.remove('active');
        temperatureElem.textContent = weatherData.tempCelsius;
        feelsLikeTempElem.textContent = `${weatherData.feelsLikeCelsius}°C`;
        windSpeedElem.textContent = `${weatherData.windSpeedKph} km/h`;
    }
    if (e.target === fahrenheitBtmElem) {
        fahrenheitBtmElem.classList.add('active');
        celsiusBtmElem.classList.remove('active');
        temperatureElem.textContent = weatherData.tempFahrenheit;
        feelsLikeTempElem.textContent = `${weatherData.feelsLikeFahrenheit}°F`;
        windSpeedElem.textContent = `${weatherData.windSpeedMph} mi/h`;
    }
}

async function getCurrentWeatherObject(inputLocation) {
    const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${inputLocation}&aqi=yes`,
        { mode: 'cors' }
    );
    const json = await response.json();
    if (!response.ok) throw json.error.message;
    return json;
}

async function extractCurrentWeatherData(inputLocation = 'kuala lumpur') {
    try {
        const { current: currentWeather, location } = await getCurrentWeatherObject(inputLocation);
        const { name: locationName, country } = location;
        const weatherIcon = currentWeather.condition.icon;
        const tempCelsius = currentWeather.temp_c;
        const tempFahrenheit = currentWeather.temp_f;
        const weatherDescription = currentWeather.condition.text;
        const feelsLikeCelsius = currentWeather.feelslike_c;
        const feelsLikeFahrenheit = currentWeather.feelslike_f;
        const windSpeedMph = currentWeather.wind_mph;
        const windSpeedKph = currentWeather.wind_kph;
        const airQuality = interpretAirQualityData(currentWeather.air_quality['us-epa-index']);
        const { humidity } = currentWeather;
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
        if (err instanceof TypeError) {
            alert(err);
            return;
        }
        inputErrorMsgElem.textContent = err;
        showErrorMsg();
    }
}

function checkInputValidity() {
    if (inputElem.validity.valueMissing) {
        inputErrorMsgElem.textContent = 'Please fill out this field!';
        showErrorMsg();
        return false;
    }
    return true;
}

function onSubmit(e) {
    e.preventDefault();
    if (!checkInputValidity()) return;
    extractCurrentWeatherData(inputElem.value);
    formElem.reset();
}

extractCurrentWeatherData();
formElem.addEventListener('submit', onSubmit);
celsiusBtmElem.addEventListener('click', switchTemperatureUnit);
fahrenheitBtmElem.addEventListener('click', switchTemperatureUnit);
