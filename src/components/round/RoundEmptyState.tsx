import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon, GolfCourse as GolfIcon } from "@mui/icons-material";
import { useStyles } from "../../styles/hooks/useStyles";

interface RoundEmptyStateProps {
  onCreateRound: () => void;
}

const RoundEmptyState: React.FC<RoundEmptyStateProps> = ({ onCreateRound }) => {
  const styles = useStyles();

  return (
    <Box sx={styles.feedback.emptyState.container}>
      <GolfIcon sx={styles.feedback.emptyState.icon} />
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.feedback.emptyState.title}
      >
        No Rounds Yet
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
        Create a new round or accept invitations to get started.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateRound}
        sx={styles.button.primary}
      >
        Create First Round
      </Button>
    </Box>
  );
};

export default RoundEmptyState;
