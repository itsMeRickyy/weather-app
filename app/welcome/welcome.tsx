import { useCallback, useEffect, useState } from "react";
import useWeatherStore, { useWeather } from "store/useWeatherDataStore";
export function Welcome() {
  const { weatherData, detectUserLocation, userLocation, locationError, searchError, searchLocation } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { locations } = useWeather();

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

        {locationError && <p style={{ color: "red" }}>{locationError}</p>}

        {userLocation && (
          <p>
            Your Location: {userLocation.name} (Lat: {userLocation.latitude}, Lon: {userLocation.longitude})
          </p>
        )}
        {/* {locations.map(location => (
          <div key={location.name}>{location.name}</div>
        ))} */}
      </div>
      <div>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={"Search location..."} />
        <button onClick={handleSearchLocation}>Search</button>
        {searchError && <p style={{ color: "red" }}>{searchError}</p>}
      </div>
      {locations.map(location => (
        <div key={location.name}>{location.name}</div>
      ))}
      {weatherData?.map((data, index) => (
        <div key={index}>
          <p>Location: {data.name}</p>
          <p>Temperature: {data.main.temp}°C</p>
          <p>Humidity: {data.main.humidity}%</p>
          <p>Weather: {data.weather[0].description}</p>
        </div>
      ))}
    </main>
  );
}
