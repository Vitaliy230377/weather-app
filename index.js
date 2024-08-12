'use strict';

const apiKey = 'b14107513b504604aa8c6226dc3d949d';
const getWeatherBtn = document.querySelector('.getWeather');

const weekDayNames = [
    'Sunday',
    'Monday',
    'Tusday',
    'Wednesday',
    'Tursday',
    'Friday',
    'Saturday'
]
const monthsNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

getWeatherBtn.addEventListener('click', getWeatherByCoords);

function getWeather(){
    const apiKey = 'b14107513b504604aa8c6226dc3d949d';
    const city  = document.getElementById('city').value;
    const limit  = 1;
    const numberOfDays = 7;

    if(!city){
        alert('Please enter a city');
        return;
    }

    // const currentWetherUrl  = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid=${apiKey}`
    const currentWeatherUrl  = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`


    fetch (currentWeatherUrl)
        .then( response =>  response.json())
            // console.log(response);
        .then(json =>  {
            // displayWeather(json[0]);
            const locationData = displayWeather(json[0]);
            // const lat = locationData.lat;
            // const lon = locationData.lon;

            const {lat, lon} = locationData

            console.log(lat);
            console.log(lon);

            if (!lat || !lon) {
                alert('Coordinates not found for the selected city');
                return;
            }

            const currentWeatherByLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            return fetch(currentWeatherByLocation);
        }) // [0] because it can be more than 1 city in object

        .then(response => response.json())
        .then(json => locationWeather(json))
        .catch(error =>{
            console.log('Error fetching current weather data: ', error);
            alert('Error fetching current weather data. Please try again');
        })
   


        fetch (currentWeatherUrl)
        .then( response =>  response.json())
            // console.log(response);
        .then(json =>  {
            // displayWeather(json[0]);
            const locationData = displayWeather(json[0]);
            // const lat = locationData.lat;
            // const lon = locationData.lon;

            const {lat, lon} = locationData

            console.log(lat);
            console.log(lon);

            if (!lat || !lon) {
                alert('Coordinates not found for the selected city');
                return;
            }

            const forecatsWeatherData = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
          
            return fetch(forecatsWeatherData);
        }) // [0] because it can be more than 1 city in object

        .then(response => response.json())
        .then(json => displayHourlyForecast(json))
        .catch(error =>{
            console.log('Error fetching current weather data: ', error);
            alert('Error fetching current weather data. Please try again');
        })


        // .then(response => {
        //     return response.json(); // Обрізаємо console.log тут
        // })
        // .then(json => {
        //     console.log(json); // Виводимо дані тільки після того, як проміс буде виконаний
        // })
}

async function getAsyncLocation(){
    const city  = document.getElementById('city').value;
    const limit  = 1;

    if(!city){
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl  = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`

    try{
        const weatherResponse = await fetch(currentWeatherUrl);
        const resp = await weatherResponse.json()
        const {lat,lon} = resp[0];
        const locationsCoords = {lat,lon};
        return locationsCoords;
    }catch(err){
            console.error('Error is in async' , err);
    }
}


async function getWeatherByCoords(){

    const locationCoords = await getAsyncLocation();
    if (!locationCoords) {
        console.error('Failed to get location coordinates.');
        return;
    } else {

        const {lat,lon} = locationCoords;

        const currentWeatherByLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const weatherResponse = await fetch(currentWeatherByLocation);
        const asyncWeatherData = await weatherResponse.json();


        const forecatsWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const forecastWeatherResponse = await fetch(forecatsWeatherUrl);
        const asyncForecastWeatherData = await forecastWeatherResponse.json();


        locationWeather(asyncWeatherData);
        displayHourlyForecast(asyncForecastWeatherData);
    }
}

function locationWeather(weatherData){
   
    if (!weatherData) {
        console.error('No weather data available.');
        return;
    }

    // console.log('Data in Current Location Weather');
    // console.log(weatherData);


    const tempDivInfo  = document.getElementById('temp-div');
    const weatherInfoDiv  = document.getElementById('weather-info');
    const weatherIcon  = document.getElementById('weather-icon');
    const hourlyForecastDiv  = document.getElementById('hourly-forecast');


    //clear previous content

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
        if(weatherData.cod === '404'){
             weatherInfoDiv.innerHTML = `<p> ${weatherData.message}</p>`
        }else{
            const date = new Date(weatherData.dt * 1000);
            const weekDayName = weekDayNames[date.getUTCDay()];
            const month = monthsNames[date.getMonth()]; // get month Name
            const day = date.getDate();            // get date
            const year = date.getFullYear();       // get year

            // Date scting
            const formattedDate = `${weekDayName} ${day},${month}, ${year}`;
            const cityName = weatherData.name;
            const temperature = Math.round(weatherData.main.temp - 273.15);
            const description = weatherData.weather[0].description;
            const iconCode = weatherData.weather[0].icon;
            const iconUrl  = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;


             const temperatureHTML = `
                <p> ${temperature}°C</p>
                `;

    
            const weatherHtml = `
                <p>${cityName}</p>
                <p>${formattedDate}</p>
                <p>${description}</p>
                `;


            tempDivInfo.innerHTML = temperatureHTML;
            weatherInfoDiv.innerHTML = weatherHtml;
            weatherIcon.src = iconUrl;
            weatherIcon.alt = description;

            showImage();
        }
}

function showImage(){
    const weatherIcon = document
    .getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}

function displayHourlyForecast(json){
    console.log('here we go');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    // // const next24Hours = hourlyData.slice(0, 8);
    console.log(json.list);
    const next5Days = json.list;

    next5Days.forEach(item => {
        const dateTime = new Date (item.dt * 1000);
        const month = monthsNames[dateTime.getMonth()]; // get month Name
        const day = dateTime.getDate();            // get date
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl  = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        console.log(temperature);

        const hourlyItemHtml = `
        <div class="hourly-item">
         <span> ${day} ${month}</span>
        <span> ${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span> ${temperature}°C</snap>
        </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}