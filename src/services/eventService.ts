import {
  Tournament,
  Event,
  Tour,
  Player,
  TournamentFormData,
  TourFormData,
  Round,
  RoundFormData,
  HoleScore,
  Team,
  TeamFormData,
  ShoutOut,
  Highlight,
  PlayerGroup,
  UserInvitations,
} from "../types/event";
import achievementService from "./achievementService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL =
  "https://golf-buddies-epfddeddfqdhbtgy.westeurope-01.azurewebsites.net/api";
const EVENTS_CACHE_KEY = "events";

// React Query hooks for data fetching

// Get all events from the API
export const useGetAllEvents = () => {
  return useQuery({
    queryKey: [EVENTS_CACHE_KEY],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/event/getallevents`);
      if (!response.ok) {
        throw new Error(`API error with status: ${response.status}`);
      }
      return await response.json();
    },
  });
};

// Get user events from the API
export const useGetUserEvents = (userId: string) => {
  return useQuery<Event[]>({
    queryKey: ["userEvents", userId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/event/${userId}/events`);
      if (!response.ok) {
        throw new Error(`API error with status: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!userId, // Only run the query if userId is provided
  });
};

// Get event by ID from the API
export const useGetEventById = (eventId: string) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      // Try to get the specific event
      const response = await fetch(`${API_BASE_URL}/event/${eventId}`);
      if (!response.ok) {
        throw new Error(`API error with status: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!eventId, // Only run the query if eventId is provided
  });
};

// Hook for getting tournament by ID
export const useGetTournamentById = (tournamentId: string) => {
  return useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: async () => {
      return await eventService.getTournamentById(tournamentId);
    },
    enabled: !!tournamentId,
  });
};

// Mutation hook for creating tournaments
export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tournamentData: TournamentFormData & { inviteFriends?: string[] };
      currentUser: Player;
    }) => {
      return await eventService.createTournament(
        data.tournamentData,
        data.currentUser
      );
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
    },
  });
};

// Mutation hook for creating tours
export const useCreateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tourData: TourFormData & { inviteFriends?: string[] };
      userId: string;
      userName: string;
    }) => {
      return await eventService.createTour(
        data.tourData,
        data.userId,
        data.userName
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
    },
  });
};

// Mutation hook for creating rounds
export const useCreateRound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      roundData: RoundFormData & { inviteFriends?: string[] };
      currentUser: Player;
    }) => {
      return await eventService.createRound(data.roundData, data.currentUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
    },
  });
};

// Mutation hook for updating events
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { eventId: string; updates: Partial<Event> }) => {
      return await eventService.updateEvent(data.eventId, data.updates);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
      }
    },
  });
};

// Mutation hook for updating tournament
export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tournamentId: string;
      updates: Partial<Tournament>;
    }) => {
      return await eventService.updateTournament(
        data.tournamentId,
        data.updates
      );
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
      }
    },
  });
};

// Mutation hook for deleting events
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      return await eventService.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
    },
  });
};

// Mutation hook for deleting tournament
export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournamentId: string) => {
      return await eventService.deleteTournament(tournamentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    },
  });
};

// Mutation hook for adding a player to an event
export const useAddPlayerToEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { eventId: string; player: Player }) => {
      return await eventService.addPlayerToEvent(data.eventId, data.player);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
        queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
      }
    },
  });
};

// Mutation hook for adding a round to a tournament
export const useAddRoundToTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tournamentId: string;
      roundData: RoundFormData;
      currentUser: Player;
    }) => {
      return await eventService.addRoundToTournament(
        data.tournamentId,
        data.roundData,
        data.currentUser
      );
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
        queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
      }
    },
  });
};

// Mutation hook for updating round scores
export const useUpdateRoundScores = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tournamentId: string;
      roundId: string;
      playerId: string;
      scores: HoleScore[];
    }) => {
      return await eventService.updateRoundScores(
        data.tournamentId,
        data.roundId,
        data.playerId,
        data.scores
      );
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
        queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
      }
    },
  });
};

// Mutation hook for inviting players to an event
export const useInvitePlayersToEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { eventId: string; emails: string[] }) => {
      return await eventService.invitePlayersToEvent(data.eventId, data.emails);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
        queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
      }
    },
  });
};

// Get user invitations
export const useGetUserInvitations = (userEmail: string) => {
  return useQuery({
    queryKey: ["userInvitations", userEmail],
    queryFn: async (): Promise<UserInvitations> => {
      const response = await fetch(
        `${API_BASE_URL}/event/invitations/${userEmail}`
      );
      if (!response.ok) {
        throw new Error(`API error with status: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!userEmail, // Only run if userEmail is provided
  });
};

// Create highlight
export const useCreateHighlight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      eventId: string;
      playerId: string;
      title: string;
      mediaType: "image" | "video";
      description?: string;
      roundId?: string;
      mediaUrl?: string;
    }) => {
      const highlightData = {
        ...data,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        `${API_BASE_URL}/event/${data.eventId}/highlights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(highlightData),
        }
      );

      if (!response.ok) {
        throw new Error(`API error with status: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
        queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
        queryClient.invalidateQueries({
          queryKey: ["tournamentHighlights", data.id],
        });
      }
    },
  });
};

// Create shout out
export const useCreateShoutOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      eventId: string;
      roundId: string;
      playerId: string;
      holeNumber: number;
      type: "birdie" | "eagle" | "hole-in-one" | "custom";
      message?: string;
    }) => {
      const shoutOutData = {
        ...data,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        `${API_BASE_URL}/event/${data.eventId}/shoutouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shoutOutData),
        }
      );

      if (!response.ok) {
        throw new Error(`API error with status: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
        queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
        queryClient.invalidateQueries({
          queryKey: ["tournamentShoutOuts", data.id],
        });
      }
    },
  });
};

// Get tournament shoutouts
export const useGetTournamentShoutOuts = (tournamentId: string) => {
  return useQuery({
    queryKey: ["tournamentShoutOuts", tournamentId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/event/${tournamentId}/shoutouts`
      );
      if (!response.ok) {
        throw new Error(`API error with status: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!tournamentId,
  });
};

// Hook to check if a user is the creator of an event
export const useIsCreator = (eventId: string) => {
  return useQuery({
    queryKey: ["isCreator", eventId],
    queryFn: async () => {
      return await eventService.isCreator(eventId);
    },
    enabled: !!eventId,
  });
};

// Hook to get the current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return await eventService.getCurrentUser();
    },
  });
};

// Mutation hook for adding a round to a tour
export const useAddRoundToTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tourId: string;
      roundData: RoundFormData;
      currentUser: Player;
    }) => {
      return await eventService.addRoundToTour(
        data.tourId,
        data.roundData,
        data.currentUser
      );
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
      }
    },
  });
};

// Mutation hook for adding a tournament to a tour
export const useAddTournamentToTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tourId: string;
      tournamentData: TournamentFormData & { inviteFriends?: string[] };
      currentUser: Player;
    }) => {
      return await eventService.addTournamentToTour(
        data.tourId,
        data.tournamentData,
        data.currentUser
      );
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
      }
    },
  });
};

// Mutation hook for updating player groups
export const useUpdatePlayerGroups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      eventId: string;
      roundId: string;
      playerGroups: PlayerGroup[];
    }) => {
      return await eventService.updatePlayerGroups(
        data.eventId,
        data.roundId,
        data.playerGroups
      );
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event", data.id] });
        queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
      }
    },
  });
};

// Hook for getting tournament leaderboard
export const useGetTournamentLeaderboard = (tournamentId: string) => {
  return useQuery({
    queryKey: ["tournamentLeaderboard", tournamentId],
    queryFn: async () => {
      return await eventService.getTournamentLeaderboard(tournamentId);
    },
    enabled: !!tournamentId,
  });
};

// Mutation hook for accepting an invitation
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { eventId: string; player: Player }) => {
      return await eventService.acceptInvitation(data.eventId, data.player);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
        queryClient.invalidateQueries({ queryKey: ["userEvents"] });
        queryClient.invalidateQueries({ queryKey: ["event"] });
        queryClient.invalidateQueries({ queryKey: ["tournament"] });
        queryClient.invalidateQueries({ queryKey: ["userInvitations"] });
      }
    },
  });
};

// Mutation hook for declining an invitation
export const useDeclineInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { eventId: string; userEmail: string }) => {
      return await eventService.declineInvitation(data.eventId, data.userEmail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
      queryClient.invalidateQueries({ queryKey: ["userInvitations"] });
    },
  });
};

// Mutation hook for updating event statuses
export const useUpdateEventStatuses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await eventService.updateEventStatuses();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_CACHE_KEY] });
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    },
  });
};

// API function to create gameplay
const createGameplayAPI = async (
  type: "tournament" | "tour" | "round",
  data: any,
  clerkId: string
): Promise<any> => {
  const response = await fetch(
    `${API_BASE_URL}/event/creategameplay?clerkId=${clerkId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: data.location || "",
        imageUrl: "",
        isPrivate: false,
        hostName: data.userName || data.currentUser?.name || "",
        tourType: data.scoringType,
        startdate: data.startDate || data.date,
        enddate: data.endDate || data.date,
        eventType: type,
        description: data.description || "",
        name: data.name,
        // Add any additional fields needed by the API
        format: data.format,
        isTeamEvent: data.isTeamEvent,
        holes: data.holes,
        par: data.par,
        courseName: data.courseName,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`API error with status: ${response.status}`);
  }

  return await response.json();
};

// Implementation of the event service methods
const eventService = {
  // Get all events from API
  getAllEvents: async (): Promise<Event[]> => {
    const response = await fetch(`${API_BASE_URL}/event/getallevents`);
    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }
    return await response.json();
  },

  // Get user events from API
  getUserEvents: async (userId: string): Promise<Event[]> => {
    const response = await fetch(`${API_BASE_URL}/event/${userId}/events`);
    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }
    return await response.json();
  },

  // Get event by ID from API
  getEventById: async (id: string): Promise<Event | null> => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`);
    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }
    return await response.json();
  },

  // Get tournament by ID
  getTournamentById: async (id: string): Promise<Tournament | null> => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`);

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    const event = await response.json();
    return event.type === "tournament" ? event : null;
  },

  // Create tournament with API
  createTournament: async (
    data: TournamentFormData & { inviteFriends?: string[] },
    currentUser: Player
  ): Promise<Event> => {
    return await createGameplayAPI(
      "tournament",
      {
        ...data,
        currentUser,
      },
      currentUser.id
    );
  },

  // Create tour with API
  createTour: async (
    data: TourFormData & { inviteFriends?: string[] },
    userId: string,
    userName: string
  ): Promise<Event> => {
    return await createGameplayAPI(
      "tour",
      {
        ...data,
        userId,
        userName,
      },
      userId
    );
  },

  // Create round with API
  createRound: async (
    data: RoundFormData & { inviteFriends?: string[] },
    currentUser: Player
  ): Promise<Event> => {
    return await createGameplayAPI(
      "round",
      {
        ...data,
        currentUser,
      },
      currentUser.id
    );
  },

  // Update event with API
  updateEvent: async (
    id: string,
    updates: Partial<Event>
  ): Promise<Event | null> => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Update tournament with API
  updateTournament: async (
    id: string,
    data: Partial<Tournament>
  ): Promise<Tournament | null> => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    const updatedTournament = await response.json();

    // If status changed to completed, process achievements
    if (data.status === "completed") {
      setTimeout(() => achievementService.processCompletedTournament(id), 0);
    }

    return updatedTournament;
  },

  // Delete tournament with API
  deleteTournament: async (id: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return true;
  },

  // Delete event with API
  deleteEvent: async (id: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return true;
  },

  // Add a player to an event with API
  addPlayerToEvent: async (
    eventId: string,
    player: Player
  ): Promise<Event | null> => {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Add a round to a tournament with API
  addRoundToTournament: async (
    tournamentId: string,
    roundData: RoundFormData,
    currentUser: Player
  ): Promise<Tournament | null> => {
    // Prepare the round data
    const roundWithEventId = {
      ...roundData,
      tournamentId,
      userId: currentUser.id,
    };

    // Create a round via API
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/rounds`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roundWithEventId),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    // The API should return the updated tournament with the new round
    return await response.json();
  },

  // Update round scores with API
  updateRoundScores: async (
    tournamentId: string,
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ): Promise<Tournament | null> => {
    // Format the update data
    const scoreData = {
      tournamentId,
      roundId,
      playerId,
      scores,
    };

    // Send to API
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/rounds/${roundId}/scores/${playerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scoreData),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    // API should return the updated tournament
    const updatedTournament = await response.json();

    // Detect achievements after score update
    eventService.detectAchievements(tournamentId, roundId, playerId, scores);

    return updatedTournament;
  },

  // Invite players to an event with API
  invitePlayersToEvent: async (
    eventId: string,
    emails: string[]
  ): Promise<Event | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${eventId}/invitations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Detect achievements based on scores (client-side only)
  detectAchievements: (
    tournamentId: string,
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ): void => {
    // We can handle this client-side without a direct API call
    // First get the tournament to check score details
    eventService.getTournamentById(tournamentId).then((tournament) => {
      if (!tournament) return;

      // Detect achievements based on par and score
      scores.forEach((score) => {
        if (!score.score || !score.par) return; // Skip if score or par is missing

        const diff = score.par - score.score;

        if (diff === 0) {
          // Par - no special achievement
          return;
        } else if (score.score === 1) {
          // Hole in one!
          eventService.createShoutOut(
            tournamentId,
            roundId,
            playerId,
            score.hole,
            "hole-in-one",
            "Incredible hole-in-one!"
          );
        } else if (diff === 1) {
          // Birdie
          eventService.createShoutOut(
            tournamentId,
            roundId,
            playerId,
            score.hole,
            "birdie",
            "Great birdie!"
          );
        } else if (diff >= 2) {
          // Eagle or better
          eventService.createShoutOut(
            tournamentId,
            roundId,
            playerId,
            score.hole,
            "eagle",
            diff === 2
              ? "Amazing eagle!"
              : "Spectacular double eagle or better!"
          );
        }
      });
    });
  },

  // Create shoutOut with API
  createShoutOut: async (
    tournamentId: string,
    roundId: string,
    playerId: string,
    holeNumber: number,
    type: "birdie" | "eagle" | "hole-in-one" | "custom",
    message?: string
  ): Promise<Tournament | null> => {
    const shoutOutData = {
      tournamentId,
      roundId,
      playerId,
      holeNumber,
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/shoutouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shoutOutData),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Get current user from Clerk
  getCurrentUser: async (): Promise<Player | null> => {
    try {
      const user = await window.Clerk?.user;
      if (!user) return null;

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
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  // Check if user is the creator of an event with API
  isCreator: async (eventId: string): Promise<boolean> => {
    const currentUser = await eventService.getCurrentUser();
    if (!currentUser) return false;

    const event = await eventService.getEventById(eventId);
    if (!event) return false;

    return event.createdBy === currentUser.id;
  },

  // Add a round to a tour with API
  addRoundToTour: async (
    tourId: string,
    roundData: RoundFormData,
    currentUser: Player
  ): Promise<Event | null> => {
    // Prepare the round data
    const roundWithEventId = {
      ...roundData,
      tourId,
      userId: currentUser.id,
    };

    // Create a round via API
    const response = await fetch(`${API_BASE_URL}/event/${tourId}/rounds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roundWithEventId),
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    // The API should return the updated tour with the new round
    return await response.json();
  },

  // Add tournament to tour with API
  addTournamentToTour: async (
    tourId: string,
    tournamentData: TournamentFormData & { inviteFriends?: string[] },
    currentUser: Player
  ): Promise<Event | null> => {
    // Prepare the tournament data
    const tournamentWithTourId = {
      ...tournamentData,
      tourId,
      userId: currentUser.id,
    };

    // Create a tournament via API
    const response = await fetch(
      `${API_BASE_URL}/event/${tourId}/tournaments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournamentWithTourId),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    // The API should return the updated tour with the new tournament
    return await response.json();
  },

  // Update player groups for a round with API
  updatePlayerGroups: async (
    eventId: string,
    roundId: string,
    playerGroups: PlayerGroup[]
  ): Promise<Tournament | null> => {
    const playerGroupData = {
      eventId,
      roundId,
      playerGroups,
    };

    const response = await fetch(
      `${API_BASE_URL}/event/${eventId}/rounds/${roundId}/playergroups`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerGroupData),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Get tournament leaderboard with API
  getTournamentLeaderboard: async (
    tournamentId: string
  ): Promise<
    {
      playerId: string;
      playerName: string;
      teamId?: string;
      teamName?: string;
      total: number;
      roundTotals: { [roundId: string]: number };
    }[]
  > => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/leaderboard`
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Accept invitation with API
  acceptInvitation: async (
    eventId: string,
    player: Player
  ): Promise<Event | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${eventId}/invitations/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(player),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Decline invitation with API
  declineInvitation: async (
    eventId: string,
    userEmail: string
  ): Promise<boolean> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${eventId}/invitations/decline`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return true;
  },

  // Update event statuses based on dates
  updateEventStatuses: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/event/updatestatuses`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }
  },

  // Get round by ID
  getRoundById: async (id: string): Promise<Round | null> => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`);

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    const event = await response.json();
    return event.type === "round" ? event : null;
  },

  // Update round event
  updateRoundEvent: async (
    id: string,
    data: Partial<Round>
  ): Promise<Round | null> => {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Get user invitations
  getUserInvitations: async (
    userEmail: string
  ): Promise<{
    tournaments: Tournament[];
    rounds: Round[];
    tours: Tour[];
  }> => {
    const response = await fetch(
      `${API_BASE_URL}/event/invitations/${userEmail}`
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Handle teams
  addTeam: async (
    tournamentId: string,
    teamData: TeamFormData
  ): Promise<Tournament | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/teams`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  updateTeam: async (
    tournamentId: string,
    teamId: string,
    teamData: Partial<Team>
  ): Promise<Tournament | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/teams/${teamId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  deleteTeam: async (
    tournamentId: string,
    teamId: string
  ): Promise<Tournament | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/teams/${teamId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  assignPlayerToTeam: async (
    tournamentId: string,
    playerId: string,
    teamId?: string
  ): Promise<Tournament | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/players/${playerId}/team`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Teams for tour
  addTeamToTour: async (
    tourId: string,
    teamData: TeamFormData
  ): Promise<Tour | null> => {
    const response = await fetch(`${API_BASE_URL}/event/${tourId}/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  updateTourTeam: async (
    tourId: string,
    teamId: string,
    teamData: Partial<Team>
  ): Promise<Tour | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tourId}/teams/${teamId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  deleteTourTeam: async (
    tourId: string,
    teamId: string
  ): Promise<Tour | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tourId}/teams/${teamId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  assignPlayerToTourTeam: async (
    tourId: string,
    playerId: string,
    teamId?: string
  ): Promise<Tour | null> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tourId}/players/${playerId}/team`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Get highlight and shoutout data
  getTournamentHighlights: async (
    tournamentId: string
  ): Promise<Highlight[]> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/highlights`
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  getTournamentShoutOuts: async (tournamentId: string): Promise<ShoutOut[]> => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/shoutouts`
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Create highlights
  createHighlight: async (
    eventId: string,
    playerId: string,
    title: string,
    mediaType: "image" | "video",
    description?: string,
    roundId?: string,
    mediaUrl?: string
  ): Promise<Tournament | Tour | null> => {
    const highlightData = {
      eventId,
      playerId,
      title,
      mediaType,
      description,
      roundId,
      mediaUrl,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(
      `${API_BASE_URL}/event/${eventId}/highlights`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(highlightData),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Team leaderboards
  getTeamLeaderboard: async (
    tournamentId: string
  ): Promise<
    {
      teamId: string;
      teamName: string;
      teamColor: string;
      playerCount: number;
      total: number;
      roundTotals: { [roundId: string]: number };
    }[]
  > => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tournamentId}/teamleaderboard`
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  getTourTeamLeaderboard: async (
    tourId: string
  ): Promise<
    {
      teamId: string;
      teamName: string;
      teamColor: string;
      playerCount: number;
      totalPoints: number;
      roundTotals: { [roundId: string]: number };
      tournamentResults: { [tournamentId: string]: number };
    }[]
  > => {
    const response = await fetch(
      `${API_BASE_URL}/event/${tourId}/teamleaderboard`
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  },

  // Error handling wrapper
  handleApiError: async (apiCall: () => Promise<any>) => {
    try {
      return await apiCall();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },
};

export default eventService;
