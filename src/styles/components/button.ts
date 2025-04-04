// src/styles/components/button.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const button = {
  // Base button style (shared properties)
  base: {
    textTransform: "none",
    borderRadius: 1.5,
  },

  // Primary button
  primary: (theme: Theme) => ({
    ...button.base,
    color: "white",
    bgcolor: theme.palette.primary.main,
    "&:hover": {
      bgcolor: theme.palette.primary.dark,
    },
  }),

  // Secondary button
  secondary: (theme: Theme) => ({
    ...button.base,
    color: "white",
    bgcolor: theme.palette.secondary.main,
    "&:hover": {
      bgcolor: theme.palette.secondary.dark,
    },
  }),

  // Outlined button
  outlined: (theme: Theme) => ({
    ...button.base,
    color: "white",
    borderColor: alpha(theme.palette.common.white, 0.5),
    "&:hover": {
      borderColor: "white",
      backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
  }),

  // Danger/error button
  danger: (theme: Theme) => ({
    ...button.base,
    color: theme.palette.error.light,
    borderColor: alpha(theme.palette.error.light, 0.5),
    "&:hover": {
      borderColor: theme.palette.error.light,
      backgroundColor: alpha(theme.palette.error.main, 0.1),
    },
  }),

  // Action button (subtle primary)
  action: (theme: Theme) => ({
    ...button.base,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, 0.2),
    },
  }),

  // Cancel/secondary action button
  cancel: (theme: Theme) => ({
    ...button.base,
    color: alpha(theme.palette.common.white, 0.7),
    "&:hover": {
      bgcolor: alpha(theme.palette.common.white, 0.1),
    },
  }),

  // Icon button variant
  icon: (theme: Theme) => ({
    width: 40,
    height: 40,
    borderRadius: "50%",
    minWidth: "auto",
    padding: 0,
    color: alpha(theme.palette.common.white, 0.7),
    "&:hover": {
      color: theme.palette.common.white,
      backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
  }),

  // Feature-specific button styles
  accept: {
    minWidth: 100,
    mr: 1,
  },

  create: {
    py: 1.5,
    px: 3,
    borderRadius: 2,
    textTransform: "none",
    fontWeight: "bold",
  },

  viewDetails: {
    py: 1,
    borderRadius: 1.5,
  },
};
