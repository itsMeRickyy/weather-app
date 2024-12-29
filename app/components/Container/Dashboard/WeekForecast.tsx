import React from "react";
import WeekForecastCard from "~/components/Card/WeekForecastCard";
import { weekForecast } from "~/services/WeekForecast";
import { useStore } from "../../../../store/useStore";

function WeekForecast() {
  const { week } = weekForecast;
  const { toggle } = useStore();

  return (
    <div className="flex flex-col gap-5">
      <h1 className={toggle ? `text-white text-xl` : `text-gray-700 text-xl`}>Week Forecast</h1>
      <div className="flex gap-2 flex-wrap">
        {week.map(day => (
          <WeekForecastCard day={day.day.substring(0, 3)} icon={day.icon} temp={`${day.temperature.min} - ${day.temperature.max}`} />
        ))}
      </div>
    </div>
  );
}

export default WeekForecast;
