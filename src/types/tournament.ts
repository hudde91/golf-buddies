import { User } from "@clerk/clerk-react";

export interface Player {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  teamId?: string;
  bio?: string;
  question1?: string;
  question2?: string;
  question3?: string;
  question4?: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  logo?: string;
  captain?: string;
}

export interface HoleScore {
  hole: number;
  score?: number;
  par?: number;
  notes?: string;
}

export interface Round {
  id: string;
  name: string; // e.g., "Round 1", "Morning Round", etc.
  date: string;
  courseDetails?: {
    name?: string;
    holes: number;
    par?: number;
  };
  format: string; // e.g., "Stroke Play", "Match Play", etc.
  scores: {
    [playerId: string]: HoleScore[];
  };
  // For match play formats
  matchResults?: {
    [playerId: string]: {
      opponentId: string;
      result?: "win" | "loss" | "halved";
      points?: number;
    };
  };
}

export interface Tournament {
  id: string;
  name: string;
  format: string;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  players: Player[];
  teams: Team[];
  rounds: Round[];
  invitations: string[]; // Array of email addresses
  isTeamEvent: boolean;
  scoringType: "individual" | "team" | "both";
  status: "upcoming" | "active" | "completed";
}

export interface TournamentFormData {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  isTeamEvent: boolean;
  scoringType: "individual" | "team" | "both";
}

export interface RoundFormData {
  name: string;
  date: string;
  courseName?: string;
  holes: number;
  par?: number;
  format: string;
}

export interface TeamFormData {
  name: string;
  color: string;
  logo?: string;
  captain?: string;
}
