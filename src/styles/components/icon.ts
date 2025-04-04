// src/styles/components/icon.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const icon = {
  // Base icon styles
  base: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
  }),

  // Icon sizes
  size: {
    small: {
      fontSize: "1rem",
    },
    medium: {
      fontSize: "1.5rem",
    },
    large: {
      fontSize: "2rem",
    },
    xlarge: {
      fontSize: "3rem",
    },
  },

  // Icon with container
  container: {
    base: (theme: Theme) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),

    primary: (theme: Theme) => ({
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

    secondary: (theme: Theme) => ({
      bgcolor: theme.palette.secondary.dark,
      color: "white",
      width: 40,
      height: 40,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mr: 2,
    }),

    feature: (theme: Theme) => ({
      color: theme.palette.primary.light,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
  },

  // Icon in text/information items
  infoIcon: (theme: Theme) => ({
    fontSize: "small",
    color: alpha(theme.palette.common.white, 0.5),
    mr: 1,
  }),

  // Empty state icon
  emptyState: (theme: Theme) => ({
    fontSize: 60,
    color: alpha(theme.palette.common.white, 0.3),
    mb: 2,
  }),

  // Feature-specific icon styles
  header: (theme: Theme) => ({
    fontSize: { xs: 32, md: 40 },
    color: alpha(theme.palette.common.white, 0.9),
    mr: 2,
  }),
};
