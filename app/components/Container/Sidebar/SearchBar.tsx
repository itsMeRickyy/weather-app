import React, { useState } from "react";
import useWeatherStore, { useWeather } from "store/useWeatherDataStore";
import { useStore } from "store/useStore";

function SearchBar() {
  const { searchError, searchLocation, weatherData, detectUserLocation } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { toggle } = useStore();

  const handleSearchLocation = async () => {
    if (searchQuery.trim() !== "") {
      await searchLocation(searchQuery);
      setSearchQuery("");
    }
  };
  return (
    <>
      <div>
        <div className=" flex gap-2 justify-between  p-2 relative">
          <input
            onKeyDown={e => e.key === "Enter" && handleSearchLocation()}
            className={` ${toggle ? `bg-darkMode-200 text-white placeholder:text-gray-300 ` : `bg-white text-gray-700 placeholder:text-gray-700 `} bg-transparent rounded-md p-2 w-full focus:outline-none`}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={"Search for places..."}
          />
          <button className="w-12 p-1 bg-gray-200 flex items-center justify-center rounded-full " onClick={handleSearchLocation}>
            <img src="https://img.icons8.com/ios-glyphs/30/000000/search.png" alt="" />
          </button>
          {searchError && <p style={{ color: "red" }}>{searchError}</p>}
        </div>
        <div>
          {searchQuery.length >= 1 && (
            <button className={`absolute top-20 w-60 rounded-lg ${toggle ? `bg-darkMode-200 text-white  ` : `bg-slate-200 text-gray-700 `}  p-2 flex items-center`} onClick={detectUserLocation}>
              Your Location...
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBar;
