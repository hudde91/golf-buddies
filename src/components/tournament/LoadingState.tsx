import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useStyles } from "../../styles/hooks/useStyles";

const LoadingState: React.FC = () => {
  const styles = useStyles();

  return (
    <Box sx={styles.feedback.loading.container}>
      <CircularProgress sx={styles.feedback.loading.icon} />
      <Typography sx={styles.feedback.loading.text}>
        Loading tournaments...
      </Typography>
    </Box>
  );
};

export default LoadingState;
