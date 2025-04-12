import React, { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useCreateUser } from "../services/profileService";

// This component doesn't render anything visible
// It just listens for auth state changes and calls our backend
const SignUpHandler: React.FC = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const createUserMutation = useCreateUser();
  const creationAttemptedRef = useRef(false);

  useEffect(() => {
    if (
      isLoaded &&
      isUserLoaded &&
      isSignedIn &&
      userId &&
      user &&
      !creationAttemptedRef.current
    ) {
      console.log("New user sign-up detected, creating in backend");

      // Set flag immediately to prevent duplicate calls
      creationAttemptedRef.current = true;

      const createUserInBackend = async () => {
        try {
          console.log("Creating user in backend:", user.id);

          // Create user in our backend
          await createUserMutation.mutateAsync({
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName || "Test",
            lastName: user.lastName || "Person",
            clerkId: user.id,
          });

          console.log("User successfully created in backend");
        } catch (error) {
          console.error("Error creating user in backend:", error);
        }
      };

      createUserInBackend();
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
