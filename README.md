# Weather Dashboard

A modern, responsive weather application built with HTML, CSS (Tailwind), and vanilla JavaScript. Get real-time weather information and forecasts for any city or your current location.


## Features

- **Location-based Weather**: Search for any city or use your current location
- **Current Weather**: View current temperature, weather conditions, and important details
- **5-Day Forecast**: Plan ahead with a detailed 5-day weather forecast
- **Weather Details**: Get humidity, wind speed, pressure, and "feels like" temperature
- **Search History**: Quick access to recently searched locations
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Modern UI**: Clean interface with animations and visual feedback

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- OpenWeatherMap API
- Geolocation API
- Local Storage API

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine
- An API key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd weather-dashboard
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Update the API key:

   - Open `src/index.js`
   - Replace `YOUR_API_KEY` with your actual OpenWeatherMap API key:
     ```javascript
     const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key
     ```

4. Build the CSS:
   ```
   npm run build:css
   ```
5. Run the application:
   ```
   npm start
   ```

## Usage Guide

### Searching for a City

1. Type a city name in the search bar
2. Press Enter or click the search button
3. View the current weather and 5-day forecast

### Using Your Current Location

1. Click the "Current Location" button
2. Allow location access when prompted by your browser
3. View weather data for your current location

### Recent Searches

1. Focus on the search bar to view your recent searches
2. Click on any previous search to quickly get weather data
3. Use "Clear History" to reset your search history

## API Information

This project uses the following OpenWeatherMap API endpoints:

- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day Forecast: `https://api.openweathermap.org/data/2.5/forecast`

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Author

Abhijit Sahane

---