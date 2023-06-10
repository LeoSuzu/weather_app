

//Keays for fetching weather data and picture from cities
const weatherKey = ''; // THIS IS KEY FOR OPENWEATHERMAP.ORG USE YOUR OWN KEY!!!
const unsplashKey = ''; // THIS IS KEY FOR UNSPLASH:COM USE YOUR OWN KEY!!!

//Set metric units for weathe data
let units = 'metric';

let fetchWeather = 'https://api.openweathermap.org/data/2.5/weather?';
let fetchHourly = 'https://api.openweathermap.org/data/2.5/forecast?';
let fetchImage = 'https://api.unsplash.com/search/photos?';
let searchMethod; // q means searching as a string cityname.

//Search method function "zip" or "city name"
function getSearchMethod(searchTerm) {
    // If search term length is 5 digits and if it is number serchMethod is "zip"-code
    if (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'zip';
    // Else searchMethod is city name search
    else
        searchMethod = 'q';
}

// fetching weather data for now in search area
function searchWeather(searchTerm) {
    getSearchMethod(searchTerm);
    fetch(`${fetchWeather}${searchMethod}=${searchTerm}&APPID=${weatherKey}&units=${units}`)
        .then((result) => {
            if (!result.ok) {
                //If not succesfull
                throw Error('ERROR');
            }
            return result.json();
        }).then((res) => {
        //Get current weathe data
        currentInit(res);

    });
}



//Because weather fetch is trggered with search button load rundom city from list first
function loadRandomCity() {
    const cities = ['Helsinki', 'Stockholm', 'Tampere', 'San Miguel de Allende', 'Edinburgh', 'Taipei' ,'Chefchaouen' ,'Sedona', 'Dubrovnik', 'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Kyoto', 'Shanghai', 'Egypt', 'Singapore', 'Barcelona', 'Queenstown', 'Istanbul', 'San Francisco', 'Sapporo', 'Palermo', 'Cape Town', 'Seoul', 'Cartagena', 'Rio de Janeiro', 'Tbilisi', 'Rome', 'Hoi An', 'Buenos Aires'];
    const randomIndex = Math.floor(Math.random() * cities.length);
    searchWeather(cities[randomIndex]);
    getHourlyForecast(cities[randomIndex]);

}

loadRandomCity();

async function currentInit(fetched) {
    // Store variables to city and current weather
    const city = fetched.name;
    const weather = fetched.weather[0].main;

    // Here start image part
    try {
        // Fetch from unsplash with search type.
        // Must have query and client id --- https://api.unsplash.com/search/photos?query=???&client id
        // More options: https://unsplash.com/documentation#search-photos
        // Trying first to fetch a picture with "city name" + "weather condition" if not successful, use default images
        const response = await fetch(`${fetchImage}query=${city} ${weather}&client_id=${unsplashKey}`);
        const data = await response.json();

        // Creating a random integer variable between 1-5 for fetching image index
        let fetchingIndex = Math.floor(Math.random() * 5) + 1;
        // Store the result in a variable
        const image = data.results[fetchingIndex].urls.regular;

        // Set as background if found. Since it is a fetched image, a new element must be created!
        document.body.style.backgroundImage = `url(${image})`;
    } catch (error) {
        console.log("Not found from unsplash. Using local images.");
        // If not found from Unsplash, load a default photo from the local ./images folder
        let backgroundElement = document.getElementById('background-image');
        switch (weather) {
            case 'Clear':
            case 'Few clouds':
                backgroundElement = "url('./images/clearPicture.app_large')";
                break;

            case 'Clouds':
            case 'Scattered clouds':
            case 'Broken clouds':
            case 'Overcast clouds':
                backgroundElement = "url('./images/cloudyPicture.app_large')";
                break;

            case 'Rain':
            case 'Drizzle':
                backgroundElement = "url('./images/rainPicture.app_large')";
                break;

            case 'Mist':
            case 'Fog':
            case 'Haze':
            case 'Smoke':
                backgroundElement = "url('./images/mistPicture.app_large')";
                break;

            case 'Thunderstorm':
            case 'Light thunderstorm':
            case 'Heavy thunderstorm':
            case 'Ragged thunderstorm':
                backgroundElement = "url('./images/storm2.app_large')";
                break;

            case 'Snow':
            case 'Light snow':
                backgroundElement = "url('./images/snowPicture.app_large')";
                break;

            default:
                break;
        }
    }

    // Setting up elements for HTML
    let cityHeader = document.getElementById('cityHeader');
    let temperatureElement = document.getElementById('temperature');
    let resultDescription = fetched.weather[0].description;
    let dateTimeNowElement = document.getElementById('weatherNow-dateTime');
    let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
    let windSpeedElement = document.getElementById('windSpeed');
    let feelsLikeElement = document.getElementById('feelsLike');
    let humidityElement = document.getElementById('humidity');
    let weatherIconElement = document.getElementById('documentIconImg');
    let cloudPercentElement = document.getElementById('cloudPercent');
    let rainLevelElement = document.getElementById('rainVolume');
    let snowLevelElement = document.getElementById('snowVolume');

    // Fetch local time zone
    let cityTimeZone = fetched.timezone;

// Create a new Date object for the current time
    let cityDate = new Date();

// Get the offset in minutes
    let offsetMinutes = cityDate.getTimezoneOffset();

// Convert the offset to milliseconds
    let offsetMilliseconds = offsetMinutes * 60 * 1000;

// Adjust the time based on the city's timezone offset
    cityDate.setTime(cityDate.getTime() + (cityTimeZone * 1000) + offsetMilliseconds);

// Format the date and time
    let formattedDateTime = cityDate.toLocaleString();

// Assign the formatted date and time to the HTML element
    dateTimeNowElement.innerHTML = formattedDateTime;




    // Assign values to HTML element variable
    // Weather icon for todays forecast
    weatherIconElement.src = 'http://openweathermap.org/img/w/' + fetched.weather[0].icon + '.png';
    // Fetched city name and welcome text
    cityHeader.innerHTML = "Welcome to " + fetched.name +"!";
    // Local date and local time
    dateTimeNowElement.innerHTML = formattedDateTime;
    // Temperature rounded down to largest integer
    temperatureElement.innerHTML = Math.floor(fetched.main.temp) + '&#176;C';
    // Weather description
    weatherDescriptionHeader.innerText = resultDescription;
    // Windspeed
    windSpeedElement.innerHTML = 'Wind speed: ' + Math.floor(fetched.wind.speed) + ' m/s';
    // Feels like
    feelsLikeElement.innerHTML = 'Feels like: ' + Math.floor(fetched.main.feels_like) + '&#176;C';
    // Feels like
    humidityElement.innerHTML = 'Humidity: ' + fetched.main.humidity +  '%';

    // Because rain level, snow level, cloud level is sometimes "NO data available" set then to 0

    //Rain value rounded down to largest integer
    if (fetched.rain) {
        rainLevelElement.innerHTML = 'Rain: ' + fetched.rain['1h'] + ' mm';
    } else {
        rainLevelElement.innerHTML = 'Rain:  0 mm';
    }

    if (fetched.snow) {
        snowLevelElement.innerHTML = 'Snow ' + fetched.snow['1h'] + ' mm';
    } else {
        snowLevelElement.innerHTML = 'Snow: 0 mm';
    }
    if (fetched.clouds) {
        cloudPercentElement.innerHTML = 'Clouds: ' + fetched.clouds.all + ' %';
    } else {
        cloudPercentElement.innerHTML = 'Clouds: 0 %';
    }

    setPositionForWeatherInfo();
}

function setPositionForWeatherInfo() {
    // Setting current weather statements to flexbox weatherContainer
    let weatherContainer = document.getElementById('weatherContainer');

    // Store client device size
    let weatherContainerHeight = weatherContainer.clientHeight;
    let weatherContainerWidth = weatherContainer.clientWidth;
}

// Fetching hourly forecast from openweathermap 3h, 6h, 9h, 12h, and 15h in the future.
function getHourlyForecast(searchTerm) {

    fetch(`${fetchHourly}${searchMethod}=${searchTerm}&APPID=${weatherKey}&units=${units}`)
        .then((result) => {
            if (!result.ok) {
                throw Error('error');
            }
            return result.json();
        })
        .then((fetched) => {
            // Delete old forecasts from hourlyForecastContainer
            hourlyForecastContainer.innerHTML = '';

            // Get the time zone offset in seconds
            const timeZoneOffset = fetched.city.timezone;

            // Set current local time in the searched location
            const currentLocalTime = new Date().getTime() + timeZoneOffset * 1000;

            // Set first forecast time as the current local time + 3 hours
            const firstForecastTime = currentLocalTime + 3 * 60 * 60 * 1000;

            // Slicing result to 5
            fetched.list.slice(0, 5).forEach((forecast, index) => {
                // Every loop adding 3 hours to the first forecast time
                const forecastTime = firstForecastTime + index * 3 * 60 * 60 * 1000;
                const forecastDate = new Date(forecastTime);

                // Set the minutes to "00"
                forecastDate.setMinutes(0);

                // Format the forecast date and time
                const formattedForecastTime = forecastDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Extract the forecast icon and temperature
                const forecastIcon = forecast.weather[0].icon;
                const forecastTemp = Math.round(forecast.main.temp);

                // Create the forecast element
                const hourlyForecastElement = document.createElement('div');
                hourlyForecastElement.classList.add('hourly-forecast');
                hourlyForecastElement.innerHTML = `<div>${formattedForecastTime}</div>
                                                   <div><img src="https://openweathermap.org/img/w/${forecastIcon}.png" alt="image" /></div>
                                                   <div>${forecastTemp}°C</div>`;

                // Append the forecast element to hourlyForecastContainer
                hourlyForecastContainer.appendChild(hourlyForecastElement);
            });
        })
        .catch((error) => {
            console.log(error);
        });
}


// Function to handle search
function handleSearch() {
    // Store element from search input
    const searchTerm = document.getElementById('searchInput').value;
    if (searchTerm) {
        // Fetch current weather and forecast
        searchWeather(searchTerm);
        getHourlyForecast(searchTerm);
    }
}

// When button is pressed with mouse
document.getElementById('searchBtn').addEventListener('click', handleSearch);

// When Enter key is pressed in the search input field
document.getElementById('searchInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});




