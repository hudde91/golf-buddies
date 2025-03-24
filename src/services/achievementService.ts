// src/services/achievementService.ts
import eventService from "./eventService";
import profileService from "./profileService";
import { Tournament, Tour, Event } from "../types/event";
import { Achievement } from "../types";
import { v4 as uuidv4 } from "uuid";

const achievementService = {
  // Process completed tournaments and save achievements
  processCompletedTournament: (tournamentId: string): void => {
    const tournament = eventService.getTournamentById(tournamentId);

    if (!tournament || tournament.status !== "completed") {
      return;
    }

    // Get the leaderboard to determine winners
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
      profileService.addAchievement(playerResult.playerId, {
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
        teamPlayers.forEach((player) => {
          profileService.addAchievement(player.id, {
            type: "tournament",
            eventId: tournament.id,
            eventName: tournament.name,
            date: tournament.endDate,
            position: 1,
            displayText: `Won the ${tournament.name} tournament with team ${winningTeam.teamName}`,
          });
        });
      }
    }
  },

  // Process completed tours and save achievements
  processCompletedTour: (tourId: string): void => {
    const event = eventService.getEventById(tourId);

    if (!event || event.type !== "tour" || event.data.status !== "completed") {
      return;
    }

    const tour = event.data as Tour;

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
      profileService.addAchievement(playerResult.playerId, {
        type: "tour",
        eventId: tour.id,
        eventName: tour.name,
        date: tour.endDate,
        position,
        displayText,
      });
    }
  },

  // Check and process all events that might have been completed
  checkAndProcessCompletedEvents: (): void => {
    const events = eventService.getAllEvents();

    events.forEach((event) => {
      if (event.type === "tournament") {
        const tournament = event.data as Tournament;
        if (tournament.status === "completed") {
          achievementService.processCompletedTournament(tournament.id);
        }
      } else if (event.type === "tour") {
        const tour = event.data as Tour;
        if (tour.status === "completed") {
          achievementService.processCompletedTour(tour.id);
        }
      }
    });
  },
};

export default achievementService;
