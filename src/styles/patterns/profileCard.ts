// src/styles/patterns/profileCard.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { card } from "../components/card";
import { text } from "../components/text";

export const profileCard = {
  container: (theme: Theme) => ({
    ...card.glass(theme),
    p: { xs: 3, md: 4 },
    mb: 4,
    border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  sectionTitle: (theme: Theme) => ({
    color: "white",
    fontWeight: 600,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    paddingBottom: "8px",
    mb: 2,
  }),

  formField: (theme: Theme) => ({
    input: {
      color: "white",
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

  avatar: (theme: Theme) => ({
    border: `4px solid ${alpha(theme.palette.common.white, 0.2)}`,
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
    width: { xs: 180, md: 220 },
    height: { xs: 180, md: 220 },
  }),

  typography: {
    heading: (theme: Theme) => ({
      ...text.heading.profile(theme),
      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
    }),
    subtitle: (theme: Theme) => ({
      ...text.subtitle.section(theme),
      fontWeight: 600,
      fontSize: "1.2rem",
      mb: 1,
    }),
    body: (theme: Theme) => ({
      ...text.body.primary(theme),
      fontSize: "1.2rem",
      lineHeight: 1.7,
      letterSpacing: "0.2px",
    }),
    muted: (theme: Theme) => ({
      ...text.body.muted(theme),
      fontSize: "0.95rem",
    }),
  },

  buttons: {
    edit: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.white, 0.1),
      padding: "12px",
      color: "white",
      "&:hover": {
        bgcolor: alpha(theme.palette.common.white, 0.2),
      },
    }),
    save: (theme: Theme) => ({
      padding: "12px 24px",
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "white",
      bgcolor: theme.palette.primary.main,
      "&:hover": {
        bgcolor: theme.palette.primary.dark,
      },
    }),
  },

  slider: {
    height: 8,
    borderRadius: 4,
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 16,
      width: 16,
      backgroundColor: (theme: Theme) => theme.palette.primary.main,
      border: (theme: Theme) => `2px solid ${theme.palette.primary.main}`,
    },
  },

  achievements: {
    container: (theme: Theme) => ({
      mb: 3,
    }),
    title: (theme: Theme) => ({
      fontSize: "1.125rem",
      fontWeight: 600,
      mb: 2,
      color: "white",
    }),
    list: (theme: Theme) => ({
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
    }),
    emptyState: (theme: Theme) => ({
      textAlign: "center",
      p: 4,
      color: alpha(theme.palette.common.white, 0.5),
    }),
    item: (theme: Theme) => ({
      display: "flex",
      alignItems: "center",
      p: 2,
      borderRadius: 1,
      boxShadow: theme.shadows[1],
    }),
    getItemBackground: (theme: Theme, position: number) => {
      if (position === 1) {
        return {
          bgcolor: alpha(theme.palette.warning.main, 0.1),
          borderLeft: `4px solid ${theme.palette.warning.main}`,
        };
      } else if (position === 2) {
        return {
          bgcolor: alpha(theme.palette.grey[400], 0.1),
          borderLeft: `4px solid ${theme.palette.grey[400]}`,
        };
      } else if (position === 3) {
        return {
          bgcolor: alpha(theme.palette.brown[300], 0.1),
          borderLeft: `4px solid ${theme.palette.brown[300]}`,
        };
      } else {
        return {
          bgcolor: alpha(theme.palette.common.black, 0.2),
          borderLeft: `4px solid ${alpha(theme.palette.common.white, 0.1)}`,
        };
      }
    },
    positionBadge: {
      base: (theme: Theme) => ({
        width: 30,
        height: 30,
        fontSize: 14,
        fontWeight: "bold",
        mr: 1,
      }),
      first: (theme: Theme) => ({
        bgcolor: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
      }),
      second: (theme: Theme) => ({
        bgcolor: theme.palette.grey[400],
        color: theme.palette.getContrastText(theme.palette.grey[400]),
      }),
      third: (theme: Theme) => ({
        bgcolor: theme.palette.brown[300],
        color: "#FFFFFF",
      }),
    },
    iconContainer: (theme: Theme) => ({
      minWidth: 40,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),
    textContainer: (theme: Theme) => ({
      display: "flex",
      flexDirection: "column",
    }),
    displayText: (theme: Theme) => ({
      fontWeight: 500,
      color: theme.palette.text.primary,
    }),
    dateText: (theme: Theme) => ({
      fontSize: 13,
      color: theme.palette.text.secondary,
    }),
    divider: (theme: Theme) => ({
      my: 1,
    }),
  },
};
