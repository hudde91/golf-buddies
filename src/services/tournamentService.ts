// src/services/tournamentService.ts
import { v4 as uuidv4 } from "uuid";
import {
  Tournament,
  Player,
  TournamentFormData,
  Round,
  RoundFormData,
  HoleScore,
  Team,
  TeamFormData,
} from "../types/tournament";

const TOURNAMENTS_KEY = "tournaments";

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

const tournamentService = {
  // Get all tournaments
  getAllTournaments: (): Tournament[] => {
    const tournamentsJson = localStorage.getItem(TOURNAMENTS_KEY);
    if (!tournamentsJson) return [];
    return JSON.parse(tournamentsJson);
  },

  // Get tournaments where user is owner or player
  getUserTournaments: (userId: string): Tournament[] => {
    const tournaments = tournamentService.getAllTournaments();
    return tournaments.filter(
      (tournament) =>
        tournament.createdBy === userId ||
        tournament.players.some((player) => player.id === userId)
    );
  },

  // Get tournament by ID
  getTournamentById: (id: string): Tournament | null => {
    const tournaments = tournamentService.getAllTournaments();
    const tournament = tournaments.find((t) => t.id === id);
    return tournament || null;
  },

  // Create new tournament
  createTournament: (
    data: TournamentFormData,
    currentUser: Player
  ): Tournament => {
    const tournaments = tournamentService.getAllTournaments();

    // Determine tournament status based on dates
    const today = new Date().toISOString().split("T")[0];
    let status: "upcoming" | "active" | "completed" = "upcoming";

    if (data.startDate <= today && data.endDate >= today) {
      status = "active";
    } else if (data.endDate < today) {
      status = "completed";
    }

    const newTournament: Tournament = {
      id: uuidv4(),
      name: data.name,
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

    tournaments.push(newTournament);
    localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments));

    return newTournament;
  },

  // Update tournament details
  updateTournament: (
    id: string,
    data: Partial<Tournament>
  ): Tournament | null => {
    const tournaments = tournamentService.getAllTournaments();
    const index = tournaments.findIndex((t) => t.id === id);

    if (index === -1) return null;

    const updatedTournament = {
      ...tournaments[index],
      ...data,
    };

    // Update status based on dates if they changed
    if (data.startDate || data.endDate) {
      const startDate = data.startDate || tournaments[index].startDate;
      const endDate = data.endDate || tournaments[index].endDate;
      const today = new Date().toISOString().split("T")[0];

      if (startDate <= today && endDate >= today) {
        updatedTournament.status = "active";
      } else if (endDate < today) {
        updatedTournament.status = "completed";
      } else {
        updatedTournament.status = "upcoming";
      }
    }

    tournaments[index] = updatedTournament;
    localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments));

    return updatedTournament;
  },

  // Delete tournament
  deleteTournament: (id: string): boolean => {
    const tournaments = tournamentService.getAllTournaments();
    const filteredTournaments = tournaments.filter((t) => t.id !== id);

    if (filteredTournaments.length === tournaments.length) return false;

    localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(filteredTournaments));
    return true;
  },

  // Add a player to tournament
  addPlayerToTournament: (
    tournamentId: string,
    player: Player
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    // Check if player is already in the tournament
    if (tournament.players.some((p) => p.id === player.id)) {
      return tournament;
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

    return tournamentService.updateTournament(tournamentId, {
      players: updatedPlayers,
      rounds: updatedRounds,
    });
  },

  // Create a new team
  addTeam: (
    tournamentId: string,
    teamData: TeamFormData
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    const newTeam: Team = {
      id: uuidv4(),
      name: teamData.name,
      color: teamData.color,
      logo: teamData.logo,
    };

    const updatedTeams = [...tournament.teams, newTeam];

    return tournamentService.updateTournament(tournamentId, {
      teams: updatedTeams,
    });
  },

  // Update team details
  updateTeam: (
    tournamentId: string,
    teamId: string,
    teamData: Partial<Team>
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    const updatedTeams = tournament.teams.map((team) =>
      team.id === teamId ? { ...team, ...teamData } : team
    );

    return tournamentService.updateTournament(tournamentId, {
      teams: updatedTeams,
    });
  },

  // Delete a team
  deleteTeam: (tournamentId: string, teamId: string): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    // Remove team association from players
    const updatedPlayers = tournament.players.map((player) =>
      player.teamId === teamId ? { ...player, teamId: undefined } : player
    );

    // Remove the team
    const updatedTeams = tournament.teams.filter((team) => team.id !== teamId);

    return tournamentService.updateTournament(tournamentId, {
      teams: updatedTeams,
      players: updatedPlayers,
    });
  },

  // Assign player to a team
  assignPlayerToTeam: (
    tournamentId: string,
    playerId: string,
    teamId: string | undefined
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    const updatedPlayers = tournament.players.map((player) =>
      player.id === playerId ? { ...player, teamId } : player
    );

    return tournamentService.updateTournament(tournamentId, {
      players: updatedPlayers,
    });
  },

  // Create a new round
  addRound: (
    tournamentId: string,
    roundData: RoundFormData
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

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

    const updatedRounds = [...tournament.rounds, newRound];

    return tournamentService.updateTournament(tournamentId, {
      rounds: updatedRounds,
    });
  },

  // Update round details
  updateRound: (
    tournamentId: string,
    roundId: string,
    data: Partial<Round>
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    const updatedRounds = tournament.rounds.map((round) =>
      round.id === roundId ? { ...round, ...data } : round
    );

    return tournamentService.updateTournament(tournamentId, {
      rounds: updatedRounds,
    });
  },

  // Delete a round
  deleteRound: (tournamentId: string, roundId: string): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    const updatedRounds = tournament.rounds.filter(
      (round) => round.id !== roundId
    );

    return tournamentService.updateTournament(tournamentId, {
      rounds: updatedRounds,
    });
  },

  // Update player scores for a specific round
  updateRoundScores: (
    tournamentId: string,
    roundId: string,
    playerId: string,
    holeScores: HoleScore[]
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    const updatedRounds = tournament.rounds.map((round) => {
      if (round.id === roundId) {
        return {
          ...round,
          scores: {
            ...round.scores,
            [playerId]: holeScores,
          },
        };
      }
      return round;
    });

    return tournamentService.updateTournament(tournamentId, {
      rounds: updatedRounds,
    });
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
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    const updatedRounds = tournament.rounds.map((round) => {
      if (round.id === roundId) {
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

        return {
          ...round,
          matchResults,
        };
      }
      return round;
    });

    return tournamentService.updateTournament(tournamentId, {
      rounds: updatedRounds,
    });
  },

  // Add invitations to tournament
  invitePlayersToTournament: (
    tournamentId: string,
    emails: string[]
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    // Filter out duplicates and existing players
    const existingEmails = tournament.players.map((p) => p.email);
    const newInvitations = emails.filter(
      (email) =>
        !existingEmails.includes(email) &&
        !tournament.invitations.includes(email)
    );

    const updatedInvitations = [...tournament.invitations, ...newInvitations];

    return tournamentService.updateTournament(tournamentId, {
      invitations: updatedInvitations,
    });
  },

  // Check if user is the creator of the tournament
  isUserTournamentCreator: (tournamentId: string, userId: string): boolean => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return false;
    return tournament.createdBy === userId;
  },

  // Check if user is part of the tournament
  isUserInTournament: (tournamentId: string, userId: string): boolean => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return false;
    return tournament.players.some((player) => player.id === userId);
  },

  // Get user's pending invitations
  getUserInvitations: (userEmail: string): Tournament[] => {
    const tournaments = tournamentService.getAllTournaments();
    return tournaments.filter((tournament) =>
      tournament.invitations.includes(userEmail)
    );
  },

  // Accept invitation to join tournament
  acceptInvitation: (
    tournamentId: string,
    player: Player
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    // Check if user is in the invitations list
    if (!tournament.invitations.includes(player.email)) return null;

    // Add player to the tournament
    const updatedTournament = tournamentService.addPlayerToTournament(
      tournamentId,
      player
    );
    if (!updatedTournament) return null;

    // Remove from invitations
    const updatedInvitations = tournament.invitations.filter(
      (email) => email !== player.email
    );

    return tournamentService.updateTournament(tournamentId, {
      invitations: updatedInvitations,
    });
  },

  // Decline invitation
  declineInvitation: (
    tournamentId: string,
    userEmail: string
  ): Tournament | null => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return null;

    // Remove from invitations
    const updatedInvitations = tournament.invitations.filter(
      (email) => email !== userEmail
    );

    return tournamentService.updateTournament(tournamentId, {
      invitations: updatedInvitations,
    });
  },

  // Calculate player's total score for a round
  calculateRoundTotal: (
    roundId: string,
    playerId: string,
    tournament: Tournament
  ): number => {
    const round = tournament.rounds.find((r) => r.id === roundId);
    if (!round || !round?.scores[playerId]) return 0;

    return round.scores[playerId].reduce((total, hole) => {
      return total + (hole.score || 0);
    }, 0);
  },

  // Calculate player's total score across all rounds
  calculateTournamentTotal: (
    playerId: string,
    tournament: Tournament
  ): number => {
    return tournament.rounds.reduce((total, round) => {
      if (!round.scores[playerId]) return total;

      const roundTotal = round.scores[playerId].reduce((roundSum, hole) => {
        return roundSum + (hole.score || 0);
      }, 0);

      return total + roundTotal;
    }, 0);
  },

  // Calculate team's total score for a round
  calculateTeamRoundTotal: (
    roundId: string,
    teamId: string,
    tournament: Tournament
  ): number => {
    const round = tournament.rounds.find((r) => r.id === roundId);
    if (!round) return 0;

    const teamPlayers = tournament.players.filter(
      (player) => player.teamId === teamId
    );

    // For match play formats, use points
    if (round.format.includes("Match Play") && round.matchResults) {
      return teamPlayers.reduce((total, player) => {
        const matchResult = round.matchResults?.[player.id];
        return total + (matchResult?.points || 0);
      }, 0);
    }

    // For stroke play formats, use scores
    return teamPlayers.reduce((total, player) => {
      const playerScores = round.scores[player.id];
      if (!playerScores) return total;

      const playerTotal = playerScores.reduce(
        (sum, hole) => sum + (hole.score || 0),
        0
      );
      return total + playerTotal;
    }, 0);
  },

  // Calculate team's total score across all rounds
  calculateTeamTournamentTotal: (
    teamId: string,
    tournament: Tournament
  ): number => {
    return tournament.rounds.reduce((total, round) => {
      return (
        total +
        tournamentService.calculateTeamRoundTotal(round.id, teamId, tournament)
      );
    }, 0);
  },

  // Get tournament individual leaderboard
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
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return [];

    return tournament.players
      .map((player) => {
        const roundTotals: { [roundId: string]: number } = {};

        tournament.rounds.forEach((round) => {
          roundTotals[round.id] = tournamentService.calculateRoundTotal(
            round.id,
            player.id,
            tournament
          );
        });

        const team = tournament.teams.find((t) => t.id === player.teamId);

        return {
          playerId: player.id,
          playerName: player.name,
          teamId: player.teamId,
          teamName: team?.name,
          total: tournamentService.calculateTournamentTotal(
            player.id,
            tournament
          ),
          roundTotals,
        };
      })
      .sort((a, b) => a.total - b.total);
  },

  // Get tournament team leaderboard
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
    const tournament = tournamentService.getTournamentById(tournamentId);
    if (!tournament) return [];

    return tournament.teams
      .map((team) => {
        const roundTotals: { [roundId: string]: number } = {};

        tournament.rounds.forEach((round) => {
          roundTotals[round.id] = tournamentService.calculateTeamRoundTotal(
            round.id,
            team.id,
            tournament
          );
        });

        const playerCount = tournament.players.filter(
          (p) => p.teamId === team.id
        ).length;

        return {
          teamId: team.id,
          teamName: team.name,
          teamColor: team.color,
          playerCount,
          total: tournamentService.calculateTeamTournamentTotal(
            team.id,
            tournament
          ),
          roundTotals,
        };
      })
      .sort((a, b) => a.total - b.total);
  },
};

export default tournamentService;
