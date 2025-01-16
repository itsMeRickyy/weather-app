import React from "react";
import Sidebar from "./components/Container/Sidebar/Sidebar";
import Dashboard from "./components/Container/Dashboard/Dashboard";
import { useStore } from "./../store/useStore";
import Header from "./components/Header/Header";

function Main() {
  const { toggle } = useStore();
  return (
    <div className={`${toggle ? `bg-darkMode-100 ` : `bg-gray-100 `} overflow-y-scroll overflow-x-hidden min-h-screen h-full`} id="main">
      <div className="flex gap-10 w-full">
        <div className="absolute right-10 top-4 hidden sm:block z-20">
          <Header />
        </div>
        {/* sidebar */}
        <Sidebar />
        <div className="hidden sm:block">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default Main;
