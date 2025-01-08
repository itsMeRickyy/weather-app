import React from "react";
import { useStore } from "store/useStore";

interface cardProps {
  day: string;
  icon?: string;
  temp: string;
  children?: React.ReactNode;
}

function WeekForecastCard({ day, icon, temp, children }: cardProps) {
  const { toggle } = useStore();

  return (
    <div className={toggle ? `w-24 h-40 rounded-2xl bg-darkMode-200 text-white flex flex-col gap-5 justify-between p-5 ` : `w-24 h-40 rounded-2xl bg-white flex flex-col gap-5 justify-between p-5 text-gray-700`}>
      <h1>{day}</h1>
      {/* <img src={icon} alt="weather icon" /> */}
      <div className="text-4xl">{icon}</div>
      {children}
      <h1 className="text-xs">{temp}</h1>
    </div>
  );
}

export default WeekForecastCard;
