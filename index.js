function getWeatherInfo() {
  var city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    alert("Please enter a city.");
    return;
  }

  var weatherKey = "3cac524057eb4d1582795741240602";
  var geocodingKey = "65ba2165024d5660860737spwaae037";
  var geocodingUrl =
    "https://geocode.maps.co/search?q=" +
    encodeURIComponent(city) +
    "&api_key=" +
    geocodingKey;

  $("#loaderOverlay").show();
  $("#weatherContent").hide();
  $("#errorDiv").empty();

  $.ajax({
    url: geocodingUrl,
    method: "GET",
    success: function (geocodingData) {
      if (
        geocodingData.length === 0 ||
        !geocodingData[0].lat ||
        !geocodingData[0].lon
      ) {
        handleError("City not found. Please enter a valid city.");
        $("#loaderOverlay").hide();
        return;
      }
      var latitude = geocodingData[0].lat;
      var longitude = geocodingData[0].lon;
      var weatherApiUrl =
        "https://cors-anywhere.herokuapp.com/https://api.weatherapi.com/v1/current.json?key=" +
        weatherKey +
        "&q=" +
        latitude +
        "," +
        longitude;

      $.ajax({
        url: weatherApiUrl,
        method: "GET",
        headers: {
          Authorization: "Bearer " + weatherKey,
        },
        success: function (response) {
          var weatherData = response.current;
          console.log(weatherData);
          if (weatherData) {
            $("#temperature").text(
              weatherData.temp_f !== undefined
                ? weatherData.temp_f
                : "Data unavailable"
            );
            $("#temperatureCelsius").text(
              weatherData.temp_c !== undefined
                ? weatherData.temp_c
                : "Data unavailable"
            );
            $("#humidity").text(
              weatherData.humidity !== undefined
                ? weatherData.humidity
                : "Data unavailable"
            );
            $("#description").text(
              weatherData.wind_kph !== undefined
                ? weatherData.wind_kph
                : "Data unavailable"
            );
            $("#condition").text(
              weatherData.condition !== undefined
                ? weatherData.condition.text
                : "Data unavailable"
            );
            $("#weatherContent").show();
            var condition = weatherData.condition.text.toLowerCase();
            var weatherIcon = "";

            if (condition.includes("snow")) {
              weatherIcon = "snow.png";
            } else if (condition.includes("rain")) {
              weatherIcon = "rain.png";
            } else if (condition.includes("cloud")) {
              weatherIcon = "cloud.png";
            } else if (condition.includes("mist")) {
              weatherIcon = "mist.png";
            } else {
              weatherIcon = "clear.png";
            }

            $(".weather-icon").attr("src", "images/" + weatherIcon);

            $("#weatherContent").show();
          } else {
            handleError("Weather data unavailable.");
          }
        },
        error: function (error) {
          handleError("Failed to fetch weather data. " + error);
        },
        complete: function () {
          $("#loaderOverlay").hide();
        },
      });
    },
    error: function (error) {
      handleError("Failed to fetch location data. " + error);
    },
  });
}

function handleError(errorMessage) {
  $("#errorDiv").html(
    '<div class="alert alert-danger">' + errorMessage + "</div>"
  );
}
