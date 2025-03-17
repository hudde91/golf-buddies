import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const LoadingState: React.FC = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        p: 3,
      }}
    >
      <CircularProgress sx={{ color: "white" }} />
      <Typography sx={{ mt: 2, color: "white" }}>
        Loading tournaments...
      </Typography>
    </Box>
  );
};

export default LoadingState;
