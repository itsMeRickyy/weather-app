import WeekForecast from "./WeekForecast";
import { useStore } from "store/useStore";
import Highlights from "../Highlights/Highlights";

function Dashboard() {
  const { toggle } = useStore();

  return (
    <div className={`${toggle ? `text-white ` : ``} flex flex-col gap-10 p-4 `}>
      <div>
        <WeekForecast />
      </div>
      <div>
        <h1 className={toggle ? `text-white text-3xl` : `text-gray-700 text-3xl`}>Today's Weather</h1>
      </div>

      <Highlights />
    </div>
  );
}

export default Dashboard;
