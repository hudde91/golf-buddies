import { Theme } from "@mui/material";

export const getPositionText = (position: number): string => {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
};

export const getBadgeColor = (position: number, theme: Theme): string => {
  if (position === 1) return theme.palette.warning.main; // Gold
  if (position === 2) return theme.palette.grey[400]; // Silver
  if (position === 3) return theme.palette.brown[300]; // Bronze
  return theme.palette.primary.main; // Default
};
