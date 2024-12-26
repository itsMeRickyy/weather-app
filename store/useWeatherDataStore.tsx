import { useEffect } from "react";
import { create } from "zustand";
import { fetchWeatherInfo } from "~/services/fetchWeather";
import type { Location, WeatherData } from "~/services/fetchWeather";
import axios from "axios";
import { detectUserLocation, searchLocation } from "utils/locationUtils";

interface WeatherState {
  // locations: Location[];
  currentLocation: Location | null;
  weatherData: WeatherData[] | null;
  openSearch: boolean;
  setIsOpenSearch: (open: boolean) => void;
  fetchWeatherData: (location: Location) => Promise<void>;
  detectUserLocation: () => Promise<void>;
  userLocation: Location | null;
  locationError: string | null;
  searchLocation: (query: string) => Promise<void>;
  searchError: string | null;
  isLoading: boolean;
}

// const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

const useWeatherStore = create<WeatherState>((set, get) => ({
  currentLocation: {
    // Initial location WITH weather data
    name: "Jakarta",
    latitude: -6.2088,
    longitude: 106.8456,
  },

  locations: [
    { name: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
    // ... other locations
  ],
  weatherData: null,
  openSearch: false,
  setIsOpenSearch: open => set({ openSearch: open }),
  userLocation: null,
  locationError: null,
  searchError: null,
  isLoading: false,
  fetchWeatherData: async (location: Location) => {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    if (!apiKey) {
      console.error("API key not found");
      return;
    }
    try {
      const response = await fetchWeatherInfo([location], apiKey);
      set({ weatherData: response, isLoading: false });
      console.log("This is Weather Data", response);
    } catch (error) {
      console.error("Error fetch weather data:", error);
      set({ weatherData: null, isLoading: false });
    }
  },
  detectUserLocation: async () => {
    set({ locationError: null, currentLocation: null, isLoading: true, weatherData: null });
    const location = await detectUserLocation();
    if (location) {
      set({ userLocation: location, currentLocation: location, isLoading: false });
      get().fetchWeatherData(location);
    } else {
      set({ locationError: "Location not found", isLoading: false });
    }
  },
  searchLocation: async query => {
    set({ searchError: null, isLoading: true, weatherData: null });
    const location = await searchLocation(query);
    if (location) {
      set({ currentLocation: location, isLoading: false });
      get().fetchWeatherData(location);
    } else {
      set({ searchError: "Location not found", isLoading: false });
    }
  },
}));

// A custom hook to trigger the initial fetch in your component.
export const useWeather = () => {
  const { currentLocation, fetchWeatherData, ...state } = useWeatherStore();

  useEffect(() => {
    if (currentLocation) {
      fetchWeatherData(currentLocation);
    } else {
      state.detectUserLocation();
    }
  }, [currentLocation, fetchWeatherData, state.detectUserLocation]);

  return { ...state, currentLocation };
};

export default useWeatherStore;
