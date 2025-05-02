import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export interface Friend {
  id: string;
  email: string;
  name: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export const useGetAcceptedFriends = (userId: string) => {
  return useQuery({
    queryKey: ["acceptedFriends", userId],
    queryFn: async () => {
      return await friendsService.getAcceptedFriends(userId);
    },
    enabled: !!userId, // Only run the query if userId is provided
  });
};

export const friendsService = {
  getFriends: (userId: string): Friend[] => {
    const dataString = localStorage.getItem(`friends_${userId}`);
    if (dataString) {
      return JSON.parse(dataString);
    }
    return [];
  },

  saveFriends: (userId: string, friends: Friend[]): void => {
    localStorage.setItem(`friends_${userId}`, JSON.stringify(friends));
  },

  addFriend: (
    userId: string,
    friendEmail: string,
    friendName: string = ""
  ): void => {
    const friends = friendsService.getFriends(userId);

    // Check if friend already exists
    const friendExists = friends.some((f) => f.email === friendEmail);

    if (!friendExists) {
      friends.push({
        id: uuidv4(),
        email: friendEmail,
        name: friendName,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      friendsService.saveFriends(userId, friends);
    }
  },

  removeFriend: (userId: string, friendId: string): void => {
    const friends = friendsService.getFriends(userId);
    const updatedFriends = friends.filter((f) => f.id !== friendId);
    friendsService.saveFriends(userId, updatedFriends);
  },

  updateFriendStatus: (
    userId: string,
    friendId: string,
    status: "pending" | "accepted" | "rejected"
  ): void => {
    const friends = friendsService.getFriends(userId);
    const updatedFriends = friends.map((f) =>
      f.id === friendId ? { ...f, status } : f
    );
    friendsService.saveFriends(userId, updatedFriends);
  },

  searchFriendByEmail: (userId: string, email: string): Friend | null => {
    const friends = friendsService.getFriends(userId);
    return friends.find((f) => f.email === email) || null;
  },

  getPendingFriends: (userId: string): Friend[] => {
    const friends = friendsService.getFriends(userId);
    return friends.filter((f) => f.status === "pending");
  },

  getAcceptedFriends: (userId: string): Friend[] => {
    const friends = friendsService.getFriends(userId);
    return friends.filter((f) => f.status === "accepted");
  },
};

export default friendsService;
