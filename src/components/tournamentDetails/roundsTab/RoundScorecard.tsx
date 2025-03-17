import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  WbSunny as SunnyIcon,
  Cloud as CloudyIcon,
  Opacity as RainIcon,
  AcUnit as SnowIcon,
  Air as WindIcon,
  Thermostat as TempIcon,
  Opacity,
} from "@mui/icons-material";
import { Round, Player, HoleScore } from "../../../types/tournament";

interface RoundScorecardProps {
  round: Round;
  players: Player[];
  isCreator: boolean;
  onUpdateScores: (
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ) => void;
}

interface Weather {
  condition: string;
  temperature: number; // in Celsius
  windSpeed: number; // in km/h
  humidity: number;
  icon: string;
  loading: boolean;
  error: string | null;
}

// Mock function to get weather - replace with actual API in production
const fetchWeather = async (
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

const RoundScorecard: React.FC<RoundScorecardProps> = ({
  round,
  players,
  isCreator,
  onUpdateScores,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editScores, setEditScores] = useState<HoleScore[]>([]);

  const [weather, setWeather] = useState<Weather>({
    condition: "",
    temperature: 0,
    windSpeed: 0,
    humidity: 0,
    icon: "",
    loading: false,
    error: null,
  });

  // Fetch weather data when component mounts or round changes
  useEffect(() => {
    const getWeather = async () => {
      // Only fetch if we have both location and date
      if (round.courseDetails?.name && round.date) {
        setWeather((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const result = await fetchWeather(
            round.courseDetails.name,
            round.date
          );
          setWeather(result);
        } catch (error) {
          setWeather((prev) => ({
            ...prev,
            loading: false,
            error: "Could not load weather data",
          }));
        }
      }
    };

    getWeather();
  }, [round.courseDetails?.name, round.date]);

  // Generate holes array
  const holes = Array.from(
    { length: round.courseDetails?.holes || 18 },
    (_, i) => i + 1
  );

  // Calculate totals
  const calculateTotal = (playerId: string): number => {
    if (!round.scores[playerId]) return 0;

    return round.scores[playerId].reduce((total, hole) => {
      return total + (hole.score || 0);
    }, 0);
  };

  const calculateParTotal = (): number => {
    if (!round.courseDetails?.par) return 0;
    return round.courseDetails.par;
  };

  const handleStartEdit = (playerId: string) => {
    setEditingPlayerId(playerId);
    setEditScores([...round.scores[playerId]]);
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
    setEditScores([]);
  };

  const handleSaveScores = () => {
    if (!editingPlayerId) return;

    onUpdateScores(round.id, editingPlayerId, editScores);
    setEditingPlayerId(null);
    setEditScores([]);
  };

  const handleScoreChange = (holeIndex: number, value: string) => {
    const numValue = value === "" ? undefined : parseInt(value, 10);

    setEditScores((prev) => {
      const newScores = [...prev];
      newScores[holeIndex] = {
        ...newScores[holeIndex],
        score: numValue,
      };
      return newScores;
    });
  };

  // Split holes into front 9 and back 9 (or appropriate splits for other hole counts)
  const getHoleSections = () => {
    const totalHoles = round.courseDetails?.holes || 18;

    if (isXsScreen) {
      // For extra small screens, split into even smaller chunks
      if (totalHoles === 18) {
        return [
          { label: "Holes 1-6", holes: holes.slice(0, 6) },
          { label: "Holes 7-12", holes: holes.slice(6, 12) },
          { label: "Holes 13-18", holes: holes.slice(12, 18) },
        ];
      } else if (totalHoles === 9) {
        return [
          { label: "Holes 1-5", holes: holes.slice(0, 5) },
          { label: "Holes 6-9", holes: holes.slice(5, 9) },
        ];
      } else if (totalHoles > 18) {
        // Split into chunks of 6 for larger hole counts
        const sections = [];
        for (let i = 0; i < totalHoles; i += 6) {
          const end = Math.min(i + 6, totalHoles);
          sections.push({
            label: `Holes ${i + 1}-${end}`,
            holes: holes.slice(i, end),
          });
        }
        return sections;
      }
    } else if (isMobile) {
      // For regular mobile screens, use slightly larger chunks
      if (totalHoles === 18) {
        return [
          { label: "Front 9", holes: holes.slice(0, 9) },
          { label: "Back 9", holes: holes.slice(9, 18) },
        ];
      } else if (totalHoles === 9) {
        return [{ label: "Holes", holes: holes }];
      } else if (totalHoles === 27) {
        return [
          { label: "First 9", holes: holes.slice(0, 9) },
          { label: "Second 9", holes: holes.slice(9, 18) },
          { label: "Third 9", holes: holes.slice(18, 27) },
        ];
      } else if (totalHoles === 36) {
        return [
          { label: "First 9", holes: holes.slice(0, 9) },
          { label: "Second 9", holes: holes.slice(9, 18) },
          { label: "Third 9", holes: holes.slice(18, 27) },
          { label: "Fourth 9", holes: holes.slice(27, 36) },
        ];
      }
    } else {
      // Desktop view
      if (totalHoles <= 9) {
        return [{ label: "Holes", holes: holes }];
      } else if (totalHoles === 18) {
        return [
          { label: "Front 9", holes: holes.slice(0, 9) },
          { label: "Back 9", holes: holes.slice(9, 18) },
        ];
      } else if (totalHoles === 27) {
        return [
          { label: "First 9", holes: holes.slice(0, 9) },
          { label: "Second 9", holes: holes.slice(9, 18) },
          { label: "Third 9", holes: holes.slice(18, 27) },
        ];
      } else if (totalHoles === 36) {
        return [
          { label: "First 9", holes: holes.slice(0, 9) },
          { label: "Second 9", holes: holes.slice(9, 18) },
          { label: "Third 9", holes: holes.slice(18, 27) },
          { label: "Fourth 9", holes: holes.slice(27, 36) },
        ];
      }
    }

    // Default fallback - just show all holes
    return [{ label: "Holes", holes: holes }];
  };

  const sections = getHoleSections();

  // Get score relative to par for visual indicators
  const getScoreClass = (score?: number, par?: number): string => {
    if (score === undefined || par === undefined) return "";

    if (score < par - 1) return "eagle"; // Eagle or better
    if (score === par - 1) return "birdie"; // Birdie
    if (score === par) return "par"; // Par
    if (score === par + 1) return "bogey"; // Bogey
    return "double-bogey"; // Double bogey or worse
  };

  // Get weather icon component based on condition
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

  // Format temperature in Celsius only
  const formatTemperature = (celsius: number) => {
    return `${celsius}°C`;
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mb: 2,
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
        }}
      >
        <Typography variant="h6" component="h3" sx={{ color: "white" }}>
          {round.name} - {new Date(round.date).toLocaleDateString()}
        </Typography>

        {round.courseDetails?.name && (
          <Chip
            label={`${round.courseDetails.name} ${
              round.courseDetails.par ? `(Par ${round.courseDetails.par})` : ""
            }`}
            color="primary"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
          />
        )}
      </Box>

      {/* Weather Display */}
      {round.courseDetails?.name && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 3,
            mt: 1,
            p: 2,
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.common.black, 0.3),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: "white", fontWeight: "medium" }}
          >
            Course Conditions:
          </Typography>

          {weather.loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <Typography
                variant="body2"
                sx={{ color: alpha(theme.palette.common.white, 0.7) }}
              >
                Loading weather data...
              </Typography>
            </Box>
          ) : weather.error ? (
            <Typography
              variant="body2"
              sx={{ color: alpha(theme.palette.common.white, 0.7) }}
            >
              {weather.error}
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 2, md: 3 },
                alignItems: "center",
              }}
            >
              <Tooltip title="Weather Condition">
                <Chip
                  icon={getWeatherIcon()}
                  label={weather.condition}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.light,
                    borderColor: alpha(theme.palette.info.light, 0.3),
                    "& .MuiChip-icon": {
                      color: "inherit",
                    },
                  }}
                />
              </Tooltip>

              <Tooltip title="Temperature">
                <Chip
                  icon={<TempIcon />}
                  label={formatTemperature(weather.temperature)}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.light,
                    borderColor: alpha(theme.palette.warning.light, 0.3),
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
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.light,
                    borderColor: alpha(theme.palette.success.light, 0.3),
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
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.light,
                    borderColor: alpha(theme.palette.primary.light, 0.3),
                    "& .MuiChip-icon": {
                      color: "inherit",
                    },
                  }}
                />
              </Tooltip>
            </Box>
          )}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
          justifyContent: { xs: "flex-start", sm: "flex-end" },
        }}
      >
        <Chip
          label={`Format: ${round.format}`}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.light,
            border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
          }}
        />

        <Chip
          label={`${round.courseDetails?.holes || 18} holes`}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            color: theme.palette.secondary.light,
            border: `1px solid ${alpha(theme.palette.secondary.light, 0.3)}`,
          }}
        />
      </Box>

      {sections.map((section, sectionIndex) => (
        <Box key={`section-${sectionIndex}`} sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              borderBottom: `1px solid ${alpha(
                theme.palette.common.white,
                0.1
              )}`,
              pb: 1,
            }}
          >
            {section.label}
          </Typography>

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              overflowX: "auto",
              bgcolor: "transparent",
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              borderRadius: 1,
              boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.3)}`,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      minWidth: { xs: 100, sm: 150 },
                      color: alpha(theme.palette.common.white, 0.9),
                      borderBottomColor: alpha(theme.palette.common.white, 0.2),
                      borderRightColor: alpha(theme.palette.common.white, 0.2),
                      bgcolor: alpha(theme.palette.common.black, 0.4),
                    }}
                  >
                    Player
                  </TableCell>
                  {section.holes.map((holeNum) => (
                    <TableCell
                      key={`hole-${holeNum}`}
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        width: 50,
                        color: alpha(theme.palette.common.white, 0.9),
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.2
                        ),
                        bgcolor: alpha(theme.palette.common.black, 0.4),
                      }}
                    >
                      {holeNum}
                    </TableCell>
                  ))}
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: alpha(theme.palette.common.white, 0.9),
                      borderBottomColor: alpha(theme.palette.common.white, 0.2),
                      bgcolor: alpha(theme.palette.common.black, 0.4),
                    }}
                  >
                    {section.label === "Holes" ? "Total" : "Sub"}
                  </TableCell>
                  {sectionIndex === sections.length - 1 && (
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: alpha(theme.palette.common.white, 0.9),
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.2
                        ),
                        bgcolor: alpha(theme.palette.common.black, 0.4),
                      }}
                    >
                      Total
                    </TableCell>
                  )}
                  {isCreator && (
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: alpha(theme.palette.common.white, 0.9),
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.2
                        ),
                        bgcolor: alpha(theme.palette.common.black, 0.4),
                        minWidth: 100,
                      }}
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Par row (if available) */}
                {round.courseDetails?.par && (
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        bgcolor: alpha(theme.palette.common.black, 0.2),
                        color: alpha(theme.palette.common.white, 0.9),
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.1
                        ),
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ color: alpha(theme.palette.common.white, 0.9) }}
                      >
                        Par
                      </Typography>
                    </TableCell>

                    {section.holes.map((holeNum) => {
                      const holeIndex = holeNum - 1;
                      const parValue =
                        round.scores[Object.keys(round.scores)[0]]?.[holeIndex]
                          ?.par ||
                        Math.floor(
                          round.courseDetails!.par! / round.courseDetails!.holes
                        );

                      return (
                        <TableCell
                          key={`par-hole-${holeNum}`}
                          align="center"
                          sx={{
                            bgcolor: alpha(theme.palette.common.black, 0.2),
                            color: alpha(theme.palette.common.white, 0.9),
                            borderBottomColor: alpha(
                              theme.palette.common.white,
                              0.1
                            ),
                          }}
                        >
                          {parValue || "-"}
                        </TableCell>
                      );
                    })}

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: alpha(theme.palette.common.black, 0.2),
                        color: alpha(theme.palette.common.white, 0.9),
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.1
                        ),
                      }}
                    >
                      {Math.floor(calculateParTotal() / sections.length)}
                    </TableCell>

                    {sectionIndex === sections.length - 1 && (
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          bgcolor: alpha(theme.palette.common.black, 0.2),
                          color: alpha(theme.palette.common.white, 0.9),
                          borderBottomColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                        }}
                      >
                        {calculateParTotal()}
                      </TableCell>
                    )}

                    {isCreator && (
                      <TableCell
                        sx={{
                          bgcolor: alpha(theme.palette.common.black, 0.2),
                          borderBottomColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                        }}
                      />
                    )}
                  </TableRow>
                )}

                {/* Player Scores */}
                {players.map((player, playerIndex) => {
                  const playerScores = round.scores[player.id] || [];
                  const sectionTotal = section.holes.reduce(
                    (total, holeNum) => {
                      const holeIndex = holeNum - 1;
                      return total + (playerScores[holeIndex]?.score || 0);
                    },
                    0
                  );
                  const totalScore = calculateTotal(player.id);

                  return (
                    <TableRow
                      key={`player-${player.id}`}
                      sx={{
                        bgcolor:
                          playerIndex % 2 === 0
                            ? alpha(theme.palette.common.black, 0.1)
                            : "transparent",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          borderBottomColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                          color: alpha(theme.palette.common.white, 0.9),
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={player.avatarUrl}
                            alt={player.name}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: alpha(theme.palette.common.white, 0.9),
                            }}
                          >
                            {player.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      {section.holes.map((holeNum) => {
                        const holeIndex = holeNum - 1;
                        const holeScore = playerScores[holeIndex];
                        const score = holeScore?.score;
                        const par = holeScore?.par;
                        const scoreClass = getScoreClass(score, par);

                        return (
                          <TableCell
                            key={`player-${player.id}-hole-${holeNum}`}
                            align="center"
                            sx={{
                              position: "relative",
                              p: { xs: 0.5, sm: 1 },
                              minWidth: "40px",
                              borderBottomColor: alpha(
                                theme.palette.common.white,
                                0.1
                              ),
                              color: alpha(theme.palette.common.white, 0.9),
                            }}
                          >
                            {editingPlayerId === player.id ? (
                              <TextField
                                type="number"
                                value={
                                  editScores[holeIndex]?.score === undefined
                                    ? ""
                                    : editScores[holeIndex].score
                                }
                                onChange={(e) =>
                                  handleScoreChange(holeIndex, e.target.value)
                                }
                                InputProps={{
                                  inputProps: {
                                    min: 1,
                                    max: 15,
                                    style: {
                                      textAlign: "center",
                                      padding: "5px 0",
                                      width: "35px",
                                      color: "white",
                                    },
                                  },
                                  sx: {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor: alpha(
                                        theme.palette.common.white,
                                        0.3
                                      ),
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                      {
                                        borderColor: alpha(
                                          theme.palette.common.white,
                                          0.5
                                        ),
                                      },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        borderColor: theme.palette.primary.main,
                                      },
                                  },
                                }}
                                variant="standard"
                                size="small"
                              />
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  position: "relative",
                                  width: { xs: "24px", sm: "30px" },
                                  height: { xs: "24px", sm: "30px" },
                                  mx: "auto",
                                  ...(scoreClass === "eagle" && {
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      width: { xs: "20px", sm: "26px" },
                                      height: { xs: "20px", sm: "26px" },
                                      borderRadius: "50%",
                                      border: "1px solid #d32f2f",
                                    },
                                    "&::after": {
                                      content: '""',
                                      position: "absolute",
                                      width: { xs: "26px", sm: "32px" },
                                      height: { xs: "26px", sm: "32px" },
                                      borderRadius: "50%",
                                      border: "1px solid #d32f2f",
                                    },
                                  }),
                                  ...(scoreClass === "birdie" && {
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      width: { xs: "22px", sm: "28px" },
                                      height: { xs: "22px", sm: "28px" },
                                      borderRadius: "50%",
                                      border: "1px solid #d32f2f",
                                    },
                                  }),
                                  ...(scoreClass === "bogey" && {
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      width: { xs: "22px", sm: "28px" },
                                      height: { xs: "22px", sm: "28px" },
                                      border: "1px solid #757575",
                                    },
                                  }),
                                  ...(scoreClass === "double-bogey" && {
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      width: { xs: "20px", sm: "26px" },
                                      height: { xs: "20px", sm: "26px" },
                                      border: "1px solid #757575",
                                    },
                                    "&::after": {
                                      content: '""',
                                      position: "absolute",
                                      width: { xs: "26px", sm: "32px" },
                                      height: { xs: "26px", sm: "32px" },
                                      border: "1px solid #757575",
                                    },
                                  }),
                                  color: alpha(theme.palette.common.white, 0.9),
                                }}
                              >
                                {score === undefined ? "-" : score}
                              </Box>
                            )}
                          </TableCell>
                        );
                      })}

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          borderBottomColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                          color: alpha(theme.palette.common.white, 0.9),
                        }}
                      >
                        {sectionTotal > 0 ? sectionTotal : "-"}
                      </TableCell>

                      {sectionIndex === sections.length - 1 && (
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: "bold",
                            borderBottomColor: alpha(
                              theme.palette.common.white,
                              0.1
                            ),
                            color: alpha(theme.palette.common.white, 0.9),
                          }}
                        >
                          {totalScore > 0 ? totalScore : "-"}
                        </TableCell>
                      )}

                      {isCreator && (
                        <TableCell
                          align="center"
                          sx={{
                            borderBottomColor: alpha(
                              theme.palette.common.white,
                              0.1
                            ),
                          }}
                        >
                          {editingPlayerId === player.id ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={handleSaveScores}
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                color="default"
                                size="small"
                                onClick={handleCancelEdit}
                                sx={{
                                  color: alpha(theme.palette.common.white, 0.7),
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.common.white,
                                      0.1
                                    ),
                                  },
                                }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleStartEdit(player.id)}
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.2
                                  ),
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default RoundScorecard;
