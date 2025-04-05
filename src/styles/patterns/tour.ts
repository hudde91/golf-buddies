// src/styles/components/tour.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getStatusColor } from "../../components/util";

export const tour = {
  // Tour form styles
  form: {
    container: {
      p: { xs: 2, sm: 4 },
      backgroundColor: "transparent",
    },

    title: {
      color: "white",
      textAlign: "center",
      mb: 2,
    },

    formField: (theme: Theme) => ({
      "& .MuiOutlinedInput-root": {
        color: "white",
        "& fieldset": {
          borderColor: alpha(theme.palette.common.white, 0.3),
        },
        "&:hover fieldset": {
          borderColor: alpha(theme.palette.common.white, 0.5),
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
        },
      },
      "& .MuiInputLabel-root": {
        color: alpha(theme.palette.common.white, 0.7),
      },
    }),

    actionButtons: {
      mt: 4,
      display: "flex",
      justifyContent: "flex-end",
      gap: 2,
    },

    cancelButton: (theme: Theme) => ({
      color: "white",
      borderColor: alpha(theme.palette.common.white, 0.5),
      "&:hover": {
        borderColor: "white",
        backgroundColor: alpha(theme.palette.common.white, 0.1),
      },
    }),

    submitButton: (theme: Theme) => ({
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
  },

  // Tour header styles
  header: {
    container: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.common.black, 0.3),
      backdropFilter: "blur(10px)",
      borderRadius: 2,
      p: { xs: 2, md: 4 },
      mb: 4,
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    }),

    contentWrapper: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 2,
    },

    statusChipsContainer: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      mb: 1,
    },

    statusChip: (status: string) => (theme: Theme) => ({
      backgroundColor: alpha(getStatusColor(status, theme), 0.2),
      color: getStatusColor(status, theme),
      fontWeight: "medium",
      borderRadius: 1,
    }),

    tourChip: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
      color: theme.palette.secondary.main,
      fontWeight: "medium",
      borderRadius: 1,
    }),

    title: {
      fontWeight: "bold",
      color: "white",
      mb: 2,
    },

    description: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.8),
      mb: 3,
      maxWidth: "800px",
    }),

    infoContainer: {
      mb: 3,
    },

    infoIcon: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.6),
      mr: 1,
    }),

    infoText: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.8),
      whiteSpace: "nowrap",
    }),

    actionButtons: {
      display: "flex",
      gap: 1,
      alignItems: "flex-start",
    },

    editButton: (theme: Theme) => ({
      color: "white",
      borderColor: alpha(theme.palette.common.white, 0.3),
      "&:hover": {
        borderColor: alpha(theme.palette.common.white, 0.6),
        backgroundColor: alpha(theme.palette.common.white, 0.1),
      },
    }),
  },

  // Tournament card styles
  tournamentCard: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.4),
      transform: "translateY(-4px)",
      boxShadow: `0 6px 12px ${alpha(theme.palette.common.black, 0.3)}`,
    },
    cursor: "pointer",
  }),

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
    "& svg": {
      color: (theme: Theme) => alpha(theme.palette.common.white, 0.6),
    },
    "& p": {
      color: (theme: Theme) => alpha(theme.palette.common.white, 0.8),
    },
  },

  divider: (theme: Theme) => ({
    my: 1.5,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  // Team card styles
  teamCard: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    overflow: "hidden",
    height: "100%",
  }),

  teamHeader: (color: string) => (theme: Theme) => ({
    backgroundColor: alpha(color, 0.15),
    borderBottom: `1px solid ${alpha(color, 0.3)}`,
    p: 2,
  }),

  teamContent: {
    p: 2,
  },

  // Typography styles
  typography: {
    title: {
      color: "white",
      fontWeight: 600,
    },

    subtitle: (theme: Theme) => ({
      color: theme.palette.primary.light,
      fontWeight: 500,
      mb: 1,
    }),

    muted: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.6),
      fontStyle: "italic",
    }),
  },
};
