import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useCreateUser } from "../services/profileService";

// This component doesn't render anything visible
// It just listens for auth state changes and calls our backend
const SignUpHandler: React.FC = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const createUserMutation = useCreateUser();
  const [userCreatedInBackend, setUserCreatedInBackend] = useState(false);

  useEffect(() => {
    // Try to get from localStorage to prevent processing on page reloads
    const hasUserBeenCreated = localStorage.getItem(`user_created_${userId}`);
    if (hasUserBeenCreated === "true") {
      setUserCreatedInBackend(true);
    }
  }, [userId]);

  useEffect(() => {
    // Only run if user is signed in, user data is loaded, and we haven't already created them
    if (
      isLoaded &&
      isUserLoaded &&
      isSignedIn &&
      userId &&
      user &&
      !userCreatedInBackend
    ) {
      // Check if this is a new user by examining the creation date
      const userCreatedAt = new Date(user.createdAt!);
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      // Only create backend user if the Clerk user was created in the last 5 minutes
      // This helps distinguish new signups from returning user logins
      if (userCreatedAt > fiveMinutesAgo) {
        console.log("New user sign-up detected, creating in backend");

        const createUserInBackend = async () => {
          try {
            // Set flag immediately to prevent duplicate calls
            setUserCreatedInBackend(true);
            localStorage.setItem(`user_created_${userId}`, "true");

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
            // Still keep the flag true to prevent infinite retries
          }
        };

        createUserInBackend();
      } else {
        // This is a returning user, just mark as created to avoid future checks
        setUserCreatedInBackend(true);
        localStorage.setItem(`user_created_${userId}`, "true");
        console.log("Returning user detected, not creating in backend");
      }
    }
  }, [
    isLoaded,
    isUserLoaded,
    isSignedIn,
    userId,
    user,
    createUserMutation,
    userCreatedInBackend,
  ]);

  return null;
};

export default SignUpHandler;
