import React, { use, useEffect, useState } from "react";
import useWeatherStore, { useWeather } from "store/useWeatherDataStore";
import SearchBar from "./SearchBar";
import { useStore } from "store/useStore";
import Header from "~/components/Header/Header";

function Sidebar() {
  const { weatherData, detectUserLocation, userLocation } = useWeatherStore();
  const { toggle } = useStore();
  const rainProbability = () => {
    const rainfall = weatherData?.[0].rain?.["1h"] || 0;

    if (rainfall >= 5) {
      return "100%"; // Heavy rain
    } else if (rainfall >= 2) {
      return "80%"; // Moderate rain
    } else if (rainfall >= 1) {
      return "50%"; // Light rain
    } else if (rainfall > 0) {
      return "30%"; // Slight chance of rain
    } else {
      return "0%";
    }
  };

  const weatherStatus = () => {
    const weather = weatherData?.[0].weather[0].description;

    if (weather === "clear sky") {
      return "☀️ Clear sky";
    } else if (weather === "few clouds") {
      return "🌤️ Few clouds";
    } else if (weather === "scattered clouds") {
      return "🌥️ Scattered clouds";
    } else if (weather === "broken clouds") {
      return "☁️ Broken clouds";
    } else if (weather === "overcast clouds") {
      return "☁️ Overcast clouds";
    } else if (weather === "light rain") {
      return "🌦️ Light rain";
    } else if (weather === "moderate rain") {
      return "🌧️ Moderate rain";
    } else if (weather === "heavy intensity rain") {
      return "🌧️ Heavy rain";
    } else if (weather === "shower rain") {
      return "🌧️ Shower rain";
    } else if (weather === "thunderstorm") {
      return "⛈️ Thunderstorm";
    } else if (weather === "thunderstorm with light rain") {
      return "⛈️ Thunderstorm with light rain";
    } else if (weather === "thunderstorm with rain") {
      return "⛈️ Thunderstorm with rain";
    } else if (weather === "thunderstorm with heavy rain") {
      return "⛈️ Thunderstorm with heavy rain";
    } else if (weather === "snow") {
      return "❄️ Snow";
    } else if (weather === "light snow") {
      return "🌨️ Light snow";
    } else if (weather === "heavy snow") {
      return "🌨️ Heavy snow";
    } else if (weather === "sleet") {
      return "🌨️ Sleet";
    } else if (weather === "mist") {
      return "🌫️ Mist";
    } else if (weather === "smoke") {
      return "🌫️ Smoke";
    } else if (weather === "haze") {
      return "🌫️ Haze";
    } else if (weather === "fog") {
      return "🌫️ Fog";
    } else if (weather === "sand") {
      return "🌫️ Sand";
    } else if (weather === "dust") {
      return "🌫️ Dust";
    } else if (weather === "ash") {
      return "🌫️ Ash";
    } else if (weather === "squall") {
      return "🌬️ Squall";
    } else if (weather === "tornado") {
      return "🌪️ Tornado";
    } else {
      return weather;
    }
  };

  useEffect(() => {
    detectUserLocation();
  }, [detectUserLocation]);

  return (
    <div>
      <div className={` ${toggle ? `bg-darkMode-300 text-white ` : `bg-white text-gray-700 `} flex flex-col gap-10 h-screen p-4 px-14`}>
        <div className="flex justify-between items-center gap-5">
          <SearchBar />
          <div className="sm:hidden">
            <Header />
          </div>
        </div>
        <div>
          {weatherData && weatherData.length > 0 ? (
            <>
              <div className="flex flex-col items-center gap-2 p-10  border-b border-gray-400">
                <p className="text-7xl">{weatherStatus()?.split(" ")[0]}</p>
                <h1 className="text-7xl">{weatherData[0].main.temp.toFixed(0)}°C</h1>
                <div className="flex gap-2">
                  <p>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</p>
                  <p className="text-gray-400">
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col gap-10 h-full">
          {weatherData && weatherData.length > 0 ? (
            <div className="flex flex-col ">
              <div className="flex items-center">
                <h1 className="text-xl">{weatherStatus()}</h1>
              </div>
              <div className="flex gap-2 ">
                <p className="text-xl">🌧️</p>
                <h1 className="text-xl">Rain - {rainProbability()}</h1>
              </div>
              {/* Render other weather properties as needed */}
            </div>
          ) : (
            <div className="h-20 rounded-md text-2xl w-full flex items-center justify-center p-3">
              <p>Loading...</p>
            </div>
          )}
          <div className="flex gap-2 p-7 h-full">
            {weatherData && weatherData.length > 0 ? (
              <div className={toggle ? `bg-darkMode-200 text-white h-20 rounded-md text-2xl w-full flex items-center justify-center p-3` : `h-20 rounded-md text-2xl bg-gray-200 w-full flex items-center justify-center p-3`}>
                <h2>{weatherData[0].name.substring(0, 10)}</h2>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
