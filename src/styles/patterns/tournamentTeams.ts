// src/styles/components/tournamentTeams.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const tournamentTeams = {
  // Empty state for no teams
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

  // Team card styles
  teamCard: (color: string) => (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `2px solid ${alpha(color, 0.5)}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s ease",
    "&:hover": {
      border: `2px solid ${alpha(color, 0.7)}`,
      boxShadow: `0 4px 12px ${alpha(color, 0.2)}`,
    },
  }),

  teamHeader: {
    display: "flex",
    alignItems: "center",
    mb: 2,
  },

  teamAvatar: (color: string) => ({
    bgcolor: color,
    color: "white",
    fontWeight: "bold",
    width: 48,
    height: 48,
    mr: 2,
  }),

  teamName: {
    color: "white",
    fontWeight: 500,
  },

  teamDivider: (theme: Theme) => ({
    my: 1.5,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  teamInfoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1.5,
  },

  teamInfoText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
  }),

  captainChip: (color: string) => (theme: Theme) => ({
    backgroundColor: alpha(color, 0.1),
    color: color,
    borderColor: alpha(color, 0.5),
  }),

  captainBadge: (color: string) => ({
    color: color,
    fontSize: "14px",
  }),

  captainLabel: (color: string) => ({
    color: color,
    ml: 1,
    fontSize: "0.75rem",
    fontWeight: "medium",
  }),

  playerName: (isCaptain: boolean) => ({
    fontWeight: isCaptain ? "bold" : "regular",
  }),

  playersList: (theme: Theme) => ({
    p: 0,
    bgcolor: "transparent",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 1,
    maxHeight: 200,
    overflow: "auto",
  }),

  playersListDialog: (theme: Theme) => ({
    p: 0,
    bgcolor: "transparent",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 1,
    maxHeight: 300,
    overflow: "auto",
  }),

  playerItem: (theme: Theme) => ({
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    "&:last-child": {
      borderBottom: "none",
    },
  }),

  noPlayersText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.6),
    fontStyle: "italic",
    py: 1,
  }),

  cardActions: {
    p: 2,
    pt: 0,
    mt: "auto",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 1,
  },

  // Button styles (could be consolidated with existing button styles)
  managePlayersButton: (theme: Theme) => ({
    color: theme.palette.primary.light,
    borderColor: alpha(theme.palette.primary.light, 0.5),
    "&:hover": {
      borderColor: theme.palette.primary.light,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  }),

  editButton: (theme: Theme) => ({
    color: theme.palette.info.light,
    borderColor: alpha(theme.palette.info.light, 0.5),
    "&:hover": {
      borderColor: theme.palette.info.light,
      backgroundColor: alpha(theme.palette.info.main, 0.1),
    },
  }),

  deleteButton: (theme: Theme) => ({
    color: theme.palette.error.light,
    borderColor: alpha(theme.palette.error.light, 0.5),
    "&:hover": {
      borderColor: theme.palette.error.light,
      backgroundColor: alpha(theme.palette.error.main, 0.1),
    },
  }),

  // Dialog styles
  dialogPaper: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.85),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  dialogTitle: (theme: Theme) => ({
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    color: "white",
  }),

  dialogActions: (theme: Theme) => ({
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    px: 3,
    py: 2,
  }),

  // Form styles (could be consolidated with existing form styles)
  formField: {
    label: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
    input: {
      color: "white",
    },
    outline: (theme: Theme) => ({
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
  },

  colorSwatch: (color: string, isSelected: boolean) => ({
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: color,
    cursor: "pointer",
    border: isSelected ? "3px solid white" : "2px solid transparent",
    transition: "all 0.2s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  }),

  previewBox: {
    mt: 3,
    pt: 2,
    display: "flex",
    alignItems: "center",
    borderTop: (theme: Theme) =>
      `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
  },

  playerListItem: (isSelected: boolean, color: string) => (theme: Theme) => ({
    backgroundColor: isSelected ? alpha(color, 0.1) : "transparent",
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    "&:last-child": {
      borderBottom: "none",
    },
  }),

  captainIcon: (isSelected: boolean, color: string) => ({
    color: isSelected ? color : alpha(color, 0.6),
  }),

  removePlayerIcon: (theme: Theme) => ({
    color: alpha(theme.palette.error.main, 0.7),
    "&:hover": {
      color: theme.palette.error.main,
    },
  }),

  addPlayerChip: (theme: Theme) => ({
    borderColor: alpha(theme.palette.primary.light, 0.5),
    color: theme.palette.primary.light,
  }),

  emptyListPaper: (theme: Theme) => ({
    p: 2,
    textAlign: "center",
    backgroundColor: "transparent",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  // Unassigned players styles
  playerCard: (theme: Theme) => ({
    p: 2,
    display: "flex",
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  assignTeamSelect: (theme: Theme) => ({
    color: "white",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.common.white, 0.3),
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.common.white, 0.5),
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
  }),

  teamColorDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    mr: 1,
  },

  // Header with action button
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    mb: 3,
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
  },

  cancelButton: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    "&:hover": {
      bgcolor: alpha(theme.palette.common.white, 0.1),
    },
  }),

  submitButton: (theme: Theme) => ({
    bgcolor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      bgcolor: theme.palette.primary.dark,
    },
  }),
};
