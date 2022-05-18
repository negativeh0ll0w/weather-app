var searchColumnEl = document.querySelector("#search-column");
var citiesListContainerBtnEl = document.querySelector(".list-group-item");
var dailyWeatherContainerEl = document.querySelector("#weather-container"); 


// Find the city form
var seachEventHandlerEl = document.querySelector("#city-search-form");
var searchByCityEl = document.querySelector("#city-search");


function fetchSecondCall(searchByCity, latNum, lonNum, currentDateTime, currentDayIcon, currTempF, currentHumidity, currentMPS, mphWindSpeed) {

    // Input API URL
    var openWeatherApiFiveDayUrl =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + latNum + "&lon=" + lonNum + "&appid=32a27c42260b02de3ba5e1466def4861&units=imperial"
    
    fetch(
        openWeatherApiFiveDayUrl
    )
    .then(function (response) {
      return response.json();
    })
    .then(function (secondCallData) {
        // Current Day
        // UV info
        var uvIndex = secondCallData.current.uvi;

        var unix_timestamp = currentDateTime;
        var date = new Date(unix_timestamp * 1000);
        // date
        var fullDayDaily = "(" + (date.getMonth() + 1) + "/" + date.getDate() + "/"  + date.getFullYear() + ")";
                
        // Populate current day data
        populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currTempF, currentHumidity, currentMPS, mphWindSpeed, uvIndex);

        // Populate 5 day forcast
        populate5DayForecast(secondCallData);
    });
};

// Function to populate current day forecast
function populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currTempF, currentHumidity, currentMPS, mphWindSpeed, uvIndex) {
    var dailyForecastContainerEl = document.createElement("div");
    dailyForecastContainerEl.setAttribute("id", "daily-forecast-container");
    dailyForecastContainerEl.classList = "borderDiv";

    var currentDayTitle = document.createElement("h3");
    currentDayTitle.textContent = ( searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) + " " + fullDayDaily);

    var currentIconEl = document.createElement("span")
    var currentIconSymbol = "http://openweathermap.org/img/wn/" + currentDayIcon + "@2x.png";
    currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
    currentDayTitle.append(currentIconEl);

    // today's weather - create elements to hold info
    var currentTempEl = document.createElement("p");
    var currentHumidityEl = document.createElement("p");
    var currentWinSpEl = document.createElement("p");
    var currentUvIEl = document.createElement("p");
    currentUvIEl.classList.add("UV-el");

    // add text
    currentTempEl.textContent = "Temperature: " + (currTempF.toFixed(1)) + " °F";
    currentHumidityEl.textContent = "Humidity: " + currentHumidity + "%";
    currentWinSpEl.textContent = "Wind Speed: " + currentMPS + " MPH";
    currentUvIEl.textContent = "UV Index: " + uvIndex;

    // change uv color 
    if (uvIndex < 3) {
        currentUvIEl.classList.add("low");
    }
    else if ((uvIndex > 6) && (uvIndex < 9)) {
        currentUvIEl.classList.add("high");
    }
    else if (uvIndex >= 9) {
        currentUvIEl.classList.add("really-bad");
    }
    else {
        currentUvIEl.classList.add("med");
    }
    
    

    $("#daily-forecast-container").remove();

    // add to document
    dailyWeatherContainerEl.appendChild(dailyForecastContainerEl);
    dailyForecastContainerEl.appendChild(currentDayTitle);
    dailyForecastContainerEl.appendChild(currentTempEl);
    dailyForecastContainerEl.appendChild(currentHumidityEl);
    dailyForecastContainerEl.appendChild(currentWinSpEl);
    dailyForecastContainerEl.appendChild(currentUvIEl);
};

  
function populate5DayForecast(secondCallData) {
    
    $("#weekly-forecast-container").remove();

    var weeklyForecastContainerEl = document.createElement("div");
    weeklyForecastContainerEl.setAttribute("id", "weekly-forecast-container");
    weeklyForecastContainerEl.classList = "border-Div-right-column"; 
    var fiveDayForecast = document.createElement("h3");
    fiveDayForecast.textContent = "5-Day Forecast:"
    dailyWeatherContainerEl.appendChild(weeklyForecastContainerEl);
    weeklyForecastContainerEl.appendChild(fiveDayForecast);
    var weeklyFlexContainerEL = document.createElement("div");
    weeklyFlexContainerEL.classList = "weekly-flex-conatiner"
    weeklyForecastContainerEl.appendChild(weeklyFlexContainerEL);

    for (i=1; i <= 5; i++) {
        var unixTime = secondCallData.daily[i].dt;
    
        var unix_timestamp = unixTime;
        var date = new Date(unix_timestamp * 1000);
    
        var fullDay = (date.getMonth() + 1) + "/" + date.getDate() + "/"  + date.getFullYear(); // Date
        var iconWeather = secondCallData.daily[i].weather[0].icon // icon
        var fahrenheitTemp = secondCallData.daily[i].temp.day // Temperature
        var humidity = secondCallData.daily[i].humidity;

        var eachDayContainer = document.createElement("div");
        eachDayContainer.setAttribute("id", ("day=" + [i]));
        eachDayContainer.classList = "border-div-five-day-forecast";
       
        var currentDayTitle = document.createElement("p");
        currentDayTitle.textContent = (fullDay);

        var iconSpan = document.createElement("p");
        iconSpan.textContent = "";

        var currentIconEl = document.createElement("span")
        var currentIconSymbol = "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png";
        currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
        iconSpan.append(currentIconEl)

        // p elements for day info
        var currentTempEl = document.createElement("p");
        var currentHumidityEl = document.createElement("p");
        
        currentTempEl.textContent = "Temperature: " +  (fahrenheitTemp.toFixed(2)) + " °F";
        currentHumidityEl.textContent = "Humidity: " + humidity + "%";
          
        // Append daily forecast
        eachDayContainer.appendChild(currentDayTitle);
        eachDayContainer.appendChild(currentIconEl);
        eachDayContainer.appendChild(currentTempEl);
        eachDayContainer.appendChild(currentHumidityEl);
        weeklyFlexContainerEL.appendChild(eachDayContainer);
    };
};

function getWeatherData(event , cityClicked) {

    event.preventDefault() 

    if (cityClicked) {
        var searchByCity = cityClicked.trim();

    } else { 
        var searchByCity = searchByCityEl.value.trim();
    };

    if (searchByCity == "") {
        alert("Please do not leave city name blank");
        searchByCityEl.value = "";
        return 
    } else {  
        searchByCityEl.value = "";
    };
     
    // Get array from local storage
    var citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

    var cityExist = 0;

    // Check if array is null and create new one again.
    if (citiesLocalStorage === null) {
        citiesSearched =  new Array();

    } else { 
        citiesSearched = citiesLocalStorage;
    };

    var openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchByCity + "&appid=32a27c42260b02de3ba5e1466def4861&units=imperial";

    fetch(  
      openWeatherApiUrl
    ).then(function (weatherResponse) {
        
        if(weatherResponse.ok) { 
        return weatherResponse.json();
        } else {
            window.alert("Error: " + weatherResponse.statusText + "\nPlease re-enter a valid city");
            searchByCityEl.value = "";
            return;
        }
    }).then(function (weatherLatLon) {
        // Current day info
        var latNum = weatherLatLon.coord.lat;
        var lonNum = weatherLatLon.coord.lon;
        var currentDateTime = weatherLatLon.dt
        var currentDayIcon = weatherLatLon.weather[0].icon // Current day icon
        var currTempF = weatherLatLon.main.temp // Temperature 
        var currentHumidity = weatherLatLon.main.humidity // Humidity
        var currentMPS = weatherLatLon.wind.speed // W.S.
        var mphWindSpeed = Math.round(currentMPS * 2.237) // MPH

        // Validate if city is new.
        for (i=0; i < citiesSearched.length; i++) {
            if (searchByCity.toLowerCase() === citiesSearched[i].toLowerCase()) {
                cityExist =1
                break;
            };
        };

        if (cityExist === 0) {
            citiesSearched.push(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '));
            
            // Save to local storage
            localStorage.setItem("savedCities", JSON.stringify(citiesSearched));
        }

        fetchSecondCall(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '), latNum, lonNum, currentDateTime, currentDayIcon, currTempF, currentHumidity, currentMPS, mphWindSpeed);
 
      }).catch(function(error) { 
        return;
      });

};


seachEventHandlerEl.addEventListener("submit",getWeatherData);
