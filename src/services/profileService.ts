import { UserProfile, Achievement } from "../types";
import { v4 as uuidv4 } from "uuid";

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
