// src/theme/tournamentStyles.ts
import { alpha, Theme } from "@mui/material";
import { colors, styleHelpers } from "./theme";

// Function to get color based on tournament status
export const getStatusColor = (status: string, theme: Theme) => {
  switch (status.toLowerCase()) {
    case "upcoming":
      return theme.palette.info.main;
    case "active":
      return theme.palette.success.main;
    case "completed":
      return theme.palette.primary.main;
    case "cancelled":
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
};

// Tournament-specific styling patterns
export const tournamentStyles = {
  tournamentCard: (theme: Theme) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: alpha(theme.palette.common.black, 0.4),
    backdropFilter: "blur(8px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 12px 20px -10px ${alpha("#000", 0.5)}`,
    },
  }),

  tournamentCardMedia: {
    height: 140,
    backgroundImage:
      "url(https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800)",
    backgroundSize: "cover",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage:
        "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)",
    },
  },

  statusChip: (color: string, theme: Theme) => ({
    display: "inline-block",
    backgroundColor: alpha(color, 0.2),
    color: color,
    fontWeight: "medium",
    borderRadius: 1,
    fontSize: "0.75rem",
    px: 1,
    py: 0.5,
  }),

  tournamentDivider: (theme: Theme) => ({
    my: 1.5,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  infoItem: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    mb: 0.5,
    "& .MuiSvgIcon-root": {
      color: alpha(theme.palette.common.white, 0.5),
      mr: 1,
      fontSize: "small",
    },
    "& .MuiTypography-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
  }),

  leaderboardRow: (
    theme: Theme,
    position: number,
    highlightWinner: boolean = true
  ) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    p: 1.5,
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    "&:last-child": { borderBottom: "none" },
    bgcolor:
      highlightWinner && position === 1
        ? alpha(theme.palette.warning.main, 0.1)
        : "transparent",
    "&:hover": {
      bgcolor: alpha(theme.palette.common.white, 0.05),
    },
  }),

  getPositionColor: (position: number, theme: Theme) => {
    if (position === 1) return theme.palette.warning.main;
    if (position === 2) return theme.palette.grey[400];
    if (position === 3) return theme.palette.brown[300];
    return theme.palette.common.white;
  },

  loadingState: {
    background: colors.backgrounds.dark,
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    p: 3,
  },

  emptyState: (theme: Theme) => ({
    textAlign: "center",
    py: 6,
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    borderRadius: 2,
    border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  emptyStateIcon: (theme: Theme) => ({
    fontSize: 60,
    color: alpha(theme.palette.common.white, 0.3),
    mb: 2,
  }),

  formStyles: {
    inputProps: (theme: Theme) => ({
      style: { color: "white" },
      sx: {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.common.white, 0.3),
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.common.white, 0.5),
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      },
    }),

    labelProps: (theme: Theme) => ({
      style: { color: alpha(theme.palette.common.white, 0.7) },
    }),
  },

  dialogStyles: {
    title: (theme: Theme) => ({
      color: "white",
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    }),

    actions: (theme: Theme) => ({
      borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      px: 3,
      py: 2,
      flexDirection: { xs: "column", sm: "row" },
      alignItems: "stretch",
      "& > button": {
        m: { xs: 0.5, sm: 0 },
      },
    }),
  },

  typography: {
    title: (theme: Theme) => ({
      fontWeight: "bold",
      color: theme.palette.common.white,
      mb: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    }),
    cardTitle: {
      color: "white",
      fontWeight: 500,
      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
    },
    header: {
      color: "white",
      fontWeight: 500,
    },
    body: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
    }),
    muted: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
  },
};

// Tournament leaderboard-specific styling patterns
export const tournamentLeaderboardStyles = {
  emptyState: (theme: Theme) => ({
    textAlign: "center",
    py: 6,
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    borderRadius: 2,
    border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  emptyStateIcon: (theme: Theme) => ({
    fontSize: 60,
    color: alpha(theme.palette.common.white, 0.3),
    mb: 2,
  }),

  tableContainer: (theme: Theme) => ({
    overflowX: "auto",
    bgcolor: "transparent",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 1,
    boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.3)}`,
  }),

  headerCell: (theme: Theme) => ({
    fontWeight: "bold",
    color: alpha(theme.palette.common.white, 0.9),
    borderBottomColor: alpha(theme.palette.common.white, 0.2),
    bgcolor: alpha(theme.palette.common.black, 0.4),
  }),

  positionHeaderCell: (theme: Theme) => ({
    fontWeight: "bold",
    width: 50,
    color: alpha(theme.palette.common.white, 0.9),
    borderBottomColor: alpha(theme.palette.common.white, 0.2),
    bgcolor: alpha(theme.palette.common.black, 0.4),
  }),

  dataCell: (theme: Theme) => ({
    borderBottomColor: alpha(theme.palette.common.white, 0.1),
    color: alpha(theme.palette.common.white, 0.9),
  }),

  centeredDataCell: (theme: Theme) => ({
    borderBottomColor: alpha(theme.palette.common.white, 0.1),
    color: alpha(theme.palette.common.white, 0.9),
    textAlign: "center",
  }),

  tableRow: (theme: Theme, index: number) => ({
    bgcolor:
      index % 2 === 0 ? alpha(theme.palette.common.black, 0.1) : "transparent",
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, 0.1),
    },
  }),

  winnerChip: {
    ml: 1,
    height: 20,
    fontSize: "0.6rem",
  },

  captainChip: (theme: Theme) => ({
    ml: 1,
    height: 20,
    fontSize: "0.6rem",
    bgcolor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.light,
    border: `1px solid ${alpha(theme.palette.success.light, 0.3)}`,
  }),

  teamChip: (teamColor: string, theme: Theme) => ({
    bgcolor: alpha(teamColor, 0.2),
    color: teamColor,
    border: `1px solid ${alpha(teamColor, 0.5)}`,
  }),

  playerAvatar: (theme: Theme, teamColor?: string) => ({
    width: 24,
    height: 24,
    mr: 1,
    border: teamColor
      ? `1px solid ${teamColor}`
      : `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  teamAvatar: (teamColor: string) => ({
    width: 24,
    height: 24,
    mr: 1,
    bgcolor: teamColor,
  }),

  mobileInfoText: (theme: Theme) => ({
    display: "block",
    textAlign: "center",
    mt: 1,
    color: alpha(theme.palette.common.white, 0.7),
  }),

  leaderboardDivider: (theme: Theme) => ({
    mb: 4,
    bgcolor: alpha(theme.palette.common.white, 0.1),
  }),

  // Helper to get color for score vs par
  scoreVsParColor: (vsPar: string, theme: Theme) => {
    if (vsPar?.startsWith("+")) return theme.palette.error.light;
    if (vsPar?.startsWith("-")) return theme.palette.success.light;
    return alpha(theme.palette.common.white, 0.9);
  },

  typography: {
    title: {
      color: "white",
      mb: 2,
    },
    noDataText: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      textAlign: "center",
      p: 2,
    }),
    noTeamText: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.5),
    }),
  },
};

// Player-specific styling patterns
export const tournamentPlayerStyles = {
  // Player card styling
  playerCard: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    p: 2,
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 6px 12px ${alpha(theme.palette.common.black, 0.3)}`,
      borderColor: alpha(theme.palette.common.white, 0.3),
      backgroundColor: alpha(theme.palette.common.black, 0.4),
    },
  }),

  // Player avatar styling
  playerAvatar: (theme: Theme, teamColor?: string) => ({
    width: 40,
    height: 40,
    mr: 2,
    border: `2px solid ${teamColor || alpha(theme.palette.common.white, 0.2)}`,
  }),

  // Profile avatar (larger size for profile dialog)
  profileAvatar: (theme: Theme, teamColor?: string) => ({
    width: 80,
    height: 80,
    mr: 3,
    border: `3px solid ${teamColor || alpha(theme.palette.common.white, 0.2)}`,
  }),

  // Chip styles for player indicators
  chips: {
    creator: {
      size: "small",
      color: "primary",
    },
    team: (teamColor: string) => ({
      size: "small",
      bgcolor: alpha(teamColor, 0.2),
      color: teamColor,
      border: `1px solid ${teamColor}`,
    }),
    captain: (teamColor: string, theme: Theme) => ({
      size: "small",
      bgcolor: alpha(teamColor, 0.1),
      color: "white",
      border: `1px solid ${alpha(teamColor, 0.5)}`,
    }),
  },

  // Info item with icon
  profileInfoItem: (theme: Theme) => ({
    display: "flex",
    alignItems: "flex-start",
    mb: 2.5,
    gap: 2,
  }),

  // Info icon container
  infoIconContainer: (color: string, theme: Theme) => ({
    bgcolor: alpha(color, 0.1),
    color: color,
    width: 40,
    height: 40,
  }),

  // Dialog styling
  profileDialog: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.8),
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
  }),

  // Section divider
  profileDivider: (theme: Theme) => ({
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    pb: 3,
    mb: 3,
  }),

  // Close button
  closeButton: (theme: Theme) => ({
    position: "absolute",
    right: 8,
    top: 8,
    color: alpha(theme.palette.common.white, 0.7),
  }),

  // Dialog actions
  dialogActions: (theme: Theme) => ({
    p: 2,
  }),

  // Typography variants for players
  typography: {
    playerName: {
      color: "white",
    },
    playerDetail: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      display: "flex",
      alignItems: "center",
      gap: 0.5,
    }),
    profileTitle: {
      color: "white",
      fontWeight: 500,
    },
    sectionTitle: {
      color: "white",
      mb: 1,
    },
    bio: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
      lineHeight: 1.6,
    }),
    infoItemTitle: (color: string) => ({
      color: color,
    }),
    infoItemValue: {
      color: "white",
    },
  },

  // Button styles
  buttons: {
    close: (theme: Theme) => ({
      color: "white",
      borderColor: alpha(theme.palette.common.white, 0.3),
      "&:hover": {
        borderColor: "white",
        backgroundColor: alpha(theme.palette.common.white, 0.1),
      },
    }),
    invite: (theme: Theme) => ({
      color: "white",
      borderColor: alpha(theme.palette.common.white, 0.3),
      "&:hover": {
        borderColor: "white",
        backgroundColor: alpha(theme.palette.common.white, 0.1),
      },
    }),
  },

  // Layouts
  layouts: {
    tabHeader: {
      display: "flex",
      justifyContent: "space-between",
      mb: 2,
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      gap: 2,
    },
  },
};

// Scorecard-specific styling patterns
export const tournamentScorecardStyles = {
  scorecardHeader: {
    container: {
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      mb: 2,
      alignItems: { xs: "flex-start", sm: "center" },
      gap: 1,
    },
    title: {
      color: "white",
    },
    courseChip: (theme: Theme) => ({
      color: "white",
      borderColor: alpha(theme.palette.primary.main, 0.5),
    }),
    formatChip: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.light,
      border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
    }),
    holesChip: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.secondary.main, 0.1),
      color: theme.palette.secondary.light,
      border: `1px solid ${alpha(theme.palette.secondary.light, 0.3)}`,
    }),
    chipsContainer: {
      display: "flex",
      mb: 2,
      flexWrap: "wrap",
      gap: 1,
      justifyContent: { xs: "flex-start", sm: "flex-end" },
    },
  },

  weatherDisplay: {
    container: (theme: Theme) => ({
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      gap: 2,
      mb: 3,
      mt: 1,
      p: 2,
      borderRadius: 1,
      backgroundColor: alpha(theme.palette.common.black, 0.3),
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    }),
    title: {
      color: "white",
      fontWeight: "medium",
    },
    loading: (theme: Theme) => ({
      display: "flex",
      alignItems: "center",
      gap: 1,
      color: alpha(theme.palette.common.white, 0.7),
    }),
    error: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
    chipsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: { xs: 2, md: 3 },
      alignItems: "center",
    },
  },

  scorecardSection: {
    container: {
      mb: 4,
    },
    title: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      pb: 1,
    }),
    tableContainer: (theme: Theme) => ({
      overflowX: "auto",
      bgcolor: "transparent",
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 1,
      boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.3)}`,
    }),
  },

  tableHeaderCell: (theme: Theme) => ({
    fontWeight: "bold",
    color: alpha(theme.palette.common.white, 0.9),
    borderBottomColor: alpha(theme.palette.common.white, 0.2),
    bgcolor: alpha(theme.palette.common.black, 0.4),
  }),

  parRow: {
    cell: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.black, 0.2),
      color: alpha(theme.palette.common.white, 0.9),
      borderBottomColor: alpha(theme.palette.common.white, 0.1),
    }),
    text: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
      fontWeight: "bold",
    }),
  },

  playerScoreRow: {
    container: (theme: Theme, playerIndex: number) => ({
      bgcolor:
        playerIndex % 2 === 0
          ? alpha(theme.palette.common.black, 0.1)
          : "transparent",
      "&:hover": {
        bgcolor: alpha(theme.palette.primary.main, 0.1),
      },
    }),
    cell: (theme: Theme) => ({
      borderBottomColor: alpha(theme.palette.common.white, 0.1),
      color: alpha(theme.palette.common.white, 0.9),
    }),
    nameCell: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      width: 24,
      height: 24,
      mr: 1,
    },
    playerName: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
    }),
    scoreCell: {
      position: "relative",
      p: { xs: 0.5, sm: 1 },
      minWidth: "40px",
    },
    totalCell: {
      fontWeight: "bold",
    },
  },

  scoreCell: {
    container: (theme: Theme, scoreClass?: string) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      width: { xs: "24px", sm: "30px" },
      height: { xs: "24px", sm: "30px" },
      mx: "auto",
      ...(scoreClass === "eagle" && {
        "&::before": {
          content: '""',
          position: "absolute",
          width: { xs: "20px", sm: "26px" },
          height: { xs: "20px", sm: "26px" },
          borderRadius: "50%",
          border: "1px solid #d32f2f",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: { xs: "26px", sm: "32px" },
          height: { xs: "26px", sm: "32px" },
          borderRadius: "50%",
          border: "1px solid #d32f2f",
        },
      }),
      ...(scoreClass === "birdie" && {
        "&::before": {
          content: '""',
          position: "absolute",
          width: { xs: "22px", sm: "28px" },
          height: { xs: "22px", sm: "28px" },
          borderRadius: "50%",
          border: "1px solid #d32f2f",
        },
      }),
      ...(scoreClass === "bogey" && {
        "&::before": {
          content: '""',
          position: "absolute",
          width: { xs: "22px", sm: "28px" },
          height: { xs: "22px", sm: "28px" },
          border: "1px solid #757575",
        },
      }),
      ...(scoreClass === "double-bogey" && {
        "&::before": {
          content: '""',
          position: "absolute",
          width: { xs: "20px", sm: "26px" },
          height: { xs: "20px", sm: "26px" },
          border: "1px solid #757575",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: { xs: "26px", sm: "32px" },
          height: { xs: "26px", sm: "32px" },
          border: "1px solid #757575",
        },
      }),
      color: alpha(theme.palette.common.white, 0.9),
    }),
    editField: (theme: Theme) => ({
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.common.white, 0.3),
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.common.white, 0.5),
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    }),
    editFieldInput: {
      textAlign: "center",
      padding: "5px 0",
      width: "35px",
      color: "white",
    },
  },

  roundsTab: {
    header: {
      display: "flex",
      justifyContent: "space-between",
      mb: 3,
      alignItems: { xs: "flex-start", sm: "center" },
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
    },
    emptyState: (theme: Theme) => ({
      textAlign: "center",
      py: 6,
      backgroundColor: alpha(theme.palette.common.black, 0.2),
      borderRadius: 2,
      border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
    }),
    emptyStateIcon: (theme: Theme) => ({
      fontSize: 60,
      color: alpha(theme.palette.common.white, 0.3),
      mb: 2,
    }),
    emptyStateTitle: {
      color: "white",
    },
    emptyStateMessage: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      maxWidth: 500,
      mx: "auto",
    }),
    roundsList: (theme: Theme) => ({
      mb: 2,
      bgcolor: alpha(theme.palette.common.black, 0.2),
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 2,
      maxHeight: { xs: "auto", md: 500 },
      overflow: { xs: "auto", md: "auto" },
      display: { xs: "flex", md: "block" },
      flexDirection: { xs: "row", md: "column" },
      overflowX: { xs: "auto", md: "hidden" },
      whiteSpace: { xs: "nowrap", md: "normal" },
    }),
    roundItem: (theme: Theme) => ({
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
      minWidth: { xs: 200, md: "auto" },
      px: { xs: 2, md: 3 },
      py: { xs: 1, md: 2 },
      "&.Mui-selected": {
        bgcolor: alpha(theme.palette.primary.main, 0.2),
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.3),
        },
      },
      "&:hover": {
        bgcolor: alpha(theme.palette.common.white, 0.05),
      },
    }),
    roundItemAvatar: {
      minWidth: { xs: 36, md: 56 },
    },
    avatar: {
      bgcolor: "primary.dark",
      width: { xs: 28, md: 40 },
      height: { xs: 28, md: 40 },
    },
    roundName: {
      color: "white",
    },
    roundDate: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.6),
    }),
    deleteButton: (theme: Theme) => ({
      color: theme.palette.error.light,
      "&:hover": {
        bgcolor: alpha(theme.palette.error.main, 0.1),
      },
    }),
    noSelection: (theme: Theme) => ({
      p: 3,
      textAlign: "center",
      bgcolor: alpha(theme.palette.common.black, 0.2),
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 2,
    }),
    noSelectionText: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
  },

  // Action buttons
  actionButtons: {
    container: {
      display: "flex",
      justifyContent: "center",
      gap: 1,
    },
    save: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      "&:hover": {
        bgcolor: alpha(theme.palette.primary.main, 0.2),
      },
    }),
    cancel: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      "&:hover": {
        bgcolor: alpha(theme.palette.common.white, 0.1),
      },
    }),
    edit: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      "&:hover": {
        bgcolor: alpha(theme.palette.primary.main, 0.2),
      },
    }),
  },
};

// Team-specific styling patterns
export const tournamentTeamStyles = {
  // Empty state placeholder
  emptyState: (theme: Theme) => ({
    textAlign: "center",
    py: 6,
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    borderRadius: 2,
    border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
  }),
  emptyStateIcon: (theme: Theme) => ({
    fontSize: 60,
    color: alpha(theme.palette.common.white, 0.3),
    mb: 2,
  }),
  emptyStateTitle: {
    color: "white",
  },
  emptyStateMessage: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    maxWidth: 500,
    mx: "auto",
  }),

  // Team card styling
  teamCard: (theme: Theme, color: string) => ({
    borderLeft: `5px solid ${color}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(8px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.3)}`,
    },
  }),
  teamHeader: {
    display: "flex",
    alignItems: "center",
    mb: 2,
  },
  teamAvatar: (color: string) => ({
    bgcolor: color,
    mr: 2,
  }),
  teamName: {
    color: "white",
  },
  teamDivider: (theme: Theme) => ({
    my: 1,
    bgcolor: alpha(theme.palette.common.white, 0.1),
  }),
  teamInfoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1,
  },
  teamInfoText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.9),
  }),
  captainChip: (theme: Theme, color: string) => ({
    bgcolor: alpha(color, 0.2),
    color: "white",
    border: `1px solid ${alpha(color, 0.5)}`,
    "& .MuiChip-icon": {
      color: color,
    },
  }),
  playersList: (theme: Theme) => ({
    maxHeight: 200,
    overflow: "auto",
    bgcolor: alpha(theme.palette.common.black, 0.2),
    borderRadius: 1,
    border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
  }),
  noPlayersText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
  }),
  cardActions: (theme: Theme) => ({
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    px: 2,
    py: 1.5,
    flexWrap: "wrap",
    gap: 1,
  }),

  // Player badge for captain
  captainBadge: (theme: Theme, color: string) => ({
    color: color,
    bgcolor: alpha(theme.palette.common.black, 0.7),
    borderRadius: "50%",
    padding: "2px",
    width: 16,
    height: 16,
  }),
  playerItem: (theme: Theme) => ({
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
    "&:last-child": {
      borderBottom: "none",
    },
  }),
  playerName: (theme: Theme, isCaptain: boolean) => ({
    color: alpha(theme.palette.common.white, 0.9),
    fontWeight: isCaptain ? 700 : 400,
  }),
  captainLabel: (color: string) => ({
    ml: 1,
    fontSize: "0.75rem",
    color: color,
  }),

  // Buttons
  managePLayersButton: (theme: Theme) => ({
    color: "white",
    borderColor: alpha(theme.palette.common.white, 0.3),
    "&:hover": {
      borderColor: "white",
      backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
  }),
  editButton: (theme: Theme) => ({
    color: theme.palette.primary.light,
    borderColor: alpha(theme.palette.primary.light, 0.5),
    "&:hover": {
      borderColor: theme.palette.primary.light,
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
  }),
  deleteButton: (theme: Theme) => ({
    borderColor: alpha(theme.palette.error.light, 0.5),
    "&:hover": {
      borderColor: theme.palette.error.light,
      backgroundColor: alpha(theme.palette.error.light, 0.1),
    },
  }),

  // Team form dialog styling
  dialogPaper: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.8),
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
  }),
  dialogTitle: (theme: Theme) => ({
    color: "white",
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),
  formField: (theme: Theme) => ({
    input: {
      color: "white",
    },
    label: {
      color: alpha(theme.palette.common.white, 0.7),
    },
    outline: {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.common.white, 0.3),
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.common.white, 0.5),
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
  }),
  colorSwatch: (theme: Theme, color: string, isSelected: boolean) => ({
    width: 36,
    height: 36,
    borderRadius: "50%",
    bgcolor: color,
    cursor: "pointer",
    border: isSelected ? "3px solid white" : "3px solid transparent",
    "&:hover": {
      opacity: 0.8,
      transform: "scale(1.1)",
    },
    transition: "all 0.2s ease",
  }),
  previewBox: (theme: Theme) => ({
    mt: 3,
    p: 2,
    border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
    borderRadius: 1,
    bgcolor: alpha(theme.palette.common.black, 0.2),
    display: "flex",
    alignItems: "center",
  }),
  dialogActions: (theme: Theme) => ({
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    px: 3,
    py: 2,
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "stretch",
    "& > button": {
      m: { xs: 0.5, sm: 0 },
    },
  }),
  cancelButton: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.9),
    order: { xs: 2, sm: 1 },
  }),
  submitButton: {
    order: { xs: 1, sm: 2 },
  },

  // Team management layout
  tabHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    mb: 3,
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
  },

  // Team players dialog
  playersListDialog: (theme: Theme) => ({
    maxHeight: { xs: 200, md: 300 },
    overflow: "auto",
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 1,
  }),
  playerListItem: (theme: Theme, isSelected: boolean, color: string) => ({
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
    "&:last-child": {
      borderBottom: "none",
    },
    backgroundColor: isSelected ? alpha(color, 0.2) : "transparent",
  }),
  captainIcon: (theme: Theme, isSelected: boolean, color: string) => ({
    color: isSelected ? color : alpha(theme.palette.common.white, 0.4),
    mr: 1,
    "&:hover": {
      color: color,
      bgcolor: alpha(color, 0.1),
    },
  }),
  removePlayerIcon: (theme: Theme) => ({
    color: theme.palette.error.light,
    "&:hover": {
      bgcolor: alpha(theme.palette.error.main, 0.1),
    },
  }),
  emptyListPaper: (theme: Theme) => ({
    p: 2,
    textAlign: "center",
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 1,
  }),
  addPlayerChip: {
    size: "small",
    color: "primary",
    variant: "outlined",
  },

  // Unassigned players list
  playerCard: (theme: Theme) => ({
    p: 2,
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(8px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
  }),
  assignTeamSelect: (theme: Theme) => ({
    color: "white",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.common.white, 0.3),
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.common.white, 0.5),
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    ".MuiSvgIcon-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
  }),
  menuPaper: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.common.black, 0.9),
    backgroundImage: "none",
    borderRadius: 1,
    boxShadow: 3,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),
  menuItem: (theme: Theme) => ({
    color: "white",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.3),
      },
    },
  }),
  teamColorDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    mr: 1,
  },
};

// Highlights and ShoutOuts specific styling patterns
export const tournamentHighlightsStyles = {
  // Container and header styles
  container: {
    py: 3,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    mb: 3,
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
  },

  headerTitle: {
    color: "white",
    fontWeight: 500,
  },

  headerSubtitle: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    mt: 0.5,
  }),

  feedContainer: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.common.black, 0.2),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
    overflow: "hidden",
  }),

  feedItem: (theme: Theme) => ({
    py: 2,
    "&:hover": {
      bgcolor: alpha(theme.palette.common.black, 0.3),
    },
  }),

  divider: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.common.white, 0.1),
  }),

  itemHeader: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },

  playerName: {
    color: "white",
    fontWeight: 600,
    mr: 1,
  },

  getTypeChip: (color: string, theme: Theme) => ({
    bgcolor: alpha(color, 0.15),
    color: color,
    fontWeight: 600,
    mr: 1,
  }),

  contentText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    my: 0.5,
  }),

  highlightTitle: {
    color: "white",
    fontWeight: 500,
    my: 0.5,
  },

  mediaContainer: (theme: Theme) => ({
    mt: 1,
    mb: 2,
    width: "100%",
    maxHeight: 240,
    overflow: "hidden",
    borderRadius: 1,
    bgcolor: alpha(theme.palette.common.black, 0.3),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),

  metadataContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    mt: 1,
  },

  metadataText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.5),
    mr: 2,
  }),

  getAvatarStyle: (type: string, color: string, theme: Theme) => ({
    bgcolor: type === "highlight" ? alpha(color, 0.8) : color,
  }),

  // Empty state
  emptyState: (theme: Theme) => ({
    p: 3,
    bgcolor: alpha(theme.palette.common.black, 0.2),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
    textAlign: "center",
  }),

  emptyStateIcon: (theme: Theme) => ({
    fontSize: 48,
    color: alpha(theme.palette.common.white, 0.5),
    mb: 2,
  }),

  emptyStateTitle: {
    color: "white",
    mb: 1,
  },

  emptyStateText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
  }),

  formDialog: {
    paper: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.black, 0.9),
      backgroundImage: "none",
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 2,
    }),
    title: {
      color: "white",
    },
    content: {
      py: 1,
    },
    actions: (theme: Theme) => ({
      borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      px: 3,
      py: 2,
    }),
  },

  uploadBox: (theme: Theme) => ({
    border: `2px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    textAlign: "center",
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  }),

  uploadIcon: {
    fontSize: 40,
    color: "primary.main",
    mb: 1,
  },

  uploadTitle: {
    color: "white",
  },

  uploadSubtext: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
  }),

  uploadError: {
    color: "error.main",
    display: "block",
    mt: 1,
  },

  previewContainer: (theme: Theme) => ({
    position: "relative",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    maxWidth: "100%",
    backgroundColor: alpha(theme.palette.common.black, 0.04),
  }),

  removeButton: (theme: Theme) => ({
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: alpha(theme.palette.common.white, 0.7),
    "&:hover": {
      backgroundColor: theme.palette.common.white,
    },
  }),

  videoPlaceholder: {
    p: 4,
    textAlign: "center",
  },

  videoIcon: (theme: Theme) => ({
    fontSize: 48,
    color: theme.palette.secondary.main,
  }),

  videoText: (theme: Theme) => ({
    display: "block",
    color: alpha(theme.palette.common.white, 0.5),
  }),

  formField: (theme: Theme) => ({
    mb: 2,
    input: {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
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
};
