// Weather service module for communicating with OpenWeatherMap API

import axios from 'axios';

// OpenWeatherMap API key from environment variables
// In development: from .env file
// In production: from hosting platform environment variables
const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Check if API key is available
if (!API_KEY) {
  console.error('Weather API key is missing! Please check your environment variables.');
}

// City name mapping for special cases
const CITY_MAPPING = {
  // Chinese cities
  'xiamen': 'Xiamen,CN', 
  'fuzhou': 'Fuzhou,CN',
  'quanzhou': 'Quanzhou,CN',
  'beijing': 'Beijing,CN',
  'shanghai': 'Shanghai,CN',
  'guangzhou': 'Guangzhou,CN',
  'shenzhen': 'Shenzhen,CN',
  'hangzhou': 'Hangzhou,CN',
  'chengdu': 'Chengdu,CN',
  'nanjing': 'Nanjing,CN',
  'wuhan': 'Wuhan,CN',
  'xian': 'Xi\'an,CN',
  'tianjin': 'Tianjin,CN',
  'chongqing': 'Chongqing,CN',
  'suzhou': 'Suzhou,CN',
  'dalian': 'Dalian,CN',
  'qingdao': 'Qingdao,CN',
  'shenyang': 'Shenyang,CN',
  'ningbo': 'Ningbo,CN',
  'changsha': 'Changsha,CN',
  'kunming': 'Kunming,CN',
  'harbin': 'Harbin,CN',
  'jinan': 'Jinan,CN',
  'nanchang': 'Nanchang,CN',
  'hefei': 'Hefei,CN',
  'zhengzhou': 'Zhengzhou,CN',
  'dongguan': 'Dongguan,CN',
  'wuxi': 'Wuxi,CN',
  
  // International cities
  'newyork': 'New York,US',
  'losangeles': 'Los Angeles,US',
  'sanfrancisco': 'San Francisco,US',
  'chicago': 'Chicago,US',
  'houston': 'Houston,US',
  'philadelphia': 'Philadelphia,US',
  'phoenix': 'Phoenix,US',
  'sandiego': 'San Diego,US',
  'dallas': 'Dallas,US',
  'austin': 'Austin,US',
  'seattle': 'Seattle,US',
  'boston': 'Boston,US',
  'lasvegas': 'Las Vegas,US',
  'miami': 'Miami,US',
  'london': 'London,GB',
  'manchester': 'Manchester,GB',
  'liverpool': 'Liverpool,GB',
  'birmingham': 'Birmingham,GB',
  'glasgow': 'Glasgow,GB',
  'paris': 'Paris,FR',
  'marseille': 'Marseille,FR',
  'lyon': 'Lyon,FR',
  'toulouse': 'Toulouse,FR',
  'nice': 'Nice,FR',
  'tokyo': 'Tokyo,JP',
  'osaka': 'Osaka,JP',
  'kyoto': 'Kyoto,JP',
  'sapporo': 'Sapporo,JP',
  'yokohama': 'Yokohama,JP',
  'seoul': 'Seoul,KR',
  'busan': 'Busan,KR',
  'incheon': 'Incheon,KR',
  'singapore': 'Singapore,SG',
  'sydney': 'Sydney,AU',
  'melbourne': 'Melbourne,AU',
  'brisbane': 'Brisbane,AU',
  'perth': 'Perth,AU',
  'adelaide': 'Adelaide,AU',
  'toronto': 'Toronto,CA',
  'vancouver': 'Vancouver,CA',
  'montreal': 'Montreal,CA',
  'calgary': 'Calgary,CA',
  'ottawa': 'Ottawa,CA',
  'dubai': 'Dubai,AE',
  'abudhabi': 'Abu Dhabi,AE',
  'moscow': 'Moscow,RU',
  'saintpetersburg': 'Saint Petersburg,RU',
  'berlin': 'Berlin,DE',
  'munich': 'Munich,DE',
  'hamburg': 'Hamburg,DE',
  'frankfurt': 'Frankfurt,DE',
  'cologne': 'Cologne,DE',
  'rome': 'Rome,IT',
  'milan': 'Milan,IT',
  'naples': 'Naples,IT',
  'turin': 'Turin,IT',
  'florence': 'Florence,IT',
  'madrid': 'Madrid,ES',
  'barcelona': 'Barcelona,ES',
  'valencia': 'Valencia,ES',
  'seville': 'Seville,ES',
  'amsterdam': 'Amsterdam,NL',
  'rotterdam': 'Rotterdam,NL',
  'bangkok': 'Bangkok,TH',
  'phuket': 'Phuket,TH',
  'mumbai': 'Mumbai,IN',
  'delhi': 'Delhi,IN',
  'bangalore': 'Bangalore,IN',
  'hyderabad': 'Hyderabad,IN',
  'chennai': 'Chennai,IN',
  'cairo': 'Cairo,EG',
  'alexandria': 'Alexandria,EG',
  'riodejaneiro': 'Rio de Janeiro,BR',
  'saopaulo': 'Sao Paulo,BR',
  'brasilia': 'Brasilia,BR',
  'mexicocity': 'Mexico City,MX',
  'cancun': 'Cancun,MX',
  'buenosaires': 'Buenos Aires,AR',
  'lima': 'Lima,PE',
  'santiago': 'Santiago,CL',
  'bogota': 'Bogota,CO',
  'caracas': 'Caracas,VE',
  'lisbon': 'Lisbon,PT',
  'porto': 'Porto,PT',
  'athens': 'Athens,GR',
  'istanbul': 'Istanbul,TR',
  'antalya': 'Antalya,TR',
  'vienna': 'Vienna,AT',
  'zurich': 'Zurich,CH',
  'geneva': 'Geneva,CH',
  'brussels': 'Brussels,BE',
  'copenhagen': 'Copenhagen,DK',
  'oslo': 'Oslo,NO',
  'stockholm': 'Stockholm,SE',
  'helsinki': 'Helsinki,FI',
  'warsaw': 'Warsaw,PL',
  'prague': 'Prague,CZ',
  'budapest': 'Budapest,HU',
  'dublin': 'Dublin,IE',
  'auckland': 'Auckland,NZ',
  'wellington': 'Wellington,NZ',
  'johannesburg': 'Johannesburg,ZA',
  'capetown': 'Cape Town,ZA',
  'casablanca': 'Casablanca,MA',
  'nairobi': 'Nairobi,KE',
  'lagos': 'Lagos,NG',
  'tehran': 'Tehran,IR',
  'jerusalem': 'Jerusalem,IL',
  'telaviv': 'Tel Aviv,IL',
  'beirut': 'Beirut,LB',
  'doha': 'Doha,QA',
  'kuwait': 'Kuwait City,KW',
  'riyadh': 'Riyadh,SA',
  'jeddah': 'Jeddah,SA',
  'manila': 'Manila,PH',
  'jakarta': 'Jakarta,ID',
  'kualalumpur': 'Kuala Lumpur,MY',
  'hanoi': 'Hanoi,VN',
  'hochiminhcity': 'Ho Chi Minh City,VN',
  'taipei': 'Taipei,TW',
  'kaohsiung': 'Kaohsiung,TW',
  'dhaka': 'Dhaka,BD',
  'colombo': 'Colombo,LK',
  'kathmandu': 'Kathmandu,NP',
  'yangon': 'Yangon,MM',
  'phnompenh': 'Phnom Penh,KH',
  'vientiane': 'Vientiane,LA',
  'ulaanbaatar': 'Ulaanbaatar,MN'
  // 可以根据需要继续添加更多城市映射
};

/**
 * Process city name to ensure API compatibility
 * @param {string} city - City name input
 * @returns {string} - Processed city name
 */
const processCityName = (city) => {
  if (!city) return '';
  
  const lowerCity = city.toLowerCase().trim();
  
  // Remove spaces for compound city names in the mapping
  const noSpaceLowerCity = lowerCity.replace(/\s+/g, '');
  
  // Check if we have a special mapping for this city
  if (CITY_MAPPING[lowerCity]) {
    return CITY_MAPPING[lowerCity];
  } else if (CITY_MAPPING[noSpaceLowerCity]) {
    return CITY_MAPPING[noSpaceLowerCity];
  }
  
  // Handle city names with country codes (e.g., "Paris,FR")
  if (lowerCity.includes(',')) {
    // The user already specified a country code, use it as is
    return city.trim();
  }
  
  // For cities without explicit country code, we'll try to use the city name directly
  // OpenWeatherMap API will attempt to find the most relevant match
  return city.trim();
};

/**
 * Get current weather data
 * @param {string} city - City name
 * @returns {Promise} - Promise returning weather data
 */
export const fetchWeatherData = async (city) => {
  try {
    const processedCity = processCityName(city);
    if (!processedCity) {
      throw new Error('City name is required');
    }
    
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: processedCity,
        appid: API_KEY,
        lang: 'en', // 使用英文返回结果
        units: 'metric' // 使用摄氏度
      }
    });
    
    // Store the original user input city name in the response data
    const weatherData = response.data;
    weatherData.userInputCity = city.trim();
    
    return weatherData;
  } catch (error) {
    console.error('Failed to fetch current weather data:', error);
    // 提供更详细的错误信息
    if (error.response && error.response.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling or try another city.`);
    } else if (error.response && error.response.status === 401) {
      throw new Error('API key is invalid. Please check your configuration.');
    } else if (error.response && error.response.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    } else if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    } else {
      throw new Error(`Unable to fetch weather data for "${city}". Please try again later.`);
    }
  }
};

/**
 * Get weather forecast data
 * @param {string} city - City name
 * @returns {Promise} - Promise returning forecast data
 */
export const fetchForecastData = async (city) => {
  try {
    const processedCity = processCityName(city);
    if (!processedCity) {
      throw new Error('City name is required');
    }
    
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: processedCity,
        appid: API_KEY,
        lang: 'en', // 使用英文返回结果
        units: 'metric', // 使用摄氏度
        cnt: 40 // 返回5天的3小时预报数据
      }
    });
    
    // Store the original user input city name in the response data
    const forecastData = response.data;
    forecastData.userInputCity = city.trim();
    
    return forecastData;
  } catch (error) {
    console.error('Failed to fetch forecast data:', error);
    // 提供更详细的错误信息
    if (error.response && error.response.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling or try another city.`);
    } else if (error.response && error.response.status === 401) {
      throw new Error('API key is invalid. Please check your configuration.');
    } else if (error.response && error.response.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    } else if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    } else {
      throw new Error(`Unable to fetch forecast data for "${city}". Please try again later.`);
    }
  }
};

/**
 * Get weather alerts data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} - Promise returning weather alerts data
 */
export const fetchWeatherAlerts = async (lat, lon) => {
  try {
    if (!lat || !lon) {
      console.warn('Missing coordinates for weather alerts');
      return [];
    }
    
    const response = await axios.get(`${BASE_URL}/onecall`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        exclude: 'current,minutely,hourly,daily', // Only get alert information
        lang: 'en', // Use English for results
        units: 'metric' // Use Celsius
      }
    });
    return response.data.alerts || [];
  } catch (error) {
    console.error('Failed to fetch weather alerts data:', error);
    // 仍然返回空数组，但记录更详细的错误信息
    if (error.response && error.response.status === 401) {
      console.error('API key is invalid for weather alerts');
    } else if (error.response && error.response.status === 429) {
      console.error('API rate limit exceeded');
    } else if (!navigator.onLine) {
      console.error('No internet connection for weather alerts');
    } else {
      console.error(`Unable to fetch weather alerts data for coordinates (${lat},${lon})`);
    }
    return []; // Return empty array if fetch fails
  }
};