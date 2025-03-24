import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTournamentStyles } from "../../theme/hooks";

const LoadingState: React.FC = () => {
  const styles = useTournamentStyles();

  return (
    <Box sx={styles.loadingState}>
      <CircularProgress sx={{ color: "white" }} />
      <Typography sx={{ mt: 2, color: "white" }}>
        Loading tournaments...
      </Typography>
    </Box>
  );
};

export default LoadingState;
