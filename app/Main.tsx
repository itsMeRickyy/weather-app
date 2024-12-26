import React from "react";
import Sidebar from "./components/Container/Sidebar/Sidebar";
import Dashboard from "./components/Container/Dashboard/Dashboard";

function Main() {
  return (
    <div className="bg-slate-50 p-4 overflow-y-hidden overflow-x-hidden h-screen">
      <div className="flex gap-10">
        <Sidebar />
        <div className="hidden sm:block">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default Main;
