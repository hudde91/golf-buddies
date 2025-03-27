import { Theme, alpha } from "@mui/material";

export const getBadgeColor = (position: number, theme: Theme) => {
  switch (position) {
    case 1:
      return theme.palette.warning.main; // Gold for 1st
    case 2:
      return alpha(theme.palette.grey[400], 0.8); // Silver for 2nd
    case 3:
      return theme.palette.warning.dark; // Bronze for 3rd
    default:
      return theme.palette.primary.main;
  }
};

export const getPositionText = (position: number) => {
  switch (position) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${position}th`;
  }
};
