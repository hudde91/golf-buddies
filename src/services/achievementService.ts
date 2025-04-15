import eventService from "./eventService";
import profileService from "./profileService";
import { Tournament, Tour, Event } from "../types/event";

const API_BASE_URL =
  "https://golf-buddies-epfddeddfqdhbtgy.westeurope-01.azurewebsites.net/api";

// Helper function to get event by ID, trying API first
// TODO This is not implemented yet on the backend so it will fallback to local storage
const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}`);
    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(
      `API fetch failed for event ${eventId}, falling back to local storage`
    );
    return eventService.getEventById(eventId);
  }
};

// Helper function to get tournament by ID, trying API first
const getTournamentById = async (
  tournamentId: string
): Promise<Tournament | null> => {
  try {
    // Try to get it as a standalone event first
    const event = await getEventById(tournamentId);
    if (event && event.type === "tournament") {
      return event as Tournament;
    }

    // If not found as a standalone event, check local tournaments
    return eventService.getTournamentById(tournamentId);
  } catch (error) {
    console.warn(`Error fetching tournament ${tournamentId}:`, error);
    return eventService.getTournamentById(tournamentId);
  }
};

const achievementService = {
  processCompletedTournament: async (tournamentId: string): Promise<void> => {
    try {
      const tournament = await getTournamentById(tournamentId);

      if (!tournament || tournament.status !== "completed") {
        return;
      }

      const leaderboard = eventService.getTournamentLeaderboard(tournamentId);

      // Process top 3 positions (or however many players there are)
      const positionsToTrack = Math.min(3, leaderboard.length);

      for (let i = 0; i < positionsToTrack; i++) {
        const playerResult = leaderboard[i];
        const position = i + 1;

        // Create achievement text based on position
        let displayText = "";
        if (position === 1) {
          displayText = `Won the ${tournament.name} tournament`;
        } else if (position === 2) {
          displayText = `Runner-up in the ${tournament.name} tournament`;
        } else if (position === 3) {
          displayText = `Third place in the ${tournament.name} tournament`;
        }

        // Save achievement to player's profile
        await profileService.addAchievement(playerResult.playerId, {
          type: "tournament",
          eventId: tournament.id,
          eventName: tournament.name,
          date: tournament.endDate,
          position,
          displayText,
        });
      }

      // Handle team events if this is a team tournament
      if (tournament.isTeamEvent && tournament.teams.length > 0) {
        const teamLeaderboard = eventService.getTeamLeaderboard(tournamentId);

        if (teamLeaderboard.length > 0) {
          const winningTeam = teamLeaderboard[0];

          // Find all players in the winning team
          const teamPlayers = tournament.players.filter(
            (player) => player.teamId === winningTeam.teamId
          );

          // Add team win achievement to all team members
          for (const player of teamPlayers) {
            await profileService.addAchievement(player.id, {
              type: "tournament",
              eventId: tournament.id,
              eventName: tournament.name,
              date: tournament.endDate,
              position: 1,
              displayText: `Won the ${tournament.name} tournament with team ${winningTeam.teamName}`,
            });
          }
        }
      }
    } catch (error) {
      console.error(
        `Error processing achievements for tournament ${tournamentId}:`,
        error
      );
    }
  },

  // Process completed tours and save achievements
  processCompletedTour: async (tourId: string): Promise<void> => {
    try {
      const event = await getEventById(tourId);

      if (!event || event.type !== "tour" || event.status !== "completed") {
        return;
      }

      const tour = event as Tour;

      // Get the tour leaderboard
      const leaderboard = eventService.getTourLeaderboard(tourId);

      // Process top 3 positions (or however many players there are)
      const positionsToTrack = Math.min(3, leaderboard.length);

      for (let i = 0; i < positionsToTrack; i++) {
        const playerResult = leaderboard[i];
        const position = i + 1;

        // Create achievement text based on position
        let displayText = "";
        if (position === 1) {
          displayText = `Won the ${tour.name} tour championship`;
        } else if (position === 2) {
          displayText = `Runner-up in the ${tour.name} tour championship`;
        } else if (position === 3) {
          displayText = `Third place in the ${tour.name} tour championship`;
        }

        // Save achievement to player's profile
        await profileService.addAchievement(playerResult.playerId, {
          type: "tour",
          eventId: tour.id,
          eventName: tour.name,
          date: tour.endDate,
          position,
          displayText,
        });
      }
    } catch (error) {
      console.error(`Error processing achievements for tour ${tourId}:`, error);
    }
  },

  // Check and process all events that might have been completed
  checkAndProcessCompletedEvents: async (events?: Event[]): Promise<void> => {
    try {
      // Use provided events or get all events from local storage
      const eventsToProcess = events || eventService.getAllEvents();

      for (const event of eventsToProcess) {
        if (event.type === "tournament") {
          const tournament = event as Tournament;
          if (tournament.status === "completed") {
            await achievementService.processCompletedTournament(tournament.id);
          }
        } else if (event.type === "tour") {
          const tour = event as Tour;
          if (tour.status === "completed") {
            await achievementService.processCompletedTour(tour.id);
          }
        }
      }
    } catch (error) {
      console.error("Error checking and processing completed events:", error);
    }
  },
};

export default achievementService;
