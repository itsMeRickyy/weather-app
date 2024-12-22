interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  weatherDescription: string;
  icon: string; // URL to a weather icon
}
