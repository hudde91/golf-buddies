import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { text, button } from "../styles";

const NotFound: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h1" component="h1" sx={text.notFoundTitle}>
        404
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontSize: "1.5rem",
          color: theme.palette.common.white,
          mb: 2,
        }}
      >
        Page Not Found
      </Typography>
      <Typography paragraph sx={text.body.secondary(theme)}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
          sx={button.primary(theme)}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
