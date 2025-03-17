export interface UserProfile {
  bio: string;
  profileImage: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
}

export interface StoredUserData {
  [userId: string]: UserProfile;
}
