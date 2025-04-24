import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { feedback } from "../components/feedback";

export const scorecard = {
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
        } as any,
        "&::after": {
          content: '""',
          position: "absolute",
          width: { xs: "26px", sm: "32px" },
          height: { xs: "26px", sm: "32px" },
          borderRadius: "50%",
          border: "1px solid #d32f2f",
        } as any,
      }),
      ...(scoreClass === "birdie" && {
        "&::before": {
          content: '""',
          position: "absolute",
          width: { xs: "22px", sm: "28px" },
          height: { xs: "22px", sm: "28px" },
          borderRadius: "50%",
          border: "1px solid #d32f2f",
        } as any,
      }),
      ...(scoreClass === "bogey" && {
        "&::before": {
          content: '""',
          position: "absolute",
          width: { xs: "22px", sm: "28px" },
          height: { xs: "22px", sm: "28px" },
          border: "1px solid #757575",
        } as any,
      }),
      ...(scoreClass === "double-bogey" && {
        "&::before": {
          content: '""',
          position: "absolute",
          width: { xs: "20px", sm: "26px" },
          height: { xs: "20px", sm: "26px" },
          border: "1px solid #757575",
        } as any,
        "&::after": {
          content: '""',
          position: "absolute",
          width: { xs: "26px", sm: "32px" },
          height: { xs: "26px", sm: "32px" },
          border: "1px solid #757575",
        } as any,
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
      ...feedback.emptyState.container(theme),
    }),
    emptyStateIcon: (theme: Theme) => ({
      ...feedback.emptyState.icon(theme),
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

  actionButtons: {
    container: {
      display: "flex",
      justifyContent: "center",
      gap: 1,
    },
    save: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
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
      color: theme.palette.primary.main,
      "&:hover": {
        bgcolor: alpha(theme.palette.primary.main, 0.2),
      },
    }),
  },
};
