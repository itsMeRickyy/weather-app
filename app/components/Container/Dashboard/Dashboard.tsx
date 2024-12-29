import useWeatherStore from "store/useWeatherDataStore";
import calculateAQI from "utils/calculateAQI";
import HighlightCard from "~/components/Card/HighlightCard";
import WeekForecast from "./WeekForecast";
import LoadingScreen from "../LoadingScreen";
import { useStore } from "store/useStore";

function Dashboard() {
  const { airQualityData, weatherData } = useWeatherStore();
  const { toggle } = useStore();

  let calculatedAQI = 0;

  if (airQualityData) {
    calculatedAQI = calculateAQI(airQualityData);
  }

  const airQualityStatus = () => {
    const aqi = calculatedAQI;
    if (aqi >= 0 && aqi <= 50) {
      return "Good 😊";
    } else if (aqi >= 51 && aqi <= 100) {
      return "Moderate 😐";
    } else if (aqi >= 101 && aqi <= 150) {
      return "Unhealthy for Sensitive Groups 😷";
    } else if (aqi >= 151 && aqi <= 200) {
      return "Unhealthy 🤒";
    } else if (aqi >= 201 && aqi <= 300) {
      return "Very Unhealthy 😫";
    } else if (aqi >= 301 && aqi <= 500) {
      return "Hazardous 😱";
    } else if (aqi >= 501 && aqi <= 1000) {
      return "Very Hazardous ☠️";
    } else {
      return "Unknown 🤔";
    }
  };

  const visibilityStatus = () => {
    const visibility = weatherData ? weatherData[0].visibility : 0;
    if (weatherData && visibility >= 10000) {
      return "Excellent 🌟";
    } else if (visibility >= 5000 && visibility < 10000) {
      return "Good 👍";
    } else if (visibility >= 1000 && visibility < 5000) {
      return "Moderate 👀";
    } else if (visibility >= 500 && visibility < 1000) {
      return "Poor 👓";
    } else {
      return "Very Poor 🌫️";
    }
  };

  const humidityStatus = () => {
    const humidity = weatherData ? weatherData[0].main.humidity : 0;
    if (humidity >= 0 && humidity < 30) {
      return "Dry 🏜️";
    } else if (humidity >= 30 && humidity < 60) {
      return "Normal 🙂";
    } else if (humidity >= 60 && humidity < 90) {
      return "Humid 🌧️";
    } else {
      return "Very Humid 💦";
    }
  };

  const pressureStatus = () => {
    const pressure = weatherData ? weatherData[0].main.pressure : 0;
    if (pressure >= 0 && pressure < 1000) {
      return "Low Pressure";
    } else if (pressure >= 1000 && pressure < 2000) {
      return "Normal Pressure";
    } else if (pressure >= 2000 && pressure < 3000) {
      return "High Pressure";
    } else {
      return "Very High Pressure";
    }
  };

  const getWindDirection = () => {
    const windDirection = weatherData ? weatherData[0].wind.deg : 0;
    const direction = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.floor((windDirection % 360) / 45);
    return direction[index];
  };

  return (
    <div className={`${toggle ? `text-white ` : ``} flex flex-col gap-10 p-4 `}>
      <div>
        <WeekForecast />
      </div>
      <div>
        <h1 className={toggle ? `text-white text-3xl` : `text-gray-700 text-3xl`}>Today's Weather</h1>
      </div>
      <div className="flex flex-wrap gap-10 justify-start">
        {(weatherData && (
          <>
            {(airQualityData && (
              <HighlightCard title="Air Quality">
                <p className="text-4xl">{calculatedAQI.toFixed(0)}</p>
                <p>{airQualityStatus()}</p>
              </HighlightCard>
            )) || <></>}
          </>
        )) || <></>}

        {(weatherData && (
          <>
            <HighlightCard title="Humidity">
              <p className="text-4xl">{weatherData[0].main.humidity.toFixed(0)}%</p>
              <p>{humidityStatus()}</p>
            </HighlightCard>
            <HighlightCard title="Wind Status">
              <p className="text-4xl">{weatherData[0].wind.speed.toFixed(0)} km/h</p>
              {/* <p>{windStatus()}</p> */}
              <div className="flex items-center gap-2">
                {toggle ? <img className="invert" src="https://img.icons8.com/ios/30/000000/compass.png" alt="Compass Icon" /> : <img src="https://img.icons8.com/ios/30/000000/compass.png" alt="Compass Icon" />}
                <p>{getWindDirection()}</p>
              </div>
            </HighlightCard>
            <HighlightCard title="Visibility">
              <p className="text-4xl">{weatherData[0].visibility / 1000} km</p>
              <p>{visibilityStatus()}</p>
            </HighlightCard>
            <HighlightCard title="Pressure">
              <p className="text-4xl">{weatherData[0].main.pressure} hPa</p>
              <p>{pressureStatus()}</p>
            </HighlightCard>
            <HighlightCard title="Sunrise & Sunset">
              <div className="flex flex-col gap-5">
                <div className="text-lg flex items-center ">
                  {toggle ? <img className="invert" src="https://img.icons8.com/ios-filled/30/000000/sunrise.png" alt="" /> : <img className="" src="https://img.icons8.com/ios-filled/30/000000/sunrise.png" alt="" />}
                  <p>{new Date(weatherData[0].sys.sunrise * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                </div>
                <div className="text-lg flex items-center ">
                  {toggle ? <img className="invert" src="https://img.icons8.com/ios-filled/30/000000/sunset.png" alt="" /> : <img className="" src="https://img.icons8.com/ios-filled/30/000000/sunset.png" alt="" />}
                  <p>{new Date(weatherData[0].sys.sunset * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                </div>
              </div>
            </HighlightCard>
          </>
        )) || (
          <div className="flex justify-center items-center h-96 w-full">
            <LoadingScreen />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
