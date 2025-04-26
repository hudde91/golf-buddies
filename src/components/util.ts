import { Theme } from "@mui/material";

export const getStatusColor = (status: string, theme: Theme) => {
  switch (status.toLowerCase()) {
    case "upcoming":
      return theme.palette.info.main;
    case "active":
      return theme.palette.success.main;
    case "completed":
      return theme.palette.primary.main;
    case "cancelled":
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
};

export const getColorBasedOnStatus = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "upcoming":
      return "primary";
    case "completed":
      return "info";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

export const formatDescriptions: Record<string, string> = {
  "Stroke Play":
    "Traditional golf scoring. Players count every stroke and the lowest total score wins.",
  "Match Play":
    "Players compete hole by hole. The player with the lower score on a hole wins that hole.",
  "Four-ball":
    "Team format where two players play as partners, each playing their own ball. The better score of the two partners counts as the team score for each hole.",
  Foursomes:
    "Team format where two players play as partners and alternate hitting the same ball. Also called 'alternate shot'.",
  "Singles Match Play": "One-on-one match play between individual players.",
  "Better Ball":
    "Similar to Four-ball. Each player plays their own ball, and the best score on each hole counts for the team.",
  Scramble:
    "Team format where each player tees off, the best shot is selected, and all players play their next shot from that location.",
  "Modified Stableford":
    "Scoring system that awards points based on performance relative to par on each hole.",
  "Skins Game":
    "Players compete for each hole. If a player wins a hole outright, they win the 'skin' for that hole.",
};

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
