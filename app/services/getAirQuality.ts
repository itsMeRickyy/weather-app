import axios from "axios";
import type { AirQualityDataType, Location, WeatherData } from "../../types";

export const getAirQualityIndex = async (locations: Location[]): Promise<AirQualityDataType[]> => {
  const apiKey = import.meta.env.VITE_APP_API_KEY;
  try {
    const responses = await Promise.all(
      locations.map(async location => {
        const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`; // Correct URL
        console.log("Fetching URL:", url);
        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text(); // Get the error message from the API
          console.error(`API Error: ${response.status} ${response.statusText}`, errorText); // Log detailed error
          throw new Error(`HTTP error ${response.status}: ${response.statusText} - ${errorText}`); // Re-throw for Zustand to handle
        }
        return response.json();
      })
    );
    return responses;
  } catch (error) {
    console.error("Error in fetchWeatherInfo:", error);
    throw error; // Important: Re-throw the error
  }
};
