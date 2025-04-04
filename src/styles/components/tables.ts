// src/styles/components/tables.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const tables = {
  container: (theme: Theme) => ({
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

  dataCell: (theme: Theme) => ({
    borderBottomColor: alpha(theme.palette.common.white, 0.1),
    color: alpha(theme.palette.common.white, 0.9),
  }),

  getRowStyle: (theme: Theme, index: number, highlight?: boolean) => ({
    bgcolor: highlight
      ? alpha(theme.palette.primary.main, 0.1)
      : index % 2 === 0
      ? alpha(theme.palette.common.black, 0.1)
      : "transparent",
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, 0.1),
    },
  }),

  // Leaderboard specific styling
  leaderboard: {
    container: (theme: Theme) => ({
      overflowX: "auto",
      bgcolor: "transparent",
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 2,
      boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.3)}`,
    }),

    header: (theme: Theme) => ({
      p: 2,
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      bgcolor: alpha(theme.palette.common.black, 0.3),
    }),

    row: (theme: Theme) => ({
      p: 2,
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
      transition: "background-color 0.2s",
      "&:hover": {
        bgcolor: alpha(theme.palette.common.white, 0.05),
      },
    }),

    // Position styling for medal positions
    position: {
      first: (theme: Theme) => ({
        bgcolor: alpha(theme.palette.warning.main, 0.1),
        color: theme.palette.warning.main,
      }),
      second: (theme: Theme) => ({
        bgcolor: alpha(theme.palette.grey[400], 0.1),
        color: theme.palette.grey[400],
      }),
      third: (theme: Theme) => ({
        bgcolor: alpha(theme.palette.warning.dark, 0.1),
        color: theme.palette.warning.dark,
      }),
      default: (theme: Theme) => ({
        bgcolor: "transparent",
        color: theme.palette.common.white,
      }),
    },
  },
};
