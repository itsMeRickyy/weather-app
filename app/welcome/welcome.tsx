import { useCallback, useEffect, useState } from "react";
import useWeatherStore, { useWeather } from "store/useWeatherDataStore";
export function Welcome() {
  const { weatherData, detectUserLocation, userLocation, locationError, searchError, searchLocation, fetchWeatherData } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { currentLocation } = useWeather();

  const handleDetectLocation = async () => {
    await detectUserLocation();
  };

  const handleSearchLocation = async () => {
    if (searchQuery.trim() !== "") {
      await searchLocation(searchQuery);
      setSearchQuery("");
    }
  };

  console.log("Weather data:", weatherData);
  return (
    <main className="flex flex-col items-center justify-center pt-16 pb-4">
      <h1>Weather data</h1>

      <div>
        <button onClick={handleDetectLocation}>Detect Your Location</button>
      </div>
      <div>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={"Search location..."} />
        <button onClick={handleSearchLocation}>Search</button>
        {searchError && <p style={{ color: "red" }}>{searchError}</p>}
      </div>
      {currentLocation && (
        <div>
          <p>
            Current Locationn: {currentLocation.name} (Lat: {currentLocation.latitude}, Lon: {currentLocation.longitude})
          </p>
          <p>Temperature: {currentLocation.temperature}</p>
        </div>
      )}

      {weatherData && (
        <div>
          <p>Temperature: {weatherData?.main.temp}</p>
          <p>Description: {weatherData?.weather[0].description}</p>
          <p>Feels Like: {weatherData?.main.feels_like}</p>
          <p>Humidity: {weatherData?.main.humidity}</p>
          <p>Wind Speed: {weatherData?.wind.speed}</p>
          <div>
            {weatherData?.weather.map((item, index) => (
              <div className="bg-gray-700 p-4" key={index}>
                <p>Main: {item.main}</p>
                <p>Description: {item.description}</p>
                <img className="w-32" src={`https://openweathermap.org/img/w/${item.icon}.png`} alt={item.description} />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
