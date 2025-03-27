import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTournamentStyles } from "../../theme/hooks";

interface TournamentHeaderProps {
  onCreateTournament: () => void;
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  onCreateTournament,
}) => {
  const styles = useTournamentStyles();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        mb: 3,
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={styles.tournamentTypography.header}>
        Golf Tournaments
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateTournament}
        sx={{
          alignSelf: { xs: "stretch", sm: "auto" },
          boxShadow: 3,
        }}
      >
        Create Tournament
      </Button>
    </Box>
  );
};

export default TournamentHeader;
