// src/services/eventService.ts
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
} from "../types/event";

const EVENTS_KEY = "events";

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

// Helper functions
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
      tournament: events[tournamentEventIndex].data as Tournament,
      parentEventIndex: tournamentEventIndex,
    };
  }

  // Then check tours for the tournament
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.type === "tour") {
      const tour = event.data as Tour;
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

// Function to update a tournament in the events array
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
      data: updatedTournament,
    };
  } else {
    // It's part of a tour
    const tour = updatedEvents[parentEventIndex].data as Tour;
    const updatedTour = { ...tour };
    updatedTour.tournaments = [...tour.tournaments];
    updatedTour.tournaments[tournamentIndex] = updatedTournament;

    updatedEvents[parentEventIndex] = {
      ...updatedEvents[parentEventIndex],
      data: updatedTour,
    };
  }

  return updatedEvents;
};

const eventService = {
  // Get all events
  getAllEvents: (): Event[] => {
    const eventsJson = localStorage.getItem(EVENTS_KEY);
    if (!eventsJson) return [];
    return JSON.parse(eventsJson);
  },

  // Get events where user is owner or player
  getUserEvents: (userId: string): Event[] => {
    const events = eventService.getAllEvents();
    return events.filter((event) => {
      if (event.type === "tournament") {
        const tournament = event.data as Tournament;
        return (
          tournament.createdBy === userId ||
          tournament.players.some((player) => player.id === userId)
        );
      } else if (event.type === "tour") {
        const tour = event.data as Tour;
        return (
          tour.createdBy === userId ||
          (tour.players &&
            tour.players.some((player) => player.id === userId)) ||
          tour.tournaments.some((tournament) =>
            tournament.players.some((player) => player.id === userId)
          )
        );
      }
      return false;
    });
  },

  // Get event by ID
  getEventById: (id: string): Event | null => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.id === id);
    return event || null;
  },

  // Get tournament by ID (used for invitations and other legacy features)
  getTournamentById: (id: string): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, id);
    // debugger;
    return result ? result.tournament : null;
  },

  // Create new tournament event
  createTournament: (data: TournamentFormData, currentUser: Player): Event => {
    const events = eventService.getAllEvents();

    // Create tournament
    const status = getEventStatus(data.startDate, data.endDate);

    const newTournament: Tournament = {
      id: uuidv4(),
      name: data.name,
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
      invitations: [],
      isTeamEvent: data.isTeamEvent,
      scoringType: data.scoringType,
      status,
    };

    // Create event wrapper
    const newEvent: Event = {
      id: newTournament.id, // Same ID for simplicity
      type: "tournament",
      data: newTournament,
    };

    events.push(newEvent);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    return newEvent;
  },

  // Create new tour event
  createTour: (data: TourFormData, userId: string, userName: string): Event => {
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
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      tournaments: [],
      players: [currentUser], // Add the creator as the first player
      status: status,
      pointsSystem: {
        win: 100,
        topFinish: { 1: 100, 2: 80, 3: 60, 4: 40, 5: 20 },
        participation: 10,
      },
    };

    // Create event wrapper
    const newEvent: Event = {
      id: newTour.id, // Same ID for simplicity
      type: "tour",
      data: newTour,
    };

    events.push(newEvent);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));

    return newEvent;
  },

  // Add tournament to tour
  addTournamentToTour: (
    tourId: string,
    tournamentData: TournamentFormData,
    currentUser: Player
  ): Event | null => {
    const event = eventService.getEventById(tourId);
    if (!event || event.type !== "tour") return null;

    const tour = event.data as Tour;

    // Create the new tournament
    const newTournament: Tournament = {
      id: uuidv4(),
      name: tournamentData.name,
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
      invitations: [],
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
      type: "tour",
      data: updatedTour,
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
      const tour = event.data as Tour;
      const updatedTour = { ...tour };
      updatedTour.tournaments = tour.tournaments.filter((t) => t.id !== id);

      events[parentEventIndex] = {
        ...event,
        data: updatedTour,
      };

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return true;
    }
  },

  // Add a player to a tournament event
  addPlayerToEvent: (eventId: string, player: Player): Event | null => {
    const event = eventService.getEventById(eventId);
    if (!event) return null;

    if (event.type === "tournament") {
      const tournament = event.data as Tournament;

      // Check if player is already in the tournament
      if (tournament.players.some((p) => p.id === player.id)) {
        return event;
      }

      const updatedPlayers = [...tournament.players, player];

      // Also add player to all existing rounds with empty scores
      const updatedRounds = tournament.rounds.map((round) => {
        if (!round.scores[player.id]) {
          const emptyScores: HoleScore[] = [];
          for (let i = 1; i <= round.courseDetails?.holes || 18; i++) {
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
        data: updatedTournament,
      });
    } else if (event.type === "tour") {
      const tour = event.data as Tour;

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
            for (let i = 1; i <= round.courseDetails?.holes || 18; i++) {
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
        data: updatedTour,
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

    return updatedTournament;
  },

  // Get user's pending invitations - only for tournaments, not tours
  getUserInvitations: (userEmail: string): Tournament[] => {
    const events = eventService.getAllEvents();
    const invitations: Tournament[] = [];

    events.forEach((event) => {
      if (event.type === "tournament") {
        const tournament = event.data as Tournament;
        if (tournament.invitations.includes(userEmail)) {
          invitations.push(tournament);
        }
      } else if (event.type === "tour") {
        const tour = event.data as Tour;
        tour.tournaments.forEach((tournament) => {
          if (tournament.invitations?.includes(userEmail)) {
            invitations.push(tournament);
          }
        });
      }
    });

    return invitations;
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
      const tournament = event.data as Tournament;

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
      const tour = event.data as Tour;

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
        data: updatedTour,
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
            for (let i = 1; i <= round.courseDetails?.holes || 18; i++) {
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
        const tour = tourEvent.data as Tour;
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
      const tournament = event.data as Tournament;

      // Check if user is in the invitations list
      if (!tournament.invitations.includes(player.email)) return null;

      // Add player to the tournament
      const updatedPlayers = [...tournament.players, player];

      // Add player to all existing rounds with empty scores
      const updatedRounds = tournament.rounds.map((round) => {
        if (!round.scores[player.id]) {
          const emptyScores: HoleScore[] = [];
          for (let i = 1; i <= round.courseDetails?.holes || 18; i++) {
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
      const tour = event.data as Tour;

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
            for (let i = 1; i <= round.courseDetails?.holes || 18; i++) {
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

  // Decline invitation
  declineInvitation: (eventId: string, userEmail: string): boolean => {
    const events = eventService.getAllEvents();
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      // If not found as a direct event, try to find as a tournament within a tour
      const result = findTournamentInEvents(events, eventId);
      if (result) {
        const { tournament, parentEventIndex, tournamentIndex } = result;

        // Check if the invitation exists
        if (!tournament.invitations.includes(userEmail)) return false;

        // Remove from invitations
        const updatedTournament = {
          ...tournament,
          invitations: tournament.invitations.filter(
            (email) => email !== userEmail
          ),
        };

        // Update the tournament in the events array
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
      const tournament = event.data as Tournament;

      // Check if the invitation exists
      if (!tournament.invitations.includes(userEmail)) return false;

      // Remove from invitations
      const updatedTournament = {
        ...tournament,
        invitations: tournament.invitations.filter(
          (email) => email !== userEmail
        ),
      };

      events[events.findIndex((e) => e.id === eventId)] = {
        ...event,
        data: updatedTournament,
      };

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return true;
    } else if (event.type === "tour") {
      // Declining invitation to a tour
      const tour = event.data as Tour;

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
        data: updatedTour,
      };

      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return true;
    }

    return false;
  },

  // Add team to event
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

  // Update team details
  updateTeam: (
    tournamentId: string,
    teamId: string,
    teamData: Partial<Team>
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    // Update the team
    const updatedTeams = tournament.teams.map((team) =>
      team.id === teamId ? { ...team, ...teamData } : team
    );

    // Update the tournament
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

  // Delete a team
  deleteTeam: (tournamentId: string, teamId: string): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    // Remove the team
    const updatedTeams = tournament.teams.filter((team) => team.id !== teamId);

    // Remove team association from players
    const updatedPlayers = tournament.players.map((player) =>
      player.teamId === teamId ? { ...player, teamId: undefined } : player
    );

    // Update the tournament
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

  // Assign player to a team
  assignPlayerToTeam: (
    tournamentId: string,
    playerId: string,
    teamId?: string
  ): Tournament | null => {
    const events = eventService.getAllEvents();
    const result = findTournamentInEvents(events, tournamentId);

    if (!result) return null;

    const { tournament } = result;

    // Update player's team assignment
    const updatedPlayers = tournament.players.map((player) =>
      player.id === playerId ? { ...player, teamId } : player
    );

    // Update the tournament
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

  // Calculate tournament leaderboard
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

  // Calculate tour leaderboard
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
    totalPoints: number;
  }[] => {
    const event = eventService.getEventById(tourId);
    if (!event || event.type !== "tour") return [];

    const tour = event.data as Tour;
    const playerResults: {
      [playerId: string]: {
        playerName: string;
        teamId?: string;
        teamName?: string;
        tournamentResults: {
          [tournamentId: string]: { position: number; points: number };
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

    // Convert to array and sort by total points
    return Object.entries(playerResults)
      .map(([playerId, data]) => ({
        playerId,
        playerName: data.playerName,
        teamId: data.teamId,
        teamName: data.teamName,
        tournamentResults: data.tournamentResults,
        totalPoints: data.totalPoints,
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
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

    // Get the round
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

    // Update the round
    const updatedRounds = [...tournament.rounds];
    updatedRounds[roundIndex] = {
      ...round,
      matchResults,
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
};

export default eventService;
