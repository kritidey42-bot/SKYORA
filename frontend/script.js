// ==========================================
// SKYORA WEATHER JAVASCRIPT
// ==========================================

// Weather icon based on OpenWeather condition

let currentSkyoraCity =
    localStorage.getItem("skyoraCity") || "Chennai";
let newsPage = 1;

function getWeatherIcon(weatherId, iconCode) {

    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
        return "⛈️";
    }

    // Drizzle
    if (weatherId >= 300 && weatherId < 400) {
        return "🌦️";
    }

    // Rain
    if (weatherId >= 500 && weatherId < 600) {
        return "🌧️";
    }

    // Snow
    if (weatherId >= 600 && weatherId < 700) {
        return "❄️";
    }

    // Atmosphere: fog, mist, haze
    if (weatherId >= 700 && weatherId < 800) {
        return "🌫️";
    }

    // Clear
    if (weatherId === 800) {
        if (iconCode && iconCode.endsWith("n")) {
            return "🌙";
        }

        return "☀️";
    }

    // Clouds
    if (weatherId > 800) {
        return "☁️";
    }

    return "🌤️";
}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(timestamp, timezoneOffset) {

    const localTime = new Date(
        (timestamp + timezoneOffset) * 1000
    );

    let hours = localTime.getUTCHours();
    let minutes = localTime.getUTCMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    minutes = String(minutes).padStart(2, "0");

    return `${hours}:${minutes} ${ampm}`;
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(timestamp, timezoneOffset) {

    const localTime = new Date(
        (timestamp + timezoneOffset) * 1000
    );

    return localTime.toLocaleDateString("en-IN", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// ==========================================
// GREETING
// ==========================================

function getGreeting(timestamp, timezoneOffset) {

    const localTime = new Date(
        (timestamp + timezoneOffset) * 1000
    );

    const hour = localTime.getUTCHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    }

    if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    }

    if (hour >= 17 && hour < 20) {
        return "Good Evening";
    }

    return "Good Night";
}


// ==========================================
// DISPLAY WEATHER
// ==========================================
function setWeatherScene(data) {
    const hero = document.querySelector(".hero");

    if (!hero || !data?.weather?.[0]) return;

    hero.classList.remove(
        "weather-clear",
        "weather-clouds",
        "weather-rain",
        "weather-storm",
        "weather-fog",
        "weather-snow",
        "weather-night"
    );

    const weatherId = data.weather[0].id;
    const icon = data.weather[0].icon || "";

    let scene = "weather-clear";

    if (weatherId >= 200 && weatherId < 300) {
        scene = "weather-storm";
    }
    else if (weatherId >= 300 && weatherId < 600) {
        scene = "weather-rain";
    }
    else if (weatherId >= 600 && weatherId < 700) {
        scene = "weather-snow";
    }
    else if (weatherId >= 700 && weatherId < 800) {
        scene = "weather-fog";
    }
    else if (weatherId > 800 && weatherId < 900) {
        scene = "weather-clouds";
    }
    else if (weatherId === 800 && icon.endsWith("n")) {
        scene = "weather-night";
    }

    hero.classList.add(scene);

    console.log("SKYORA weather scene:", scene);
}
function displayWeather(data) {
    console.log("Weather data received:");
console.log(data);

setWeatherScene(data);
    console.log("Weather data received:");
    console.log(data);

    setWeatherScene(data);
    if (data.coord) {

    loadAirQuality(
        data.coord.lat,
        data.coord.lon
    );

}

// Load Weather History
if (data.coord) {

    loadPastWeather(
        data.coord.lat,
        data.coord.lon,
        data.name
    );

}
    // Load Air Quality
if (data.coord) {

    loadAirQuality(
        data.coord.lat,
        data.coord.lon
    );

}

    // ==========================================
// SKYORA — LOAD AIR QUALITY
// ==========================================


    // Update favorite button state
const favoriteButton =
    document.getElementById("favoriteCityBtn");

if (favoriteButton) {

    const favorites =
        JSON.parse(
            localStorage.getItem("skyoraFavorites") || "[]"
        );

    if (favorites.includes(data.name)) {

        favoriteButton.textContent = "⭐";
        favoriteButton.classList.add("active");

    } else {

        favoriteButton.textContent = "☆";
        favoriteButton.classList.remove("active");

    }
}

    const alert = generateWeatherAlert(data);

const alertIcon = document.querySelector(".alert-icon");

if (alertIcon) {
    alertIcon.textContent = alert.icon;
}

const alertTitle = document.getElementById("alertTitle");
const alertText = document.getElementById("alertText");
const alertLevel = document.getElementById("alertLevel");

if (alertTitle) {
    alertTitle.textContent = alert.title;
}

if (alertText) {
    alertText.textContent = alert.message;
}

if (alertLevel) {
    alertLevel.textContent = alert.level.toUpperCase();

    alertLevel.className = "";
    alertLevel.classList.add(alert.level);
}

// Last updated time
const lastUpdated =
    document.getElementById("lastUpdated");

if (lastUpdated) {

    const now = new Date();

    lastUpdated.textContent =
        "Last updated: " +
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
}
// -----------------------------
// Weather Intelligence
// -----------------------------

const insightsContainer =
    document.getElementById("insights");

if (insightsContainer) {

    const temperature =
        Math.round(data.main.temp);

    const humidity =
        data.main.humidity;

    const windSpeed =
        data.wind.speed;

    const weatherDescription =
        data.weather[0].description;

    insightsContainer.innerHTML = `

        <div class="insight-card">

            <span>🌡️</span>

            <h3>Temperature</h3>

            <p>
                The current temperature is
                <strong>${temperature}°C</strong>.
                ${temperature >= 35
                    ? "It is quite hot, so stay hydrated and avoid prolonged exposure to the sun."
                    : temperature <= 20
                    ? "The weather is relatively cool and comfortable."
                    : "The temperature is generally comfortable for outdoor activities."
                }
            </p>

        </div>


        <div class="insight-card">

            <span>🌧️</span>

            <h3>Rain & Conditions</h3>

            <p>
                Current conditions are
                <strong>${weatherDescription}</strong>
                with humidity around
                <strong>${humidity}%</strong>.
            </p>

        </div>


        <div class="insight-card">

            <span>🌬️</span>

            <h3>Wind</h3>

            <p>
                Wind speed is currently around
                <strong>${windSpeed} m/s</strong>.
                ${windSpeed >= 10
                    ? "Winds are relatively strong, so take care around exposed areas."
                    : "Wind conditions are relatively calm."
                }
            </p>

        </div>

    `;
}
    // -----------------------------
    // Location
    // -----------------------------

    const currentLocation =
        document.getElementById("currentLocation");

    if (currentLocation) {
        currentLocation.textContent = data.name;
    }


    const heroLocation =
        document.getElementById("heroLocation");

    if (heroLocation) {
        heroLocation.textContent = data.name;
    }


    // -----------------------------
    // Temperature
    // -----------------------------

    const temperature =
        document.getElementById("temperature");

    if (temperature) {
        temperature.textContent =
            Math.round(data.main.temp);
    }


    // -----------------------------
    // Condition
    // -----------------------------

    const condition =
        document.getElementById("condition");

    if (condition) {
        condition.textContent =
            data.weather[0].description;
    }


    // -----------------------------
    // Feels Like
    // -----------------------------

    const feelsLike =
        document.getElementById("feelsLike");

    if (feelsLike) {
        feelsLike.textContent =
            `Feels like ${Math.round(data.main.feels_like)}°C`;
    }


    // -----------------------------
    // Humidity
    // -----------------------------

    const humidity =
        document.getElementById("humidity");

    if (humidity) {
        humidity.textContent =
            `${data.main.humidity}%`;
    }


    // -----------------------------
    // Wind
    // -----------------------------

    const wind =
        document.getElementById("wind");

    if (wind) {
        wind.textContent =
            `${data.wind.speed} m/s`;
    }


    // -----------------------------
    // Pressure
    // -----------------------------

    const pressure =
        document.getElementById("pressure");

    if (pressure) {
        pressure.textContent =
            `${data.main.pressure} hPa`;
    }


    // -----------------------------
    // Visibility
    // -----------------------------

    const visibility =
        document.getElementById("visibility");

    if (visibility) {

        const visibilityKm =
            (data.visibility / 1000).toFixed(1);

        visibility.textContent =
            `${visibilityKm} km`;
    }



    // -----------------------------
// -----------------------------
// UV Index
// -----------------------------

const uvIndex =
    document.getElementById("uv");

const uvLevel =
    document.getElementById("uvLevel");

if (uvIndex) {

    const uvValue =
        data.uvi ?? null;

    uvIndex.textContent =
        uvValue ?? "--";

    if (uvLevel && uvValue !== null) {

        let level = "";

        if (uvValue <= 2) {
            level = "Low";
        }
        else if (uvValue <= 5) {
            level = "Moderate";
        }
        else if (uvValue <= 7) {
            level = "High";
        }
        else if (uvValue <= 10) {
            level = "Very High";
        }
        else {
            level = "Extreme";
        }

        uvLevel.textContent =
            level;
    }
}

    // -----------------------------
    // Rain
    // -----------------------------

    const rain =
        document.getElementById("rain");

    if (rain) {

        const rainAmount =
            data.rain?.["1h"] || 0;

        rain.textContent =
            `${rainAmount} mm`;
    }


    // -----------------------------
    // Weather Icon
    // -----------------------------

    const weatherIcon =
        document.getElementById("weatherIcon");

    if (weatherIcon) {

        weatherIcon.textContent =
            getWeatherIcon(
                data.weather[0].id,
                data.weather[0].icon
            );
    }


    // -----------------------------
    // Date
    // -----------------------------

    const heroDate =
        document.getElementById("heroDate");

    if (heroDate) {

        heroDate.textContent =
            formatDate(
                data.dt,
                data.timezone
            );
    }


    const dateElements =
        document.querySelectorAll(".date");

    dateElements.forEach(element => {

        element.textContent =
            formatDate(
                data.dt,
                data.timezone
            );

    });


    // -----------------------------
    // Greeting
    // -----------------------------

    const greeting =
        document.querySelector(".greeting");

    if (greeting) {

        greeting.textContent =
            getGreeting(
                data.dt,
                data.timezone
            );
    }


    // -----------------------------
    // Sunrise
    // -----------------------------

    const sunrise =
        document.getElementById("sunrise");

    if (sunrise) {

        sunrise.textContent =
            formatTime(
                data.sys.sunrise,
                data.timezone
            );
    }


    // -----------------------------
    // Sunset
    // -----------------------------

    const sunset =
        document.getElementById("sunset");

    if (sunset) {

        sunset.textContent =
            formatTime(
                data.sys.sunset,
                data.timezone
            );
    }


    // -----------------------------
    // Hide loading
    // -----------------------------

    const loading =
        document.getElementById("loading");

    if (loading) {
        loading.style.display = "none";
    }


    const weatherContent =
        document.getElementById("weatherContent");

    if (weatherContent) {
        weatherContent.style.display = "";
    }
}


// ==========================================
// LOAD WEATHER FROM BACKEND
// ==========================================

async function loadWeather(city) {

    try {

        const loading =
            document.getElementById("loading");

        if (loading) {
            loading.style.display = "block";
            loading.textContent = "Loading weather...";
        }


const response = await fetch(
    `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
);


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Unable to get weather"
            );
        }


displayWeather(data);
loadNews(data.name);
loadForecast(data.name);

// Save city to recent searches
saveRecentSearch(data.name);


        // Save current city
        localStorage.setItem(
            "skyoraCity",
            data.name
        );
        // Save city for automatic refresh
currentSkyoraCity = data.name;


} catch (error) {

    console.error("Weather error:", error);

    const loading =
        document.getElementById("loading");

    if (loading) {

        loading.style.display = "block";

        loading.textContent =
            "Weather error: " + error.message;
    }
}
}


// ==========================================
// SEARCH BUTTON
// ==========================================

const searchBtn =
    document.getElementById("searchBtn");

const locationInput =
    document.getElementById("locationInput");


if (searchBtn) {

    searchBtn.addEventListener("click", function () {

        const city =
            locationInput.value.trim();


        if (!city) {

            alert("Please enter a city name.");

            return;
        }


        loadWeather(city);

    });
}

// Search weather when Enter is pressed
if (locationInput) {

    locationInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            const city =
                locationInput.value.trim();

            if (!city) {
                alert("Please enter a city name.");
                return;
            }

            loadWeather(city);
        }

    });

}


// ==========================================
// PRESS ENTER TO SEARCH
// ==========================================

if (locationInput) {

    locationInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            const city =
                locationInput.value.trim();


            if (!city) {

                alert("Please enter a city name.");

                return;
            }


            loadWeather(city);
            locationInput.value = "";
        }

    });
}


// ==========================================
// USE MY LOCATION
// ==========================================

const locationBtn =
    document.getElementById("locationBtn");


if (locationBtn) {

    locationBtn.addEventListener("click", function () {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        locationBtn.textContent =
            "📍 Getting location...";


        navigator.geolocation.getCurrentPosition(

            async function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                try {

                    const response =
                        await fetch(
                            `http://localhost:5000/api/weather?lat=${latitude}&lon=${longitude}`
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.error ||
                            "Unable to get weather"
                        );
                    }


                    displayWeather(data);

                } catch (error) {

                    console.error(error);

                    alert(
                        "Unable to get weather for your location."
                    );

                }


                locationBtn.textContent =
                    "📍 Use my location";

            },


            function () {

                alert(
                    "Location permission was not given."
                );


                locationBtn.textContent =
                    "📍 Use my location";
            }

        );

    });
}


// ==========================================
// INITIAL WEATHER
// ==========================================

const savedCity =
    localStorage.getItem("skyoraCity");


if (savedCity) {

    if (locationInput) {
        locationInput.value = savedCity;
    }

    loadWeather(savedCity);

} else {

    loadWeather("Chennai");

}
// ==========================================
// LOAD 5-DAY FORECAST
// ==========================================

// ==========================================
// LOAD 5-DAY FORECAST
// ==========================================

async function loadForecast(city) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/forecast?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to load forecast"
            );
        }

        displayForecast(data);
        // Show weather trends
displayWeatherTrendChart(data);

    } catch (error) {
        console.error("Forecast error:", error);
    }
}


// ==========================================
// DISPLAY FORECAST
// ==========================================

function displayForecast(data) {

    const hourlyContainer = document.getElementById("hourly");
    const dailyContainer = document.getElementById("daily");

    if (!hourlyContainer && !dailyContainer) return;


    // -----------------------------
    // HOURLY FORECAST
    // -----------------------------

    if (hourlyContainer) {

        hourlyContainer.innerHTML = "";

        const hourlyData = data.list.slice(0, 8);

        hourlyData.forEach(item => {

            const time = new Date(item.dt * 1000);

            const hour = time.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit"
            });

            // ==========================================
// SKYORA — RAIN TIMELINE
// ==========================================

const rainTimelineItems =
    document.getElementById("rainTimelineItems");

const rainTimelineTitle =
    document.getElementById("rainTimelineTitle");

const rainTimelineSummary =
    document.getElementById("rainTimelineSummary");

if (rainTimelineItems) {

    rainTimelineItems.innerHTML = "";

    const rainData = data.list.slice(0, 5);

    let highestRainChance = 0;

    rainData.forEach(item => {

        const time =
            new Date(item.dt * 1000);

        const hour =
            time.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit"
            });

        const rainChance =
            Math.round((item.pop || 0) * 100);

        highestRainChance =
            Math.max(
                highestRainChance,
                rainChance
            );

        let icon = "☁️";

        if (rainChance >= 70) {
            icon = "🌧️";
        }
        else if (rainChance >= 40) {
            icon = "🌦️";
        }
        else if (rainChance > 0) {
            icon = "🌤️";
        }

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "rain-timeline-item";

        itemElement.innerHTML = `
            <div class="rain-time">
                ${hour}
            </div>

            <span class="rain-icon">
                ${icon}
            </span>

            <div class="rain-probability">
                ${rainChance}%
            </div>

            <div class="rain-label">
                Rain chance
            </div>
        `;

        rainTimelineItems.appendChild(itemElement);

    });

    if (rainTimelineTitle) {

        if (highestRainChance >= 70) {
            rainTimelineTitle.textContent =
                "Rain is likely in the next few hours";
        }
        else if (highestRainChance >= 40) {
            rainTimelineTitle.textContent =
                "Some rain may occur in the next few hours";
        }
        else {
            rainTimelineTitle.textContent =
                "Low rain chance in the next few hours";
        }
    }

    if (rainTimelineSummary) {

        rainTimelineSummary.textContent =
            `Highest chance: ${highestRainChance}%`;
    }

}

            const temperature = Math.round(item.main.temp);

            const condition = item.weather[0].main;

            const rainChance =
                Math.round((item.pop || 0) * 100);

            const card = document.createElement("div");

            card.className = "forecast-card";

            card.innerHTML = `
                <div class="forecast-time">${hour}</div>

                <div class="forecast-icon">
                    ${getWeatherIcon(
                        item.weather[0].id,
                        item.weather[0].icon
                    )}
                </div>

                <div class="forecast-temp">
                    ${temperature}°C
                </div>

                <div class="forecast-condition">
                    ${condition}
                </div>

                <div class="forecast-rain">
                    💧 ${rainChance}%
                </div>
            `;

            hourlyContainer.appendChild(card);
        });
    }


    // -----------------------------
    // DAILY FORECAST
    // -----------------------------

    if (dailyContainer) {

        dailyContainer.innerHTML = "";

        const days = {};

        data.list.forEach(item => {

            const date = new Date(item.dt * 1000);

            const key = date.toLocaleDateString("en-IN");

            if (!days[key]) {
                days[key] = [];
            }

            days[key].push(item);
        });


        Object.values(days)
            .slice(0, 5)
            .forEach(day => {

                const first = day[0];
                const date = new Date(first.dt * 1000);

                const dayName =
                    date.toLocaleDateString("en-IN", {
                        weekday: "short"
                    });

                const maxTemp = Math.round(
                    Math.max(...day.map(item => item.main.temp_max))
                );

                const minTemp = Math.round(
                    Math.min(...day.map(item => item.main.temp_min))
                );

                const condition =
                    first.weather[0].main;

                const card =
                    document.createElement("div");

                card.className = "daily-card";

                card.innerHTML = `
                    <div class="daily-day">
                        ${dayName}
                    </div>

                    <div class="daily-icon">
                        ${getWeatherIcon(
                            first.weather[0].id,
                            first.weather[0].icon
                        )}
                    </div>

                    <div class="daily-condition">
                        ${condition}
                    </div>

                    <div class="daily-temperature">
                        ${maxTemp}° / ${minTemp}°C
                    </div>
                `;

                dailyContainer.appendChild(card);
            });
    }
}
// ==========================================
// SKYORA INTERACTIVE WORLD MAP
// ==========================================

let weatherMap;
let mapMarker;


// Initialize map
function initializeWeatherMap() {

    const mapElement = document.getElementById("weatherMap");

    if (!mapElement) return;

    // Prevent creating the map more than once
    if (weatherMap) return;

    weatherMap = L.map("weatherMap").setView([20, 0], 2);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(weatherMap);

    console.log("SKYORA world map loaded.");

    // Click anywhere on map
    weatherMap.on("click", function (event) {

        const latitude = event.latlng.lat;
        const longitude = event.latlng.lng;

        showMapLocation(latitude, longitude);
    });
}


// Show selected location
async function showMapLocation(latitude, longitude) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/weather?lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to get weather"
            );
        }

        // Remove old marker
        if (mapMarker) {
            weatherMap.removeLayer(mapMarker);
        }

        // Create new marker
        mapMarker = L.marker([
            latitude,
            longitude
        ]).addTo(weatherMap);

        mapMarker.bindPopup(`
            <strong>${data.name}</strong><br>
            ${Math.round(data.main.temp)}°C<br>
            ${data.weather[0].description}
        `).openPopup();


        // Update information card
        const infoCard =
            document.getElementById("mapInfoCard");

        if (infoCard) {

            infoCard.innerHTML = `
                <div class="map-info-title">
                    ${data.name}
                </div>

                <div class="map-info-text">
                    ${Math.round(data.main.temp)}°C ·
                    ${data.weather[0].description}
                    <br>
                    Humidity: ${data.main.humidity}%
                    <br>
                    Wind: ${data.wind.speed} m/s
                </div>
            `;
        }

    } catch (error) {

        console.error(
            "Map weather error:",
            error
        );
    }
}


// Map city search
async function searchMapLocation() {

    const input =
        document.getElementById("mapSearchInput");

    if (!input) return;

    const city = input.value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Location not found"
            );
        }

        const latitude = data.coord.lat;
        const longitude = data.coord.lon;

        weatherMap.setView(
            [latitude, longitude],
            10
        );

        showMapLocation(
            latitude,
            longitude
        );

    } catch (error) {

        console.error(
            "Map search error:",
            error
        );

        alert("Location not found. Please try another city.");
    }
}


// Map current location
function mapMyLocation() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            weatherMap.setView(
                [latitude, longitude],
                10
            );

            showMapLocation(
                latitude,
                longitude
            );
        },

        function () {

            alert(
                "Please allow location access to use this feature."
            );
        }
    );
}


// ==========================================
// MAP BUTTONS
// ==========================================

const mapSearchBtn =
    document.getElementById("mapSearchBtn");

if (mapSearchBtn) {

    mapSearchBtn.addEventListener(
        "click",
        searchMapLocation
    );
}


const mapSearchInput =
    document.getElementById("mapSearchInput");

if (mapSearchInput) {

    mapSearchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                searchMapLocation();
            }

        }
    );
}


const mapMyLocationBtn =
    document.getElementById("mapMyLocationBtn");

if (mapMyLocationBtn) {

    mapMyLocationBtn.addEventListener(
        "click",
        mapMyLocation
    );
}


// Start map
initializeWeatherMap();
// ==========================================
// SKYORA WEATHER INTELLIGENCE
// ==========================================


// ==========================================
// SKYORA WEATHER INTELLIGENCE
// ==========================================

function generateWeatherInsight(data) {

    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherId = data.weather[0].id;
    const condition = data.weather[0].description;

    let title = "Weather looks comfortable";

    let message =
        `Current conditions are ${condition} with a temperature of ${Math.round(temperature)}°C.`;

    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {

        title = "Thunderstorm conditions";

        message =
            `Thunderstorms are currently reported with ${Math.round(temperature)}°C conditions. Outdoor plans should be approached with caution.`;
    }

    // Rain
    else if (weatherId >= 500 && weatherId < 600) {

        title = "Rainy conditions";

        message =
            `Rain is currently affecting this location. It is ${Math.round(temperature)}°C and feels like ${Math.round(feelsLike)}°C. Carrying an umbrella may be useful.`;
    }

    // Drizzle
    else if (weatherId >= 300 && weatherId < 400) {

        title = "Light rain conditions";

        message =
            `Light rain or drizzle is being reported. The temperature is ${Math.round(temperature)}°C. Consider carrying an umbrella if you are heading outside.`;
    }

    // Snow
    else if (weatherId >= 600 && weatherId < 700) {

        title = "Cold and snowy conditions";

        message =
            `Snow is currently being reported. The temperature is ${Math.round(temperature)}°C. Warmer clothing may be useful outdoors.`;
    }

    // Fog / Haze / Mist
    else if (weatherId >= 700 && weatherId < 800) {

        title = "Reduced visibility";

        message =
            `Atmospheric conditions such as fog, haze or mist are being reported. Visibility may be reduced, so extra care may be useful when travelling.`;
    }

    // Extreme Heat
    else if (temperature >= 40) {

        title = "Extreme heat conditions";

        message =
            `It is currently ${Math.round(temperature)}°C and feels like ${Math.round(feelsLike)}°C. Limit prolonged heat exposure and stay hydrated.`;
    }

    // Hot
    else if (temperature >= 35) {

        title = "Hot conditions";

        message =
            `It is currently ${Math.round(temperature)}°C and feels like ${Math.round(feelsLike)}°C. Stay hydrated and take breaks from prolonged heat exposure.`;
    }

    // Cold
    else if (temperature <= 10) {

        title = "Cold conditions";

        message =
            `The temperature is currently ${Math.round(temperature)}°C. Warmer clothing may be useful for outdoor activities.`;
    }

    // Strong Wind
    else if (windSpeed >= 10) {

        title = "Strong winds";

        message =
            `Wind speeds are currently around ${windSpeed} m/s. Outdoor conditions may feel significantly windier than normal.`;
    }

    // High Humidity
    else if (humidity >= 80) {

        title = "High humidity";

        message =
            `Humidity is currently ${humidity}%. The air may feel warmer and more uncomfortable than the temperature suggests.`;
    }

    // Comfortable Weather
    else {

        title = "Weather looks comfortable";

        message =
            `Current conditions are ${condition} with a temperature of ${Math.round(temperature)}°C and humidity around ${humidity}%.`;
    }

    return {
        title,
        message
    };
}
// ==========================================
// SKYORA WEATHER ALERT SYSTEM
// ==========================================

// ==========================================
// SKYORA LOCAL WEATHER STORIES
// ==========================================

// ==========================================
// SKYORA LOCAL WEATHER STORIES
// ==========================================

// ==========================================
// SKYORA LOCAL WEATHER STORIES
// ==========================================

function generateWeatherAlert(data) {

    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    const weatherId = data.weather[0].id;

    let level = "green";
    let title = "Weather conditions are normal";
    let message = "No significant weather concerns detected.";
    let icon = "✓";

    if (weatherId >= 200 && weatherId < 300) {

        level = "red";
        icon = "⚡";
        title = "Thunderstorm Alert";

        message =
            "Thunderstorm conditions are currently reported. Avoid exposed outdoor areas and take shelter if necessary.";

    } else if (temperature >= 40) {

        level = "red";
        icon = "🌡️";
        title = "Extreme Heat Alert";

        message =
            `The temperature is ${Math.round(temperature)}°C and feels like ${Math.round(feelsLike)}°C. Avoid prolonged heat exposure and stay hydrated.`;

    } else if (
        weatherId >= 500 &&
        weatherId < 600 &&
        humidity >= 85
    ) {

        level = "orange";
        icon = "🌧️";
        title = "Heavy Rain Warning";

        message =
            "Rainy conditions and high humidity are currently being reported. Travel carefully and carry an umbrella.";

    } else if (windSpeed >= 15) {

        level = "orange";
        icon = "💨";
        title = "Strong Wind Warning";

        message =
            `Wind speeds are currently around ${windSpeed} m/s. Avoid exposed areas and take care around trees and loose objects.`;

    } else if (temperature >= 35) {

        level = "yellow";
        icon = "🌡️";
        title = "High Temperature";

        message =
            `The current temperature is ${Math.round(temperature)}°C and feels like ${Math.round(feelsLike)}°C. Stay hydrated and take breaks from the heat.`;

    } else if (windSpeed >= 10) {

        level = "yellow";
        icon = "💨";
        title = "Strong Wind Caution";

        message =
            `Wind speeds are currently around ${windSpeed} m/s. Outdoor conditions may feel significantly windier than normal.`;

    } else if (weatherId >= 500 && weatherId < 600) {

        level = "blue";
        icon = "🌧️";
        title = "Rain Information";

        message =
            "Rain is currently being reported in this location. Carrying an umbrella may be useful.";

    } else if (weatherId >= 700 && weatherId < 800) {

        level = "blue";
        icon = "🌫️";
        title = "Reduced Visibility";

        message =
            "Fog, haze or mist may be affecting visibility. Take extra care while travelling.";
    }

    return {
        level,
        title,
        message,
        icon
    };
}

async function loadNews(city) {
    newsPage = 1;

    const newsGrid = document.getElementById("newsGrid");
    const loadMoreButton = document.getElementById("loadMoreNews");

    if (!newsGrid) return;

    newsGrid.innerHTML = `
        <p>Loading local weather stories...</p>
    `;

    try {

        const response = await fetch(
            `http://localhost:5000/api/news?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load news.");
        }

        if (!data.articles || data.articles.length === 0) {

            newsGrid.innerHTML = `
                <p>No local weather stories found.</p>
            `;

            if (loadMoreButton) {
                loadMoreButton.style.display = "none";
            }

            return;
        }

        newsGrid.innerHTML = data.articles
            .map((article) => {

                const date = article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString()
                    : "";

                return `
                    <article class="news-card">

                        <img
                            src="${article.image || ""}"
                            alt="${article.title || "Weather news"}"
                            class="news-image"
                        >

                        <span class="news-tag">
                            ${article.source?.name || "NEWS"}
                        </span>

                        <h3>
                            ${article.title || "Local weather story"}
                        </h3>

                        <p>
                            ${article.description || "Read the latest local weather story."}
                        </p>

                        <small>
                            ${date}
                        </small>

                        <a
                            href="${article.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="news-link"
                        >
                            Read more if you're interested →
                        </a>

                    </article>
                `;

            })
            .join("");

        if (loadMoreButton) {
            loadMoreButton.style.display = "block";
        }

    } catch (error) {

        console.error("News loading error:", error);

        newsGrid.innerHTML = `
            <p>
                Unable to load local weather stories.
            </p>
        `;

        if (loadMoreButton) {
            loadMoreButton.style.display = "none";
        }
    }
}

// ==========================================
// VIEW MORE NEWS STORIES
// ==========================================

document.addEventListener("click", async (event) => {

    if (event.target.id !== "loadMoreNews") {
        return;
    }

    const button = event.target;
    const newsGrid = document.getElementById("newsGrid");

    button.textContent = "Loading...";
    button.disabled = true;

    try {

        const cityInput = document.getElementById("cityInput");
        const city = cityInput?.value?.trim() || "Chennai";

        newsPage++;

        const topics = [
            "rainfall",
            "temperature",
            "monsoon",
            "weather forecast",
            "weather warning"
        ];

        const topicIndex = (newsPage - 2) % topics.length;
        const topic = topics[topicIndex];

        const response = await fetch(
            `http://localhost:5000/api/news?city=${encodeURIComponent(city)}&topic=${encodeURIComponent(topic)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load more stories.");
        }

        // IMPORTANT:
        // If there are no new articles, keep the existing stories.
        if (!data.articles || data.articles.length === 0) {

            button.textContent = "No More Stories";
            button.disabled = true;

            return;
        }

        data.articles.forEach((article) => {

            const card = document.createElement("article");

            card.className = "news-card";

            const date = article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : "";

            card.innerHTML = `
                <img
                    src="${article.image || ""}"
                    alt="${article.title || "Weather news"}"
                    class="news-image"
                >

                <span class="news-tag">
                    ${article.source?.name || "NEWS"}
                </span>

                <h3>
                    ${article.title || "Local weather story"}
                </h3>

                <p>
                    ${article.description || "Read the latest local weather story."}
                </p>

                <small>
                    ${date}
                </small>

                <a
                    href="${article.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="news-link"
                >
                    Read more if you're interested →
                </a>
            `;

            newsGrid.appendChild(card);
        });

        button.textContent = "View More Stories →";
        button.disabled = false;

    } catch (error) {

        console.error("More news loading error:", error);

        newsPage--;

        button.textContent = "Try Again";
        button.disabled = false;
    }

});


const themeToggle =
    document.getElementById("themeToggle");

if (themeToggle) {

    // Load saved theme
    const savedTheme =
        localStorage.getItem("skyoraTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️";
    }

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            themeToggle.textContent = "☀️";

            localStorage.setItem(
                "skyoraTheme",
                "dark"
            );

        } else {

            themeToggle.textContent = "🌙";

            localStorage.setItem(
                "skyoraTheme",
                "light"
            );

        }

    });

}


// ==========================================
// SKYORA — BACK TO TOP
// ==========================================

const backToTop =
    document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 500) {
            backToTop.style.display = "flex";
        } else {
            backToTop.style.display = "none";
        }

    });

    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

// ==========================================
// SKYORA — FAVORITE CITY
// ==========================================

const favoriteCityBtn =
    document.getElementById("favoriteCityBtn");

if (favoriteCityBtn) {

    favoriteCityBtn.addEventListener("click", function () {

        if (!currentSkyoraCity) {
            return;
        }

        let favorites =
            JSON.parse(
                localStorage.getItem("skyoraFavorites") || "[]"
            );

        if (favorites.includes(currentSkyoraCity)) {

            favorites =
                favorites.filter(
                    city => city !== currentSkyoraCity
                );

            favoriteCityBtn.textContent = "☆";
            favoriteCityBtn.classList.remove("active");

        } else {

            favorites.push(currentSkyoraCity);

            favoriteCityBtn.textContent = "⭐";
            favoriteCityBtn.classList.add("active");
        }

        localStorage.setItem(
            "skyoraFavorites",
            JSON.stringify(favorites)
        );

    });

}


// ==========================================
// SKYORA — AIR QUALITY DATA
// ==========================================

async function loadAirQuality(latitude, longitude) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/air-quality?lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to load air quality"
            );
        }

        const aqiValue =
            document.getElementById("aqiValue");

        const aqiStatus =
            document.getElementById("aqiStatus");

        const pm25 =
            document.getElementById("pm25");

        const pm10 =
            document.getElementById("pm10");

        const no2 =
            document.getElementById("no2");

        if (aqiValue) {
            aqiValue.textContent =
                data.current?.us_aqi ?? "--";
        }

        if (pm25) {
            pm25.textContent =
                data.current?.pm2_5 ?? "--";
        }

        if (pm10) {
            pm10.textContent =
                data.current?.pm10 ?? "--";
        }

        if (no2) {
            no2.textContent =
                data.current?.nitrogen_dioxide ?? "--";
        }

        if (aqiStatus) {

            const aqi =
                data.current?.us_aqi;

            if (aqi === undefined) {
                aqiStatus.textContent = "Unavailable";
            }
            else if (aqi <= 50) {
                aqiStatus.textContent =
                    "Good";
            }
            else if (aqi <= 100) {
                aqiStatus.textContent =
                    "Moderate";
            }
            else if (aqi <= 150) {
                aqiStatus.textContent =
                    "Unhealthy for sensitive groups";
            }
            else if (aqi <= 200) {
                aqiStatus.textContent =
                    "Unhealthy";
            }
            else if (aqi <= 300) {
                aqiStatus.textContent =
                    "Very Unhealthy";
            }
            else {
                aqiStatus.textContent =
                    "Hazardous";
            }

        }

    } catch (error) {

        console.error(
            "Air quality error:",
            error
        );

    }

}


// ==========================================
// SKYORA — WEATHER TREND CHART
// ==========================================

let weatherTrendChart = null;

function displayWeatherTrendChart(data) {

    const chartCanvas =
        document.getElementById("weatherTrendChart");

    if (!chartCanvas || !data || !data.list) {
        return;
    }

    const forecastData =
        data.list.slice(0, 8);

    const labels = forecastData.map(item => {

        const time =
            new Date(item.dt * 1000);

        return time.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit"
        });

    });

    const temperatures =
        forecastData.map(item =>
            Math.round(item.main.temp)
        );

    const rainProbability =
        forecastData.map(item =>
            Math.round((item.pop || 0) * 100)
        );

    const chartLocation =
        document.getElementById("chartLocation");

    if (chartLocation) {
        chartLocation.textContent =
            data.city?.name || "Current location";
    }

    if (weatherTrendChart) {
        weatherTrendChart.destroy();
    }

    weatherTrendChart =
        new Chart(chartCanvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {
                        label: "Temperature (°C)",

                        data: temperatures,

                        borderWidth: 3,

                        tension: 0.4,

                        pointRadius: 4,

                        yAxisID: "temperature"
                    },

                    {
                        label: "Rain Probability (%)",

                        data: rainProbability,

                        borderWidth: 3,

                        tension: 0.4,

                        pointRadius: 4,

                        yAxisID: "rain"
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                plugins: {

                    legend: {
                        position: "top"
                    }

                },

                scales: {

                    temperature: {

                        type: "linear",

                        position: "left",

                        title: {
                            display: true,
                            text: "Temperature °C"
                        }

                    },

                    rain: {

                        type: "linear",

                        position: "right",

                        min: 0,

                        max: 100,

                        title: {
                            display: true,
                            text: "Rain Probability %"
                        },

                        grid: {
                            drawOnChartArea: false
                        }

                    }

                }

            }

        });

}

// ==========================================
// SKYORA — LOAD PAST WEATHER
// ==========================================

async function loadPastWeather(latitude, longitude, cityName) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/past-weather?lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to load past weather"
            );
        }

        displayPastWeather(
            data,
            cityName
        );

    } catch (error) {

        console.error(
            "Past weather error:",
            error
        );

    }

}


// ==========================================
// SKYORA — DISPLAY PAST WEATHER
// ==========================================

function displayPastWeather(data, cityName) {

    const historyItems =
        document.getElementById("historyItems");

    const historyLocation =
        document.getElementById("historyLocation");

    if (!historyItems || !data.daily) {
        return;
    }

    historyItems.innerHTML = "";

    if (historyLocation) {
        historyLocation.textContent =
            cityName || "Current location";
    }

    const dates =
        data.daily.time || [];

    const maxTemps =
        data.daily.temperature_2m_max || [];

    const minTemps =
        data.daily.temperature_2m_min || [];

    const rainfall =
        data.daily.precipitation_sum || [];

    const wind =
        data.daily.windspeed_10m_max || [];

    const weatherCodes =
        data.daily.weather_code || [];

    dates.forEach((date, index) => {

        const card =
            document.createElement("div");

        card.className =
            "history-item";

        const weatherCode =
            weatherCodes[index];

        let icon = "☁️";
        let condition = "Cloudy";

        if (weatherCode === 0) {
            icon = "☀️";
            condition = "Clear";
        }
        else if (
            weatherCode >= 1 &&
            weatherCode <= 3
        ) {
            icon = "🌤️";
            condition = "Partly cloudy";
        }
        else if (
            weatherCode >= 51 &&
            weatherCode <= 67
        ) {
            icon = "🌧️";
            condition = "Rain";
        }
        else if (
            weatherCode >= 71 &&
            weatherCode <= 77
        ) {
            icon = "🌨️";
            condition = "Snow";
        }
        else if (
            weatherCode >= 80 &&
            weatherCode <= 82
        ) {
            icon = "🌦️";
            condition = "Rain showers";
        }
        else if (
            weatherCode >= 95
        ) {
            icon = "⛈️";
            condition = "Thunderstorm";
        }

        const formattedDate =
            new Date(date + "T00:00:00")
                .toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                });

        card.innerHTML = `
            <div class="history-day">
                ${formattedDate}
            </div>

            <div class="history-icon-weather">
                ${icon}
            </div>

            <div class="history-temperature">
                ${Math.round(maxTemps[index])}° /
                ${Math.round(minTemps[index])}°
            </div>

            <div class="history-condition">
                ${condition}
            </div>

            <div class="history-rain">
                💧 ${Number(rainfall[index] || 0).toFixed(1)} mm
            </div>
        `;

        historyItems.appendChild(card);

    });

}


// ==========================================
// SKYORA — SEARCH HISTORY
// ==========================================

function saveRecentSearch(city) {

    if (!city) {
        return;
    }

    let searches =
        JSON.parse(
            localStorage.getItem("skyoraRecentSearches") || "[]"
        );

    searches =
        searches.filter(
            item => item.toLowerCase() !== city.toLowerCase()
        );

    searches.unshift(city);

    searches =
        searches.slice(0, 6);

    localStorage.setItem(
        "skyoraRecentSearches",
        JSON.stringify(searches)
    );

    displayRecentSearches();
}


function displayRecentSearches() {

    const container =
        document.getElementById("recentSearches");

    if (!container) {
        return;
    }

    const searches =
        JSON.parse(
            localStorage.getItem("skyoraRecentSearches") || "[]"
        );

    if (searches.length === 0) {

        container.innerHTML = `
            <div class="recent-search-empty">
                Your recent searches will appear here.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    searches.forEach(city => {

        const item =
            document.createElement("button");

        item.className =
            "recent-search-item";

        item.textContent =
            city;

        item.addEventListener(
            "click",
            function () {

                loadWeather(city);

            }
        );

        container.appendChild(item);

    });

}


// Show saved searches when page loads
displayRecentSearches();


// ==========================================
// SKYORA — CITY COMPARISON
// ==========================================

async function compareWeatherCity(city) {

    const response = await fetch(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || `Unable to load ${city}`
        );
    }

    return data;
}


async function displayCityComparison() {

    const cityOneInput =
        document.getElementById("compareCityOne");

    const cityTwoInput =
        document.getElementById("compareCityTwo");

    const results =
        document.getElementById("comparisonResults");

    if (!cityOneInput || !cityTwoInput || !results) {
        return;
    }

    const cityOne =
        cityOneInput.value.trim();

    const cityTwo =
        cityTwoInput.value.trim();

    if (!cityOne || !cityTwo) {

        results.innerHTML = `
            <div class="comparison-empty">
                Please enter both cities to compare.
            </div>
        `;

        return;
    }

    results.innerHTML = `
        <div class="comparison-empty">
            Comparing weather conditions...
        </div>
    `;

    try {

        const [weatherOne, weatherTwo] =
            await Promise.all([
                compareWeatherCity(cityOne),
                compareWeatherCity(cityTwo)
            ]);

        results.innerHTML = "";

        const cities = [
            weatherOne,
            weatherTwo
        ];

        cities.forEach(data => {

            const card =
                document.createElement("div");

            card.className =
                "comparison-result-card";

            card.innerHTML = `
                <div class="comparison-city-name">
                    ${data.name}
                </div>

                <div class="comparison-condition">
                    ${data.weather[0].description}
                </div>

                <div class="comparison-temperature">
                    ${Math.round(data.main.temp)}°C
                </div>

                <div class="comparison-metrics">

                    <div class="comparison-metric">
                        <span>💧 Humidity</span>
                        <strong>
                            ${data.main.humidity}%
                        </strong>
                    </div>

                    <div class="comparison-metric">
                        <span>💨 Wind</span>
                        <strong>
                            ${data.wind.speed} m/s
                        </strong>
                    </div>

                    <div class="comparison-metric">
                        <span>🌡️ Feels like</span>
                        <strong>
                            ${Math.round(data.main.feels_like)}°C
                        </strong>
                    </div>

                </div>
            `;

            results.appendChild(card);

        });

    } catch (error) {

        console.error(
            "City comparison error:",
            error
        );

        results.innerHTML = `
            <div class="comparison-empty">
                ${error.message}
            </div>
        `;

    }

}


const compareCitiesBtn =
    document.getElementById("compareCitiesBtn");

if (compareCitiesBtn) {

    compareCitiesBtn.addEventListener(
        "click",
        displayCityComparison
    );

}


// ==========================================
// CITY COMPARISON — ENTER KEY
// ==========================================

const compareCityOne =
    document.getElementById("compareCityOne");

const compareCityTwo =
    document.getElementById("compareCityTwo");

if (compareCityOne) {

    compareCityOne.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                displayCityComparison();
            }

        }
    );

}

if (compareCityTwo) {

    compareCityTwo.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                displayCityComparison();
            }

        }
    );

}