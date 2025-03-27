import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon, EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useTournamentStyles } from "../../theme/hooks";

interface TournamentEmptyStateProps {
  onCreateTournament: () => void;
}

const TournamentEmptyState: React.FC<TournamentEmptyStateProps> = ({
  onCreateTournament,
}) => {
  const styles = useTournamentStyles();

  return (
    <Box sx={styles.emptyState}>
      <TrophyIcon sx={styles.emptyStateIcon} />
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.tournamentTypography.title}
      >
        No Tournaments Yet
      </Typography>
      <Typography
        variant="body2"
        sx={{
          ...styles.tournamentTypography.muted,
          mb: 3,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        Create a new tournament or accept invitations to get started.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateTournament}
      >
        Create First Tournament
      </Button>
    </Box>
  );
};

export default TournamentEmptyState;
