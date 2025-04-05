import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useStyles } from "../../styles/hooks/useStyles";

interface RoundHeaderProps {
  onCreateRound: () => void;
}

const RoundHeader: React.FC<RoundHeaderProps> = ({ onCreateRound }) => {
  const styles = useStyles();

  return (
    <Box sx={styles.headers.dashboard.container}>
      <Typography variant="h4" sx={styles.headers.dashboard.title}>
        Golf Rounds
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateRound}
        sx={{
          ...styles.button.primary,
          ...styles.button.create,
        }}
      >
        Create Round
      </Button>
    </Box>
  );
};

export default RoundHeader;
