import React from "react";
import { Box, Typography, Chip, useMediaQuery, useTheme } from "@mui/material";
import { Round } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import WeatherDisplay from "./WeatherDisplay";
import { Weather } from "../../services/weatherService";

interface RoundHeaderProps {
  round: Round;
  weather?: Weather;
}

const RoundHeader: React.FC<RoundHeaderProps> = ({ round, weather }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const styles = useStyles();

  return (
    <>
      <Box sx={styles.tournamentRounds.header.container}>
        <Typography
          variant="h6"
          component="h3"
          sx={styles.tournamentRounds.header.title}
        >
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
            sx={styles.tournamentRounds.header.courseChip}
          />
        )}
      </Box>

      <Box sx={styles.tournamentRounds.header.chipsContainer}>
        <Chip
          label={`Format: ${round.format}`}
          size="small"
          sx={styles.tournamentRounds.header.formatChip}
        />

        <Chip
          label={`${round.courseDetails?.holes || 18} holes`}
          size="small"
          sx={styles.tournamentRounds.header.holesChip}
        />
      </Box>

      {weather && (
        <WeatherDisplay
          weather={weather}
          courseName={round.courseDetails?.name}
        />
      )}
    </>
  );
};

export default RoundHeader;
