import { Achievement } from ".";

export interface Player {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  teamId?: string;
  bio?: string;
  handicap?: number;
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

export interface PlayerGroup {
  id: string;
  name: string;
  playerIds: string[];
  startingHole?: number; // Optional, for shotgun starts
  teeTime?: string; // Optional, for scheduled tee times
}

interface BaseEvent {
  id: string;
  type: "tournament" | "tour" | "round";
}

export interface Round extends BaseEvent {
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
  createdBy?: string;
  createdAt?: string;
  players?: Player[];
  teams?: Team[];
  location?: string;
  description?: string;
  status?: "upcoming" | "active" | "completed";
  invitations?: string[];
  playerGroups?: PlayerGroup[];
  // For match play formats
  matchResults?: {
    [playerId: string]: {
      opponentId: string;
      result?: "win" | "loss" | "halved";
      points?: number;
    };
  };
  shoutOuts?: ShoutOut[];
  highlights?: Highlight[];
}

export interface Tournament extends BaseEvent {
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
  invitations: string[];
  isTeamEvent: boolean;
  scoringType: "individual" | "team" | "both";
  status: "upcoming" | "active" | "completed";
  shoutOuts?: ShoutOut[];
  highlights?: Highlight[];
}

export interface Tour extends BaseEvent {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  tournaments: Tournament[]; // Keep for backward compatibility
  rounds: Round[];
  players: Player[];
  teams?: Team[]; // Optional shared teams across tournaments
  invitations?: string[];
  isTeamEvent?: boolean;
  scoringType?: "individual" | "team" | "both";
  status: "upcoming" | "active" | "completed";
  pointsSystem?: {
    // Optional points system for tour rankings
    win: number;
    topFinish: { [position: number]: number }; // e.g., {1: 100, 2: 75, 3: 60}
    participation: number;
  };
  // Add highlight support for tours
  shoutOuts?: ShoutOut[];
  highlights?: Highlight[];
}

export type Event = Tournament | Tour | Round;

export interface UserInvitations {
  tournaments: Tournament[];
  rounds: Round[];
  tours: Tour[];
}

export interface TournamentFormData {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  isTeamEvent: boolean;
  scoringType: "individual" | "team" | "both";
  inviteFriends?: string[];
}

export interface RoundFormData {
  name: string;
  date: string;
  courseName?: string;
  description?: string;
  holes: number;
  par?: number;
  format: string;
  inviteFriends?: string[];
  slope?: number;
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
  isTeamEvent?: boolean;
  scoringType?: "individual" | "team" | "both";
  inviteFriends?: string[];
}

export interface ShoutOut {
  id: string;
  eventId: string;
  eventType: "tournament" | "tour";
  roundId: string;
  playerId: string;
  holeNumber: number;
  type: "birdie" | "eagle" | "hole-in-one" | "custom";
  message?: string;
  timestamp: string;
}

export interface Highlight {
  id: string;
  eventId: string;
  eventType: "tournament" | "tour";
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
