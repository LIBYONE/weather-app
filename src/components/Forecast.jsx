import React from 'react'
import './Forecast.css'

function Forecast({ data }) {
  if (!data || !data.list) return null

  // API已返回摄氏度，不需要转换
  const roundTemperature = (temp) => {
    return Math.round(temp)
  }

  // 获取天气图标URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`
  }

  // 格式化日期
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // 按天分组天气数据
  const groupForecastByDay = () => {
    const grouped = {}
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US')
      
      if (!grouped[date]) {
        grouped[date] = []
      }
      
      grouped[date].push(item)
    })
    
    return grouped
  }

  // 获取每天的天气摘要
  const getDailySummary = (dayData) => {
    // 计算平均温度、最高温度和最低温度
    let sumTemp = 0
    let maxTemp = -Infinity
    let minTemp = Infinity
    let mostFrequentWeather = {}
    
    dayData.forEach(item => {
      const temp = item.main.temp
      sumTemp += temp
      maxTemp = Math.max(maxTemp, temp)
      minTemp = Math.min(minTemp, temp)
      
      // 统计最常见的天气状况
      const weather = item.weather[0].main
      mostFrequentWeather[weather] = (mostFrequentWeather[weather] || 0) + 1
    })
    
    // 找出出现次数最多的天气状况
    let mainWeather = ''
    let maxCount = 0
    
    for (const weather in mostFrequentWeather) {
      if (mostFrequentWeather[weather] > maxCount) {
        maxCount = mostFrequentWeather[weather]
        mainWeather = weather
      }
    }
    
    // 找出代表性的天气图标（使用中午时段的图标）
    let iconCode = ''
    for (const item of dayData) {
      const hour = new Date(item.dt * 1000).getHours()
      if (hour >= 11 && hour <= 13) {
        iconCode = item.weather[0].icon
        break
      }
    }
    
    // 如果没找到中午时段，就使用第一个数据的图标
    if (!iconCode && dayData.length > 0) {
      iconCode = dayData[0].weather[0].icon
    }
    
    return {
      avgTemp: sumTemp / dayData.length,
      maxTemp,
      minTemp,
      mainWeather,
      iconCode,
      description: dayData[0].weather[0].description // 使用第一个数据点的描述
    }
  }

  const groupedForecast = groupForecastByDay()
  const forecastDays = Object.keys(groupedForecast).slice(0, 5) // 限制为5天

  return (
    <div className="forecast">
      <h2>Weather Forecast</h2>
      <div className="forecast-container">
        {forecastDays.map(day => {
          const dayData = groupedForecast[day]
          const summary = getDailySummary(dayData)
          
          return (
            <div key={day} className="forecast-day">
              <div className="forecast-date">{formatDate(dayData[0].dt)}</div>
              <div className="forecast-icon">
                <img 
                  src={getWeatherIconUrl(summary.iconCode)} 
                  alt={summary.description} 
                />
              </div>
              <div className="forecast-description">{summary.description}</div>
              <div className="forecast-temps">
                <span className="max-temp">{roundTemperature(summary.maxTemp)}°</span>
                <span className="min-temp">{roundTemperature(summary.minTemp)}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Forecast