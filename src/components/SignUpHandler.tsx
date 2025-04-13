import React, { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useCreateUser } from "../services/profileService";
import axios from "axios";

const API_BASE_URL =
  "https://golf-buddies-epfddeddfqdhbtgy.westeurope-01.azurewebsites.net/api";

// This component doesn't render anything visible
// It just listens for auth state changes and calls our backend
const SignUpHandler: React.FC = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const createUserMutation = useCreateUser();
  const processingRef = useRef(false);

  useEffect(() => {
    // Only run if user is signed in, user data is loaded, and we aren't already processing
    if (
      isLoaded &&
      isUserLoaded &&
      isSignedIn &&
      userId &&
      user &&
      !processingRef.current
    ) {
      // Set processing flag to prevent duplicate attempts
      processingRef.current = true;

      const checkUserAndCreate = async () => {
        try {
          // First check if user already exists in our backend using the correct endpoint
          try {
            const response = await axios.get(
              `${API_BASE_URL}/user?clerkId=${userId}`
            );
            if (response.status === 200 && response.data) {
              // User exists in backend
              const existingUser = response.data;
              console.log("Existing user found:", existingUser);
            }
            console.log("User already exists in backend, no need to create");
            return; // User exists, no need to create
          } catch (error) {
            // If we get here, it likely means user doesn't exist (404 error)
            // Continue to create the user
            console.log("User does not exist in backend, creating new user");
          }

          // Create user in our backend
          await createUserMutation.mutateAsync({
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName || "Anonymous",
            lastName: user.lastName || "User",
            clerkId: user.id,
          });

          console.log("User successfully created in backend");
        } catch (error) {
          console.error("Error during user check/create process:", error);
        } finally {
          // Reset processing flag when complete
          processingRef.current = false;
        }
      };

      checkUserAndCreate();
    }
  }, [
    isLoaded,
    isUserLoaded,
    isSignedIn,
    userId,
    user,
    // createUserMutation removed from dependencies
  ]);

  return null;
};

export default SignUpHandler;
