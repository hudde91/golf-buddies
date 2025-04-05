// src/styles/components/tournamentRounds.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const tournamentRounds = {
  // RoundsTab component styles
  roundsTab: {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
      flexDirection: { xs: "column", sm: "row" },
      gap: { xs: 2, sm: 0 },
    },

    emptyState: {
      textAlign: "center",
      py: 6,
      px: 2,
      mt: 3,
      backgroundColor: (theme: Theme) => alpha(theme.palette.common.black, 0.2),
      borderRadius: 2,
      border: (theme: Theme) =>
        `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
    },

    emptyStateIcon: (theme: Theme) => ({
      fontSize: 60,
      color: alpha(theme.palette.common.white, 0.3),
      mb: 2,
    }),

    emptyStateTitle: {
      color: "white",
      mb: 1,
    },

    emptyStateMessage: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 3,
    }),

    roundsList: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.black, 0.3),
      backdropFilter: "blur(10px)",
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 2,
      p: 0,
      overflow: "hidden",
    }),

    roundItem: (theme: Theme) => ({
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      "&:last-child": {
        borderBottom: "none",
      },
      "&.Mui-selected": {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.05),
      },
    }),

    roundItemAvatar: {
      minWidth: { xs: "auto", sm: 56 },
      mr: { xs: 1, sm: 0 },
    },

    avatar: (theme: Theme) => ({
      bgcolor: theme.palette.primary.dark,
    }),

    roundName: {
      color: "white",
      fontWeight: 500,
    },

    roundDate: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),

    deleteButton: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      "&:hover": {
        color: theme.palette.error.main,
      },
    }),

    noSelection: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      border: (theme: Theme) =>
        `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
      borderRadius: 2,
    },

    noSelectionText: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
  },

  // Group styles
  group: {
    container: (theme: Theme) => ({
      mb: 4,
    }),

    header: (theme: Theme) => ({
      p: 2,
      bgcolor: theme.palette.primary.main,
      color: "white",
      borderRadius: "4px",
      cursor: "pointer",
      "&:hover": {
        bgcolor: theme.palette.primary.dark,
      },
    }),

    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      fontWeight: "bold",
    },

    playerCount: {
      fontSize: "0.875rem",
    },

    chips: {
      display: "flex",
      gap: 1,
    },

    timeChip: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.white, 0.2),
      color: "white",
    }),

    holeChip: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.white, 0.2),
      color: "white",
    }),

    playerChips: {
      mt: 2,
      display: "flex",
      flexWrap: "wrap",
      gap: 1,
    },

    playerChip: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.white, 0.2),
      color: "white",
    }),
  },

  // Ungrouped players styles
  ungrouped: {
    container: {
      mb: 4,
    },

    header: (theme: Theme) => ({
      mb: 2,
      p: 2,
      bgcolor: theme.palette.grey[700],
      color: "white",
      borderRadius: "4px 4px 0 0",
      borderBottom: "none",
    }),

    playerList: (theme: Theme) => ({
      mb: 2,
      border: `1px solid ${theme.palette.divider}`,
      borderTop: "none",
      borderRadius: "0 0 4px 4px",
      overflow: "hidden",
    }),

    playerItem: (theme: Theme) => ({
      borderBottom: `1px solid ${theme.palette.divider}`,
      "&:last-child": {
        borderBottom: "none",
      },
    }),

    playerName: {
      display: "flex",
      alignItems: "center",
    },
  },

  // Header styles for scorecard
  header: {
    container: {
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", md: "center" },
      mb: 2,
    },

    title: {
      color: "white",
      fontWeight: 600,
      mb: { xs: 1, md: 0 },
    },

    courseChip: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.light,
      borderColor: alpha(theme.palette.primary.light, 0.3),
    }),

    chipsContainer: {
      display: "flex",
      gap: 1,
      mb: 3,
    },

    formatChip: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.secondary.main, 0.1),
      color: theme.palette.secondary.light,
    }),

    holesChip: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.info.main, 0.1),
      color: theme.palette.info.light,
    }),
  },

  // Weather display styles
  weather: {
    container: (theme: Theme) => ({
      mb: 3,
      p: 2,
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 2,
      backgroundColor: alpha(theme.palette.common.black, 0.2),
    }),

    title: {
      color: "white",
      mb: 1,
    },

    chipsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: 1,
    },

    loading: {
      display: "flex",
      alignItems: "center",
      gap: 1,
      color: (theme: Theme) => alpha(theme.palette.common.white, 0.7),
    },

    error: (theme: Theme) => ({
      color: theme.palette.error.main,
    }),

    // Weather chip variants
    chips: {
      condition: (theme: Theme) => ({
        bgcolor: alpha(theme.palette.info.main, 0.1),
        color: theme.palette.info.light,
        borderColor: alpha(theme.palette.info.light, 0.3),
      }),

      temperature: (theme: Theme) => ({
        bgcolor: alpha(theme.palette.warning.main, 0.1),
        color: theme.palette.warning.light,
        borderColor: alpha(theme.palette.warning.light, 0.3),
      }),

      wind: (theme: Theme) => ({
        bgcolor: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.light,
        borderColor: alpha(theme.palette.success.light, 0.3),
      }),

      humidity: (theme: Theme) => ({
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.light,
        borderColor: alpha(theme.palette.primary.light, 0.3),
      }),
    },
  },
};
