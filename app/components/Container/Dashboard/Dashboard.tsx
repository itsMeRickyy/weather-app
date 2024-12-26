import React from "react";
import useWeatherStore from "store/useWeatherDataStore";

function Dashboard() {
  const { weatherData, detectUserLocation } = useWeatherStore();

  return (
    <div className="flex flex-col gap-10 p-4">
      <div>
        <h1 className="text-gray-700 text-3xl">Today's Weather</h1>
      </div>
      <div>
        <div className="w-56 h-56 rounded-lg bg-green-300">
          {weatherData && weatherData.length > 0 ? (
            <>
              <h1>Air Quality</h1>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
