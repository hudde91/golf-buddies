import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { Box, Container, Typography, Paper } from "@mui/material";

const SignUpPage: React.FC = () => {
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
          Create your Golf Buddies Account
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
          textAlign="center"
        >
          Join our community to create and participate in golf events with your
          friends
        </Typography>

        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            redirectUrl="/events"
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUpPage;
