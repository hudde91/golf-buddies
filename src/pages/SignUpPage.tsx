import React, { useEffect } from "react";
import { SignUp, useSignUp, useClerk } from "@clerk/clerk-react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../services/profileService";

const SignUpPage: React.FC = () => {
  // const navigate = useNavigate();
  // const { isLoaded, signUp, setActive } = useSignUp();
  // const { client } = useClerk();
  // const createUserMutation = useCreateUser();

  // Monitor the signUp.status to detect when sign-up is complete
  // useEffect(() => {
  //   if (!isLoaded) return;

  //   const handleSignUpComplete = async () => {
  //     // Check if the user has completed sign-up or has a user ID
  //     if (
  //       (signUp.status === "complete" || signUp.createdUserId) &&
  //       signUp.createdUserId
  //     ) {
  //       try {
  //         console.log("User created with Clerk, adding to our backend");
  //         // Get user information from Clerk
  //         const user = {
  //           userId: signUp.createdUserId,
  //           email: signUp.emailAddress,
  //           firstName: signUp.firstName || "",
  //           lastName: signUp.lastName || "",
  //           clerkId: signUp.createdUserId,
  //         };

  //         // Call our backend service to create the user using React Query mutation
  //         await createUserMutation.mutateAsync(user);

  //         // No need to navigate here - Clerk will handle the redirect based on its configuration
  //       } catch (error) {
  //         console.error("Error handling signup:", error);
  //       }
  //     }
  //   };

  //   handleSignUpComplete();
  // }, [isLoaded, signUp]);

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
