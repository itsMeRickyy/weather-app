import React, { useState } from "react";
import useWeatherStore, { useWeather } from "store/useWeatherDataStore";

function SearchBar() {
  const { searchError, searchLocation, weatherData, detectUserLocation } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchLocation = async () => {
    if (searchQuery.trim() !== "") {
      await searchLocation(searchQuery);
      setSearchQuery("");
    }
  };
  return (
    <>
      <div>
        <div className=" flex gap-2 justify-between  p-2 ">
          <input
            onKeyDown={e => e.key === "Enter" && handleSearchLocation()}
            className=" bg-transparent placeholder:text-gray-700 rounded-md p-2 w-full focus:outline-none"
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
            <button className="w-full p-1 bg-gray-200 flex items-center  " onClick={detectUserLocation}>
              Your Location...
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBar;
