import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const avatars = {
  standard: (theme: Theme, teamColor?: string) => ({
    width: { xs: 32, sm: 36 },
    height: { xs: 32, sm: 36 },
    mr: 1,
    border: teamColor
      ? `2px solid ${teamColor}`
      : `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  profile: (theme: Theme, teamColor?: string) => ({
    width: { xs: 80, md: 100 },
    height: { xs: 80, md: 100 },
    mr: 2,
    border: teamColor
      ? `3px solid ${teamColor}`
      : `3px solid ${alpha(theme.palette.common.white, 0.2)}`,
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
  }),

  team: (color: string) => ({
    bgcolor: color,
    width: 40,
    height: 40,
    mr: 2,
  }),

  iconContainer: (theme: Theme) => ({
    bgcolor: theme.palette.primary.dark,
    color: "white",
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 2,
  }),

  badge: (theme: Theme, color: string) => ({
    color: color,
    bgcolor: alpha(theme.palette.common.black, 0.7),
    borderRadius: "50%",
    padding: "2px",
    width: 16,
    height: 16,
  }),

  // Player avatar with medium size - good for list items
  player: (theme: Theme, teamColor?: string) => ({
    width: { xs: 48, md: 56 },
    height: { xs: 48, md: 56 },
    mr: 2,
    border: teamColor
      ? `2px solid ${teamColor}`
      : `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  // Small avatar for leaderboards and compact displays
  leaderboard: (theme: Theme, teamColor?: string) => ({
    width: { xs: 28, sm: 32 },
    height: { xs: 28, sm: 32 },
    mr: 1,
    border: teamColor
      ? `2px solid ${teamColor}`
      : `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }),
};
