const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// ===============================
// HOME / TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "SKYORA backend is running!"
    });
});

// ===============================
// OPENWEATHER WEATHER ROUTE
// ===============================

app.get("/api/weather", async (req, res) => {
    try {
        const city = req.query.city;
const lat = req.query.lat;
const lon = req.query.lon;

if (!city && (!lat || !lon)) {
    return res.status(400).json({
        error: "Please provide a city or location coordinates."
    });
}

        // Get API key from .env
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "OpenWeather API key is missing."
            });
        }

        // OpenWeather API URL
       let url;

if (lat && lon) {
    url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${apiKey}&units=metric`;
} else {
    url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
}

        // Request weather data
        const response = await fetch(url);

        const data = await response.json();

        // Check OpenWeather response
        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || "Unable to get weather data."
            });
        }

        // Get UV Index using the weather location coordinates
        try {
            const uvUrl =
                `https://api.open-meteo.com/v1/forecast?latitude=${data.coord.lat}&longitude=${data.coord.lon}&current=uv_index`;

            const uvResponse = await fetch(uvUrl);
            const uvData = await uvResponse.json();

            if (uvResponse.ok && uvData.current) {
                data.uvi = uvData.current.uv_index;
            } else {
                data.uvi = null;
            }

        } catch (uvError) {
            console.error("UV Index error:", uvError);
            data.uvi = null;
        }

        // Send weather data to frontend
        res.json(data);

    } catch (error) {
        console.error("Weather error:", error);

        res.status(500).json({
            error: "Server error while getting weather data."
        });
    }
});

// ===============================
// START SERVER
// ===============================
// ==========================================
// 5-DAY WEATHER FORECAST
// ==========================================

app.get("/api/forecast", async (req, res) => {
    try {
        const city = req.query.city;

        if (!city) {
            return res.status(400).json({
                error: "Please provide a city name."
            });
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "OpenWeather API key is missing."
            });
        }

        const url =
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || "Unable to get forecast data."
            });
        }

        res.json(data);

    } catch (error) {
        console.error("Forecast error:", error);

        res.status(500).json({
            error: "Server error while getting forecast data."
        });
    }
});
// ==========================================
// SKYORA LOCAL NEWS API
// ==========================================

app.get("/api/news", async (req, res) => {
    try {
        const city = req.query.city;

        if (!city) {
            return res.status(400).json({
                error: "Please provide a city name."
            });
        }

        const apiKey = process.env.GNEWS_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GNews API key is missing."
            });
        }

const topic = req.query.topic || "weather";

const query = encodeURIComponent(
    `${city} ${topic}`
);

const page = req.query.page || 1;

const url =
    `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&page=${page}&apikey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.errors?.join(", ") || "Unable to get news."
            });
        }

        res.json(data);

    } catch (error) {
        console.error("News error:", error);

        res.status(500).json({
            error: "Server error while getting news."
        });
    }
});

// ==========================================
// SKYORA CONTACT FORM
// ==========================================

app.post("/api/contact", (req, res) => {

    const {
        name,
        email,
        category,
        message
    } = req.body;

    if (!name || !email || !category || !message) {
        return res.status(400).json({
            error: "Please fill in all fields."
        });
    }

    console.log("================================");
    console.log("SKYORA CONTACT MESSAGE");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Category:", category);
    console.log("Message:", message);
    console.log("================================");

    res.json({
        success: true,
        message: "Your message has been received."
    });
});

// ==========================================
// SKYORA — AIR QUALITY API
// ==========================================

app.get("/api/air-quality", async (req, res) => {

    try {

        const lat = req.query.lat;
        const lon = req.query.lon;

        if (!lat || !lon) {
            return res.status(400).json({
                error: "Latitude and longitude are required."
            });
        }

        const url =
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Unable to get air quality data."
            });
        }

        res.json(data);

    } catch (error) {

        console.error("Air quality error:", error);

        res.status(500).json({
            error: "Server error while getting air quality data."
        });

    }

});

// ==========================================
// SKYORA — PAST WEATHER API
// ==========================================

app.get("/api/past-weather", async (req, res) => {

    try {

        const lat = req.query.lat;
        const lon = req.query.lon;

        if (!lat || !lon) {
            return res.status(400).json({
                error: "Latitude and longitude are required."
            });
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 4);

        const formatDate = (date) => {
            return date.toISOString().split("T")[0];
        };

        const start = formatDate(startDate);
        const end = formatDate(endDate);

        const url =
            `https://archive-api.open-meteo.com/v1/archive?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&start_date=${start}&end_date=${end}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Unable to get past weather data."
            });
        }

        res.json(data);

    } catch (error) {

        console.error(
            "Past weather error:",
            error
        );

        res.status(500).json({
            error: "Server error while getting past weather data."
        });

    }

});
app.listen(PORT, () => {
    console.log(`SKYORA server running at http://localhost:${PORT}`);
});