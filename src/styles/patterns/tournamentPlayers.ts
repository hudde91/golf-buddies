// src/styles/components/tournamentPlayers.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const tournamentPlayers = {
  // Layout styles
  layouts: {
    tabHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "center" },
      mb: 3,
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
    },
  },

  // Typography styles
  playerTypography: {
    playerName: {
      color: "white",
      fontWeight: 500,
    },

    playerDetail: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      mt: 0.5,
      fontSize: "0.875rem",
    }),

    profileTitle: {
      color: "white",
      fontWeight: 600,
    },

    sectionTitle: (theme: Theme) => ({
      color: theme.palette.primary.light,
      mb: 2,
    }),

    bio: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
      mb: 2,
      lineHeight: 1.6,
    }),

    getInfoItemTitle: (color: string) => ({
      color: color,
      fontWeight: 500,
    }),

    infoItemValue: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
    }),
  },

  // Button styles
  buttons: {
    invite: (theme: Theme) => ({
      color: "white",
      borderColor: alpha(theme.palette.common.white, 0.5),
      "&:hover": {
        borderColor: "white",
        backgroundColor: alpha(theme.palette.common.white, 0.1),
      },
    }),

    close: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      borderColor: alpha(theme.palette.common.white, 0.3),
      "&:hover": {
        borderColor: alpha(theme.palette.common.white, 0.5),
        backgroundColor: alpha(theme.palette.common.white, 0.1),
      },
    }),
  },

  // Player card
  playerCard: (theme: Theme) => ({
    p: 2,
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.4),
      transform: "translateY(-2px)",
      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`,
    },
  }),

  // Avatar styles
  getPlayerAvatar: (teamColor?: string) => (theme: Theme) => ({
    width: 48,
    height: 48,
    mr: 2,
    border: teamColor
      ? `2px solid ${teamColor}`
      : `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  getProfileAvatar: (teamColor?: string) => (theme: Theme) => ({
    width: 80,
    height: 80,
    mr: 2,
    border: teamColor
      ? `3px solid ${teamColor}`
      : `3px solid ${alpha(theme.palette.common.white, 0.2)}`,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  }),

  getInfoIconContainer: (color: string) => (theme: Theme) => ({
    width: 40,
    height: 40,
    bgcolor: alpha(color, 0.15),
    color: color,
    mr: 2,
  }),

  // Dialog styles
  profileDialog: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.85),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  closeButton: (theme: Theme) => ({
    position: "absolute",
    right: 8,
    top: 8,
    color: alpha(theme.palette.common.white, 0.7),
  }),

  dialogActions: (theme: Theme) => ({
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    px: 3,
    py: 2,
  }),

  profileDivider: (theme: Theme) => ({
    pb: 2,
    mb: 2,
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  profileInfoItem: {
    display: "flex",
    alignItems: "center",
    mb: 2,
  },

  // Chip styles
  chips: {
    getTeamChip: (color: string) => (theme: Theme) => ({
      backgroundColor: alpha(color, 0.15),
      color: color,
      border: `1px solid ${alpha(color, 0.3)}`,
    }),

    getCaptainChip: (color: string) => (theme: Theme) => ({
      backgroundColor: alpha(color, 0.1),
      color: color,
      borderColor: alpha(color, 0.3),
    }),
  },
};
