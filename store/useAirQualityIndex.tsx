import { create } from "zustand";
import { getAirQualityIndex } from "~/services/getAirQuality";
import type { AirQualityDataType, Location, WeatherData } from ".././types";
import useWeatherStore from "./useWeatherDataStore";
import { useEffect } from "react";

interface AirQualityIndexState {
  airQualityIndex: AirQualityDataType[] | null;
  isLoading: boolean;
  fetchAirQuality: (locations: Location[], apiKey: string) => Promise<void>;
}

export const useAirQualityIndex = create<AirQualityIndexState>((set, get) => ({
  airQualityIndex: null,
  isLoading: false,

  fetchAirQuality: async (locations: Location[]) => {
    set({ isLoading: true });
    const response = await getAirQualityIndex(locations);
    set({ airQualityIndex: response as AirQualityDataType[], isLoading: false });
  },
}));

export const useAirQualityTrigger = () => {
  const { fetchAirQuality } = useAirQualityIndex();
  const { userLocation } = useWeatherStore();
  const apiKey = import.meta.env.VITE_APP_API_KEY;

  useEffect(() => {
    if (userLocation) {
      fetchAirQuality([userLocation], apiKey);
      console.log("This is userrrr location", userLocation);
    }
  }, [userLocation]);
};
