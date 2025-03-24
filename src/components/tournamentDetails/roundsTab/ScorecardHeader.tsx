import React from "react";
import { Box, Typography, Chip, useMediaQuery, useTheme } from "@mui/material";
import { Round } from "../../../types/event";
import { useTournamentScorecardStyles } from "../../../theme/hooks";

interface ScorecardHeaderProps {
  round: Round;
}

const ScorecardHeader: React.FC<ScorecardHeaderProps> = ({ round }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const styles = useTournamentScorecardStyles();

  return (
    <>
      <Box sx={styles.header.container}>
        <Typography variant="h6" component="h3" sx={styles.header.title}>
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
            sx={styles.header.courseChip}
          />
        )}
      </Box>

      <Box sx={styles.header.chipsContainer}>
        <Chip
          label={`Format: ${round.format}`}
          size="small"
          sx={styles.header.formatChip}
        />

        <Chip
          label={`${round.courseDetails?.holes || 18} holes`}
          size="small"
          sx={styles.header.holesChip}
        />
      </Box>
    </>
  );
};

export default ScorecardHeader;
