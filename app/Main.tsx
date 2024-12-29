import React from "react";
import Sidebar from "./components/Container/Sidebar/Sidebar";
import Dashboard from "./components/Container/Dashboard/Dashboard";
import { useStore } from "./../store/useStore";
import Header from "./components/Header/Header";

function Main() {
  const { toggle } = useStore();
  return (
    <div className={`${toggle ? `bg-darkMode-100 ` : `bg-gray-100 `} sm:overflow-y-scroll sm:overflow-x-hidden h-screen`} id="main">
      <div className="flex gap-10 w-full">
        <div className="absolute right-10 top-5 hidden sm:block">
          <Header />
        </div>
        <Sidebar />
        <div className="hidden sm:block">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default Main;
