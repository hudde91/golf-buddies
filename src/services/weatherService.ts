// Mock function to get weather - replace with actual API in production
export interface Weather {
  condition: string;
  temperature: number; // in Celsius
  windSpeed: number; // in km/h
  humidity: number;
  icon: string;
  loading: boolean;
  error: string | null;
}

export const fetchWeather = async (
  location: string,
  date: string
): Promise<Weather> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Parse the location (assuming format: "CourseName, City, Country")
  const locationParts = location.split(", ");
  const city = locationParts.length > 1 ? locationParts[1] : "";
  const country = locationParts.length > 2 ? locationParts[2] : "";

  // Mock weather data
  const weatherConditions = [
    "Sunny",
    "Partly Cloudy",
    "Cloudy",
    "Light Rain",
    "Rainy",
    "Windy",
  ];
  const randomCondition =
    weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

  // Generate realistic temperature based on randomness but also considering location (in Celsius)
  let baseTemp = 21; // Default base in Celsius (around 70F)
  if (
    country.includes("Scotland") ||
    country.includes("Ireland") ||
    country.includes("UK")
  ) {
    baseTemp = 15; // Cooler for UK regions (around 60F)
  } else if (country.includes("Australia")) {
    baseTemp = 27; // Warmer for Australia (around 80F)
  }

  // Adjust based on random factor
  const tempVariation = Math.floor(Math.random() * 10) - 5;
  const temperature = baseTemp + tempVariation;

  // Generate wind speed in km/h
  const windSpeed = Math.floor(Math.random() * 30) + 8;

  // Generate humidity
  const humidity = Math.floor(Math.random() * 40) + 40;

  let icon = "sunny";
  if (randomCondition.includes("Cloudy")) icon = "cloudy";
  if (randomCondition.includes("Rain")) icon = "rain";
  if (randomCondition.includes("Windy")) icon = "windy";

  return {
    condition: randomCondition,
    temperature,
    windSpeed,
    humidity,
    icon,
    loading: false,
    error: null,
  };
};

export const getInitialWeatherState = (): Weather => {
  return {
    condition: "",
    temperature: 0,
    windSpeed: 0,
    humidity: 0,
    icon: "",
    loading: false,
    error: null,
  };
};
