// src/services/profileService.ts
import { UserProfile } from "../types";

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
      question1: "",
      question2: "",
      question3: "",
      question4: "",
    };
  },
};

export default profileService;
