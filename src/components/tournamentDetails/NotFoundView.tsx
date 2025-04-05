import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useStyles } from "../../styles/hooks/useStyles";

interface NotFoundViewProps {
  onBackClick: () => void;
}

const NotFoundView: React.FC<NotFoundViewProps> = ({ onBackClick }) => {
  const styles = useStyles();

  return (
    <Box sx={styles.feedback.loading.container}>
      <Container maxWidth="md">
        <Box sx={styles.card.glass}>
          <Typography variant="h5" sx={{ color: "error.light", mb: 2 }}>
            Tournament not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackClick}
            variant="outlined"
            sx={styles.button.outlined}
          >
            Back to Tournaments
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundView;
