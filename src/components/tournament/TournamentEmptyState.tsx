import React from "react";
import { Box, Typography, Button, useTheme, alpha } from "@mui/material";
import { Add as AddIcon, EmojiEvents as TrophyIcon } from "@mui/icons-material";

interface TournamentEmptyStateProps {
  onCreateTournament: () => void;
}

const TournamentEmptyState: React.FC<TournamentEmptyStateProps> = ({
  onCreateTournament,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        backgroundColor: alpha(theme.palette.common.black, 0.2),
        borderRadius: 2,
        border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
      }}
    >
      <TrophyIcon
        sx={{
          fontSize: 60,
          color: alpha(theme.palette.common.white, 0.3),
          mb: 2,
        }}
      />
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        No Tournaments Yet
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: alpha(theme.palette.common.white, 0.7),
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
