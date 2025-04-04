// src/styles/patterns/statusIndicator.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const statusIndicator = {
  // Function to generate a status chip style based on status type
  chip: (color: string, theme: Theme) => ({
    backgroundColor: alpha(color, 0.1),
    color: color,
    fontWeight: "medium",
    borderRadius: 1,
    fontSize: "0.75rem",
    px: 1,
    py: 0.5,
  }),

  // Badge style status indicator
  badge: (color: string, theme: Theme) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: color,
    display: "inline-block",
    mr: 1,
  }),

  // Team colors for teams
  team: (teamColor: string, theme: Theme) => ({
    bgcolor: alpha(teamColor, 0.2),
    color: teamColor,
    border: `1px solid ${alpha(teamColor, 0.5)}`,
  }),
};
