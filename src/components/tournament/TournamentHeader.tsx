import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useStyles } from "../../styles/hooks/useStyles";

interface TournamentHeaderProps {
  onCreateTournament: () => void;
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  onCreateTournament,
}) => {
  const styles = useStyles();

  return (
    <Box sx={styles.headers.dashboard.container}>
      <Typography variant="h4" sx={styles.headers.dashboard.title}>
        Golf Tournaments
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateTournament}
        sx={{
          ...styles.button.primary,
          ...styles.button.create,
        }}
      >
        Create Tournament
      </Button>
    </Box>
  );
};

export default TournamentHeader;
