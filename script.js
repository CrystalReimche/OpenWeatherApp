let appId = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
let units = 'imperial';
let searchMethod; // either q(city name) or zip code

function getSearchMethod(searchTerm) {
    if(searchTerm.lenght === 5 && Number.parseInt(searchTerm) + '' === searchTerm) // if input is zip, checking length is 5 digits long.  Then making sure no letters are in zip code.
        searchMethod = 'zip';
    else
        searchMethod = 'q';
}

function searchWeather(searchTerm){
    getSearchMethod(searchTerm);
    // note back ticks, able to inject JS into strings
    fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&appid=${appId}&units=${units}`) // calling URL with variables
        .then(result => {
            return result.json(); // converting returned information into JSON
        })
        .then(result => {
            init(result);
        })
        .catch(err => alert("Error!"));
}

function init(resultFromServer) {
    console.log(resultFromServer);

    switch (resultFromServer.weather[0].main) { // look at JSON results, under weather[0], then main
        case 'Clear':
            document.body.style.backgroundImage = 'url("images/clear.jpg")'
            break;

        case 'Clouds':
            document.body.style.backgroundImage = 'url("images/cloudy.jpg")'
            break;

        case 'Rain':
        case 'Drizzle':
        case 'Mist':
            document.body.style.backgroundImage = 'url("images/rain.jpg")'
            break;

        case 'Thunderstorm':
            document.body.style.backgroundImage = 'url("images/storm.jpg")'
            break;

        case 'Snow':
            document.body.style.backgroundImage = 'url("images/snow.jpg")'
            break;
        
        default:
            break;
    }

    let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
    let temperatureElement = document.getElementById('temperature');
    let humidityElement = document.getElementById('humidity');
    let windSpeedElement = document.getElementById('windSpeed');
    let cityHeader = document.getElementById('cityHeader');
    let weatherIcon = document.getElementById('documentIconImg');

    weatherIcon.src = 'http://openweathermap.org/img/wn/' + resultFromServer.weather[0].icon + '.png';

    let resultDescription = resultFromServer.weather[0].description;
    weatherDescriptionHeader.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1); // Make first letter uppercase

    temperatureElement.innerHTML = Math.floor(resultFromServer.main.temp) + '&#176';

    /*  ***********  TODO  *********
        make function to change wind speed from meters to miles
       ***********  TODO  *********  */
    windSpeedElement.innerHTML = 'Winds at ' + Math.floor(resultFromServer.wind.speed * 2.237) + ' mph';

    cityHeader.innerHTML = resultFromServer.name;

    humidityElement.innerHTML = 'Humidity levels at ' + resultFromServer.main.humidity + '%';

    setPositionForWeatherInfo();
}

function setPositionForWeatherInfo() {
    let weatherContainer = document.getElementById('weatherContainer');
    let weatherContainerHeight = weatherContainer.clientHeight;
    let weatherContainerWidth = weatherContainer.clientWidth;

    weatherContainer.style.left = `calc(50% - ${weatherContainerWidth / 2}px)`;
    weatherContainer.style.top = `calc(50% - ${weatherContainerHeight / 1.3}px)`;
    weatherContainer.style.visibility = 'visible';
}

document.getElementById('searchBtn').addEventListener('click', () => {
    let searchTerm = document.getElementById('searchInput').value;
    if(searchTerm)
        searchWeather(searchTerm);
});
