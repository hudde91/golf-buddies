export interface Achievement {
  id: string;
  type: "tournament" | "tour";
  eventId: string;
  eventName: string;
  date: string;
  position: number;
  displayText: string;
}

export interface UserProfile {
  bio: string;
  profileImage: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  achievements?: Achievement[];
}

export interface StoredUserData {
  [userId: string]: UserProfile;
}
