import React, { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useCreateUser } from "../services/profileService";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL =
  "https://golf-buddies-epfddeddfqdhbtgy.westeurope-01.azurewebsites.net/api";

const SignUpHandler: React.FC = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const createUserMutation = useCreateUser();
  const processingRef = useRef(false);

  // Query to check if user exists in our backend
  const { data: backendUser, isError } = useQuery({
    queryKey: ["backendUser", userId],
    queryFn: async () => {
      if (!userId) return null;

      const response = await fetch(`${API_BASE_URL}/user?clerkId=${userId}`);

      // If the user doesn't exist (404), throw an error to trigger isError
      if (response.status === 404) {
        throw new Error("User not found");
      }

      if (!response.ok) {
        throw new Error(`API error with status: ${response.status}`);
      }

      return await response.json();
    },
    // Only enable this query if we have a userId and the user is signed in
    enabled: !!userId && isSignedIn === true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      // Don't retry if the user doesn't exist
      if (error instanceof Error && error.message === "User not found") {
        return false;
      }
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (
      isLoaded &&
      isUserLoaded &&
      isSignedIn &&
      userId &&
      user &&
      !processingRef.current &&
      isError // This means user doesn't exist in backend
    ) {
      processingRef.current = true;

      const createUserInBackend = async () => {
        try {
          console.log("User does not exist in backend, creating new user");

          await createUserMutation.mutateAsync({
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName || "Anonymous",
            lastName: user.lastName || "User",
            clerkId: user.id,
          });

          console.log("User successfully created in backend");
        } catch (error) {
          console.error("Error creating user in backend:", error);
        } finally {
          processingRef.current = false;
        }
      };

      createUserInBackend();
    }
  }, [isLoaded, isUserLoaded, isSignedIn, userId, user, isError, backendUser]);

  return null;
};

export default SignUpHandler;
