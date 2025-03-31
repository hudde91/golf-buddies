import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Tournament,
  Event,
  Tour,
  Player,
  TournamentFormData,
  TourFormData,
  Round,
  RoundFormData,
  Team,
  TeamFormData,
} from "../types/event";

// Set up Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth interceptor using Clerk token
apiClient.interceptors.request.use(async (config) => {
  try {
    // If using Clerk, get token - this would need to be adjusted based on your auth setup
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to get auth token:", error);
  }
  return config;
});

// Comprehensive query key structure
export const QUERY_KEYS = {
  events: {
    all: ["events"],
    detail: (id: string) => ["events", "detail", id],
    lists: {
      byUser: (userId: string) => ["events", "lists", "byUser", userId],
      byStatus: (status: string) => ["events", "lists", "byStatus", status],
      invitations: (email: string) => ["events", "lists", "invitations", email],
    },
  },
  tournaments: {
    all: ["tournaments"],
    detail: (id: string) => ["tournaments", "detail", id],
    rounds: (id: string) => ["tournaments", id, "rounds"],
    specificRound: (tournamentId: string, roundId: string) => [
      "tournaments",
      tournamentId,
      "rounds",
      roundId,
    ],
    leaderboard: (id: string) => ["tournaments", id, "leaderboard"],
    teamLeaderboard: (id: string) => ["tournaments", id, "team-leaderboard"],
    shoutOuts: (id: string) => ["tournaments", id, "shoutouts"],
    highlights: (id: string) => ["tournaments", id, "highlights"],
  },
  tours: {
    all: ["tours"],
    detail: (id: string) => ["tours", "detail", id],
    leaderboard: (id: string) => ["tours", id, "leaderboard"],
  },
};

// GET queries
export const useAllEvents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.events.all,
    queryFn: async () => {
      const { data } = await apiClient.get<Event[]>("/events");
      return data;
    },
  });
};

export const useEventById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Event>(`/events/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useTournamentById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.tournaments.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Tournament>(`/tournaments/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useUserEvents = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.lists.byUser(userId),
    queryFn: async () => {
      const { data } = await apiClient.get<Event[]>(`/events/user/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useUserInvitations = (userEmail: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.lists.invitations(userEmail),
    queryFn: async () => {
      const { data } = await apiClient.get<Tournament[]>(
        `/invitations/${userEmail}`
      );
      return data;
    },
    enabled: !!userEmail,
  });
};

export const useTournamentLeaderboard = (
  tournamentId: string,
  options = {}
) => {
  return useQuery({
    queryKey: QUERY_KEYS.tournaments.leaderboard(tournamentId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/tournaments/${tournamentId}/leaderboard`
      );
      return data;
    },
    enabled: !!tournamentId,
    ...options,
  });
};

export const useTeamLeaderboard = (tournamentId: string, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.tournaments.teamLeaderboard(tournamentId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/tournaments/${tournamentId}/teams/leaderboard`
      );
      return data;
    },
    enabled: !!tournamentId,
    ...options,
  });
};

export const useTourLeaderboard = (tourId: string, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.tours.leaderboard(tourId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/tours/${tourId}/leaderboard`);
      return data;
    },
    enabled: !!tourId,
    ...options,
  });
};

export const useTournamentRounds = (tournamentId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.tournaments.rounds(tournamentId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/tournaments/${tournamentId}/rounds`
      );
      return data;
    },
    enabled: !!tournamentId,
  });
};

export const useRoundDetails = (tournamentId: string, roundId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.tournaments.specificRound(tournamentId, roundId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/tournaments/${tournamentId}/rounds/${roundId}`
      );
      return data;
    },
    enabled: !!tournamentId && !!roundId,
  });
};

export const useTournamentShoutOuts = (tournamentId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.tournaments.shoutOuts(tournamentId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/tournaments/${tournamentId}/shoutouts`
      );
      return data;
    },
    enabled: !!tournamentId,
  });
};

export const useTournamentHighlights = (tournamentId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.tournaments.highlights(tournamentId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/tournaments/${tournamentId}/highlights`
      );
      return data;
    },
    enabled: !!tournamentId,
  });
};

// Mutations
export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      currentUser,
    }: {
      data: TournamentFormData;
      currentUser: Player;
    }) => {
      const { data: response } = await apiClient.post<Event>("/tournaments", {
        data,
        currentUser,
      });
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.specificRound(
          variables.tournamentId,
          variables.roundId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.leaderboard(variables.tournamentId),
      });
    },
  });
};

// Network-aware query hook
export const useNetworkAwareQuery = (
  queryKey: any[],
  queryFn: any,
  options = {}
) => {
  const [networkType, setNetworkType] = useState("unknown");

  useEffect(() => {
    // Check connection type if available
    if ("connection" in navigator) {
      setNetworkType((navigator as any).connection.effectiveType);

      const updateNetworkType = () => {
        setNetworkType((navigator as any).connection.effectiveType);
      };

      (navigator as any).connection.addEventListener(
        "change",
        updateNetworkType
      );
      return () => {
        (navigator as any).connection.removeEventListener(
          "change",
          updateNetworkType
        );
      };
    }
  }, []);

  // Adjust staleTime and retry settings based on connection
  const adjustedOptions = useMemo(() => {
    switch (networkType) {
      case "4g":
        return {
          staleTime: 2 * 60 * 1000, // 2 minutes
          ...options,
        };
      case "3g":
        return {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 3,
          retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
          ...options,
        };
      case "2g":
      case "slow-2g":
        return {
          staleTime: 15 * 60 * 1000, // 15 minutes
          retry: 2,
          retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
          ...options,
        };
      default:
        return options;
    }
  }, [networkType, options]);

  return useQuery({
    queryKey,
    queryFn,
    ...adjustedOptions,
  });
};

export const useCreateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      userId,
      userName,
    }: {
      data: TourFormData;
      userId: string;
      userName: string;
    }) => {
      const { data: response } = await apiClient.post<Event>("/tours", {
        data,
        userId,
        userName,
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.lists.byUser(data.data.createdBy),
      });
    },
  });
};

export const useAddTournamentToTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tourId,
      tournamentData,
      currentUser,
    }: {
      tourId: string;
      tournamentData: TournamentFormData;
      currentUser: Player;
    }) => {
      const { data } = await apiClient.post<Event>(
        `/tours/${tourId}/tournaments`,
        { tournamentData, currentUser }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate tour data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(variables.tourId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tours.detail(variables.tourId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tours.leaderboard(variables.tourId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Event>;
    }) => {
      const { data } = await apiClient.put<Event>(`/events/${id}`, updates);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(variables.id),
      });

      // If it's a tournament or tour, invalidate specific queries
      if (data.type === "tournament") {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tournaments.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tournaments.leaderboard(variables.id),
        });
      } else if (data.type === "tour") {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tours.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tours.leaderboard(variables.id),
        });
      }

      // Invalidate lists that might contain this event
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.lists.byUser(data.data.createdBy),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Tournament>;
    }) => {
      const { data: response } = await apiClient.put<Tournament>(
        `/tournaments/${id}`,
        data
      );
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.leaderboard(variables.id),
      });

      // Also invalidate any tour that might contain this tournament
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            queryKey[0] === "tours" &&
            query.state.data?.data?.tournaments?.some(
              (t: Tournament) => t.id === variables.id
            )
          );
        },
      });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/events/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });

      // Remove from cache completely
      queryClient.removeQueries({ queryKey: QUERY_KEYS.events.detail(id) });
    },
  });
};

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tournaments/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });

      // Remove from cache completely
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.tournaments.detail(id),
      });

      // Also invalidate any tour that might contain this tournament
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            queryKey[0] === "tours" &&
            query.state.data?.data?.tournaments?.some(
              (t: Tournament) => t.id === id
            )
          );
        },
      });
    },
  });
};

export const useAddPlayerToEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      player,
    }: {
      eventId: string;
      player: Player;
    }) => {
      const { data } = await apiClient.post<Event>(
        `/events/${eventId}/players`,
        player
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(variables.eventId),
      });

      if (data.type === "tournament") {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tournaments.detail(variables.eventId),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tournaments.leaderboard(variables.eventId),
        });
      } else if (data.type === "tour") {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tours.detail(variables.eventId),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tours.leaderboard(variables.eventId),
        });

        // Also invalidate all tournaments in this tour
        const tour = data.data as Tour;
        tour.tournaments.forEach((tournament) => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.tournaments.detail(tournament.id),
          });
        });
      }
    },
  });
};

export const useAddRound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      roundData,
    }: {
      tournamentId: string;
      roundData: RoundFormData;
    }) => {
      const { data } = await apiClient.post<Tournament>(
        `/tournaments/${tournamentId}/rounds`,
        roundData
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.rounds(variables.tournamentId),
      });
    },
  });
};

export const useUpdateRound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      roundId,
      data,
    }: {
      tournamentId: string;
      roundId: string;
      data: Partial<Round>;
    }) => {
      const { data: response } = await apiClient.put<Tournament>(
        `/tournaments/${tournamentId}/rounds/${roundId}`,
        data
      );
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.rounds(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.specificRound(
          variables.tournamentId,
          variables.roundId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.leaderboard(variables.tournamentId),
      });
    },
  });
};

export const useDeleteRound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      roundId,
    }: {
      tournamentId: string;
      roundId: string;
    }) => {
      const { data } = await apiClient.delete<Tournament>(
        `/tournaments/${tournamentId}/rounds/${roundId}`
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.rounds(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.leaderboard(variables.tournamentId),
      });

      // Remove the round from cache
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.tournaments.specificRound(
          variables.tournamentId,
          variables.roundId
        ),
      });
    },
  });
};

export const useUpdateRoundScores = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      roundId,
      playerId,
      scores,
    }: {
      tournamentId: string;
      roundId: string;
      playerId: string;
      scores: any[];
    }) => {
      const { data } = await apiClient.put<Tournament>(
        `/tournaments/${tournamentId}/rounds/${roundId}/scores/${playerId}`,
        { scores }
      );
      return data;
    },
    onMutate: async ({ tournamentId, roundId, playerId, scores }) => {
      // Cancel related queries to avoid race conditions
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.tournaments.detail(tournamentId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.tournaments.specificRound(tournamentId, roundId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.tournaments.leaderboard(tournamentId),
      });

      // Get snapshot of current data
      const previousTournament = queryClient.getQueryData(
        QUERY_KEYS.tournaments.detail(tournamentId)
      );
      const previousRound = queryClient.getQueryData(
        QUERY_KEYS.tournaments.specificRound(tournamentId, roundId)
      );

      // Optimistically update tournament
      queryClient.setQueryData(
        QUERY_KEYS.tournaments.detail(tournamentId),
        (oldData: any) => {
          if (!oldData) return oldData;

          // Create a deep copy to avoid mutation
          const newData = JSON.parse(JSON.stringify(oldData));

          // Find the round and update player scores
          const roundIndex = newData.rounds.findIndex(
            (r: any) => r.id === roundId
          );
          if (roundIndex >= 0) {
            newData.rounds[roundIndex].scores[playerId] = scores;
          }

          return newData;
        }
      );

      // Also update round data if it's in the cache
      if (previousRound) {
        queryClient.setQueryData(
          QUERY_KEYS.tournaments.specificRound(tournamentId, roundId),
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              scores: {
                ...oldData.scores,
                [playerId]: scores,
              },
            };
          }
        );
      }

      return { previousTournament, previousRound };
    },
    onError: (err, variables, context) => {
      // Roll back optimistic updates
      if (context?.previousTournament) {
        queryClient.setQueryData(
          QUERY_KEYS.tournaments.detail(variables.tournamentId),
          context.previousTournament
        );
      }
      if (context?.previousRound) {
        queryClient.setQueryData(
          QUERY_KEYS.tournaments.specificRound(
            variables.tournamentId,
            variables.roundId
          ),
          context.previousRound
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.specificRound(
          variables.tournamentId,
          variables.roundId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.leaderboard(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.teamLeaderboard(
          variables.tournamentId
        ),
      });
    },
  });
};

export const useInvitePlayersToTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      emails,
    }: {
      eventId: string;
      emails: string[];
    }) => {
      const { data } = await apiClient.post<Tournament | Tour>(
        `/events/${eventId}/invitations`,
        { emails }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(variables.eventId),
      });
    },
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      player,
    }: {
      eventId: string;
      player: Player;
    }) => {
      const { data } = await apiClient.post<Event>(
        `/events/${eventId}/accept-invitation`,
        player
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(variables.eventId),
      });

      // Invalidate user's invitations list
      if (data.data.players && data.data.players.length > 0) {
        const email = data.data.players[0].email;
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.events.lists.invitations(email),
        });
      }

      // If it's a tournament or tour, invalidate specific queries
      if (data.type === "tournament") {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tournaments.detail(variables.eventId),
        });
      } else if (data.type === "tour") {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.tours.detail(variables.eventId),
        });

        // Also invalidate all tournaments in this tour
        const tour = data.data as Tour;
        tour.tournaments.forEach((tournament) => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.tournaments.detail(tournament.id),
          });
        });
      }
    },
  });
};

export const useDeclineInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      userEmail,
    }: {
      eventId: string;
      userEmail: string;
    }) => {
      const { data } = await apiClient.post<boolean>(
        `/events/${eventId}/decline-invitation`,
        { userEmail }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.lists.invitations(variables.userEmail),
      });
    },
  });
};

export const useAddTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      teamData,
    }: {
      tournamentId: string;
      teamData: TeamFormData;
    }) => {
      const { data } = await apiClient.post<Tournament>(
        `/tournaments/${tournamentId}/teams`,
        teamData
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      teamId,
      teamData,
    }: {
      tournamentId: string;
      teamId: string;
      teamData: Partial<Team>;
    }) => {
      const { data } = await apiClient.put<Tournament>(
        `/tournaments/${tournamentId}/teams/${teamId}`,
        teamData
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.teamLeaderboard(
          variables.tournamentId
        ),
      });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      teamId,
    }: {
      tournamentId: string;
      teamId: string;
    }) => {
      const { data } = await apiClient.delete<Tournament>(
        `/tournaments/${tournamentId}/teams/${teamId}`
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.teamLeaderboard(
          variables.tournamentId
        ),
      });
    },
  });
};

export const useAssignPlayerToTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      playerId,
      teamId,
    }: {
      tournamentId: string;
      playerId: string;
      teamId?: string;
    }) => {
      const { data } = await apiClient.put<Tournament>(
        `/tournaments/${tournamentId}/players/${playerId}/team`,
        { teamId }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.teamLeaderboard(
          variables.tournamentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.leaderboard(variables.tournamentId),
      });
    },
  });
};

export const useCreateShoutOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      roundId,
      playerId,
      holeNumber,
      type,
      message,
    }: {
      tournamentId: string;
      roundId: string;
      playerId: string;
      holeNumber: number;
      type: string;
      message?: string;
    }) => {
      const { data } = await apiClient.post<Tournament>(
        `/tournaments/${tournamentId}/shoutouts`,
        { roundId, playerId, holeNumber, type, message }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.shoutOuts(variables.tournamentId),
      });
    },
  });
};

export const useCreateHighlight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      playerId,
      title,
      mediaType,
      description,
      roundId,
      mediaUrl,
    }: {
      tournamentId: string;
      playerId: string;
      title: string;
      mediaType: string;
      description?: string;
      roundId?: string;
      mediaUrl?: string;
    }) => {
      const { data } = await apiClient.post<Tournament>(
        `/tournaments/${tournamentId}/highlights`,
        { playerId, title, mediaType, description, roundId, mediaUrl }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.highlights(variables.tournamentId),
      });
    },
  });
};

export const useUpdateEventStatuses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post("/events/update-statuses");
      return data;
    },
    onSuccess: () => {
      // This affects potentially all events, so invalidate broadly
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useUpdateMatchResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      roundId,
      playerId,
      opponentId,
      result,
      points,
    }: {
      tournamentId: string;
      roundId: string;
      playerId: string;
      opponentId: string;
      result: string;
      points: number;
    }) => {
      const { data } = await apiClient.put<Tournament>(
        `/tournaments/${tournamentId}/rounds/${roundId}/match-results`,
        { playerId, opponentId, result, points }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.detail(variables.tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tournaments.specificRound(
          variables.tournamentId,
          variables.roundId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.lists.byUser(data.data.createdBy),
      });
    },
  });
};
