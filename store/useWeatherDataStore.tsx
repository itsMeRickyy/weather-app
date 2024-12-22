import { useEffect } from "react";
import { create } from "zustand";
import { fetchWeatherInfo } from "~/services/fetchWeather";
import type { Location, WeatherData } from "~/services/fetchWeather";
import axios from "axios";

interface WeatherState {
  locations: Location[];
  weatherData: WeatherData[] | null;
  openSearch: boolean;
  setIsOpenSearch: (open: boolean) => void;
  fetchWeatherData: () => Promise<void>;
  detectUserLocation: () => Promise<void>;
  userLocation: Location | null;
  locationError: string | null;
  searchLocation: (query: string) => Promise<void>;
  searchError: string | null;
}

const useWeatherStore = create<WeatherState>((set, get) => ({
  locations: [
    { name: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
    // ... other locations
  ],
  weatherData: null,
  openSearch: false,
  userLocation: null,
  locationError: null,
  searchError: null,

  setIsOpenSearch: open => set({ openSearch: open }),
  fetchWeatherData: async () => {
    try {
      const weatherData = await fetchWeatherInfo(get().locations, import.meta.env.VITE_WEATHER_API_KEY);
      set({ weatherData });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  },
  detectUserLocation: async () => {
    if (!navigator.geolocation) {
      set({ locationError: "Geolocation is not supported by your browser." });
      return;
    }

    set({ locationError: null }); // Clear any previous errors

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding to get the city name (using a third-party service)
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const cityName = data.address?.city || data.address?.town || data.address?.village || "Unknown Location";
        set({ userLocation: { name: cityName, latitude, longitude } });
        set(state => ({ locations: [...state.locations, { name: cityName, latitude, longitude }] }));
        get().fetchWeatherData();
      } catch (reverseGeocodingError) {
        console.error("Error reverse geocoding:", reverseGeocodingError);
        set({ userLocation: { name: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`, latitude, longitude } });
        set(state => ({ locations: [...state.locations, { name: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`, latitude, longitude }] }));
        get().fetchWeatherData();
      }
    } catch (error: any) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          set({ locationError: "User denied the request for Geolocation." });
          break;
        case error.POSITION_UNAVAILABLE:
          set({ locationError: "Location information is unavailable." });
          break;
        case error.TIMEOUT:
          set({ locationError: "The request to get user location timed out." });
          break;
        case error.UNKNOWN_ERROR:
          set({ locationError: "An unknown error occurred." });
          break;
      }
      console.error("Error getting user location:", error);
    }
  },
  searchLocation: async query => {
    set({ searchError: null });
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&limit=1`);
      const data = response.data;

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        set({ locations: [...get().locations, { name: display_name, latitude, longitude }] });
        get().fetchWeatherData();
      } else {
        set({ searchError: "Location not found" });
        console.error("Location not found");
      }
    } catch (error) {
      set({ searchError: "Error searching location" });
      console.error("Error searching location:", error);
    }
  },
}));

// A custom hook to trigger the initial fetch in your component.
export const useWeather = () => {
  const { locations, fetchWeatherData, ...state } = useWeatherStore();

  useEffect(() => {
    fetchWeatherData();
  }, [locations, fetchWeatherData]);

  return { ...state, locations };
};

export default useWeatherStore;
