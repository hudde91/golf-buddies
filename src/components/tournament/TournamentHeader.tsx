import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface TournamentHeaderProps {
  onCreateTournament: () => void;
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  onCreateTournament,
}) => {
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
      <Typography variant="h4" sx={{ color: "white", fontWeight: 500 }}>
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
