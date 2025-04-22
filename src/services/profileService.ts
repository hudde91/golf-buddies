import { UserProfile, Achievement } from "../types";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL =
  "https://golf-buddies-epfddeddfqdhbtgy.westeurope-01.azurewebsites.net/api";

// Define interface for creating user
interface CreateUserParams {
  userId: string;
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileData?: Partial<UserProfile>;
}

// React Query hook to get user by clerkId
export const useGetUserByClerkId = (clerkId: string) => {
  return useQuery({
    queryKey: ["user", clerkId],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user?clerkId=${clerkId}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // Store user data in localStorage as fallback
        localStorage.setItem(`profile_${clerkId}`, JSON.stringify(data));
        return data;
      } catch (error) {
        console.warn("API fetch failed, falling back to local storage");
        // Fall back to local storage
        return profileService.getProfile(clerkId);
      }
    },
    enabled: !!clerkId,
  });
};

// React Query hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clerkId,
      profileData,
    }: {
      clerkId: string;
      profileData: Partial<UserProfile>;
    }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/updateuser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId,
            ...profileData,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // Also update local storage for backward compatibility
        profileService.saveProfile(clerkId, profileData);
        return data;
      } catch (error) {
        console.warn("API update failed, using local storage only");
        // Fall back to local storage only
        profileService.saveProfile(clerkId, profileData);
        return profileService.getProfile(clerkId);
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the user query after a successful update
      queryClient.invalidateQueries({
        queryKey: ["user", variables.clerkId],
      });
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (params: CreateUserParams) => {
      try {
        // You could add a check here to see if user already exists
        const response = await fetch(`${API_BASE_URL}/user/createUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },
  });
};

export const profileService = {
  saveProfile: (userId: string, profileData: Partial<UserProfile>): void => {
    const existingDataString = localStorage.getItem(`profile_${userId}`);
    const existingData: UserProfile = existingDataString
      ? JSON.parse(existingDataString)
      : {
          bio: "",
          profileImage: "",
          question1: "",
          question2: "",
          question3: "",
          question4: "",
          achievements: [],
        };

    const updatedData = {
      ...existingData,
      ...profileData,
    };

    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));
  },

  getProfile: (userId: string): UserProfile => {
    const dataString = localStorage.getItem(`profile_${userId}`);
    if (dataString) {
      return JSON.parse(dataString);
    }
    return {
      bio: "",
      profileImage: "",
      handicap: 0,
      question1: "",
      question2: "",
      question3: "",
      achievements: [],
    };
  },

  // Fetches user profile from the API
  fetchUserProfile: async (clerkId: string): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user?clerkId=${clerkId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Store the fetched profile in localStorage as fallback
      localStorage.setItem(`profile_${clerkId}`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn("API fetch failed, falling back to local storage");
      // Fall back to local storage
      return profileService.getProfile(clerkId);
    }
  },

  // Updates user profile through the API
  updateUserProfile: async (
    clerkId: string,
    profileData: Partial<UserProfile>
  ): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/updateuser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId,
          ...profileData,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Update local storage for backward compatibility
      profileService.saveProfile(clerkId, profileData);
      return data;
    } catch (error) {
      console.warn("API update failed, using local storage only");
      // Fall back to local storage only
      profileService.saveProfile(clerkId, profileData);
      return profileService.getProfile(clerkId);
    }
  },

  addAchievement: (
    userId: string,
    achievement: Omit<Achievement, "id">
  ): void => {
    const profile = profileService.getProfile(userId);

    if (!profile.achievements) {
      profile.achievements = [];
    }

    // Check if this achievement already exists to avoid duplicates
    const achievementExists = profile.achievements.some(
      (a) =>
        a.eventId === achievement.eventId &&
        a.type === achievement.type &&
        a.position === achievement.position
    );

    if (!achievementExists) {
      profile.achievements.push({
        id: uuidv4(),
        ...achievement,
      });

      profileService.saveProfile(userId, {
        achievements: profile.achievements,
      });
    }
  },

  getUserAchievements: (userId: string): Achievement[] => {
    const profile = profileService.getProfile(userId);
    return profile.achievements || [];
  },

  removeAchievement: (userId: string, achievementId: string): void => {
    const profile = profileService.getProfile(userId);

    if (profile.achievements) {
      profile.achievements = profile.achievements.filter(
        (a) => a.id !== achievementId
      );
      profileService.saveProfile(userId, {
        achievements: profile.achievements,
      });
    }
  },
};

export default profileService;
