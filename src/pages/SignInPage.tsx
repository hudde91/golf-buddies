import React from "react";
import { Navigate } from "react-router-dom";
import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Container, Box } from "@mui/material";

const SignInPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {/* TODO: Add SignedUp flow from Clerk */}
      <SignedIn>
        <Navigate to="/profile" replace />
      </SignedIn>
      <SignedOut>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            redirectUrl="/profile"
          />
        </Box>
      </SignedOut>
    </Container>
  );
};

export default SignInPage;
