export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  longitude: number;
  latitude: number;
  name: string;
  id: number;
  temperature: number;
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
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    "1h": number | null;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface AirQualityDataType {
  coord: {
    lon: number;
    lat: number;
  };
  list: {
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }[];
}
