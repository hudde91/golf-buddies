import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

interface NotFoundViewProps {
  onBackClick: () => void;
}

const NotFoundView: React.FC<NotFoundViewProps> = ({ onBackClick }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
        minHeight: "calc(100vh - 64px)",
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.common.black, 0.3),
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: "error.light", mb: 2 }}>
            Tournament not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackClick}
            variant="outlined"
            sx={{
              color: "white",
              borderColor: alpha(theme.palette.common.white, 0.3),
              "&:hover": {
                borderColor: "white",
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            Back to Tournaments
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundView;
