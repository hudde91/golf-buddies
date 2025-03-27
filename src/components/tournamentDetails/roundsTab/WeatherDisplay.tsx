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
import { Weather } from "../../../services/weatherService";
import { useTournamentScorecardStyles } from "../../../theme/hooks";

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
  const styles = useTournamentScorecardStyles();

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
    <Box sx={styles.weather.container}>
      <Typography variant="subtitle1" sx={styles.weather.title}>
        Course Conditions:
      </Typography>

      {weather.loading ? (
        <Box sx={styles.weather.loading}>
          <CircularProgress size={20} color="inherit" />
          <Typography variant="body2">Loading weather data...</Typography>
        </Box>
      ) : weather.error ? (
        <Typography variant="body2" sx={styles.weather.error}>
          {weather.error}
        </Typography>
      ) : (
        <Box sx={styles.weather.chipsContainer}>
          <Tooltip title="Weather Condition">
            <Chip
              icon={getWeatherIcon()}
              label={weather.condition}
              size={isMobile ? "small" : "medium"}
              sx={{
                bgcolor: `rgba(${theme.palette.info.main}, 0.1)`,
                color: theme.palette.info.light,
                borderColor: `rgba(${theme.palette.info.light}, 0.3)`,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Tooltip>

          <Tooltip title="Temperature">
            <Chip
              icon={<TempIcon />}
              label={`${weather.temperature}°C`}
              size={isMobile ? "small" : "medium"}
              sx={{
                bgcolor: `rgba(${theme.palette.warning.main}, 0.1)`,
                color: theme.palette.warning.light,
                borderColor: `rgba(${theme.palette.warning.light}, 0.3)`,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Tooltip>

          <Tooltip title="Wind Speed">
            <Chip
              icon={<WindIcon />}
              label={`${weather.windSpeed} km/h`}
              size={isMobile ? "small" : "medium"}
              sx={{
                bgcolor: `rgba(${theme.palette.success.main}, 0.1)`,
                color: theme.palette.success.light,
                borderColor: `rgba(${theme.palette.success.light}, 0.3)`,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Tooltip>

          <Tooltip title="Humidity">
            <Chip
              icon={<Opacity />}
              label={`${weather.humidity}%`}
              size={isMobile ? "small" : "medium"}
              sx={{
                bgcolor: `rgba(${theme.palette.primary.main}, 0.1)`,
                color: theme.palette.primary.light,
                borderColor: `rgba(${theme.palette.primary.light}, 0.3)`,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default WeatherDisplay;
