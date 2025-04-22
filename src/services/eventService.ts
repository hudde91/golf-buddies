import { v4 as uuidv4 } from "uuid";
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
} from "../types/event";
import achievementService from "./achievementService";
import { useQuery } from "@tanstack/react-query";

const EVENTS_KEY = "events";
const API_BASE_URL =
  "https://golf-buddies-epfddeddfqdhbtgy.westeurope-01.azurewebsites.net/api";

// export const useGetEventById = (clerkId: string) => {
//   return useQuery({
//     queryKey: ["event", clerkId],
//     queryFn: async () => {
//       const response = await axios.get(`${API_BASE_URL}/events/${clerkId}`);
//       return response.data;
//     },
//     enabled: !!clerkId, // Only run the query if clerkId is provided
//   });
// };

// export const useGetUserEvents = (userId: string) => {
//   return useQuery({
//     queryKey: ["userEvents", userId],
//     queryFn: async () => {
//       const response = await axios.get(
//         `${API_BASE_URL}/event/${userId}/events`
//       );
//       return response.data;
//     },
//     enabled: !!userId, // Only run the query if userId is provided
//   });
// };

// Enhanced getEventById with fallback to local storage
// export const getEventById = async (id: string): Promise<Event | null> => {
//   try {
//     // Try to get from API first
//     const response = await axios.get(`${API_BASE_URL}/events/${id}`);
//     return response.data;
//   } catch (error) {
//     console.warn("API fetch failed, falling back to local storage:", error);

//     // Fall back to local storage
//     try {
//       const events = eventService.getAllEvents();
//       return events.find((e) => e.id === id) || null;
//     } catch (fallbackError) {
//       console.error("Local storage fallback also failed:", fallbackError);
//       return null;
//     }
//   }
// };

export const useGetEventById = (eventId: string) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/event/${eventId}`);
        if (!response.ok) {
          throw new Error(`API error with status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.warn("API fetch failed, falling back to local storage");

        // Fall back to local storage
        const events = eventService.getAllEvents();
        const event = events.find((e) => e.id === eventId);

        if (!event) {
          throw new Error("Event not found in API or local storage");
        }

        return event;
      }
    },
    enabled: !!eventId, // Only run the query if eventId is provided
  });
};

// Similarly enhanced useGetUserEvents
export const useGetUserEvents = (userId: string) => {
  return useQuery({
    queryKey: ["userEvents", userId],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/event/${userId}/events`);
        if (!response.ok) {
          throw new Error(`API error with status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.warn("API fetch failed, falling back to local storage");

        // Fall back to local storage
        return eventService.getUserEvents(userId);
      }
    },
    enabled: !!userId, // Only run the query if userId is provided
  });
};

const createGameplayAPI = async (
  type: "tournament" | "tour" | "round",
  data: any,
  clerkId: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/event/creategameplay?clerkId=${clerkId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          // Remove below once Rasmus updates service
          location: "",
          hostName: "",
          imageUrl: "",
          ...data,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error creating ${type} via API:`, error);
    throw error;
  }
};

// Available round formats
export const roundFormats = [
  "Stroke Play",
  "Match Play",
  "Four-ball",
  "Foursomes",
  "Singles Match Play",
  "Better Ball",
  "Scramble",
  "Modified Stableford",
  "Skins Game",
];

// Available team colors
export const teamColors = [
  "#1976d2", // Blue
  "#dc004e", // Red
  "#388e3c", // Green
  "#f57c00", // Orange
  "#9c27b0", // Purple
  "#00796b", // Teal
  "#ffc107", // Amber
  "#607d8b", // Blue-gray
  "#d32f2f", // Deep red
];

const getEventStatus = (
  startDate: string,
  endDate: string
): "upcoming" | "active" | "completed" => {
  const today = new Date().toISOString().split("T")[0];

  if (startDate <= today && endDate >= today) {
    return "active";
  } else if (endDate < today) {
    return "completed";
  } else {
    return "upcoming";
  }
};

// Function to find a tournament in the events array (either standalone or in a tour)
const findTournamentInEvents = (
  events: Event[],
  tournamentId: string
): {
  tournament: Tournament;
  parentEventIndex: number;
  tournamentIndex?: number;
} | null => {
  // First check standalone tournament events
  const tournamentEventIndex = events.findIndex(
    (e) => e.type === "tournament" && e.id === tournamentId
  );

  if (tournamentEventIndex !== -1) {
    return {
      tournament: events[tournamentEventIndex] as Tournament,
      parentEventIndex: tournamentEventIndex,
    };
  }

  // Then check tours for the tournament
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.type === "tour") {
      const tour = event as Tour;
      const tournamentIndex = tour.tournaments.findIndex(
        (t) => t.id === tournamentId
      );

      if (tournamentIndex !== -1) {
        return {
          tournament: tour.tournaments[tournamentIndex],
          parentEventIndex: i,
          tournamentIndex,
        };
      }
    }
  }

  return null;
};

const updateTournamentInEvents = (
  events: Event[],
  tournamentId: string,
  updatedTournament: Tournament
): Event[] => {
  const updatedEvents = [...events];
  const result = findTournamentInEvents(events, tournamentId);

  if (!result) return updatedEvents;

  const { parentEventIndex, tournamentIndex } = result;

  if (tournamentIndex === undefined) {
    // It's a standalone tournament event
    updatedEvents[parentEventIndex] = {
      ...updatedEvents[parentEventIndex],
      ...updatedTournament,
    };
  } else {
    // It's part of a tour
    const tour = updatedEvents[parentEventIndex] as Tour;
    const updatedTour = { ...tour };
    updatedTour.tournaments = [...tour.tournaments];
    updatedTour.tournaments[tournamentIndex] = updatedTournament;

    updatedEvents[parentEventIndex] = {
      ...updatedEvents[parentEventIndex],
      ...updatedTour,
    };
  }

  return updatedEvents;
};

// Helper function to calculate a leaderboard for a single round
const getRoundLeaderboard = (
  round: Round
): {
  playerId: string;
  playerName: string;
  teamId?: string;
  teamName?: string;
  score: number;
}[] => {
  // Get player details
  const playerDetails: {
    [playerId: string]: { name: string; teamId?: string; teamName?: string };
  } = {};
  (round.players || []).forEach((player) => {
    const team = player.teamId ? { id: player.teamId, name: "" } : undefined;
    playerDetails[player.id] = {
      name: player.name,
      teamId: player.teamId,
      teamName: team?.name,
    };
  });

  // Calculate scores for each player
  return Object.entries(round.scores)
    .map(([playerId, holeScores]) => {
      const totalScore = holeScores.reduce(
        (sum, hole) => sum + (hole.score || 0),
        0
      );

      const playerDetail = playerDetails[playerId] || {
        name: "Unknown Player",
      };

      return {
        playerId,
        playerName: playerDetail.name,
        teamId: playerDetail.teamId,
        teamName: playerDetail.teamName,
        score: totalScore,
      };
    })
    .sort((a, b) => a.score - b.score);
};

const eventService = {
  // Get all events
  getAllEvents: (): Event[] => {
    const eventsJson = localStorage.getItem(EVENTS_KEY);
    if (!eventsJson) return [];
    return JSON.parse(eventsJson);
  },

  // Get event by ID - using the API now
  // getEventById: async (id: string): Promise<Event | null> => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/events/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching event by ID:", error);
  //     return null;
  //   }
  // },

  // Legacy getEventById for when you need the synchronous version
  getEventByIdSync: (id: string): Event | null => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.id === id);
    return event || null;
  },

  // Get events where user is owner or player
  getUserEvents: (userId: string): Event[] => {
    const events = eventService.getAllEvents();
    return events.filter((event) => {
      if (event.type === "tournament") {
        const tournament = event as Tournament;
        return (
          tournament.createdBy === userId ||
          tournament.players.some((player) => player.id === userId)
        );
      } else if (event.type === "tour") {
        const tour = event as Tour;
        return (
          tour.createdBy === userId ||
          (tour.players &&
            tour.players.some((player) => player.id === userId)) ||
          tour.tournaments.some((tournament) =>
            tournament.players.some((player) => player.id === userId)
          )
        );
      } else if (event.type === "round") {
        const round = event;
        return (
          round.createdBy === userId ||
          (round.players &&
            round.players.some((player) => player.id === userId))
        );
      }
      return false;
    });
  },

  // // Get event by ID
  getEventById: (id: string): Event | null => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.id === id);
    return event || null;
  },

  // Get tournament by ID (used for invitations and other legacy features)
  getTournamentById: (id: string): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, id);
    return result ? result.tournament : null;
  },

  createTournament: async (
    data: TournamentFormData & { inviteFriends?: string[] },
    currentUser: Player
  ): Promise<Event> => {
    try {
      // Try to create tournament via API first
      const apiResponse = await createGameplayAPI(
        "tournament",
        {
          ...data,
          currentUser,
        },
        currentUser.id
      );

      return apiResponse;
    } catch (error) {
      console.warn(
        "API tournament creation failed, falling back to local storage"
      );

      // Fallback to local storage implementation
      const events = eventService.getAllEvents();

      // Create tournament
      const status = getEventStatus(data.startDate, data.endDate);

      const newTournament: Tournament = {
        id: uuidv4(),
        name: data.name,
        type: "tournament",
        format: "Standard", // Default format
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        description: data.description,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        players: [currentUser],
        teams: [],
        rounds: [],
        invitations: data.inviteFriends || [], // Add selected friends to invitations
        isTeamEvent: data.isTeamEvent,
        scoringType: data.scoringType,
        status,
      };

      // Create event wrapper
      const newEvent: Event = {
        ...newTournament,
      };

      events.push(newEvent);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

      return newEvent;
    }
  },

  // Update the createTour method
  createTour: async (
    data: TourFormData & { inviteFriends?: string[] },
    userId: string,
    userName: string
  ): Promise<Event> => {
    try {
      // Try to create tour via API first
      const apiResponse = await createGameplayAPI(
        "tour",
        {
          ...data,
          userId,
          userName,
        },
        userId
      );

      return apiResponse;
    } catch (error) {
      console.warn("API tour creation failed, falling back to local storage");

      // Fallback to local storage implementation
      const events = eventService.getAllEvents();

      // Determine status
      const status = getEventStatus(data.startDate, data.endDate);

      // Create current user as player
      const currentUser: Player = {
        id: userId,
        name: userName,
        email: "", // We may need to add this from the user object if available
        avatarUrl: "", // We may need to add this from the user object if available
        teamId: "",
        bio: "",
        question1: "",
        question2: "",
        question3: "",
        question4: "",
      };

      // Create tour
      const newTour: Tour = {
        id: uuidv4(),
        name: data.name,
        type: "tour",
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        tournaments: [],
        rounds: [],
        players: [currentUser], // Add the creator as the first player
        invitations: data.inviteFriends || [], // Add selected friends to invitations
        status: status,
        isTeamEvent: data.isTeamEvent || false, // Add team event flag
        scoringType: data.isTeamEvent
          ? data.scoringType || "individual"
          : "individual",
        pointsSystem: {
          win: 100,
          topFinish: { 1: 100, 2: 80, 3: 60, 4: 40, 5: 20 },
          participation: 10,
        },
      };

      const newEvent: Event = {
        ...newTour,
      };

      events.push(newEvent);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

      return newEvent;
    }
  },

  createRound: async (
    data: RoundFormData & { inviteFriends?: string[] },
    currentUser: Player
  ): Promise<Event> => {
    try {
      // Try to create round via API first
      console.log("Attempting to create round via API");
      const apiResponse = await createGameplayAPI(
        "round",
        {
          ...data,
          currentUser,
        },
        currentUser.id
      );

      console.log("API round creation successful:", apiResponse);
      return apiResponse;
    } catch (error) {
      console.warn(
        "API round creation failed, falling back to local storage:",
        error
      );

      // Fallback to local storage implementation
      const events = eventService.getAllEvents();

      // Determine status based on the date
      const today = new Date().toISOString().split("T")[0];
      const status =
        data.date === today
          ? "active"
          : data.date < today
          ? "completed"
          : "upcoming";

      // Initialize empty scores for the current user
      const scores: { [playerId: string]: HoleScore[] } = {};
      const holeScores: HoleScore[] = [];

      for (let i = 1; i <= data.holes; i++) {
        holeScores.push({
          hole: i,
          par: data.par ? Math.floor(data.par / data.holes) : undefined,
        });
      }

      scores[currentUser.id] = holeScores;

      // Create the new round
      const newRound: Round = {
        id: uuidv4(),
        name: data.name,
        type: "round",
        date: data.date,
        courseDetails: {
          name: data.courseName,
          holes: data.holes,
          par: data.par,
        },
        format: data.format,
        scores,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        players: [currentUser],
        description: data.description || "",
        status,
        invitations: data.inviteFriends || [],
        playerGroups: [
          {
            id: uuidv4(),
            name: data.name,
            playerIds: [currentUser.id],
          },
        ],
      };

      // Create event wrapper
      const newEvent: Event = {
        ...newRound,
      };

      events.push(newEvent);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      console.log("Created round via local storage:", newEvent);

      return newEvent;
    }
  },

  addRoundToTour: (
    tourId: string,
    roundData: RoundFormData,
    currentUser: Player
  ): Event | null => {
    const event = eventService.getEventByIdSync(tourId);
    if (!event || event.type !== "tour") return null;

    const tour = event as Tour;

    // Create scores object with empty scores for all players
    const scores: { [playerId: string]: HoleScore[] } = {};
    (tour.players || []).forEach((player) => {
      const holeScores: HoleScore[] = [];
      for (let i = 1; i <= roundData.holes; i++) {
        holeScores.push({
          hole: i,
          par: roundData.par
            ? Math.floor(roundData.par / roundData.holes)
            : undefined,
        });
      }
      scores[player.id] = holeScores;
    });

    // Determine status based on the date
    const today = new Date().toISOString().split("T")[0];
    const status =
      roundData.date === today
        ? "active"
        : roundData.date < today
        ? "completed"
        : "upcoming";

    // Create the new round
    const newRound: Round = {
      id: uuidv4(),
      name: roundData.name,
      type: "round",
      date: roundData.date,
      courseDetails: {
        name: roundData.courseName,
        holes: roundData.holes,
        par: roundData.par,
      },
      format: roundData.format,
      scores,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      players: tour.players || [currentUser],
      description: roundData.description || "",
      status,
      invitations: roundData.inviteFriends || [],
      playerGroups: [
        {
          id: uuidv4(),
          name: roundData.name,
          playerIds: [currentUser.id],
        },
      ],
    };

    // Initialize rounds array if it doesn't exist (for backward compatibility)
    const tourRounds = tour.rounds || [];

    // Update the tour
    const updatedTour: Tour = {
      ...tour,
      rounds: [...tourRounds, newRound],
    };

    // Update overall tour status based on round dates if needed
    if (roundData.date < tour.startDate) {
      updatedTour.startDate = roundData.date;
    }
    if (roundData.date > tour.endDate) {
      updatedTour.endDate = roundData.date;
    }
    updatedTour.status = getEventStatus(
      updatedTour.startDate,
      updatedTour.endDate
    );

    // Update event in storage
    return eventService.updateEvent(tourId, {
      ...updatedTour,
    });
  },

  // Update the addTournamentToTour method to include friend invitations
  addTournamentToTour: (
    tourId: string,
    tournamentData: TournamentFormData & { inviteFriends?: string[] },
    currentUser: Player
  ): Event | null => {
    const event = eventService.getEventByIdSync(tourId);
    if (!event || event.type !== "tour") return null;

    const tour = event as Tour;

    // Create the new tournament
    const newTournament: Tournament = {
      id: uuidv4(),
      name: tournamentData.name,
      type: "tournament",
      format: "Standard", // Default format
      startDate: tournamentData.startDate,
      endDate: tournamentData.endDate,
      location: tournamentData.location,
      description: tournamentData.description,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      players: tour.players || [currentUser],
      teams: tour.teams || [],
      rounds: [],
      invitations: tournamentData.inviteFriends || [], // Add selected friends to invitations
      isTeamEvent: tournamentData.isTeamEvent,
      scoringType: tournamentData.scoringType,
      status: getEventStatus(tournamentData.startDate, tournamentData.endDate),
    };

    // Update the tour
    const updatedTour: Tour = {
      ...tour,
      tournaments: [...tour.tournaments, newTournament],
    };

    // Update overall tour status based on tournament dates if needed
    if (tournamentData.startDate < tour.startDate) {
      updatedTour.startDate = tournamentData.startDate;
    }
    if (tournamentData.endDate > tour.endDate) {
      updatedTour.endDate = tournamentData.endDate;
    }
    updatedTour.status = getEventStatus(
      updatedTour.startDate,
      updatedTour.endDate
    );

    // Update event in storage
    return eventService.updateEvent(tourId, {
      ...updatedTour,
    });
  },

  // Update event
  updateEvent: (id: string, updates: Partial<Event>): Event | null => {
    const events = eventService.getAllEvents();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) return null;

    const updatedEvent = {
      ...events[index],
      ...updates,
    };

    events[index] = updatedEvent;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    return updatedEvent;
  },

  // Update tournament
  updateTournament: (
    id: string,
    data: Partial<Tournament>
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, id);

    if (!result) return null;

    const { tournament } = result;
    const updatedTournament = { ...tournament, ...data };

    // Update status if dates changed
    const oldStatus = tournament.status;
    if (data.startDate || data.endDate) {
      const startDate = data.startDate || tournament.startDate;
      const endDate = data.endDate || tournament.endDate;
      updatedTournament.status = getEventStatus(startDate, endDate);
    }

    const updatedEvents = updateTournamentInEvents(
      events,
      id,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    // If status changed to completed, process achievements
    if (oldStatus !== "completed" && updatedTournament.status === "completed") {
      setTimeout(() => achievementService.processCompletedTournament(id), 0);
    }

    return updatedTournament;
  },

  // Delete event
  deleteEvent: (id: string): boolean => {
    const events = eventService.getAllEvents();
    const filteredEvents = events.filter((e) => e.id !== id);

    if (filteredEvents.length === events.length) return false;

    localStorage.setItem(EVENTS_KEY, JSON.stringify(filteredEvents));
    return true;
  },

  // Delete tournament
  deleteTournament: (id: string): boolean => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, id);

    if (!result) return false;

    const { parentEventIndex, tournamentIndex } = result;

    if (tournamentIndex === undefined) {
      // It's a standalone tournament event, delete the whole event
      return eventService.deleteEvent(id);
    } else {
      // It's part of a tour, just remove the tournament from the tour
      const event = events[parentEventIndex];
      const tour = event as Tour;
      const updatedTour = { ...tour };
      updatedTour.tournaments = tour.tournaments.filter((t) => t.id !== id);

      events[parentEventIndex] = {
        ...event,
        ...updatedTour,
      };

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return true;
    }
  },

  // Add a player to a tournament event
  addPlayerToEvent: (eventId: string, player: Player): Event | null => {
    const event = eventService.getEventByIdSync(eventId);
    if (!event) return null;

    if (event.type === "tournament") {
      const tournament = event as Tournament;

      // Check if player is already in the tournament
      if (tournament.players.some((p) => p.id === player.id)) {
        return event;
      }

      const updatedPlayers = [...tournament.players, player];

      // Also add player to all existing rounds with empty scores
      const updatedRounds = tournament.rounds.map((round) => {
        if (!round.scores[player.id]) {
          const emptyScores: HoleScore[] = [];
          for (let i = 1; i <= round.courseDetails?.holes! || 18; i++) {
            emptyScores.push({ hole: i });
          }
          return {
            ...round,
            scores: {
              ...round.scores,
              [player.id]: emptyScores,
            },
          };
        }
        return round;
      });

      const updatedTournament = {
        ...tournament,
        players: updatedPlayers,
        rounds: updatedRounds,
      };

      return eventService.updateEvent(eventId, {
        ...updatedTournament,
      });
    } else if (event.type === "tour") {
      const tour = event as Tour;

      // Check if player is already in the tour
      if (tour.players && tour.players.some((p) => p.id === player.id)) {
        return event;
      }

      // Add player to tour
      const updatedPlayers = [...(tour.players || []), player];

      // Add player to all tournaments in the tour
      const updatedTournaments = tour.tournaments.map((tournament) => {
        if (tournament.players.some((p) => p.id === player.id)) {
          return tournament;
        }

        const updatedTournamentPlayers = [...tournament.players, player];

        // Add player to all rounds in this tournament
        const updatedRounds = tournament.rounds.map((round) => {
          if (!round.scores[player.id]) {
            const emptyScores: HoleScore[] = [];
            for (let i = 1; i <= round.courseDetails?.holes! || 18; i++) {
              emptyScores.push({ hole: i });
            }
            return {
              ...round,
              scores: {
                ...round.scores,
                [player.id]: emptyScores,
              },
            };
          }
          return round;
        });

        return {
          ...tournament,
          players: updatedTournamentPlayers,
          rounds: updatedRounds,
        };
      });

      const updatedTour = {
        ...tour,
        players: updatedPlayers,
        tournaments: updatedTournaments,
      };

      return eventService.updateEvent(eventId, {
        ...updatedTour,
      });
    }

    return null;
  },

  // Add a round to a tournament
  addRound: (
    tournamentId: string,
    roundData: RoundFormData
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    // Create scores object with empty scores for all players
    const scores: { [playerId: string]: HoleScore[] } = {};
    tournament.players.forEach((player) => {
      const holeScores: HoleScore[] = [];
      for (let i = 1; i <= roundData.holes; i++) {
        holeScores.push({
          hole: i,
          par: roundData.par
            ? Math.floor(roundData.par / roundData.holes)
            : undefined,
        });
      }
      scores[player.id] = holeScores;
    });

    const newRound: Round = {
      id: uuidv4(),
      name: roundData.name,
      type: "round",
      date: roundData.date,
      format: roundData.format,
      courseDetails: {
        name: roundData.courseName,
        holes: roundData.holes,
        par: roundData.par,
      },
      scores,
    };

    // Update the tournament with the new round
    const updatedTournament = {
      ...tournament,
      rounds: [...tournament.rounds, newRound],
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  // Update round in a tournament
  updateRound: (
    tournamentId: string,
    roundId: string,
    data: Partial<Round>
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;
    const roundIndex = tournament.rounds.findIndex((r) => r.id === roundId);

    if (roundIndex === -1) return null;

    // Update the round
    const updatedRounds = [...tournament.rounds];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      ...data,
    };

    // Update the tournament
    const updatedTournament = {
      ...tournament,
      rounds: updatedRounds,
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  // Delete a round
  deleteRound: (tournamentId: string, roundId: string): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    // Remove the round
    const updatedRounds = tournament.rounds.filter((r) => r.id !== roundId);

    // Update the tournament
    const updatedTournament = {
      ...tournament,
      rounds: updatedRounds,
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  // Update player groups for a round
  updatePlayerGroups: (
    tournamentId: string,
    roundId: string,
    playerGroups: PlayerGroup[]
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;
    const roundIndex = tournament.rounds.findIndex((r) => r.id === roundId);

    if (roundIndex === -1) return null;

    // Update the player groups for this round
    const updatedRounds = [...tournament.rounds];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      playerGroups: playerGroups,
    };

    // Update the tournament
    const updatedTournament = {
      ...tournament,
      rounds: updatedRounds,
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  // Get player groups for a round
  getRoundPlayerGroups: (
    tournamentId: string,
    roundId: string
  ): PlayerGroup[] => {
    const tournament = eventService.getTournamentById(tournamentId);
    if (!tournament) return [];

    const round = tournament.rounds.find((r) => r.id === roundId);
    if (!round) return [];

    return round.playerGroups || [];
  },

  updateTournamentPlayerGroups: (
    tournamentId: string,
    roundId: string,
    playerGroups: PlayerGroup[]
  ): Tournament | null => {
    return eventService.updateRound(tournamentId, roundId, { playerGroups });
  },

  // Create a shoutOut for special achievements
  createShoutOut: (
    tournamentId: string,
    roundId: string,
    playerId: string,
    holeNumber: number,
    type: "birdie" | "eagle" | "hole-in-one",
    message?: string
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    // Create new shoutOut
    const newShoutOut: ShoutOut = {
      id: uuidv4(),
      tournamentId,
      roundId,
      playerId,
      holeNumber,
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    // Add shoutOut to tournament
    const updatedTournament = {
      ...tournament,
      shoutOuts: [...(tournament.shoutOuts || []), newShoutOut],
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  // Get all shoutOuts for a tournament
  getTournamentShoutOuts: (tournamentId: string): ShoutOut[] => {
    const tournament = eventService.getTournamentById(tournamentId);
    if (!tournament || !tournament.shoutOuts) return [];
    return tournament.shoutOuts;
  },

  detectAchievements: (
    tournamentId: string,
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ): void => {
    const tournament = eventService.getTournamentById(tournamentId);
    if (!tournament) return;

    const round = tournament.rounds.find((r) => r.id === roundId);
    if (!round) return;

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
          diff === 2 ? "Amazing eagle!" : "Spectacular double eagle or better!"
        );
      }
    });
  },

  // Create a highlight with media (image or video)
  createHighlight: (
    tournamentId: string,
    playerId: string,
    title: string,
    mediaType: "image" | "video",
    description?: string,
    roundId?: string,
    mediaUrl?: string
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    // Create new highlight
    const newHighlight: Highlight = {
      id: uuidv4(),
      tournamentId,
      playerId,
      roundId,
      title,
      description,
      mediaUrl,
      mediaType,
      timestamp: new Date().toISOString(),
    };

    // Add highlight to tournament
    const updatedTournament = {
      ...tournament,
      highlights: [...(tournament.highlights || []), newHighlight],
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  // Get all highlights for a tournament
  getTournamentHighlights: (tournamentId: string): Highlight[] => {
    const tournament = eventService.getTournamentById(tournamentId);
    if (!tournament || !tournament.highlights) return [];
    return tournament.highlights;
  },

  // Update player scores for a round
  updateRoundScores: (
    tournamentId: string,
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;
    const roundIndex = tournament.rounds.findIndex((r) => r.id === roundId);

    if (roundIndex === -1) return null;

    // Update the scores for this player in this round
    const updatedRounds = [...tournament.rounds];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      scores: {
        ...updatedRounds[roundIndex].scores,
        [playerId]: scores,
      },
    };

    // Update the tournament
    const updatedTournament = {
      ...tournament,
      rounds: updatedRounds,
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    // Detect achievements and create shoutOuts (add this line)
    eventService.detectAchievements(tournamentId, roundId, playerId, scores);

    return updatedTournament;
  },

  // Invite players to a tournament or tour
  invitePlayersToTournament: (
    eventId: string,
    emails: string[]
  ): Tournament | Tour | null => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.id === eventId);

    if (!event) return null;

    if (event.type === "tournament") {
      // Inviting to a standalone tournament
      const tournament = event as Tournament;

      // Filter out duplicates and existing players
      const existingEmails = tournament.players.map((p) => p.email);
      const newInvitations = emails.filter(
        (email) =>
          !existingEmails.includes(email) &&
          !tournament.invitations.includes(email)
      );

      // Update the tournament with new invitations
      const updatedTournament = {
        ...tournament,
        invitations: [...tournament.invitations, ...newInvitations],
      };

      const updatedEvents = updateTournamentInEvents(
        events,
        eventId,
        updatedTournament
      );
      localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

      return updatedTournament;
    } else if (event.type === "tour") {
      // Inviting to a tour
      const tour = event as Tour;

      // Filter out duplicates and existing players
      const existingEmails = tour.players?.map((p) => p.email) || [];
      const newInvitations = emails.filter(
        (email) =>
          !existingEmails.includes(email) &&
          !(tour.invitations || []).includes(email)
      );

      // Initialize invitations array if it doesn't exist
      const tourInvitations = tour.invitations || [];

      // Update the tour with new invitations
      const updatedTour = {
        ...tour,
        invitations: [...tourInvitations, ...newInvitations],
      };

      // Also add these invitations to all tournaments in the tour
      const updatedTournaments = tour.tournaments.map((tournament) => {
        const tournamentExistingEmails = tournament.players.map((p) => p.email);
        const tournamentNewInvitations = newInvitations.filter(
          (email) =>
            !tournamentExistingEmails.includes(email) &&
            !tournament.invitations.includes(email)
        );

        return {
          ...tournament,
          invitations: [...tournament.invitations, ...tournamentNewInvitations],
        };
      });

      updatedTour.tournaments = updatedTournaments;

      // Update the event in the events array
      events[events.findIndex((e) => e.id === eventId)] = {
        ...event,
        ...updatedTour,
      };

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

      return updatedTour;
    }

    return null;
  },

  // Accept invitation to join tournament or tour
  acceptInvitation: (eventId: string, player: Player): Event | null => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      // If not found as a direct event, try to find as a tournament within a tour
      const result = findTournamentInEvents(events, eventId);
      if (result) {
        const { tournament, parentEventIndex, tournamentIndex } = result;

        // Check if user is in the invitations list
        if (!tournament.invitations.includes(player.email)) return null;

        // Add player to the tournament
        const updatedTournament = {
          ...tournament,
          players: [...tournament.players, player],
          invitations: tournament.invitations.filter(
            (email) => email !== player.email
          ),
        };

        // Update rounds with empty scores for the player
        updatedTournament.rounds = updatedTournament.rounds.map((round) => {
          if (!round.scores[player.id]) {
            const emptyScores: HoleScore[] = [];
            for (let i = 1; i <= round.courseDetails?.holes! || 18; i++) {
              emptyScores.push({ hole: i });
            }
            return {
              ...round,
              scores: {
                ...round.scores,
                [player.id]: emptyScores,
              },
            };
          }
          return round;
        });

        // Update the tournament in the tour
        const tourEvent = events[parentEventIndex];
        const tour = tourEvent as Tour;
        const updatedTour = { ...tour };

        if (tournamentIndex !== undefined) {
          updatedTour.tournaments = [...tour.tournaments];
          updatedTour.tournaments[tournamentIndex] = updatedTournament;
        }

        // Also add the player to the tour's player list if not already there
        if (
          !updatedTour.players ||
          !updatedTour.players.some((p) => p.id === player.id)
        ) {
          updatedTour.players = [...(updatedTour.players || []), player];
        }

        const updatedEvent = {
          ...tourEvent,
          data: updatedTour,
        };

        events[parentEventIndex] = updatedEvent;
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

        return updatedEvent;
      }

      return null;
    }

    if (event.type === "tournament") {
      // Accepting invitation to a standalone tournament
      const tournament = event as Tournament;

      // Check if user is in the invitations list
      if (!tournament.invitations.includes(player.email)) return null;

      // Add player to the tournament
      const updatedPlayers = [...tournament.players, player];

      // Add player to all existing rounds with empty scores
      const updatedRounds = tournament.rounds.map((round) => {
        if (!round.scores[player.id]) {
          const emptyScores: HoleScore[] = [];
          for (let i = 1; i <= round.courseDetails?.holes! || 18; i++) {
            emptyScores.push({ hole: i });
          }
          return {
            ...round,
            scores: {
              ...round.scores,
              [player.id]: emptyScores,
            },
          };
        }
        return round;
      });

      // Remove from invitations
      const updatedInvitations = tournament.invitations.filter(
        (email) => email !== player.email
      );

      const updatedTournament = {
        ...tournament,
        players: updatedPlayers,
        rounds: updatedRounds,
        invitations: updatedInvitations,
      };

      const updatedEvent = {
        ...event,
        data: updatedTournament,
      };

      events[events.findIndex((e) => e.id === eventId)] = updatedEvent;
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

      return updatedEvent;
    } else if (event.type === "tour") {
      // Accepting invitation to a tour
      const tour = event as Tour;

      // Check if tour has invitations array and if user is in it
      if (!tour.invitations || !tour.invitations.includes(player.email))
        return null;

      // Add player to the tour
      const updatedPlayers = [...(tour.players || []), player];

      // Remove from tour invitations
      const updatedInvitations = tour.invitations.filter(
        (email) => email !== player.email
      );

      // Also add player to all tournaments in the tour
      const updatedTournaments = tour.tournaments.map((tournament) => {
        // Add to tournament players if not already there
        let updatedTournament = { ...tournament };
        if (!tournament.players.some((p) => p.id === player.id)) {
          updatedTournament.players = [...tournament.players, player];
        }

        // Add to all rounds with empty scores
        updatedTournament.rounds = updatedTournament.rounds.map((round) => {
          if (!round.scores[player.id]) {
            const emptyScores: HoleScore[] = [];
            for (let i = 1; i <= round.courseDetails?.holes! || 18; i++) {
              emptyScores.push({ hole: i });
            }
            return {
              ...round,
              scores: {
                ...round.scores,
                [player.id]: emptyScores,
              },
            };
          }
          return round;
        });

        // Remove from tournament invitations
        if (tournament.invitations.includes(player.email)) {
          updatedTournament.invitations = tournament.invitations.filter(
            (email) => email !== player.email
          );
        }

        return updatedTournament;
      });

      const updatedTour = {
        ...tour,
        players: updatedPlayers,
        tournaments: updatedTournaments,
        invitations: updatedInvitations,
      };

      const updatedEvent = {
        ...event,
        data: updatedTour,
      };

      events[events.findIndex((e) => e.id === eventId)] = updatedEvent;
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

      return updatedEvent;
    }

    return null;
  },

  declineInvitation: (eventId: string, userEmail: string): boolean => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      // If not found as a direct event, try to find as a tournament within a tour
      const result = findTournamentInEvents(events, eventId);
      if (result) {
        const { tournament } = result;

        // Check if the invitation exists
        if (!tournament.invitations.includes(userEmail)) return false;

        const updatedTournament = {
          ...tournament,
          invitations: tournament.invitations.filter(
            (email) => email !== userEmail
          ),
        };

        const updatedEvents = updateTournamentInEvents(
          events,
          eventId,
          updatedTournament
        );
        localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

        return true;
      }

      return false;
    }

    if (event.type === "tournament") {
      // Declining invitation to a standalone tournament
      const tournament = event as Tournament;

      if (!tournament.invitations.includes(userEmail)) return false;

      const updatedTournament = {
        ...tournament,
        invitations: tournament.invitations.filter(
          (email) => email !== userEmail
        ),
      };

      events[events.findIndex((e) => e.id === eventId)] = {
        ...event,
        ...updatedTournament,
      };

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return true;
    } else if (event.type === "tour") {
      // Declining invitation to a tour
      const tour = event as Tour;

      // Check if tour has invitations and if the invitation exists
      if (!tour.invitations || !tour.invitations.includes(userEmail))
        return false;

      // Remove from tour invitations
      const updatedInvitations = tour.invitations.filter(
        (email) => email !== userEmail
      );

      // Also remove from all tournament invitations in this tour
      const updatedTournaments = tour.tournaments.map((tournament) => {
        if (tournament.invitations.includes(userEmail)) {
          return {
            ...tournament,
            invitations: tournament.invitations.filter(
              (email) => email !== userEmail
            ),
          };
        }
        return tournament;
      });

      const updatedTour = {
        ...tour,
        invitations: updatedInvitations,
        tournaments: updatedTournaments,
      };

      events[events.findIndex((e) => e.id === eventId)] = {
        ...event,
        ...updatedTour,
      };

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return true;
    }

    return false;
  },

  addTeam: (
    tournamentId: string,
    teamData: TeamFormData
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    const newTeam: Team = {
      id: uuidv4(),
      name: teamData.name,
      color: teamData.color,
      logo: teamData.logo,
      captain: teamData.captain,
    };

    // Add the team to the tournament
    const updatedTournament = {
      ...tournament,
      teams: [...tournament.teams, newTeam],
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  updateTeam: (
    tournamentId: string,
    teamId: string,
    teamData: Partial<Team>
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    const updatedTeams = tournament.teams.map((team) =>
      team.id === teamId ? { ...team, ...teamData } : team
    );

    const updatedTournament = {
      ...tournament,
      teams: updatedTeams,
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  deleteTeam: (tournamentId: string, teamId: string): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    const updatedTeams = tournament.teams.filter((team) => team.id !== teamId);

    // Remove team association from players
    const updatedPlayers = tournament.players.map((player) =>
      player.teamId === teamId ? { ...player, teamId: undefined } : player
    );

    const updatedTournament = {
      ...tournament,
      teams: updatedTeams,
      players: updatedPlayers,
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  assignPlayerToTeam: (
    tournamentId: string,
    playerId: string,
    teamId?: string
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    const updatedPlayers = tournament.players.map((player) =>
      player.id === playerId ? { ...player, teamId } : player
    );

    const updatedTournament = {
      ...tournament,
      players: updatedPlayers,
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  getTournamentLeaderboard: (
    tournamentId: string
  ): {
    playerId: string;
    playerName: string;
    teamId?: string;
    teamName?: string;
    total: number;
    roundTotals: { [roundId: string]: number };
  }[] => {
    const tournament = eventService.getTournamentById(tournamentId);
    if (!tournament) return [];

    return tournament.players
      .map((player) => {
        const roundTotals: { [roundId: string]: number } = {};

        tournament.rounds.forEach((round) => {
          if (round.scores[player.id]) {
            roundTotals[round.id] = round.scores[player.id].reduce(
              (total, hole) => total + (hole.score || 0),
              0
            );
          } else {
            roundTotals[round.id] = 0;
          }
        });

        const team = tournament.teams.find((t) => t.id === player.teamId);

        return {
          playerId: player.id,
          playerName: player.name,
          teamId: player.teamId,
          teamName: team?.name,
          total: Object.values(roundTotals).reduce(
            (sum, score) => sum + score,
            0
          ),
          roundTotals,
        };
      })
      .sort((a, b) => a.total - b.total);
  },

  // Calculate tour leaderboard including both tournaments and rounds
  getTourLeaderboard: (
    tourId: string
  ): {
    playerId: string;
    playerName: string;
    teamId?: string;
    teamName?: string;
    tournamentResults: {
      [tournamentId: string]: { position: number; points: number };
    };
    roundResults: {
      [roundId: string]: { position: number; points: number };
    };
    totalPoints: number;
  }[] => {
    const event = eventService.getEventByIdSync(tourId);
    if (!event || event.type !== "tour") return [];

    const tour = event as Tour;
    const playerResults: {
      [playerId: string]: {
        playerName: string;
        teamId?: string;
        teamName?: string;
        tournamentResults: {
          [tournamentId: string]: { position: number; points: number };
        };
        roundResults: {
          [roundId: string]: { position: number; points: number };
        };
        totalPoints: number;
      };
    } = {};

    // Process each tournament
    tour.tournaments.forEach((tournament) => {
      // Get tournament leaderboard
      const leaderboard = eventService.getTournamentLeaderboard(tournament.id);

      // Award points based on position
      leaderboard.forEach((result, index) => {
        const position = index + 1;
        let points = 0;

        if (position === 1) {
          points = tour.pointsSystem?.win || 100;
        } else if (
          tour.pointsSystem?.topFinish &&
          tour.pointsSystem.topFinish[position]
        ) {
          points = tour.pointsSystem.topFinish[position];
        } else {
          points = tour.pointsSystem?.participation || 10;
        }

        if (!playerResults[result.playerId]) {
          playerResults[result.playerId] = {
            playerName: result.playerName,
            teamId: result.teamId,
            teamName: result.teamName,
            tournamentResults: {},
            roundResults: {},
            totalPoints: 0,
          };
        }

        playerResults[result.playerId].tournamentResults[tournament.id] = {
          position,
          points,
        };

        playerResults[result.playerId].totalPoints += points;
      });
    });

    // Process each round (if they exist)
    if (tour.rounds && tour.rounds.length > 0) {
      tour.rounds.forEach((round) => {
        // Calculate round leaderboard
        const roundLeaderboard = getRoundLeaderboard(round);

        // Award points based on position
        roundLeaderboard.forEach((result, index) => {
          const position = index + 1;
          let points = 0;

          if (position === 1) {
            points = tour.pointsSystem?.win || 100;
          } else if (
            tour.pointsSystem?.topFinish &&
            tour.pointsSystem.topFinish[position]
          ) {
            points = tour.pointsSystem.topFinish[position];
          } else {
            points = tour.pointsSystem?.participation || 10;
          }

          if (!playerResults[result.playerId]) {
            // Get player name and team from round data
            const player = (tour.players || []).find(
              (p) => p.id === result.playerId
            );

            playerResults[result.playerId] = {
              playerName: player?.name || result.playerName || "Unknown Player",
              teamId: player?.teamId || result.teamId,
              teamName: result.teamName,
              tournamentResults: {},
              roundResults: {},
              totalPoints: 0,
            };
          }

          playerResults[result.playerId].roundResults[round.id] = {
            position,
            points,
          };

          playerResults[result.playerId].totalPoints += points;
        });
      });
    }

    return Object.entries(playerResults)
      .map(([playerId, data]) => ({
        playerId,
        playerName: data.playerName,
        teamId: data.teamId,
        teamName: data.teamName,
        tournamentResults: data.tournamentResults,
        roundResults: data.roundResults,
        totalPoints: data.totalPoints,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  },

  // Delete a round from a tour
  deleteRoundFromTour: (tourId: string, roundId: string): Event | null => {
    const event = eventService.getEventByIdSync(tourId);
    if (!event || event.type !== "tour") return null;

    const tour = event as Tour;

    // Ensure the rounds array exists
    if (!tour.rounds) {
      return event; // Nothing to delete
    }

    // Remove the round
    const updatedRounds = tour.rounds.filter((r) => r.id !== roundId);

    // Update the tour
    const updatedTour = {
      ...tour,
      rounds: updatedRounds,
    };

    // Update overall tour dates if needed (if the deleted round was the earliest or latest)
    if (updatedRounds.length > 0) {
      // Sort the remaining rounds by date
      const sortedRounds = [...updatedRounds].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Update start date if needed
      if (sortedRounds[0].date !== tour.startDate) {
        updatedTour.startDate = sortedRounds[0].date;
      }

      // Update end date if needed
      if (sortedRounds[sortedRounds.length - 1].date !== tour.endDate) {
        updatedTour.endDate = sortedRounds[sortedRounds.length - 1].date;
      }
    }

    // Update event in storage
    return eventService.updateEvent(tourId, {
      ...updatedTour,
    });
  },

  // Update player groups for a round in a tour
  updateTourRoundPlayerGroups: (
    tourId: string,
    roundId: string,
    playerGroups: PlayerGroup[]
  ): Event | null => {
    const event = eventService.getEventByIdSync(tourId);
    if (!event || event.type !== "tour") return null;

    const tour = event as Tour;

    // Ensure the rounds array exists
    if (!tour.rounds) {
      return null; // No rounds to update
    }

    // Find the round index
    const roundIndex = tour.rounds.findIndex((r) => r.id === roundId);
    if (roundIndex === -1) return null;

    // Create updated rounds array
    const updatedRounds = [...tour.rounds];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      playerGroups: playerGroups,
    };

    // Update the tour
    const updatedTour = {
      ...tour,
      rounds: updatedRounds,
    };

    // Update event in storage
    return eventService.updateEvent(tourId, {
      ...updatedTour,
    });
  },

  getRoundById: (id: string): Round | null => {
    const events = eventService.getAllEvents();

    // First, try to find as a standalone round event
    const roundEvent = events.find((e) => e.type === "round" && e.id === id);
    if (roundEvent) {
      return roundEvent as Round;
    }

    // Next, check for round in tournaments
    for (const event of events) {
      if (event.type === "tournament") {
        const tournament = event as Tournament;
        const round = tournament.rounds.find((r) => r.id === id);
        if (round) {
          return round;
        }
      }
    }

    // Finally, check for round in tours
    for (const event of events) {
      if (event.type === "tour") {
        const tour = event as Tour;
        if (tour.rounds) {
          const round = tour.rounds.find((r) => r.id === id);
          if (round) {
            return round;
          }
        }
      }
    }

    return null;
  },

  // Calculate team tournament leaderboard
  getTeamLeaderboard: (
    tournamentId: string
  ): {
    teamId: string;
    teamName: string;
    teamColor: string;
    playerCount: number;
    total: number;
    roundTotals: { [roundId: string]: number };
  }[] => {
    const tournament = eventService.getTournamentById(tournamentId);
    if (!tournament) return [];

    return tournament.teams
      .map((team) => {
        const roundTotals: { [roundId: string]: number } = {};
        const teamPlayers = tournament.players.filter(
          (p) => p.teamId === team.id
        );

        tournament.rounds.forEach((round) => {
          // For match play formats, use points
          if (round.format.includes("Match Play") && round.matchResults) {
            roundTotals[round.id] = teamPlayers.reduce((total, player) => {
              const matchResult = round.matchResults?.[player.id];
              return total + (matchResult?.points || 0);
            }, 0);
          } else {
            // For stroke play formats, use scores
            roundTotals[round.id] = teamPlayers.reduce((total, player) => {
              const playerScores = round.scores[player.id];
              if (!playerScores) return total;

              const playerTotal = playerScores.reduce(
                (sum, hole) => sum + (hole.score || 0),
                0
              );
              return total + playerTotal;
            }, 0);
          }
        });

        return {
          teamId: team.id,
          teamName: team.name,
          teamColor: team.color,
          playerCount: teamPlayers.length,
          total: Object.values(roundTotals).reduce(
            (sum, score) => sum + score,
            0
          ),
          roundTotals,
        };
      })
      .sort((a, b) => a.total - b.total);
  },

  // Update match results for match play formats
  updateMatchResults: (
    tournamentId: string,
    roundId: string,
    playerId: string,
    opponentId: string,
    result: "win" | "loss" | "halved",
    points: number
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const tournamentResult = findTournamentInEvents(events, tournamentId);

    if (!tournamentResult) return null;

    const { tournament } = tournamentResult;
    const roundIndex = tournament.rounds.findIndex((r) => r.id === roundId);

    if (roundIndex === -1) return null;

    const round = tournament.rounds[roundIndex];

    // Create or update matchResults object
    const matchResults = round.matchResults || {};

    // Update this player's result
    matchResults[playerId] = {
      opponentId,
      result,
      points,
    };

    // Update opponent's result (opposite result)
    const opponentResult =
      result === "win" ? "loss" : result === "loss" ? "win" : "halved";
    const opponentPoints =
      result === "halved" ? points : result === "win" ? 0 : points * 2; // Points logic

    matchResults[opponentId] = {
      opponentId: playerId,
      result: opponentResult,
      points: opponentPoints,
    };

    const updatedRounds = [...tournament.rounds];
    updatedRounds[roundIndex] = {
      ...round,
      matchResults,
    };

    const updatedTournament = {
      ...tournament,
      rounds: updatedRounds,
    };

    const updatedEvents = updateTournamentInEvents(
      events,
      tournamentId,
      updatedTournament
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

    return updatedTournament;
  },

  // Check if user is tournament creator
  isUserTournamentCreator: (tournamentId: string, userId: string): boolean => {
    const tournament = eventService.getTournamentById(tournamentId);
    if (!tournament) return false;
    return tournament.createdBy === userId;
  },

  // Check if user is in tournament
  isUserInTournament: (tournamentId: string, userId: string): boolean => {
    const tournament = eventService.getTournamentById(tournamentId);
    if (!tournament) return false;
    return tournament.players.some((player) => player.id === userId);
  },

  // Update event statuses based on dates
  updateEventStatuses: (): void => {
    const events = eventService.getAllEvents();
    let hasChanges = false;

    events.forEach((event, index) => {
      if (event.type === "tournament") {
        const tournament = event as Tournament;
        const newStatus = getEventStatus(
          tournament.startDate,
          tournament.endDate
        );

        if (tournament.status !== newStatus) {
          events[index] = {
            ...tournament,
            status: newStatus,
          };
          hasChanges = true;

          // If the event just became completed, process achievements
          if (newStatus === "completed" && tournament.status !== "completed") {
            // This will be called after the event is saved
            setTimeout(
              () =>
                achievementService.processCompletedTournament(tournament.id),
              0
            );
          }
        }
      } else if (event.type === "tour") {
        const tour = event as Tour;
        const newStatus = getEventStatus(tour.startDate, tour.endDate);

        if (tour.status !== newStatus) {
          events[index] = {
            ...tour,
            status: newStatus,
          };

          hasChanges = true;

          // If the event just became completed, process achievements
          if (newStatus === "completed" && tour.status !== "completed") {
            // This will be called after the event is saved
            setTimeout(
              () => achievementService.processCompletedTour(tour.id),
              0
            );
          }
        }

        // Also update statuses of tournaments within the tour
        if (tour.tournaments && tour.tournaments.length > 0) {
          let tourHasChanges = false;

          const updatedTournaments = tour.tournaments.map((tournament) => {
            const newTournamentStatus = getEventStatus(
              tournament.startDate,
              tournament.endDate
            );

            if (tournament.status !== newTournamentStatus) {
              tourHasChanges = true;

              // If a tournament just became completed, process achievements
              if (
                newTournamentStatus === "completed" &&
                tournament.status !== "completed"
              ) {
                // This will be called after the event is saved
                setTimeout(
                  () =>
                    achievementService.processCompletedTournament(
                      tournament.id
                    ),
                  0
                );
              }

              return {
                ...tournament,
                status: newTournamentStatus,
              };
            }

            return tournament;
          });

          if (tourHasChanges) {
            events[index] = {
              ...tour,
              tournaments: updatedTournaments,
            };
            hasChanges = true;
          }
        }
      }
    });

    if (hasChanges) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
  },
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

  // Update player scores in a round
  updatePlayerScores: async (
    tournamentId: string,
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ): Promise<Tournament | null> => {
    return eventService.updateRoundScores(
      tournamentId,
      roundId,
      playerId,
      scores
    );
  },

  // Check if the current user is the creator of a tournament or event
  isCreator: async (tournamentOrEventId: string): Promise<boolean> => {
    const currentUser = await eventService.getCurrentUser();
    if (!currentUser) return false;

    // First try to find it as a tournament
    const tournament = eventService.getTournamentById(tournamentOrEventId);
    if (tournament) {
      return tournament.createdBy === currentUser.id;
    }

    // If not found as a tournament, check as an event
    const event = eventService.getEventById(tournamentOrEventId);
    if (event) {
      if (event.type === "tournament") {
        const tournamentData = event as Tournament;
        return tournamentData.createdBy === currentUser.id;
      } else if (event.type === "tour") {
        const tourData = event as Tour;
        return tourData.createdBy === currentUser.id;
      }
    }

    return false;
  },

  // createRound: (
  //   data: RoundFormData & { inviteFriends?: string[] },
  //   currentUser: Player
  // ): Event => {
  //   const events = eventService.getAllEvents();

  //   // Determine status based on the date
  //   const today = new Date().toISOString().split("T")[0];
  //   const status =
  //     data.date === today
  //       ? "active"
  //       : data.date < today
  //       ? "completed"
  //       : "upcoming";

  //   // Initialize empty scores for the current user
  //   const scores: { [playerId: string]: HoleScore[] } = {};
  //   const holeScores: HoleScore[] = [];

  //   for (let i = 1; i <= data.holes; i++) {
  //     holeScores.push({
  //       hole: i,
  //       par: data.par ? Math.floor(data.par / data.holes) : undefined,
  //     });
  //   }

  //   scores[currentUser.id] = holeScores;

  //   // Create the new round
  //   const newRound: Round = {
  //     id: uuidv4(),
  //     name: data.name,
  //     type: "round",
  //     date: data.date,
  //     courseDetails: {
  //       name: data.courseName,
  //       holes: data.holes,
  //       par: data.par,
  //     },
  //     format: data.format,
  //     scores,
  //     createdBy: currentUser.id,
  //     createdAt: new Date().toISOString(),
  //     players: [currentUser],
  //     location: data.location || "Not specified",
  //     description: data.description || "",
  //     status,
  //     invitations: data.inviteFriends || [],
  //     playerGroups: [
  //       {
  //         id: uuidv4(),
  //         name: data.name,
  //         playerIds: [currentUser.id],
  //       },
  //     ],
  //   };

  //   // Create event wrapper
  //   const newEvent: Event = {
  //     ...newRound,
  //   };

  //   events.push(newEvent);
  //   localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

  //   return newEvent;
  // },

  // Get a round by ID
  // getRoundById: (id: string): Round | null => {
  //   const events = eventService.getAllEvents();

  //   // First, try to find as a standalone round event
  //   const roundEvent = events.find((e) => e.type === "round" && e.id === id);
  //   if (roundEvent) {
  //     return roundEvent.data as Round;
  //   }

  //   // Next, try to find it as a round within a tournament
  //   for (const event of events) {
  //     if (event.type === "tournament") {
  //       const tournament = event.data as Tournament;
  //       const round = tournament.rounds.find((r) => r.id === id);
  //       if (round) {
  //         return round;
  //       }
  //     } else if (event.type === "tour") {
  //       const tour = event.data as Tour;
  //       for (const tournament of tour.tournaments) {
  //         const round = tournament.rounds.find((r) => r.id === id);
  //         if (round) {
  //           return round;
  //         }
  //       }
  //     }
  //   }

  //   return null;
  // },

  // Update a standalone round event
  updateRoundEvent: (id: string, data: Partial<Round>): Round | null => {
    const events = eventService.getAllEvents();
    const index = events.findIndex((e) => e.type === "round" && e.id === id);

    if (index === -1) return null;

    const round = events[index] as Round;
    const updatedRound = { ...round, ...data };

    // Update status if date changed
    if (data.date) {
      const today = new Date().toISOString().split("T")[0];
      updatedRound.status =
        data.date === today
          ? "active"
          : data.date < today
          ? "completed"
          : "upcoming";
    }

    events[index] = {
      ...events[index],
      ...updatedRound,
    };

    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    return updatedRound;
  },

  // Delete a standalone round event
  deleteRoundEvent: (id: string): boolean => {
    const events = eventService.getAllEvents();
    const filteredEvents = events.filter(
      (e) => !(e.type === "round" && e.id === id)
    );

    if (filteredEvents.length === events.length) return false;

    localStorage.setItem(EVENTS_KEY, JSON.stringify(filteredEvents));
    return true;
  },

  // Handle invitations to a standalone round
  invitePlayersToRound: (roundId: string, emails: string[]): Round | null => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.type === "round" && e.id === roundId);

    if (!event) return null;

    const round = event as Round;

    // Filter out duplicates and existing players
    const existingEmails = round.players?.map((p) => p.email) || [];
    const newInvitations = emails.filter(
      (email) =>
        !existingEmails.includes(email) &&
        !(round.invitations || []).includes(email)
    );

    // Update the round with new invitations
    const updatedRound = {
      ...round,
      invitations: [...(round.invitations || []), ...newInvitations],
    };

    const updatedEvent = {
      ...event,
      data: updatedRound,
    };

    events[events.findIndex((e) => e.id === roundId)] = updatedEvent;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    return updatedRound;
  },

  // Accept an invitation to a round
  acceptRoundInvitation: (roundId: string, player: Player): Event | null => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.type === "round" && e.id === roundId);

    if (!event) return null;

    const round = event as Round;

    // Check if user is in the invitations list
    if (!(round.invitations || []).includes(player.email)) return null;

    // Add player to the round
    const updatedPlayers = [...(round.players || []), player];

    // Add empty scores for the player
    const scores = { ...round.scores };
    const holeScores: HoleScore[] = [];

    for (let i = 1; i <= (round.courseDetails?.holes || 18); i++) {
      holeScores.push({
        hole: i,
        par: round.courseDetails?.par
          ? Math.floor(
              round.courseDetails.par / (round.courseDetails.holes || 18)
            )
          : undefined,
      });
    }

    scores[player.id] = holeScores;

    // Remove from invitations
    const updatedInvitations = (round.invitations || []).filter(
      (email) => email !== player.email
    );

    const updatedRound = {
      ...round,
      players: updatedPlayers,
      scores,
      invitations: updatedInvitations,
    };

    const updatedEvent = {
      ...event,
      data: updatedRound,
    };

    events[events.findIndex((e) => e.id === roundId)] = updatedEvent;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    return updatedEvent;
  },

  // Decline an invitation to a round
  declineRoundInvitation: (roundId: string, userEmail: string): boolean => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.type === "round" && e.id === roundId);

    if (!event) return false;

    const round = event as Round;

    // Check if the invitation exists
    if (!(round.invitations || []).includes(userEmail)) return false;

    // Remove from invitations
    const updatedInvitations = (round.invitations || []).filter(
      (email) => email !== userEmail
    );

    const updatedRound = {
      ...round,
      invitations: updatedInvitations,
    };

    const updatedEvent = {
      ...event,
      data: updatedRound,
    };

    events[events.findIndex((e) => e.id === roundId)] = updatedEvent;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    return true;
  },

  // Get user invitations for rounds, tournaments, and tours
  getUserInvitations: (
    userEmail: string
  ): {
    tournaments: Tournament[];
    rounds: Round[];
    tours: Tour[];
  } => {
    const events = eventService.getAllEvents();
    const invitations = {
      tournaments: [] as Tournament[],
      rounds: [] as Round[],
      tours: [] as Tour[],
    };

    events.forEach((event) => {
      if (event.type === "tournament") {
        const tournament = event as Tournament;
        if (tournament.invitations.includes(userEmail)) {
          invitations.tournaments.push(tournament);
        }
      } else if (event.type === "tour") {
        const tour = event as Tour;
        if (tour.invitations && tour.invitations.includes(userEmail)) {
          invitations.tours.push(tour);
        }

        // Also check tournaments within the tour
        tour.tournaments.forEach((tournament) => {
          if (tournament.invitations?.includes(userEmail)) {
            invitations.tournaments.push(tournament);
          }
        });
      } else if (event.type === "round") {
        const round = event as Round;
        if (round.invitations && round.invitations.includes(userEmail)) {
          invitations.rounds.push(round);
        }
      }
    });

    return invitations;
  },

  // Get round leaderboard
  getRoundLeaderboard: (
    roundId: string
  ): {
    playerId: string;
    playerName: string;
    teamId?: string;
    teamName?: string;
    score: number;
  }[] => {
    const round = eventService.getRoundById(roundId);
    if (!round) return [];

    // Get player details
    const playerDetails: {
      [playerId: string]: { name: string; teamId?: string; teamName?: string };
    } = {};
    (round.players || []).forEach((player) => {
      const team = player.teamId ? { id: player.teamId, name: "" } : undefined;
      playerDetails[player.id] = {
        name: player.name,
        teamId: player.teamId,
        teamName: team?.name,
      };
    });

    // Calculate scores for each player
    return Object.entries(round.scores)
      .map(([playerId, holeScores]) => {
        const totalScore = holeScores.reduce(
          (sum, hole) => sum + (hole.score || 0),
          0
        );

        const playerDetail = playerDetails[playerId] || {
          name: "Unknown Player",
        };

        return {
          playerId,
          playerName: playerDetail.name,
          teamId: playerDetail.teamId,
          teamName: playerDetail.teamName,
          score: totalScore,
        };
      })
      .sort((a, b) => a.score - b.score); // Sort by score (lower is better)
  },
};

export const addTeamToTour = (
  tourId: string,
  teamData: TeamFormData
): Event | null => {
  const events = eventService.getAllEvents();
  const event = events.find((e) => e.id === tourId && e.type === "tour");

  if (!event) return null;

  const tour = event as Tour;

  // Create new team
  const newTeam: Team = {
    id: uuidv4(),
    name: teamData.name,
    color: teamData.color,
    logo: teamData.logo,
    captain: teamData.captain,
  };

  // Add team to tour
  const updatedTour = {
    ...tour,
    teams: [...(tour.teams || []), newTeam],
  };

  // Update event
  events[events.findIndex((e) => e.id === tourId)] = {
    ...event,
    ...updatedTour,
  };

  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return event;
};

// Update a team in a tour
export const updateTourTeam = (
  tourId: string,
  teamId: string,
  teamData: Partial<Team>
): Event | null => {
  const events = eventService.getAllEvents();
  const event = events.find((e) => e.id === tourId && e.type === "tour");

  if (!event) return null;

  const tour = event as Tour;

  // Ensure teams array exists
  if (!tour.teams) return event;

  // Find and update the team
  const teamIndex = tour.teams.findIndex((t) => t.id === teamId);
  if (teamIndex === -1) return event;

  const updatedTeams = [...tour.teams];
  updatedTeams[teamIndex] = {
    ...updatedTeams[teamIndex],
    ...teamData,
  };

  const updatedTour = {
    ...tour,
    teams: updatedTeams,
  };

  // Update event
  events[events.findIndex((e) => e.id === tourId)] = {
    ...event,
    ...updatedTour,
  };

  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return event;
};

// Delete a team from a tour
export const deleteTourTeam = (
  tourId: string,
  teamId: string
): Event | null => {
  const events = eventService.getAllEvents();
  const event = events.find((e) => e.id === tourId && e.type === "tour");

  if (!event) return null;

  const tour = event as Tour;

  // Ensure teams array exists
  if (!tour.teams) return event;

  // Remove the team
  const updatedTeams = tour.teams.filter((t) => t.id !== teamId);

  // Update player team associations
  const updatedPlayers = tour.players
    ? tour.players.map((player) => {
        if (player.teamId === teamId) {
          return { ...player, teamId: undefined };
        }
        return player;
      })
    : [];

  const updatedTour = {
    ...tour,
    teams: updatedTeams,
    players: updatedPlayers,
  };

  // Update event
  events[events.findIndex((e) => e.id === tourId)] = {
    ...event,
    ...updatedTour,
  };

  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return event;
};

// Assign a player to a team in a tour
export const assignPlayerToTourTeam = (
  tourId: string,
  playerId: string,
  teamId?: string
): Event | null => {
  const events = eventService.getAllEvents();
  const event = events.find((e) => e.id === tourId && e.type === "tour");

  if (!event) return null;

  const tour = event as Tour;

  if (!tour.players) return event;

  // Update player's team
  const updatedPlayers = tour.players.map((player) => {
    if (player.id === playerId) {
      return { ...player, teamId };
    }
    return player;
  });

  // If the player was a captain and is being removed from their team, update the team
  if (!teamId && tour.teams) {
    const captainTeam = tour.teams.find((t) => t.captain === playerId);
    if (captainTeam) {
      // Update the team to remove the captain
      tour.teams = tour.teams.map((t) => {
        if (t.id === captainTeam.id) {
          return { ...t, captain: undefined };
        }
        return t;
      });
    }
  }

  const updatedTour = {
    ...tour,
    players: updatedPlayers,
  };

  // Update event
  events[events.findIndex((e) => e.id === tourId)] = {
    ...event,
    ...updatedTour,
  };

  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return event;
};

// Get tour by ID (helper function)
export const getTourById = (tourId: string): Tour | null => {
  const event = eventService.getEventByIdSync(tourId);
  return event && event.type === "tour" ? (event as Tour) : null;
};

// Get team leaderboard for a tour
export const getTourTeamLeaderboard = (
  tourId: string
): {
  teamId: string;
  teamName: string;
  teamColor: string;
  playerCount: number;
  totalPoints: number;
  roundTotals: { [roundId: string]: number };
  tournamentResults: { [tournamentId: string]: number };
}[] => {
  const tour = getTourById(tourId);
  if (!tour || !tour.teams || tour.teams.length === 0) return [];

  // Get individual leaderboard to aggregate points by team
  const individualLeaderboard = eventService.getTourLeaderboard(tourId);

  // Map to store team data
  const teamData: {
    [teamId: string]: {
      teamName: string;
      teamColor: string;
      playerCount: number;
      totalPoints: number;
      roundTotals: { [roundId: string]: number };
      tournamentResults: { [tournamentId: string]: number };
    };
  } = {};

  // Initialize team data
  tour.teams.forEach((team) => {
    teamData[team.id] = {
      teamName: team.name,
      teamColor: team.color,
      playerCount: 0,
      totalPoints: 0,
      roundTotals: {},
      tournamentResults: {},
    };
  });

  // Count players per team
  (tour.players || []).forEach((player) => {
    if (player.teamId && teamData[player.teamId]) {
      teamData[player.teamId].playerCount++;
    }
  });

  // Aggregate individual points by team
  individualLeaderboard.forEach((playerData) => {
    if (playerData.teamId && teamData[playerData.teamId]) {
      // Add to team total points
      teamData[playerData.teamId].totalPoints += playerData.totalPoints;

      // Aggregate tournament results
      Object.entries(playerData.tournamentResults).forEach(
        ([tournamentId, result]) => {
          const tournamentPoints = result.points || 0;
          if (!teamData[playerData.teamId!].tournamentResults[tournamentId]) {
            teamData[playerData.teamId!].tournamentResults[tournamentId] = 0;
          }
          teamData[playerData.teamId!].tournamentResults[tournamentId] +=
            tournamentPoints;
        }
      );

      // Aggregate round results
      Object.entries(playerData.roundResults || {}).forEach(
        ([roundId, result]) => {
          const roundPoints = result.points || 0;
          if (!teamData[playerData.teamId!].roundTotals[roundId]) {
            teamData[playerData.teamId!].roundTotals[roundId] = 0;
          }
          teamData[playerData.teamId!].roundTotals[roundId] += roundPoints;
        }
      );
    }
  });

  // Convert to array and sort by total points
  return Object.entries(teamData)
    .map(([teamId, data]) => ({
      teamId,
      teamName: data.teamName,
      teamColor: data.teamColor,
      playerCount: data.playerCount,
      totalPoints: data.totalPoints,
      roundTotals: data.roundTotals,
      tournamentResults: data.tournamentResults,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
};

export default eventService;
