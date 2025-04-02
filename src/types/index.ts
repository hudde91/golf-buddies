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
  handicap: number;
  question1: string;
  question2: string;
  question3: string;
  achievements?: Achievement[];
}

export interface StoredUserData {
  [userId: string]: UserProfile;
}
