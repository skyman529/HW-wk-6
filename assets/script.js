// Get the video
var video = document.getElementById("myVideo");
// Get the button
var btn = document.getElementById("myBtn");
// make list of searched cities
var searchHistoryList = function(cityName) {
    $('.pastSearch:contains("' + cityName + '")').remove();
    // create entry with city name
    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("pastSearch");
    searchHistoryEntry.text(cityName);
    // create search container
    var searchinputContainer = $("<div>");
    searchinputContainer.addClass("pastSearch-container");
    // add to search history
    searchinputContainer.append(searchHistoryEntry);
    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchinputContainer);

    if (savedSearches.length > 0){
       
        var prevSavedsearch = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(prevSavedsearch);
    }

    // add city 
    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    // clear search bar
    $("#search-input").val("");

};
// onclick for past weather search
$("#search-history-container").on("click", "p", function() {
    var previousCityName = $(this).text();
    getWeatherData(previousCityName);
    fiveDayforcastSection(previousCityName);

    var previousCityClicked = $(this);
    previousCityClicked.remove();
});

var showsaved = function() {
    var savedSearchHistory = localStorage.getItem("savedSearches");

    if (!savedSearchHistory) {
        return false;
    }

    //fixes list for search history
    savedSearchHistory = JSON.parse(savedSearchHistory);

    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};

var getWeatherData = function(cityName) {
    // fetch data from openweather api 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // get city's longitude and lat
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(response){
                    searchHistoryList(cityName);

                    // add current weather container to page
                    var currentWeatherContainer = $("#current-weather-container");
                    currentWeatherContainer.addClass("current-weather-container");

                    // add city name, date, and weather icon to current weather title
                    var currTitle = $("#current-title");
                    var currDay = moment().format("M/D/YYYY");
                    currTitle.text(`${cityName} (${currDay})`);
                    var currIcon = $("#current-weather-icon");
                    currIcon.addClass("current-weather-icon");
                    var currIconCode = response.current.weather[0].icon;
                    currIcon.attr("src", `https://openweathermap.org/img/wn/${currIconCode}@2x.png`);

                    // add current longitude and latitude 
                    var currentlong = $("#current-longitude");
                    currentlong.text("Longitude: " + cityLon);
                    var currentlat = $("#current-latitude");
                    currentlat.text("Latitude: " + cityLat);
                    // add current temp 
                    var currentTemp = $("#current-temp");
                    currentTemp.text("Temperature: " + response.current.temp + "°f");

                    // add current humidit
                    var currentHumidity = $("#current-humidity");
                    currentHumidity.text("Humidity: " + response.current.humidity + "%");

                    // add current wind speed
                    var currentWindSpeed = $("#current-wind-speed");
                    currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + " MPH");
                })
        })
        .catch(function(err) {
            // reset search
            $("#search-input").val("");
            // alert of errors
            alert("PLease check the spelling of your city");
        });
};
var fiveDayforcastSection = function(cityName) {
    // get data from open weather current weather api
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)

        .then(function(response) {
            return response.json();
        })
        .then(function(response) {

            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response);

                    // crete five day
                    var futforcast = $("#future-forcast-title");
                    futforcast.text("5-Day forcast:")

                    // through forcasts container
                    for (var i = 1; i <= 5; i++) {
                        // create card containers and class
                        var futureCard = $(".future-card");
                        futureCard.addClass("future-card-details");

                        // date info
                        var futureDate = $("#future-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        futureDate.text(date);

                        // add icons
                        var futureIcon = $("#future-icon-" + i);
                        futureIcon.addClass("future-icon");
                        var futureIconCode = response.daily[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

                        var futureTemp = $("#future-temp-" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + "°f");

                        var futureHumidity = $("#future-humidity-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                })
        })
};

// called when the search form is submitted
$("#search-form").on("submit", function() {
    event.preventDefault();
    
    // get name of city searched
    var cityName = $("#search-input").val();

    if (cityName === "" || cityName == null) {
        // alert for empty search
        alert("Please search for a city");
        event.preventDefault();
    } else {
        // add city to search history and display current weather conditions
        getWeatherData(cityName);
        fiveDayforcastSection(cityName);
    }
});



showsaved();
