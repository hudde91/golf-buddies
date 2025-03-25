// import { User } from "@clerk/clerk-react";
import { Achievement } from ".";

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
  achievements?: Achievement[];
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
  name: string;
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
  shoutOuts?: ShoutOut[];
  highlights?: Highlight[];
}

export interface Tour {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  tournaments: Tournament[];
  players?: Player[];
  teams?: Team[]; // Optional shared teams across tournaments
  invitations?: string[];
  status: "upcoming" | "active" | "completed";
  pointsSystem?: {
    // Optional points system for tour rankings
    win: number;
    topFinish: { [position: number]: number }; // e.g., {1: 100, 2: 75, 3: 60}
    participation: number;
  };
}

export interface Event {
  id: string;
  type: "tournament" | "tour";
  data: Tournament | Tour;
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

export interface TourFormData {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ShoutOut {
  id: string;
  tournamentId: string;
  roundId: string;
  playerId: string;
  holeNumber: number;
  type: "birdie" | "eagle" | "hole-in-one" | "custom";
  message?: string;
  timestamp: string;
}

export interface Highlight {
  id: string;
  tournamentId: string;
  playerId: string;
  roundId?: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  mediaType: "image" | "video";
  timestamp: string;
}

// Combined type for displaying both shoutOuts and highlights together
export interface FeedItem {
  id: string;
  type: "shoutOut" | "highlight";
  timestamp: string;
  data: ShoutOut | Highlight;
}

export interface HighlightFormData {
  title: string;
  description?: string;
  mediaType: "image" | "video";
  mediaFile?: File;
  roundId?: string;
}
