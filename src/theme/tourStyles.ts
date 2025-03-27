import { alpha, Theme } from "@mui/material";
import { styleHelpers } from "./theme";

// Tour-specific styling patterns that extend the main theme
export const tourStyles = {
  tourContainer: (theme: Theme) => ({
    ...styleHelpers.glassBox(theme),
    p: { xs: 2, md: 3 },
    mb: 4,
  }),

  tourCard: (theme: Theme) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: alpha(theme.palette.common.black, 0.4),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 12px 20px ${alpha(theme.palette.common.black, 0.3)}`,
    },
  }),

  tourSectionTitle: (theme: Theme) => ({
    color: "white",
    mb: 3,
    fontWeight: 500,
  }),

  tourTabs: (theme: Theme) => ({
    px: 2,
    pt: 2,
    borderBottom: 1,
    borderColor: alpha(theme.palette.common.white, 0.1),
    "& .MuiTab-root": {
      color: "white",
      textTransform: "none",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "white",
    },
  }),

  tourTabPanel: {
    p: { xs: 2, md: 3 },
  },

  tourPlayerItem: (theme: Theme) => ({
    p: 2,
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    "&:last-child": { borderBottom: "none" },
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.05),
    },
  }),

  tourTeamCard: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.4),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    overflow: "hidden",
  }),

  statusChip: (color: string, theme: Theme) => ({
    backgroundColor: alpha(color, 0.2),
    color: color,
    fontWeight: "medium",
    borderRadius: 1,
  }),

  leaderboardTable: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    borderRadius: 2,
    overflow: "hidden",
  }),

  leaderboardHeader: (theme: Theme) => ({
    p: 2,
    bgcolor: alpha(theme.palette.primary.main, 0.2),
    fontWeight: "bold",
    color: "white",
  }),

  getMedalStyle: (position: number, theme: Theme) => {
    const colors = [
      theme.palette.warning.main, // Gold
      theme.palette.grey[400], // Silver
      theme.palette.brown[300], // Bronze
    ];

    if (position < 3) {
      return {
        bgcolor: alpha(colors[position], 0.1),
        color: colors[position],
      };
    }

    return {
      bgcolor: "transparent",
      color: "white",
    };
  },

  infoItem: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    mb: 0.5,
    "& .MuiSvgIcon-root": {
      color: alpha(theme.palette.common.white, 0.5),
      mr: 1,
      fontSize: "1.2rem",
    },
    "& .MuiTypography-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
  }),

  tourDivider: (theme: Theme) => ({
    my: 1.5,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),
};
