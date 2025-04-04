import { alpha, Theme } from "@mui/material";
import { card } from "../components";

export const playerCard = {
  container: (theme: Theme) => ({
    ...card.glass(theme),
    display: "flex",
    alignItems: "center",
    p: 2,
  }),
  avatar: (theme: Theme, teamColor?: string) => ({
    width: 48,
    height: 48,
    mr: 2,
    border: teamColor
      ? `2px solid ${teamColor}`
      : `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }),
  content: {
    display: "flex",
    flexDirection: "column",
  },
  name: (theme: Theme) => ({
    fontSize: 16,
    color: theme.palette.common.white,
    fontWeight: 600,
  }),
  teamChip: (theme: Theme, teamColor: string) => ({
    mt: 0.5,
    backgroundColor: alpha(teamColor, 0.2),
    color: teamColor,
  }),
};
