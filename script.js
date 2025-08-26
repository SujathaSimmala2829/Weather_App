// Get elements from the DOM
const getWeatherButton = document.getElementById("getWeather");
const weatherContainer = document.getElementById("weather");
const locationInput = document.getElementById("locationInput");

// Function to fetch weather data by city name
async function fetchWeatherDataByCity(city) {
  const apiKey = ""; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Display weather data on the page
function displayWeather(data) {
  const { name, main, weather, wind, sys } = data;
  const weatherTip = getWeatherTip(weather[0].main);
  const careTip = getCareTip();
  const weatherIcon = getWeatherIcon(weather[0].main);

  setDynamicBackground(weather[0].main);

  weatherContainer.innerHTML = `
    <h2>Weather in ${name}</h2>
    <img src="${weatherIcon}" alt="Weather Icon" class="weather-icon" />
    <p>Temperature: ${main.temp}°C</p>
    <p>Condition: ${weather[0].description}</p>
    <p><strong>Weather Tip:</strong> ${weatherTip}</p>
    <p><strong>Care Tip:</strong> ${careTip}</p>
    <p><strong>Humidity:</strong> ${main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
    <p><strong>Sunrise:</strong> ${new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
    <p><strong>Sunset:</strong> ${new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
  `;
}
function setDynamicBackground(condition) {
  const backgrounds = {
    Clear: "images/clear.jpeg",
    Rain: "images/rain.jpg",
    Snow: "images/snow.jpeg",
    Clouds: "images/cloud.jpeg",
    Thunderstorm: "images/thunder.jpeg",
    Default: "images/default.jpeg"
  };

  const bgUrl = backgrounds[condition] || backgrounds["Default"];
  document.body.style.backgroundImage = `url('${bgUrl}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundAttachment = "fixed";
}


// Provide tips based on weather conditions and the time of day
function getWeatherTip(condition) {
  const hours = new Date().getHours();
  
  // Define weather-based tips
  const weatherTips = {
    Clear: {
      morning: "Good morning! The sun is out, perfect for a walk or some outdoor exercise.",
      afternoon: "It's a bright and sunny afternoon! Great for outdoor activities. Don't forget sunscreen!",
      evening: "A beautiful sunny evening! Enjoy the golden hour and some fresh air.",
      night: "Clear skies tonight. It's a great time for stargazing, enjoy the peaceful night."
    },
    Rain: {
      morning: "Rainy morning ahead! Grab your umbrella, and stay dry as you start the day.",
      afternoon: "It’s still raining in the afternoon. Stay warm inside or enjoy a cozy indoor activity.",
      evening: "Heavy rain this evening! Perfect time for a warm drink and relaxing indoors.",
      night: "The rain continues into the night. Stay dry as you head to bed, and enjoy the sound of rain."
    },
    Snow: {
      morning: "Good morning! It's snowing! Bundle up, and enjoy the winter wonderland outside.",
      afternoon: "Snowfall continues. Consider building a snowman or sipping hot cocoa by the window.",
      evening: "The snow keeps falling, a cozy evening is perfect to enjoy the winter scenery.",
      night: "The snow looks magical at night. Stay warm and enjoy the quiet, snow-covered streets."
    },
    Clouds: {
      morning: "It’s a cloudy morning. A perfect time for a relaxed walk or indoor activities.",
      afternoon: "Cloudy skies in the afternoon. Ideal for a quiet day indoors with a good book or movie.",
      evening: "The clouds are still around in the evening. Great time for a calm, relaxed evening.",
      night: "Cloudy skies tonight, perfect for a peaceful rest."
    },
    Thunderstorm: {
      morning: "Stormy morning ahead! Stay indoors and keep safe, avoid traveling if possible.",
      afternoon: "Thunderstorms are continuing. Stay indoors and enjoy your hobby.",
      evening: "It’s stormy this evening! Stay safe and cozy indoors, maybe enjoy a movie night.",
      night: "Thunderstorms at night! A perfect time for staying warm inside and listening to the rain."
    }
  };

  // Get the time of day for the current weather condition
  const timeOfDay = getTimeOfDay();
  return weatherTips[condition] ? weatherTips[condition][timeOfDay] : "Stay safe and enjoy the weather!";
}

// Get time of day as a string (morning, afternoon, evening, night)
function getTimeOfDay() {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 10) {
    return "morning";
  } else if (hours >= 10 && hours < 14) {
    return "afternoon";
  } else if (hours >= 14 && hours < 18) {
    return "afternoon";
  } else if (hours >= 18 && hours < 22) {
    return "evening";
  } else {
    return "night";
  }
}

// Get the weather icon based on the condition
function getWeatherIcon(condition) {
  const icons = {
    Clear: "https://openweathermap.org/img/wn/01d.png",
    Rain: "https://openweathermap.org/img/wn/10d.png",
    Snow: "https://openweathermap.org/img/wn/13d.png",
    Clouds: "https://openweathermap.org/img/wn/03d.png",
    Thunderstorm: "https://openweathermap.org/img/wn/11d.png"
  };
  return icons[condition] || "https://openweathermap.org/img/wn/01d.png";
}

// Provide care tips based on the time of day
function getCareTip() {
  const hours = new Date().getHours();
  
  // Define care tips based on time of day
  const careTips = {
    morning: "Start your day with some stretching to wake up your muscles. Drink water to hydrate.",
    afternoon: "Take a short break to refresh your mind. Consider a healthy snack to keep your energy up.",
    evening: "Relax your mind and body, take a deep breath, and unwind. Start thinking about a healthy dinner.",
    night: "Ensure you get enough sleep. Avoid screen time before bed to promote better sleep quality."
  };

  // Return the appropriate care tip based on the current time of day
  const timeOfDay = getTimeOfDay();
  return careTips[timeOfDay] || "Remember to take care of yourself!";
}

// Add event listener to the button
getWeatherButton.addEventListener("click", () => {
  const city = locationInput.value.trim();
  if (city) {
    fetchWeatherDataByCity(city);
  } else {
    weatherContainer.innerHTML = "<p class='error'>Please enter a city name.</p>";
  }
});


// Voice Search Feature
const voiceSearchButton = document.getElementById("voiceSearch");
const statusText = document.getElementById("status");

voiceSearchButton.addEventListener("click", () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition not supported");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onstart = () => {
    statusText.textContent = "🎤 Listening...";
  };

  recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  console.log("Raw voice input:", spokenText);

  // Smart city extraction
  const matched = spokenText.match(/in\s+([a-zA-Z\s]+)|for\s+([a-zA-Z\s]+)|weather\s+([a-zA-Z\s]+)/i);
  let cleanedCity = "";

  if (matched) {
    // Pick the first non-null matched group
    cleanedCity = (matched[1] || matched[2] || matched[3] || "").trim();
  } else {
    // fallback: use full speech with basic cleanup
    cleanedCity = spokenText.replace(/[^a-zA-Z\s]/g, "").trim();
  }

  // Update input and UI
  locationInput.value = cleanedCity;
  statusText.textContent = `🔍 You said: "${spokenText}" → Searching for: "${cleanedCity}"`;

  if (cleanedCity) {
    fetchWeatherDataByCity(cleanedCity);
  } else {
    statusText.textContent = "❌ Couldn't detect a city in your voice input.";
  }
};


  recognition.onerror = (event) => {
    statusText.textContent = `Error: ${event.error}`;
  };

  recognition.start();
});

// Detect location on page load
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherDataByCoordinates(lat, lon);
    }, () => {
      console.log("Location access denied or unavailable.");
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
});

// New function to fetch weather by coordinates
async function fetchWeatherDataByCoordinates(lat, lon) {
  const apiKey = "d473d3173f1fdc223507f8337fe1da65";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}
