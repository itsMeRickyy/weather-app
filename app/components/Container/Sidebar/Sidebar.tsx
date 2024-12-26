import React, { use, useEffect, useState } from "react";
import useWeatherStore, { useWeather } from "store/useWeatherDataStore";
import SearchBar from "./SearchBar";

function Sidebar() {
  const { weatherData, detectUserLocation } = useWeatherStore();
  // const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000); // Update every second

  //   return () => clearInterval(intervalId);
  // }, []);

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

  useEffect(() => {
    detectUserLocation();
  }, [detectUserLocation]);

  console.log("weatherData", weatherData);

  return (
    <div>
      <div className="bg-white text-gray-700 flex flex-col gap-10 w-96 h-screen  px-14">
        <SearchBar />
        <div>
          {weatherData && weatherData.length > 0 ? (
            <>
              <div className="flex flex-col items-center gap-2 p-10  border-b border-gray-400">
                <img className="w-28" src={`http://openweathermap.org/img/w/${weatherData[0].weather[0].icon}.png`} alt="" />
                <h1 className="text-7xl">{weatherData[0].main.temp.toFixed(0)}°C</h1>
                <p>
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col gap-10 h-full">
          {weatherData && weatherData.length > 0 ? (
            <div className="flex flex-col">
              <div className="flex items-center">
                <img src={`http://openweathermap.org/img/w/${weatherData[0].weather[0].icon}.png`} alt="" />
                <p className="">
                  {weatherData[0].weather[0].description
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
              </div>
              <div className="flex gap-2 pl-2">
                <img src="https://img.icons8.com/ios-glyphs/30/000000/rain.png" alt="" />
                <h1>Rain - {rainProbability()}</h1>
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
              <div className="h-20 rounded-md text-2xl bg-gray-200 w-full flex items-center justify-center p-3">
                <h2>{weatherData[0].name}</h2>
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
