import { UserProfile, Achievement } from "../types";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

// React Query hooks
// TO be implemented in the future
// export const useGetUserProfile = (userId: string) => {
//   return useQuery({
//     queryKey: ["userProfile", userId],
//     queryFn: async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/user/${userId}/profile`
//         );
//         return response.data;
//       } catch (error) {
//         console.warn("API fetch failed, falling back to local storage");
//         // Fall back to local storage
//         return profileService.getProfile(userId);
//       }
//     },
//     enabled: !!userId,
//   });
// };

// TO be implemented in the future
// export const useGetUserAchievements = (userId: string) => {
//   return useQuery({
//     queryKey: ["userAchievements", userId],
//     queryFn: async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/user/${userId}/achievements`
//         );
//         return response.data;
//       } catch (error) {
//         console.warn("API fetch failed, falling back to local storage");
//         // Fall back to local storage
//         return profileService.getUserAchievements(userId);
//       }
//     },
//     enabled: !!userId,
//   });
// };

// TO be implemented in the future
// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       userId,
//       profileData,
//     }: {
//       userId: string;
//       profileData: Partial<UserProfile>;
//     }) => {
//       try {
//         const response = await axios.put(
//           `${API_BASE_URL}/user/${userId}/profile`,
//           profileData
//         );
//         // Also update local storage for backward compatibility
//         profileService.saveProfile(userId, profileData);
//         return response.data;
//       } catch (error) {
//         console.warn("API update failed, using local storage only");
//         // Fall back to local storage only
//         profileService.saveProfile(userId, profileData);
//         return profileService.getProfile(userId);
//       }
//     },
//     onSuccess: (data, variables) => {
//       // Invalidate and refetch the profile query after a successful update
//       queryClient.invalidateQueries({
//         queryKey: ["userProfile", variables.userId],
//       });
//     },
//   });
// };

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (params: CreateUserParams) => {
      try {
        // Attempt to fetch the user first to check if they already exist
        // try {
        //   const checkResponse = await axios.get(`${API_BASE_URL}/user`);
        //   console.log("User already exists in backend, skipping creation");
        //   // If the user exists, return the existing user data
        //   return checkResponse.data;
        // } catch (error) {
        //   // If the GET request fails with 404, user doesn't exist yet, proceed with creation
        //   console.log("User does not exist in backend, creating new user");
        // }

        // Create the user if they don't exist yet
        const response = await axios.post(
          `${API_BASE_URL}/user/createUser`,
          params
        );

        // Also save profile data to localStorage if provided (for backward compatibility)
        if (params.profileData) {
          profileService.saveProfile(params.userId, params.profileData);
        }

        return response.data;
      } catch (error) {
        console.error("Error creating user:", error);
        // If API fails but profileData was provided, still save to localStorage
        if (params.profileData) {
          profileService.saveProfile(params.userId, params.profileData);
        }
        throw error;
      }
    },
  });
};

export const profileService = {
  // Legacy method to create user in backend (kept for backward compatibility)
  // createUser: async (params: CreateUserParams): Promise<boolean> => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/user/createUser`,
  //       params
  //     );

  //     // If profileData was provided, also save it to localStorage for backward compatibility
  //     if (params.profileData) {
  //       profileService.saveProfile(params.userId, params.profileData);
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     // If API fails but profileData was provided, still save to localStorage
  //     if (params.profileData) {
  //       profileService.saveProfile(params.userId, params.profileData);
  //     }
  //     return false;
  //   }
  // },

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
