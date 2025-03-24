import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useTournamentStyles } from "../../theme/hooks";

interface NotFoundViewProps {
  onBackClick: () => void;
}

const NotFoundView: React.FC<NotFoundViewProps> = ({ onBackClick }) => {
  const styles = useTournamentStyles();

  return (
    <Box sx={styles.loadingState}>
      <Container maxWidth="md">
        <Box sx={styles.tournamentCard}>
          <Typography variant="h5" sx={{ color: "error.light", mb: 2 }}>
            Tournament not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackClick}
            variant="outlined"
            sx={styles.outlinedButton}
          >
            Back to Tournaments
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundView;
