import React, { useEffect, useState } from "react";
import axios from "axios";
import useWeatherStore, { useWeather } from "store/useWeatherDataStore";

function CityCard() {
  const { searchError, searchLocation, weatherData } = useWeatherStore();
  const { currentLocation } = useWeather();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (currentLocation?.name) {
        try {
          // Replace with your actual Unsplash API key
          const apiKey = "YOUR_UNSPLASH_API_KEY";
          const response = await axios.get(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(currentLocation.name)}&client_id=${apiKey}`);
          setBackgroundImage(response.data.urls.regular);
        } catch (error) {
          console.error("Error fetching image:", error);
          // Set a default image or handle the error gracefully
          setBackgroundImage("path/to/default/image.jpg");
        }
      }
    };

    fetchImage();
  }, []);

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>{currentLocation?.name}</h1>
    </div>
  );
}

export default CityCard;
