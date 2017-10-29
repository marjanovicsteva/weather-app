/* global $ navigator moment */

var lat, lon;
var tempUnit = "C";
var currentTempInCelsius, temperatureInFahrenheit;
var maxTempInCelsius, maxTempInFahrenheit;
var minTempInCelsius, minTempInFahrenheit;
var isDay = true;
var time = new Date();
time = moment().format("HH");
if (time >= 0 && time < 6) {
    isDay = false;
} else if (time >= 6 && time < 18) {
    isDay = true;
} else if (time >= 18 && time < 24) {
    isDay = false;
}

$(document).ready(function() {
    if ($(window).width() < 992) {
        $("#text-center").removeClass("text-left");
        $("#titleSpace").hide();
        $("#weatherIcon").css("margin-bottom", "50px");
        $("#buttonSpace").hide();
    }
    $(window).resize(function() {
        if ($(window).width() < 992) {
            $("#text-center").removeClass("text-left");
            $("#titleSpace").hide();
            $("#weatherIcon").css("margin-bottom", "50px");
            $("#buttonSpace").hide();
        } else {
            $("#text-center").addClass("text-left");
            $("#titleSpace").show();
            $("#weatherIcon").css("margin-bottom", "20px");
            $("#buttonSpace").show();
        }
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = "lat=" + position.coords.latitude;
            lon = "lon=" + position.coords.longitude;
            
            var urlString = "https://api.openweathermap.org/data/2.5/weather?" + lat + "&" + lon + "&APPID=666f4aa5ff6ef52bcabb2953252b8f55";
            
            
            $.getJSON(urlString, function(json) {
                // Favicon
                $("#favicon").attr("href", "https://openweathermap.org/img/w/" + String(json.weather[0].icon) + ".png");
                
                // Icon
                iconGen(json.weather[0].main);
                
                // Main Information
                $("#city").text(json.name + ", ");
                $("#country").text(json.sys.country);
                currentTempInCelsius = Math.round((json.main.temp - 273.15) * 10) / 10;
                $("#temperature").text(currentTempInCelsius + " " + String.fromCharCode(176));
                $(".tempUnit").text(tempUnit);
                $("#description").text(json.weather[0].main);
                
                // Aditional information
                maxTempInCelsius = Math.round((json.main.temp_max - 273.15) * 10) / 10;
                minTempInCelsius = Math.round((json.main.temp_min - 273.15) * 10) / 10;
                $("#maxTemp").text(maxTempInCelsius + " " + String.fromCharCode(176));
                $("#minTemp").text(minTempInCelsius + " " + String.fromCharCode(176));
                $("#pressure").text(json.main.pressure + " mb");
                $("#humidity").text(json.main.humidity + "%");

                
                // Checks which side of the world wind is blowing at
                
                if (json.wind.deg >= 0 && json.wind.deg <= 22.5) {
                    // N
                    $("#windDirection").text("N");
                } else if (json.wind.deg > 22.5 && json.wind.deg <= 67.5) {
                    // NE
                    $("#windDirection").text("NE");
                } else if (json.wind.deg > 67.5 && json.wind.deg <= 112.5) {
                    // E
                    $("#windDirection").text("E");
                } else if (json.wind.deg > 112.5 && json.wind.deg <= 157.5) {
                    // SE
                    $("#windDirection").text("SE");
                } else if (json.wind.deg > 157.5 && json.wind.deg <= 202.5) {
                    // S
                    $("#windDirection").text("S");
                } else if (json.wind.deg > 202.5 && json.wind.deg <= 257.5) {
                    // SW
                    $("#windDirection").text("SW");
                } else if (json.wind.deg > 257.5 && json.wind.deg <= 292.5) {
                    // W
                    $("#windDirection").text("W");
                } else if (json.wind.deg > 292.5 && json.wind.deg <= 337.5) {
                    // NW
                    $("#windDirection").text("NW");
                } else if (json.wind.deg > 337.5 && json.wind.deg <= 360) {
                    // N pt2
                    $("#windDirection").text("N");
                } else {
                    // Wind direction unavailable
                    $("#windDirection").html("<em>unavailable</em>");
                }
                $("#windSpeed").text(json.wind.speed + " km/h");
            });
        });
        
        $("#fahrenheit").click(function() {
            if ($("#celsius").parent().hasClass("active")) {
                // Switching radio button state
                $("#celsius").removeAttr("checked");
                $("#celsius").parent().removeClass("active");
                $("#fahrenheit").attr("checked", true);
                $("#fahrenheit").parent().addClass("active");
                
                // Changing Units
                $(".tempUnit").text("F");
                temperatureInFahrenheit = Math.round((currentTempInCelsius * 9 / 5 + 32) * 10) / 10;
                maxTempInFahrenheit = Math.round((maxTempInCelsius * 9 / 5 + 32) * 10) / 10;
                minTempInFahrenheit = Math.round((minTempInCelsius * 9 / 5 + 32) * 10) / 10;
                $("#temperature").html(temperatureInFahrenheit + " " + String.fromCharCode(176));
                $("#maxTemp").html(maxTempInFahrenheit + " " + String.fromCharCode(176));
                $("#minTemp").html(minTempInFahrenheit + " " + String.fromCharCode(176));
            }
        });
        
        $("#celsius").click(function() {
            if ($("#fahrenheit").parent().hasClass("active")) {
                $("#fahrenheit").removeAttr("checked");
                $("#fahrenheit").parent().removeClass("active");
                $("#celsius").attr("checked", true);
                $("#celsius").parent().addClass("active");
                
                // Changing Units
                $(".tempUnit").text("C");
                
                $("#temperature").html(currentTempInCelsius + " " + String.fromCharCode(176));
                $("#maxTemp").html(maxTempInCelsius + " " + String.fromCharCode(176));
                $("#minTemp").html(minTempInCelsius + " " + String.fromCharCode(176));
            }
        });
        
        $(".tabBtn").click(function() {
            // Switch active classes
            $(".tabBtn").removeClass("active").addClass("text-info");
            $(this).removeClass("text-info").addClass("active");
            
            if ($(".tabBtn").first().hasClass("active")) {
                // Main is selected
                $("#additionalInfo").addClass("hide");
                $("#mainInfo").removeClass("hide");
                $("#moreInfo").removeClass("hide");
                $("#card-title").text("Current Weather");
            } else {
                // Additional is selected
                $("#mainInfo").addClass("hide");
                $("#moreInfo").addClass("hide");
                $("#additionalInfo").removeClass("hide");
                $("#card-title").text("More Information");
            }
        });
        
        $("#moreInfo").click(function() {
            $(".tabBtn").first().removeClass("active").addClass("text-info");
            $(".tabBtn").eq(1).removeClass("text-info").addClass("active");
            $("#mainInfo").addClass("hide");
            $(this).addClass("hide");
            $("#additionalInfo").removeClass("hide");
            $("#card-title").text("More Information");
        });
        
    } else {
        alert("Geolocation unavailable. Please allow geolocation in settings.");
    }
});

function iconGen(description) {
    description = description.toLowerCase();
    if (isDay == true) {
        switch (description) {
            case 'clear':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-day-sunny");
                break;
            case 'clouds':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-cloudy");
                break;
            case 'rain':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-showers");
                break;
            case 'snow':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-snow");
                break;
            case 'thunderstorm':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-storm-showers");
                break;
            case 'drizzle':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-sleet");
                break;
            default:
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-na");
        }
    } else {
        switch (description) {
            case 'clear':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-night-clear");
                break;
            case 'clouds':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-night-alt-cloudy");
                break;
            case 'rain':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-night-alt-showers");
                break;
            case 'snow':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-night-alt-snow");
                break;
            case 'thunderstorm':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-night-alt-storm-showers");
                break;
            case 'drizzle':
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-night-alt-sleet");
                break;
            default:
                $("#weatherIcon").removeClass();
                $("#weatherIcon").addClass("wi wi-na");
        }
    }
}