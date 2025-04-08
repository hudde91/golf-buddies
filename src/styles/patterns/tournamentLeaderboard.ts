// src/styles/components/tournamentLeaderboard.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const tournamentLeaderboard = {
  // Empty state
  leaderboardEmptyState: {
    textAlign: "center",
    py: 6,
    px: 2,
    backgroundColor: (theme: Theme) => alpha(theme.palette.common.black, 0.2),
    borderRadius: 2,
    border: (theme: Theme) =>
      `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
  },

  leaderboardEmptyStateIcon: (theme: Theme) => ({
    fontSize: 60,
    color: alpha(theme.palette.common.white, 0.3),
    mb: 2,
  }),

  // Table styling
  tableContainer: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  getTableRowStyle: (index: number) => (theme: Theme) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: alpha(theme.palette.common.black, 0.2),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  }),

  headerCell: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.9),
    backgroundColor: alpha(theme.palette.common.black, 0.4),
    fontWeight: "bold",
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  positionHeaderCell: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.9),
    backgroundColor: alpha(theme.palette.common.black, 0.4),
    fontWeight: "bold",
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
    width: 80,
  }),

  dataCell: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.9),
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  centeredDataCell: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.9),
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    textAlign: "center",
  }),

  // Divider
  leaderboardDivider: (theme: Theme) => ({
    my: 3,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  // Typography
  leaderboardTypography: {
    title: {
      color: "white",
      mb: 2,
    },

    body: {
      color: "white",
      pl: 1,
    },

    noTeamText: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.5),
      fontStyle: "italic",
    }),

    noDataText: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      textAlign: "center",
      py: 4,
    }),
  },

  // Info text for mobile
  mobileInfoText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.6),
    mt: 1,
    fontStyle: "italic",
    textAlign: "center",
  }),

  // Avatar styles
  getPlayerAvatar: (teamColor?: string) => (theme: Theme) => ({
    width: { xs: 32, sm: 36 },
    height: { xs: 32, sm: 36 },
    mr: 1,
    border: teamColor
      ? `2px solid ${teamColor}`
      : `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  getTeamAvatar: (color: string) => ({
    bgcolor: color,
    color: "white",
    width: 36,
    height: 36,
    mr: 2,
  }),

  // Chip styles
  winnerChip: (theme: Theme) => ({
    ml: 1,
    bgcolor: alpha(theme.palette.warning.main, 0.2),
    color: theme.palette.warning.light,
  }),

  captainChip: (theme: Theme) => ({
    ml: 1,
    bgcolor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.light,
    border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
  }),

  getTeamChip: (color: string) => (theme: Theme) => ({
    backgroundColor: alpha(color, 0.15),
    color: color,
    border: `1px solid ${alpha(color, 0.3)}`,
  }),

  // Utility functions for score display
  formatScoreToPar: (score: number, par: number): string => {
    const diff = score - par;
    if (diff === 0) return "E";
    return diff > 0 ? `+${diff}` : diff.toString();
  },

  getScoreVsParColor: (scoreToPar: string): string => {
    if (scoreToPar === "E") return "#FFFFFF"; // White for even par
    if (scoreToPar.startsWith("+")) return "#f44336"; // Red for over par
    return "#4caf50"; // Green for under par
  },

  getScoreDisplay: (
    score: number | null,
    position: number,
    leaderboard: any[]
  ): string => {
    if (score === null) return "-";

    // Check if tied
    if (
      position > 0 &&
      leaderboard[position].total === leaderboard[position - 1].total
    ) {
      return score.toString() + " (T)";
    }

    return score.toString();
  },
};
