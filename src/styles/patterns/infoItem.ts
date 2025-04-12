// src/styles/patterns/infoItem.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const infoItem = {
  base: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    mb: 0.5,
    "& .MuiSvgIcon-root": {
      mr: 1,
      color: alpha(theme.palette.common.white, 0.5),
    },
    "& .MuiTypography-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
  }),

  // Event info item (used in cards)
  event: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  // Profile info with label and value
  profile: () => ({
    display: "flex",
    alignItems: "flex-start",
    mb: 2.5,
    gap: 2,
  }),

  // Multi-column container for info items
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
};
