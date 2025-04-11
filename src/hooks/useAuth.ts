import { useUser } from "@clerk/clerk-react";
import { useCallback } from "react";
import { Player } from "../types/event";

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const getCurrentPlayer = useCallback((): Player | null => {
    if (!isLoaded || !isSignedIn || !user) {
      return null;
    }

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
      bio: "",
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      handicap: 0,
    };
  }, [isLoaded, isSignedIn, user]);

  // Helper method to determine if the current user is the creator of an entity
  const isCreator = useCallback(
    (createdById: string): boolean => {
      if (!isLoaded || !isSignedIn || !user) {
        return false;
      }
      return user.id === createdById;
    },
    [isLoaded, isSignedIn, user]
  );

  return {
    user,
    isLoaded,
    isSignedIn,
    getCurrentPlayer,
    isCreator,
  };
};
