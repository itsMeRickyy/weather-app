import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useParams, useLoaderData, useActionData, useMatches, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useRef, useEffect } from "react";
import { create } from "zustand";
import { Swiper, SwiperSlide } from "swiper/react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        ServerRouter,
        {
          context: routerContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const stylesheet = "/assets/app-DN0K4wyy.css";
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}, {
  rel: "stylesheet",
  href: stylesheet
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const fetchWeatherInfo = async (locations, apiKey) => {
  try {
    const responses = await Promise.all(
      locations.map(async (location) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`;
        console.log("Fetching URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
          throw new Error(`HTTP error ${response.status}: ${response.statusText} - ${errorText}`);
        }
        return response.json();
      })
    );
    return responses;
  } catch (error) {
    console.error("Error in fetchWeatherInfo:", error);
    throw error;
  }
};
const detectUserLocation = async () => {
  var _a, _b, _c, _d;
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser.");
  }
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const { latitude, longitude } = position.coords;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
        headers: {
          "User-Agent": "YourAppName/1.0 (YourContactInfo)"
          // IMPORTANT: Replace with your app info
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Reverse geocoding failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      const cityName = ((_a = data.address) == null ? void 0 : _a.city) || ((_b = data.address) == null ? void 0 : _b.town) || ((_c = data.address) == null ? void 0 : _c.village) || ((_d = data.address) == null ? void 0 : _d.county) || "Unknown Location";
      return { name: cityName, latitude, longitude };
    } catch (reverseGeocodingError) {
      console.error("Error reverse geocoding:", reverseGeocodingError);
      return { name: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`, latitude, longitude };
    }
  } catch (error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        throw new Error("User denied the request for Geolocation.");
      case error.POSITION_UNAVAILABLE:
        throw new Error("Location information is unavailable.");
      case error.TIMEOUT:
        throw new Error("The request to get user location timed out.");
      case error.UNKNOWN_ERROR:
        throw new Error("An unknown error occurred.");
      default:
        throw error;
    }
  }
};
const searchLocation = async (query) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2`, {
      headers: {
        "User-Agent": "YourAppName/1.0 (YourContactInfo)"
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search location failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    const firstResult = data[0];
    if (!firstResult) {
      throw new Error("No results found.");
    }
    return {
      name: firstResult.display_name,
      id: firstResult.place_id,
      temperature: 0,
      // Placeholder value
      latitude: firstResult.lat,
      longitude: firstResult.lon,
      main: {
        temp: 0,
        // Placeholder value
        humidity: 0,
        // Placeholder value
        feels_like: 0,
        // Placeholder value
        pressure: 0
        // Placeholder value
      },
      weather: [
        {
          main: "",
          // Placeholder value
          description: "",
          // Placeholder value
          icon: ""
          // Placeholder value
        }
      ],
      wind: {
        speed: 0,
        // Placeholder value
        deg: 0
        // Placeholder value
      },
      clouds: {
        all: 0
        // Placeholder value
      },
      visibility: 0,
      // Placeholder value
      dt: 0,
      // Placeholder value
      sys: {
        country: "",
        // Placeholder value
        sunrise: 0,
        // Placeholder value
        sunset: 0
        // Placeholder value
      }
    };
  } catch (searchLocationError) {
    console.error("Error search location:", searchLocationError);
    return null;
  }
};
const getAirQualityIndex = async (locations) => {
  const apiKey = "063606c69912a431e9f0c3ac070e1d95";
  try {
    const responses = await Promise.all(
      locations.map(async (location) => {
        const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`;
        console.log("Fetching URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
          throw new Error(`HTTP error ${response.status}: ${response.statusText} - ${errorText}`);
        }
        return response.json();
      })
    );
    return responses;
  } catch (error) {
    console.error("Error in fetchWeatherInfo:", error);
    throw error;
  }
};
const useWeatherStore = create((set, get) => ({
  currentLocation: {
    // Initial location WITH weather data
    name: "Jakarta",
    latitude: -6.2088,
    longitude: 106.8456
  },
  locations: [
    { name: "Jakarta", latitude: -6.2088, longitude: 106.8456 }
    // ... other locations
  ],
  weatherData: null,
  openSearch: false,
  setIsOpenSearch: (open) => set({ openSearch: open }),
  userLocation: null,
  locationError: null,
  searchError: null,
  isLoading: false,
  airQualityData: null,
  fetchWeatherData: async (location) => {
    const apiKey = "063606c69912a431e9f0c3ac070e1d95";
    try {
      const response = await fetchWeatherInfo([location], apiKey);
      const airQualityResponse = await getAirQualityIndex([location]);
      set({ weatherData: response, airQualityData: airQualityResponse[0], isLoading: false });
      console.log("This is Weather Data", response);
    } catch (error) {
      console.error("Error fetch weather data:", error);
      set({ weatherData: null, isLoading: false });
    }
  },
  detectUserLocation: async () => {
    set({ locationError: null, currentLocation: null, isLoading: true, weatherData: null });
    const location = await detectUserLocation();
    if (location) {
      set({ userLocation: location, currentLocation: location, isLoading: false });
      get().fetchWeatherData(location);
    } else {
      set({ locationError: "Location not found", isLoading: false });
    }
  },
  searchLocation: async (query) => {
    set({ searchError: null, isLoading: true, weatherData: null });
    const location = await searchLocation(query);
    if (location) {
      set({ currentLocation: location, isLoading: false });
      get().fetchWeatherData(location);
    } else {
      set({ searchError: "Location not found", isLoading: false });
    }
  }
}));
const useStore = create((set) => ({
  toggle: false,
  setToggle: (toggle) => set({ toggle })
}));
function SearchBar() {
  const { searchError, searchLocation: searchLocation2, weatherData, detectUserLocation: detectUserLocation2 } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { toggle } = useStore();
  const handleSearchLocation = async () => {
    if (searchQuery.trim() !== "") {
      await searchLocation2(searchQuery);
      setSearchQuery("");
    }
  };
  const handleDetectUserLocation = async () => {
    await detectUserLocation2();
    setSearchQuery("");
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl justify-between  p-2 relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 bg-white rounded-full", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          onKeyDown: (e) => e.key === "Enter" && handleSearchLocation(),
          className: ` ${toggle ? `bg-darkMode-200 text-white placeholder:text-gray-300 ` : `bg-white text-gray-700 placeholder:text-gray-700 `} bg-transparent rounded-md p-2 w-full focus:outline-none`,
          type: "text",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: "Search for places..."
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "w-12 p-1 bg-gray-200 flex items-center justify-center rounded-full ", onClick: handleSearchLocation, children: /* @__PURE__ */ jsx("img", { src: "https://img.icons8.com/ios-glyphs/30/000000/search.png", alt: "" }) }),
      searchError && /* @__PURE__ */ jsx("p", { style: { color: "red" }, children: searchError })
    ] }),
    /* @__PURE__ */ jsx("div", { children: searchQuery.length >= 1 && /* @__PURE__ */ jsx("button", { className: `absolute top-20 w-60 rounded-lg ${toggle ? `bg-darkMode-200 text-white  ` : `bg-slate-200 text-gray-700 `}  p-2 flex items-center`, onClick: handleDetectUserLocation, children: "Your Location..." }) })
  ] }) }) });
}
function SunIconFilled() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 24 24", fill: "currentColor", className: "icon icon-tabler icons-tabler-filled icon-tabler-sun", children: [
    /* @__PURE__ */ jsx("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    /* @__PURE__ */ jsx("path", { d: "M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" }),
    /* @__PURE__ */ jsx("path", { d: "M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z" }),
    /* @__PURE__ */ jsx("path", { d: "M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z" }),
    /* @__PURE__ */ jsx("path", { d: "M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" }),
    /* @__PURE__ */ jsx("path", { d: "M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" }),
    /* @__PURE__ */ jsx("path", { d: "M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z" }),
    /* @__PURE__ */ jsx("path", { d: "M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z" }),
    /* @__PURE__ */ jsx("path", { d: "M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" })
  ] }) });
}
function SunIcon() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "28",
      height: "28",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "icon fill-slate-700 stroke-slate-700  icon-tabler icons-tabler-outline icon-tabler-sun",
      children: [
        /* @__PURE__ */ jsx("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
        /* @__PURE__ */ jsx("path", { d: "M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" }),
        /* @__PURE__ */ jsx("path", { d: "M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" })
      ]
    }
  ) });
}
function Header() {
  const { toggle, setToggle } = useStore();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-5 items-center justify-items-center relative", children: [
    /* @__PURE__ */ jsx("div", { className: "relative modalBtn", children: /* @__PURE__ */ jsx("div", { className: "hidden w-9 h-9 rounded-full bg-gray-800" }) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("button", { onClick: () => setToggle(!toggle), className: " text-white p-2 rounded-lg text-2xl focus:outline-none", children: toggle ? /* @__PURE__ */ jsx(SunIconFilled, {}) : /* @__PURE__ */ jsx(SunIcon, {}) }) }),
    /* @__PURE__ */ jsx("div", { ref: modalRef, className: `Modal ${showModal ? `block` : `hidden`} absolute w-[95vw] h-[95vh] top-10 right-0 mx-auto flex justify-end`, children: /* @__PURE__ */ jsxs("div", { className: ` ${toggle ? `bg-darkMode-100 ` : `bg-gray-200 `} p-5  h-[30vh] w-[40vw] rounded-lg flex`, children: [
      /* @__PURE__ */ jsx("h1", { className: "text-sm", children: "Dark mode?" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setToggle(!toggle), className: " h-10 flex justify-center items-center text-white p-2 rounded-lg text-2xl focus:outline-none", children: toggle ? /* @__PURE__ */ jsx(SunIconFilled, {}) : /* @__PURE__ */ jsx(SunIcon, {}) })
    ] }) })
  ] }) });
}
const pollutants = {
  pm2_5: {
    breakpoints: [0, 12, 35.4, 55.4, 150.4, 250.4, 350.4, 500.4],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500]
  },
  pm10: {
    breakpoints: [0, 54, 154, 254, 354, 424, 504, 604],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500]
  },
  o3: {
    breakpoints: [0, 0.053, 0.07, 0.085, 0.105, 0.12, 0.16, 0.2],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500]
  },
  co: {
    breakpoints: [0, 4.4, 9.4, 12.4, 15.4, 30.4, 40.4, 50.4],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500]
  },
  no2: {
    breakpoints: [0, 35, 75, 115, 150, 200, 250, 300],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500]
  },
  so2: {
    breakpoints: [0, 30, 75, 115, 155, 280, 365, 405],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500]
  }
};
function calculateAQI(pollutantData) {
  let maxAqi = 0;
  for (const [pollutant, values] of Object.entries(pollutants)) {
    const concentration = pollutantData.list[0].components[pollutant];
    const aqi = calculatePollutantAQI(concentration, values.breakpoints, values.cpoints);
    maxAqi = Math.max(maxAqi, aqi);
  }
  return maxAqi;
}
function calculatePollutantAQI(concentration, breakpoints, cpoints) {
  for (let i = 0; i < breakpoints.length - 1; i++) {
    if (concentration >= breakpoints[i] && concentration <= breakpoints[i + 1]) {
      return (cpoints[i + 1] - cpoints[i]) / (breakpoints[i + 1] - breakpoints[i]) * (concentration - breakpoints[i]) + cpoints[i];
    }
  }
  return 0;
}
function HighlightCard({ children, title, status }) {
  const { toggle } = useStore();
  return /* @__PURE__ */ jsxs("div", { className: `${toggle ? `bg-darkMode-200 text-white  ` : ` bg-white text-gray-700`} w-40 h-36 lg:w-44 lg:h-40  rounded-2xl xl:w-52 xl:h-48 lg:rounded-2xl flex flex-col gap-3 lg:gap-5 justify-between p-5`, children: [
    /* @__PURE__ */ jsx("h1", { className: "text-slate-400 text-sm md:text-md", children: title }),
    children,
    /* @__PURE__ */ jsx("h1", { className: "text-sm bg bg-green-100", children: status })
  ] });
}
function LoadingScreen() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center mt-4 w-full", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" }) }) });
}
function Highlights() {
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
    } else if (aqi >= 501 && aqi <= 1e3) {
      return "Very Hazardous ☠️";
    } else {
      return "Unknown 🤔";
    }
  };
  const visibilityStatus = () => {
    const visibility = weatherData ? weatherData[0].visibility : 0;
    if (weatherData && visibility >= 1e4) {
      return "Excellent 🌟";
    } else if (visibility >= 5e3 && visibility < 1e4) {
      return "Good 👍";
    } else if (visibility >= 1e3 && visibility < 5e3) {
      return "Moderate 👀";
    } else if (visibility >= 500 && visibility < 1e3) {
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
    if (pressure >= 0 && pressure < 1e3) {
      return "Low Pressure";
    } else if (pressure >= 1e3 && pressure < 2e3) {
      return "Normal Pressure";
    } else if (pressure >= 2e3 && pressure < 3e3) {
      return "High Pressure";
    } else {
      return "Very High Pressure";
    }
  };
  const getWindDirection = () => {
    const windDirection = weatherData ? weatherData[0].wind.deg : 0;
    const direction = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.floor(windDirection % 360 / 45);
    return direction[index];
  };
  return /* @__PURE__ */ jsx("div", { children: weatherData && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center sm:justify-normal gap-5  ", children: [
    /* @__PURE__ */ jsxs(HighlightCard, { title: "Air Quality", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-2xl lg:text-3xl", children: calculatedAQI.toFixed(0) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base", children: airQualityStatus() })
    ] }),
    /* @__PURE__ */ jsxs(HighlightCard, { title: "Humidity", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-2xl lg:text-3xl", children: [
        weatherData[0].main.humidity.toFixed(0),
        "%"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base", children: humidityStatus() })
    ] }),
    /* @__PURE__ */ jsxs(HighlightCard, { title: "Wind Status", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-2xl lg:text-3xl", children: [
        weatherData[0].wind.speed.toFixed(0),
        " km/h"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        toggle ? /* @__PURE__ */ jsx("img", { className: "invert", src: "https://img.icons8.com/ios/30/000000/compass.png", alt: "Compass Icon" }) : /* @__PURE__ */ jsx("img", { src: "https://img.icons8.com/ios/30/000000/compass.png", alt: "Compass Icon" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base", children: getWindDirection() })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(HighlightCard, { title: "Visibility", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-2xl lg:text-3xl", children: [
        weatherData[0].visibility / 1e3,
        " km"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base", children: visibilityStatus() })
    ] }),
    /* @__PURE__ */ jsxs(HighlightCard, { title: "Pressure", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-2xl lg:text-3xl", children: [
        weatherData[0].main.pressure,
        " hPa"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base", children: pressureStatus() })
    ] }),
    /* @__PURE__ */ jsx(HighlightCard, { title: "Sunrise & Sunset", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:text-lg flex items-center ", children: [
        toggle ? /* @__PURE__ */ jsx("img", { className: "invert", src: "https://img.icons8.com/ios-filled/30/000000/sunrise.png", alt: "" }) : /* @__PURE__ */ jsx("img", { className: "", src: "https://img.icons8.com/ios-filled/30/000000/sunrise.png", alt: "" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base", children: new Date(weatherData[0].sys.sunrise * 1e3).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:text-lg flex items-center ", children: [
        toggle ? /* @__PURE__ */ jsx("img", { className: "invert", src: "https://img.icons8.com/ios-filled/30/000000/sunset.png", alt: "" }) : /* @__PURE__ */ jsx("img", { className: "", src: "https://img.icons8.com/ios-filled/30/000000/sunset.png", alt: "" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base", children: new Date(weatherData[0].sys.sunset * 1e3).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) })
      ] })
    ] }) })
  ] }) }) || /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-96 ", children: /* @__PURE__ */ jsx(LoadingScreen, {}) }) });
}
function Sidebar() {
  var _a;
  const { weatherData, detectUserLocation: detectUserLocation2, userLocation } = useWeatherStore();
  const { toggle } = useStore();
  const rainProbability = () => {
    var _a2;
    const rainfall = ((_a2 = weatherData == null ? void 0 : weatherData[0].rain) == null ? void 0 : _a2["1h"]) || 0;
    if (rainfall >= 5) {
      return "100%";
    } else if (rainfall >= 2) {
      return "80%";
    } else if (rainfall >= 1) {
      return "50%";
    } else if (rainfall > 0) {
      return "30%";
    } else {
      return "0%";
    }
  };
  const weatherStatus = () => {
    const weather = weatherData == null ? void 0 : weatherData[0].weather[0].description;
    if (weather === "clear sky") {
      return "☀️ Clear sky";
    } else if (weather === "few clouds") {
      return "🌤️ Few clouds";
    } else if (weather === "scattered clouds") {
      return "🌥️ Scattered clouds";
    } else if (weather === "broken clouds") {
      return "☁️ Broken clouds";
    } else if (weather === "overcast clouds") {
      return "☁️ Overcast clouds";
    } else if (weather === "light rain") {
      return "🌦️ Light rain";
    } else if (weather === "moderate rain") {
      return "🌧️ Moderate rain";
    } else if (weather === "heavy intensity rain") {
      return "🌧️ Heavy rain";
    } else if (weather === "shower rain") {
      return "🌧️ Shower rain";
    } else if (weather === "thunderstorm") {
      return "⛈️ Thunderstorm";
    } else if (weather === "thunderstorm with light rain") {
      return "⛈️ Thunderstorm with light rain";
    } else if (weather === "thunderstorm with rain") {
      return "⛈️ Thunderstorm with rain";
    } else if (weather === "thunderstorm with heavy rain") {
      return "⛈️ Thunderstorm with heavy rain";
    } else if (weather === "snow") {
      return "❄️ Snow";
    } else if (weather === "light snow") {
      return "🌨️ Light snow";
    } else if (weather === "heavy snow") {
      return "🌨️ Heavy snow";
    } else if (weather === "sleet") {
      return "🌨️ Sleet";
    } else if (weather === "mist") {
      return "🌫️ Mist";
    } else if (weather === "smoke") {
      return "🌫️ Smoke";
    } else if (weather === "haze") {
      return "🌫️ Haze";
    } else if (weather === "fog") {
      return "🌫️ Fog";
    } else if (weather === "sand") {
      return "🌫️ Sand";
    } else if (weather === "dust") {
      return "🌫️ Dust";
    } else if (weather === "ash") {
      return "🌫️ Ash";
    } else if (weather === "squall") {
      return "🌬️ Squall";
    } else if (weather === "tornado") {
      return "🌪️ Tornado";
    } else {
      return weather;
    }
  };
  useEffect(() => {
    detectUserLocation2();
  }, [detectUserLocation2]);
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: ` ${toggle ? `bg-darkMode-300 text-white ` : `sm:bg-white text-gray-700 `} flex flex-col gap-10 min-h-screen h-full pt-2 px-2 sm:px-14 sm:w-[350px] w-screen`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-5", children: [
      /* @__PURE__ */ jsx(SearchBar, {}),
      /* @__PURE__ */ jsx("div", { className: "sm:hidden", children: /* @__PURE__ */ jsx(Header, {}) })
    ] }),
    /* @__PURE__ */ jsx("div", { children: weatherData && weatherData.length > 0 ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 p-10  border-b border-gray-400", children: [
      /* @__PURE__ */ jsx("p", { className: "text-7xl", children: (_a = weatherStatus()) == null ? void 0 : _a.split(" ")[0] }),
      /* @__PURE__ */ jsxs("h1", { className: "text-7xl", children: [
        weatherData[0].main.temp.toFixed(0),
        "°C"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("p", { children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric"
        }) })
      ] })
    ] }) }) : /* @__PURE__ */ jsx(Fragment, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-10 h-full", children: [
      weatherData && weatherData.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col px-5", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx("h1", { className: "text-xl", children: weatherStatus() }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 ", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xl", children: "🌧️" }),
          /* @__PURE__ */ jsxs("h1", { className: "text-xl", children: [
            "Rain - ",
            rainProbability()
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "h-20 rounded-md  text-2xl flex items-center justify-center p-3", children: /* @__PURE__ */ jsx("p", { children: "Loading..." }) }),
      /* @__PURE__ */ jsx("div", { className: "flex  gap-2 p-7 ", children: weatherData && weatherData.length > 0 ? /* @__PURE__ */ jsx("div", { className: toggle ? `bg-darkMode-200 text-white h-20 rounded-md text-2xl w-full flex items-center justify-center p-3` : `h-20 rounded-md text-2xl bg-gray-200 w-full flex items-center justify-center p-3`, children: /* @__PURE__ */ jsx("h2", { children: weatherData[0].name.substring(0, 10) }) }) : /* @__PURE__ */ jsx(Fragment, {}) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "sm:hidden pb-5 gap-3 ", children: /* @__PURE__ */ jsx(Highlights, {}) }) })
    ] })
  ] }) });
}
function WeekForecastCard({ day, icon, temp, children }) {
  const { toggle } = useStore();
  return /* @__PURE__ */ jsxs("div", { className: toggle ? `w-24 h-40 rounded-2xl bg-darkMode-200 text-white flex flex-col gap-5 justify-between p-5 ` : `w-24 h-40 rounded-2xl bg-white flex flex-col gap-5 justify-between p-5 text-gray-700`, children: [
    /* @__PURE__ */ jsx("h1", { children: day }),
    /* @__PURE__ */ jsx("div", { className: "text-4xl", children: icon }),
    children,
    /* @__PURE__ */ jsx("h1", { className: "text-xs", children: temp })
  ] });
}
const weekForecast = {
  week: [
    {
      day: "Sunday",
      date: "2025-01-05",
      temperature: {
        min: 2,
        max: 12
      },
      condition: "Clear",
      icon: "☀️"
    },
    {
      day: "Monday",
      date: "2024-12-30",
      temperature: {
        min: 15,
        max: 25
      },
      condition: "Sunny",
      icon: "☀️"
    },
    {
      day: "Tuesday",
      date: "2024-12-31",
      temperature: {
        min: 12,
        max: 22
      },
      condition: "Partly Cloudy",
      icon: "⛅️"
    },
    {
      day: "Wednesday",
      date: "2025-01-01",
      temperature: {
        min: 10,
        max: 20
      },
      condition: "Cloudy",
      icon: "☁️"
    },
    {
      day: "Thursday",
      date: "2025-01-02",
      temperature: {
        min: 8,
        max: 18
      },
      condition: "Rain",
      icon: "🌧️"
    },
    {
      day: "Friday",
      date: "2025-01-03",
      temperature: {
        min: 6,
        max: 16
      },
      condition: "Snow",
      icon: "❄️"
    },
    {
      day: "Saturday",
      date: "2025-01-04",
      temperature: {
        min: 4,
        max: 14
      },
      condition: "Foggy",
      icon: "🌫️"
    }
  ]
};
function WeekForecast() {
  const { week } = weekForecast;
  const { toggle } = useStore();
  const generateId = () => Math.floor(Math.random() * 1e3);
  return /* @__PURE__ */ jsxs("div", { className: " w-[31vw]  md:w-[50vw] lg:w-[57vw] xl:w-[60vw]  relative flex flex-col gap-8", children: [
    /* @__PURE__ */ jsx("h1", { className: toggle ? `text-white text-xl` : `text-gray-700 text-xl`, children: "Week Forecast" }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Swiper,
      {
        slidesPerView: 4,
        spaceBetween: 85,
        freeMode: true,
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 5
          },
          900: {
            slidesPerView: 4,
            spaceBetween: 40
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 10
          },
          1280: {
            slidesPerView: 7,
            spaceBetween: 10
          },
          1536: {
            slidesPerView: 7,
            spaceBetween: 10
          }
        },
        className: "mySwiper ",
        children: week.map((day) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(WeekForecastCard, { day: day.day.substring(0, 3), icon: day.icon, temp: `${day.temperature.min} ° - ${day.temperature.max} °` }) }, generateId()))
      }
    ) })
  ] });
}
function Dashboard() {
  const { toggle } = useStore();
  return /* @__PURE__ */ jsxs("div", { className: `${toggle ? `text-white ` : ``} flex flex-col gap-10 p-4 `, children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(WeekForecast, {}) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: toggle ? `text-white text-3xl` : `text-gray-700 text-3xl`, children: "Today's Weather" }) }),
    /* @__PURE__ */ jsx(Highlights, {})
  ] });
}
function Main() {
  const { toggle } = useStore();
  return /* @__PURE__ */ jsx("div", { className: `${toggle ? `bg-darkMode-100 ` : `bg-gray-100 `} overflow-y-scroll overflow-x-hidden min-h-screen h-full`, id: "main", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-10 w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-10 top-4 hidden sm:block z-20", children: /* @__PURE__ */ jsx(Header, {}) }),
    /* @__PURE__ */ jsx(Sidebar, {}),
    /* @__PURE__ */ jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsx(Dashboard, {}) })
  ] }) });
}
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Main, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-gV2k_UUR.js", "imports": ["/assets/chunk-D52XG6IA-ChLflW2D.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-CCqrRgU0.js", "imports": ["/assets/chunk-D52XG6IA-ChLflW2D.js", "/assets/with-props-BuTW7FIh.js"], "css": [] }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/home-uWzf5V4g.js", "imports": ["/assets/with-props-BuTW7FIh.js", "/assets/chunk-D52XG6IA-ChLflW2D.js"], "css": ["/assets/home-DPd3d4l0.css"] } }, "url": "/assets/manifest-7e0233cd.js", "version": "7e0233cd" };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false };
const isSpaMode = true;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  publicPath,
  routes
};
