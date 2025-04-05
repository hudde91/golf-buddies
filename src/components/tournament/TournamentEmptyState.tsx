import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon, EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useStyles } from "../../styles/hooks/useStyles";

interface TournamentEmptyStateProps {
  onCreateTournament: () => void;
}

const TournamentEmptyState: React.FC<TournamentEmptyStateProps> = ({
  onCreateTournament,
}) => {
  const styles = useStyles();

  return (
    <Box sx={styles.feedback.emptyState.container}>
      <TrophyIcon sx={styles.feedback.emptyState.icon} />
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.feedback.emptyState.title}
      >
        No Tournaments Yet
      </Typography>
      <Typography
        variant="body2"
        sx={{
          ...styles.feedback.emptyState.description,
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
        sx={styles.button.primary}
      >
        Create First Tournament
      </Button>
    </Box>
  );
};

export default TournamentEmptyState;
