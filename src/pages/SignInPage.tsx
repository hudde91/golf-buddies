import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { Box, Container, Typography, Paper, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const SignInPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Sign In to Golf Buddies
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={2}
          textAlign="center"
        >
          Welcome back! Sign in to access your golf events and competitions
        </Typography>

        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            redirectUrl="/events"
          />

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/sign-up" fontWeight="medium">
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignInPage;
