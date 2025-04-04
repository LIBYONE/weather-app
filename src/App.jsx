import { useState, useEffect } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import WeatherAlert from './components/WeatherAlert'
import { fetchWeatherData, fetchForecastData, fetchWeatherAlerts } from './services/weatherService'
import { FaSun, FaMoon } from 'react-icons/fa'

function App() {
  const [city, setCity] = useState('')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [recentCities, setRecentCities] = useState(() => {
    const saved = localStorage.getItem('recentCities')
    return saved ? JSON.parse(saved) : []
  })

  const handleSearch = async (searchCity) => {
    setCity(searchCity)
    setLoading(true)
    setError(null)
    
    // Add to recent search cities list
    if (searchCity.trim() && !recentCities.includes(searchCity.trim())) {
      const updatedCities = [searchCity.trim(), ...recentCities.slice(0, 4)]
      setRecentCities(updatedCities)
      localStorage.setItem('recentCities', JSON.stringify(updatedCities))
    }
    
    try {
      // Get current weather data
      const weatherData = await fetchWeatherData(searchCity)
      // Add the user input city name to the weather data
      weatherData.userInputCity = searchCity.trim()
      setCurrentWeather(weatherData)
      
      // Get forecast data
      const forecastData = await fetchForecastData(searchCity)
      setForecast(forecastData)
      
      // Get weather alerts data
      if (weatherData.coord) {
        const { lat, lon } = weatherData.coord
        const alertsData = await fetchWeatherAlerts(lat, lon)
        setAlerts(alertsData)
      } else {
        setAlerts([])
      }
    } catch (err) {
      // 显示具体的错误信息，而不是通用消息
      setError(err.message || 'Unable to fetch weather data. Please check the city name or try again later.')
      setCurrentWeather(null)
      setForecast(null)
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }

  // Toggle theme mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }
  
  // Use useEffect to monitor theme changes and apply to body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])
  
  // Select city from recent cities list
  const selectRecentCity = (city) => {
    handleSearch(city)
  }
  
  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <header>
        <div className="header-top">
          <h1>Weather Forecast</h1>
          <button 
            className="theme-toggle" 
            onClick={toggleDarkMode} 
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        <SearchBar onSearch={handleSearch} />
        
        {recentCities.length > 0 && (
          <div className="recent-cities">
            <p>Recent searches:</p>
            <div className="city-tags">
              {recentCities.map((recentCity, index) => (
                <button 
                  key={index} 
                  className="city-tag" 
                  onClick={() => selectRecentCity(recentCity)}
                >
                  {recentCity}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      
      <main>
        {loading && <div className="loading-message">Loading weather data...</div>}
        
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {currentWeather && (
          <div className="weather-container">
            <CurrentWeather data={currentWeather} />
            
            {alerts.length > 0 && (
              <div className="alerts-section">
                <h2>Weather Alerts</h2>
                <div className="alerts-container">
                  {alerts.map((alert, index) => (
                    <WeatherAlert key={index} alert={alert} />
                  ))}
                </div>
              </div>
            )}
            
            {forecast && (
              <div className="forecast-section">
                <Forecast data={forecast} />
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer>
        <p>© 2023 Weather Forecast | Data Source: OpenWeatherMap</p>
      </footer>
    </div>
  )
}

export default App