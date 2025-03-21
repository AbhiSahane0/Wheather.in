// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
const themeText = document.getElementById("themeText");
const html = document.documentElement;

// Update theme text display based on current mode
function updateThemeText() {
  const isDark = html.classList.contains("dark");
  themeText.textContent = isDark ? "Dark Mode" : "Light Mode";
}

// Set initial theme text
updateThemeText();

// Toggle between light and dark mode
themeToggle.addEventListener("click", () => {
  // Toggle the 'dark' class on the html element
  html.classList.toggle("dark");

  // Store the preference in localStorage
  const isDark = html.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Update the theme text
  updateThemeText();
});

// Weather API Configuration
const API_KEY = "4b4294da2815764b014b692c3ec9d541"; // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// DOM Elements Selection
const locationSearch = document.getElementById("locationSearch");
const searchButton = document.getElementById("searchButton");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const recentSearchesDropdown = document.getElementById("recentSearches");
const currentTemp = document.querySelector("#currentTempValue");
const currentLocation = document.querySelector("#currentLocationName");
const weatherDescription = document.querySelector("#weatherDescription");
const feelsLikeInline = document.querySelector("#feelsLikeInline");
const weatherIcon = document.querySelector(".w-32.h-32");

// Weather details elements
const detailsContainer = document.querySelector(".grid.grid-cols-2.gap-6");
const detailElements = detailsContainer
  ? Array.from(detailsContainer.querySelectorAll(".text-xl.font-semibold"))
  : [];
const humidity = detailElements[0];
const windSpeed = detailElements[1];
const pressure = detailElements[2];
const feelsLike = detailElements[3];

// Forecast container
const forecastContainer = document.querySelector(
  ".grid-cols-2.md\\:grid-cols-5"
);

// Animation Classes for smooth transitions
const fadeInClasses = [
  "opacity-0",
  "transition-opacity",
  "duration-500",
  "ease-in-out",
];
const fadeInActive = "opacity-100";

// Weather icon mapping
const weatherIcons = {
  "01d": "clear-day",
  "01n": "clear-night",
  "02d": "partly-cloudy-day",
  "02n": "partly-cloudy-night",
  "03d": "cloudy",
  "03n": "cloudy",
  "04d": "cloudy",
  "04n": "cloudy",
  "09d": "rain",
  "09n": "rain",
  "10d": "rain",
  "10n": "rain",
  "11d": "thunderstorm",
  "11n": "thunderstorm",
  "13d": "snow",
  "13n": "snow",
  "50d": "fog",
  "50n": "fog",
};

// Recent searches management
const MAX_RECENT_SEARCHES = 5; // Maximum number of recent searches to store
let recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");

// Fetch Weather Data by City Name
async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your API key and make sure it's activated."
        );
      }
      throw new Error(data.message || "Failed to fetch weather data");
    }

    // Add to recent searches if successful
    addToRecentSearches(city);

    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

// Fetch Weather Data by Coordinates (for geolocation)
async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your API key and make sure it's activated."
        );
      }
      throw new Error(data.message || "Failed to fetch weather data");
    }

    // Add to recent searches if successful
    if (data.name) {
      addToRecentSearches(data.name);
    }

    return data;
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    throw error;
  }
}

// Fetch 5-Day Forecast by City Name
async function fetchForecast(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your API key and make sure it's activated."
        );
      }
      throw new Error(data.message || "Failed to fetch forecast data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

// Fetch 5-Day Forecast by Coordinates
async function fetchForecastByCoords(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your API key and make sure it's activated."
        );
      }
      throw new Error(data.message || "Failed to fetch forecast data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching forecast by coordinates:", error);
    throw error;
  }
}

// Update Current Weather UI with fetched data
function updateCurrentWeather(data) {
  if (!currentTemp || !currentLocation) {
    console.error("Current weather elements not found in the DOM");
    return;
  }

  // Add fade-in animation for smooth transition
  fadeInClasses.forEach((cls) => currentTemp.classList.add(cls));
  fadeInClasses.forEach((cls) => currentLocation.classList.add(cls));

  if (weatherDescription) {
    fadeInClasses.forEach((cls) => weatherDescription.classList.add(cls));
  }

  // Update the temperature and location with a slight delay for animation
  setTimeout(() => {
    currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
    currentLocation.textContent = data.name;

    // Update weather description if element exists
    if (weatherDescription && data.weather && data.weather[0]) {
      weatherDescription.textContent = data.weather[0].description;
    }

    // Update inline feels like temperature
    if (feelsLikeInline) {
      feelsLikeInline.textContent = `${Math.round(data.main.feels_like)}°C`;
    }

    // Remove fade-in animation
    fadeInClasses.forEach((cls) => currentTemp.classList.remove(cls));
    fadeInClasses.forEach((cls) => currentLocation.classList.remove(cls));

    if (weatherDescription) {
      fadeInClasses.forEach((cls) => weatherDescription.classList.remove(cls));
    }
  }, 100);

  // Update weather details with staggered animations
  if (humidity && windSpeed && pressure && feelsLike) {
    const details = [
      { element: humidity, value: `${data.main.humidity}%` },
      { element: windSpeed, value: `${Math.round(data.wind.speed)} km/h` },
      { element: pressure, value: `${data.main.pressure} hPa` },
      { element: feelsLike, value: `${Math.round(data.main.feels_like)}°C` },
    ];

    // Apply animations with staggered timing for each weather detail
    details.forEach(({ element, value }, index) => {
      setTimeout(() => {
        fadeInClasses.forEach((cls) => element.classList.add(cls));
        setTimeout(() => {
          element.textContent = value;
          fadeInClasses.forEach((cls) => element.classList.remove(cls));
        }, 100);
      }, index * 100);
    });
  } else {
    console.error("Weather detail elements not found in the DOM");
  }

  // Update weather icon with enhanced styling
  if (weatherIcon) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Custom icon animation based on weather type
    let animationClass = "animate-pulse";
    if (iconCode.includes("01") || iconCode.includes("02")) {
      animationClass = "floating";
    } else if (iconCode.includes("09") || iconCode.includes("10")) {
      animationClass = "animate-bounce";
    } else if (iconCode.includes("11")) {
      animationClass = "animate-pulse animate-pulse";
    }

    weatherIcon.innerHTML = `<img src="${iconUrl}" alt="${data.weather[0].description}" class="w-full h-full ${animationClass}">`;
  }
}

// Create a forecast card with enhanced details and styling
function createForecastCard(forecast) {
  const date = new Date(forecast.dt * 1000);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  const temp = Math.round(forecast.main.temp);
  const iconCode = forecast.weather[0].icon;
  const humidity = forecast.main.humidity;
  const windSpeed = Math.round(forecast.wind.speed);
  const description = forecast.weather[0].description;

  // Enhanced card with humidity and wind speed information, improved styling
  return `
    <div class="bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-600">
      <div class="font-medium text-gray-500 dark:text-gray-300 mb-1">${dayName}</div>
      <div class="text-xs text-gray-400 dark:text-gray-500 mb-2">${dayDate}</div>
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon" class="mx-auto mb-2 w-16 h-16">
      <p class="text-xl font-bold text-gray-800 dark:text-white mb-1">${temp}°C</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 capitalize">${description}</p>
      <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 mt-2">
        <div class="flex items-center justify-center p-1 bg-blue-50 dark:bg-gray-600 rounded-lg">
          <svg class="w-3 h-3 mr-1 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          <span>${humidity}%</span>
        </div>
        <div class="flex items-center justify-center p-1 bg-blue-50 dark:bg-gray-600 rounded-lg">
          <svg class="w-3 h-3 mr-1 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
          <span>${windSpeed} km/h</span>
        </div>
      </div>
    </div>
  `;
}

// Update Forecast UI with enhanced cards
function updateForecast(data) {
  if (!forecastContainer) {
    console.error("Forecast container not found in the DOM");
    return;
  }

  // Get one forecast per day (every 8th item is a new day in the API response)
  const dailyForecasts = data.list
    .filter((item, index) => index % 8 === 0)
    .slice(0, 5);

  // Add a brief loading animation
  forecastContainer.classList.add("opacity-0");

  setTimeout(() => {
    // Render forecast cards
    forecastContainer.innerHTML = dailyForecasts
      .map(createForecastCard)
      .join("");
    forecastContainer.classList.remove("opacity-0");
    forecastContainer.classList.add("transition-opacity", "duration-500");
  }, 300);
}

// Add a city to recent searches
function addToRecentSearches(city) {
  // Convert to title case for consistency
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  // Remove if already exists to avoid duplicates
  recentSearches = recentSearches.filter(
    (item) => item.toLowerCase() !== city.toLowerCase()
  );

  // Add to the beginning of the array
  recentSearches.unshift(city);

  // Limit to maximum number of recent searches
  if (recentSearches.length > MAX_RECENT_SEARCHES) {
    recentSearches = recentSearches.slice(0, MAX_RECENT_SEARCHES);
  }

  // Save to localStorage
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));

  // Update dropdown UI
  updateRecentSearchesDropdown();
}

// Update the recent searches dropdown UI with enhanced styling
function updateRecentSearchesDropdown() {
  if (!recentSearchesDropdown) return;

  // Clear current dropdown items
  recentSearchesDropdown.innerHTML = "";

  // If no recent searches, hide dropdown
  if (recentSearches.length === 0) {
    recentSearchesDropdown.classList.add("hidden");
    return;
  }

  // Add header to dropdown
  const header = document.createElement("div");
  header.className =
    "px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700";
  header.textContent = "Recent Searches";
  recentSearchesDropdown.appendChild(header);

  // Add items to dropdown with enhanced styling
  recentSearches.forEach((city) => {
    const item = document.createElement("div");
    item.className =
      "px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 text-gray-800 dark:text-white flex items-center";

    // Add icon to recent search item
    const iconSpan = document.createElement("span");
    iconSpan.className = "mr-2 text-blue-500";
    iconSpan.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;

    const textSpan = document.createElement("span");
    textSpan.textContent = city;

    item.appendChild(iconSpan);
    item.appendChild(textSpan);

    item.addEventListener("click", () => {
      locationSearch.value = city;
      recentSearchesDropdown.classList.add("hidden");
      handleSearch();
    });
    recentSearchesDropdown.appendChild(item);
  });

  // Add clear history button
  const clearButton = document.createElement("div");
  clearButton.className =
    "px-4 py-2 text-center text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 cursor-pointer border-t border-gray-200 dark:border-gray-700";
  clearButton.textContent = "Clear History";
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    recentSearches = [];
    localStorage.removeItem("recentSearches");
    recentSearchesDropdown.classList.add("hidden");
  });

  recentSearchesDropdown.appendChild(clearButton);
}

// Get user's current location using geolocation API
function getCurrentLocation() {
  if (navigator.geolocation) {
    // Show loading state on the current location button
    currentLocationBtn.disabled = true;
    currentLocationBtn.innerHTML = `
      <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Locating...
    `;

    // Request current position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Fetch weather and forecast data using coordinates
          const [weatherData, forecastData] = await Promise.all([
            fetchWeatherByCoords(latitude, longitude),
            fetchForecastByCoords(latitude, longitude),
          ]);

          // Update UI with fetched data
          updateCurrentWeather(weatherData);
          updateForecast(forecastData);
        } catch (error) {
          showNotification(
            "Error",
            error.message || "Error fetching location data. Please try again."
          );
        } finally {
          // Reset button state
          resetCurrentLocationButton();
        }
      },
      // Error callback
      (error) => {
        // Handle geolocation errors
        let errorMessage = "Unable to get your location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location permission denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
        }

        showNotification("Location Error", errorMessage);
        resetCurrentLocationButton();
      }
    );
  } else {
    showNotification(
      "Browser Error",
      "Geolocation is not supported by your browser."
    );
  }
}

// Create a custom notification element
function showNotification(title, message) {
  // Check if a notification already exists and remove it
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification container
  const notification = document.createElement("div");
  notification.className =
    "notification fixed z-50 transform transition-all duration-500 opacity-0";

  // Make it responsive
  if (window.innerWidth <= 640) {
    // Mobile styling - full width at bottom
    notification.classList.add("bottom-4", "left-4", "right-4", "max-w-full");
  } else {
    // Desktop styling - top right corner
    notification.classList.add("top-4", "right-4", "max-w-md");
  }

  // Set special styling if it's an error notification
  const isError =
    title.toLowerCase().includes("error") ||
    title.toLowerCase().includes("not found");
  let bgClass, borderClass;

  if (isError) {
    bgClass = "bg-red-50";
    borderClass = "border-red-300";
  } else {
    bgClass = "bg-white";
    borderClass = "border-gray-200";
  }

  // Add classes individually to avoid the HTML space character error
  notification.classList.add(bgClass);
  notification.classList.add("rounded-lg");
  notification.classList.add("shadow-xl");
  notification.classList.add("p-4");
  notification.classList.add("border");
  notification.classList.add(borderClass);

  // Add dark mode classes
  if (isError) {
    notification.classList.add("dark:bg-red-900/30");
    notification.classList.add("dark:border-red-700");
  } else {
    notification.classList.add("dark:bg-gray-800");
    notification.classList.add("dark:border-gray-700");
  }

  // Add left border accent for errors
  if (isError) {
    notification.classList.add("border-l-4");
    notification.classList.add("border-l-red-500");
  }

  // Create notification content
  notification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-shrink-0 pt-0.5">
        ${
          isError
            ? `
          <svg class="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
            : `
          <svg class="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
        }
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-bold ${
          isError
            ? "text-red-800 dark:text-red-200"
            : "text-gray-900 dark:text-white"
        }">${title}</p>
        <p class="mt-1 text-sm ${
          isError
            ? "text-red-700 dark:text-red-300"
            : "text-gray-500 dark:text-gray-400"
        }">${message}</p>
      </div>
      <div class="ml-4 flex-shrink-0 flex">
        <button class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-${
          isError ? "red" : "blue"
        }-500 rounded-full p-1 transition-colors">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  `;

  // Add to DOM
  document.body.appendChild(notification);

  // Add animation class after a short delay (for transition to work)
  setTimeout(() => {
    if (window.innerWidth <= 640) {
      notification.classList.add("translate-y-0");
    } else {
      notification.classList.add("translate-y-4");
    }
    notification.classList.add("opacity-100");
  }, 10);

  // Add click event to close button
  const closeButton = notification.querySelector("button");
  closeButton.addEventListener("click", () => {
    notification.classList.remove(
      window.innerWidth <= 640 ? "translate-y-0" : "translate-y-4"
    );
    notification.classList.remove("opacity-100");
    notification.classList.add("opacity-0");
    setTimeout(() => {
      notification.remove();
    }, 500);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove(
        window.innerWidth <= 640 ? "translate-y-0" : "translate-y-4"
      );
      notification.classList.remove("opacity-100");
      notification.classList.add("opacity-0");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 500);
    }
  }, 5000);
}

// Reset current location button to original state
function resetCurrentLocationButton() {
  currentLocationBtn.disabled = false;
  currentLocationBtn.innerHTML = `
    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
    Current Location
  `;
}

// Handle city search with enhanced error handling and UI feedback
async function handleSearch() {
  const city = locationSearch.value.trim();
  if (!city) return;

  try {
    // Show loading state
    searchButton.disabled = true;
    searchButton.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;

    // Fetch weather and forecast data in parallel
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherData(city),
      fetchForecast(city),
    ]);

    // Update UI with the fetched data
    updateCurrentWeather(weatherData);
    updateForecast(forecastData);
  } catch (error) {
    let errorTitle = "Search Error";
    let errorMessage =
      error.message || "Error fetching weather data. Please try again.";

    // Customize error message for city not found
    if (error.message && error.message.toLowerCase().includes("not found")) {
      errorTitle = "City Not Found";

      // Popular cities suggestions
      const popularCities = ["London", "New York", "Tokyo", "Mumbai", "Paris"];
      const suggestions = popularCities
        .filter(
          (c) =>
            !recentSearches.some((rs) => rs.toLowerCase() === c.toLowerCase())
        )
        .slice(0, 3);

      let suggestionText = "";
      if (suggestions.length > 0) {
        suggestionText =
          " Try one of these popular cities: " +
          suggestions
            .map(
              (c) =>
                `<span class="font-medium cursor-pointer underline text-red-700 dark:text-red-300 suggestion-city">${c}</span>`
            )
            .join(", ");
      }

      errorMessage = `We couldn't find "${city}" in our database. Please check the spelling or try another city.${suggestionText}`;
    }

    showNotification(errorTitle, errorMessage);

    // Add click event for city suggestions
    setTimeout(() => {
      document.querySelectorAll(".suggestion-city").forEach((element) => {
        element.addEventListener("click", () => {
          locationSearch.value = element.textContent;
          handleSearch();
          // Close notification
          const notification = document.querySelector(".notification");
          if (notification) {
            notification.classList.remove(
              window.innerWidth <= 640 ? "translate-y-0" : "translate-y-4"
            );
            notification.classList.remove("opacity-100");
            notification.classList.add("opacity-0");
            setTimeout(() => notification.remove(), 500);
          }
        });
      });
    }, 100);
  } finally {
    // Reset search button
    searchButton.disabled = false;
    searchButton.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    `;
  }
}

// Event Listeners
// Search button click
searchButton.addEventListener("click", handleSearch);

// Enter key in search input
locationSearch.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// Current location button click
currentLocationBtn.addEventListener("click", getCurrentLocation);

// Show recent searches dropdown when focusing on input
locationSearch.addEventListener("focus", () => {
  updateRecentSearchesDropdown();
  if (recentSearches.length > 0) {
    recentSearchesDropdown.classList.remove("hidden");
  }
});

// Hide dropdown when clicking outside of it
document.addEventListener("click", (e) => {
  if (
    !locationSearch.contains(e.target) &&
    !recentSearchesDropdown.contains(e.target)
  ) {
    recentSearchesDropdown.classList.add("hidden");
  }
});

// Add a subtle animation on page load
document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.querySelector(".container");
  if (mainContent) {
    mainContent.classList.add("opacity-0");
    setTimeout(() => {
      mainContent.classList.add("transition-opacity", "duration-700");
      mainContent.classList.remove("opacity-0");
    }, 100);
  }
});

// Initialize recent searches dropdown
updateRecentSearchesDropdown();

// Try to get weather for default city or user's location on page load
if (recentSearches.length > 0) {
  // Use the most recent search if available
  locationSearch.value = recentSearches[0];
  handleSearch();
} else {
  // Try to get user's location on initial load if no recent searches
  getCurrentLocation();
}
