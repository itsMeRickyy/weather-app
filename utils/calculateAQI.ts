interface PollutantData {
  co: number;
  nh3: number;
  no: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
  so2: number;
}

interface AQILevel {
  breakpoint: number;
  index: number;
}

const aqiLevels: AQILevel[] = [
  { breakpoint: 0, index: 0 },
  { breakpoint: 12, index: 50 },
  { breakpoint: 35.4, index: 100 },
  { breakpoint: 55.4, index: 150 },
  { breakpoint: 150.4, index: 200 },
  { breakpoint: 250.4, index: 300 },
  { breakpoint: 350.4, index: 400 },
  { breakpoint: 500.4, index: 500 },
];
import type { AirQualityDataType } from ".././types";

const pollutants: Record<string, { breakpoints: number[]; cpoints: number[] }> = {
  pm2_5: {
    breakpoints: [0, 12, 35.4, 55.4, 150.4, 250.4, 350.4, 500.4],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500],
  },
  pm10: {
    breakpoints: [0, 54, 154, 254, 354, 424, 504, 604],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500],
  },
  o3: {
    breakpoints: [0, 0.053, 0.07, 0.085, 0.105, 0.12, 0.16, 0.2],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500],
  },
  co: {
    breakpoints: [0, 4.4, 9.4, 12.4, 15.4, 30.4, 40.4, 50.4],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500],
  },
  no2: {
    breakpoints: [0, 35, 75, 115, 150, 200, 250, 300],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500],
  },
  so2: {
    breakpoints: [0, 30, 75, 115, 155, 280, 365, 405],
    cpoints: [0, 50, 100, 150, 200, 300, 400, 500],
  },
};

function calculateAQI(pollutantData: AirQualityDataType): number {
  let maxAqi = 0;

  for (const [pollutant, values] of Object.entries(pollutants)) {
    const concentration = pollutantData.list[0].components[pollutant as keyof PollutantData];
    const aqi = calculatePollutantAQI(concentration, values.breakpoints, values.cpoints);
    maxAqi = Math.max(maxAqi, aqi);
  }

  return maxAqi;
}

function calculatePollutantAQI(concentration: number, breakpoints: number[], cpoints: number[]): number {
  for (let i = 0; i < breakpoints.length - 1; i++) {
    if (concentration >= breakpoints[i] && concentration <= breakpoints[i + 1]) {
      return ((cpoints[i + 1] - cpoints[i]) / (breakpoints[i + 1] - breakpoints[i])) * (concentration - breakpoints[i]) + cpoints[i];
    }
  }
  return 0; // Handle cases where concentration is below the lowest breakpoint
}

export default calculateAQI;
