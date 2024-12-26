import type { Location } from "~/services/fetchWeather";

export interface WeatherData {
  name: string;
  id: number;
  temperature: number;
  description: string;
  latitude: number;
  longitude: number;
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

export const detectUserLocation = async (): Promise<Location | null> => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser.");
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
        headers: {
          "User-Agent": "YourAppName/1.0 (YourContactInfo)", // IMPORTANT: Replace with your app info
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Reverse geocoding failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      // Extract city, town, or village name (with fallback)
      const cityName = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "Unknown Location";

      return { name: cityName, latitude, longitude };
    } catch (reverseGeocodingError) {
      console.error("Error reverse geocoding:", reverseGeocodingError);
      // Fallback: Use coordinates as location name if reverse geocoding fails
      return { name: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`, latitude, longitude };
    }
  } catch (error: any) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        throw new Error("User denied the request for Geolocation.");
      case error.POSITION_UNAVAILABLE:
        throw new Error("Location information is unavailable.");
      case error.TIMEOUT:
        throw new Error("The request to get user location timed out.");
      case error.UNKNOWN_ERROR:
        throw new Error("An unknown error occurred.");
      default:
        throw error; // Re-throw any other errors
    }
  }
};

export const searchLocation = async (query: string): Promise<WeatherData | null> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2`, {
      headers: {
        "User-Agent": "YourAppName/1.0 (YourContactInfo)",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search location failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const firstResult = data[0];

    if (!firstResult) {
      throw new Error("No results found.");
    }

    return {
      name: firstResult.display_name,
      latitude: firstResult.lat,
      longitude: firstResult.lon,
      id: firstResult.place_id,
      temperature: 0,
      description: "",
      main: { temp: 0, humidity: 0, feels_like: 0, pressure: 0 },
      weather: [{ main: "", description: "", icon: "" }],
      wind: { speed: 0, deg: 0 },
      clouds: { all: 0 },
    };
  } catch (searchLocationError) {
    console.error("Error search location:", searchLocationError);
    return null;
  }
};
