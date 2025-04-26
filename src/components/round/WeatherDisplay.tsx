import React from "react";
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  WbSunny as SunnyIcon,
  Cloud as CloudyIcon,
  Opacity as RainIcon,
  AcUnit as SnowIcon,
  Air as WindIcon,
  Thermostat as TempIcon,
  Opacity,
} from "@mui/icons-material";
import { Weather } from "../../services/weatherService";
import { useStyles } from "../../styles/hooks/useStyles";

interface WeatherDisplayProps {
  weather: Weather;
  courseName?: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  weather,
  courseName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const styles = useStyles();

  const getWeatherIcon = () => {
    switch (weather.icon) {
      case "sunny":
        return <SunnyIcon sx={{ color: "#FFD700" }} />;
      case "cloudy":
        return <CloudyIcon sx={{ color: "#B0C4DE" }} />;
      case "rain":
        return <RainIcon sx={{ color: "#4682B4" }} />;
      case "snow":
        return <SnowIcon sx={{ color: "#F0F8FF" }} />;
      case "windy":
        return <WindIcon sx={{ color: "#87CEEB" }} />;
      default:
        return <SunnyIcon sx={{ color: "#FFD700" }} />;
    }
  };

  if (!courseName) return null;

  return (
    <Box sx={styles.tournamentRounds.weather.container}>
      <Typography
        variant="subtitle1"
        sx={styles.tournamentRounds.weather.title}
      >
        Course Conditions:
      </Typography>

      {weather.loading ? (
        <Box sx={styles.tournamentRounds.weather.loading}>
          <CircularProgress size={20} color="inherit" />
          <Typography variant="body2">Loading weather data...</Typography>
        </Box>
      ) : weather.error ? (
        <Typography variant="body2" sx={styles.tournamentRounds.weather.error}>
          {weather.error}
        </Typography>
      ) : (
        <Box sx={styles.tournamentRounds.weather.chipsContainer}>
          <Tooltip title="Weather Condition">
            <Chip
              icon={getWeatherIcon()}
              label={weather.condition}
              size={isMobile ? "small" : "medium"}
              sx={styles.tournamentRounds.weather.chips.condition}
            />
          </Tooltip>

          <Tooltip title="Temperature">
            <Chip
              icon={<TempIcon />}
              label={`${weather.temperature}°C`}
              size={isMobile ? "small" : "medium"}
              sx={styles.tournamentRounds.weather.chips.temperature}
            />
          </Tooltip>

          <Tooltip title="Wind Speed">
            <Chip
              icon={<WindIcon />}
              label={`${weather.windSpeed} km/h`}
              size={isMobile ? "small" : "medium"}
              sx={styles.tournamentRounds.weather.chips.wind}
            />
          </Tooltip>

          <Tooltip title="Humidity">
            <Chip
              icon={<Opacity />}
              label={`${weather.humidity}%`}
              size={isMobile ? "small" : "medium"}
              sx={styles.tournamentRounds.weather.chips.humidity}
            />
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default WeatherDisplay;
