import axios from "axios";

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  name: string;
  id: number;
  temperature: number;
  description: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  weather: [
    {
      main: string;
      description: string;
      icon: string;
    }
  ];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
}

export async function fetchWeatherInfo(locations: Location[], apiKey: string): Promise<WeatherData[]> {
  const weatherData = await Promise.all(
    locations.map(async location => {
      const response = await axios.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`);
      return response.data;
    })
  );

  return weatherData;
}

export interface detailLocation {
  name: string | undefined;
}

export async function FetchDetailWeather(locations: string | undefined, apiKey: string): Promise<WeatherData> {
  const response = await axios.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?q=${locations}&appid=${apiKey}`);
  return response.data;
}
