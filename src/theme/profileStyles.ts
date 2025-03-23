// src/theme/tourStyles.ts
import { alpha, Theme } from "@mui/material";
import { colors, styleHelpers } from "./theme";

// Profile-specific styling patterns that extend the main theme
export const profileStyles = {
  // Extend the glass panel for profile cards
  profileCard: (theme: Theme) => ({
    ...styleHelpers.glassBox(theme),
    p: { xs: 3, md: 4 },
    mb: 4,
    border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  // Section title with primary color accent
  sectionTitle: (theme: Theme) => ({
    color: colors.text.primary,
    fontWeight: 600,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    paddingBottom: "8px",
    mb: 2,
  }),

  // Profile form field styling
  formField: (theme: Theme) => ({
    input: {
      color: colors.text.primary,
      fontSize: "1.1rem",
      lineHeight: 1.6,
    },
    label: {
      color: alpha(theme.palette.common.white, 0.7),
      fontSize: "1.1rem",
    },
    border: {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.common.white, 0.3),
        borderWidth: "2px",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.common.white, 0.5),
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
    },
  }),

  // Avatar styling
  avatar: (theme: Theme) => ({
    border: `4px solid ${alpha(theme.palette.common.white, 0.2)}`,
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
  }),

  // Typography variants specific to profile
  typography: {
    profileHeading: (theme: Theme) => ({
      color: colors.text.primary,
      fontWeight: 600,
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    }),
    profileSubtitle: (theme: Theme) => ({
      color: theme.palette.primary.light,
      fontWeight: 600,
      fontSize: "1.2rem",
      mb: 1,
    }),
    profileBody: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
      fontSize: "1.2rem",
      lineHeight: 1.7,
      letterSpacing: "0.2px",
    }),
    profileMuted: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.6),
      fontSize: "0.95rem",
    }),
  },

  // Profile-specific buttons
  buttons: {
    editButton: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.white, 0.1),
      padding: "12px",
      "&:hover": {
        bgcolor: alpha(theme.palette.common.white, 0.2),
      },
    }),
    saveButton: (theme: Theme) => ({
      padding: "12px 24px",
      fontSize: "1.1rem",
      fontWeight: 600,
    }),
  },
};
