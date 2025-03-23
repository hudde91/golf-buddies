// src/theme/invitationStyles.ts
import { alpha, Theme } from "@mui/material";

// Invitation-specific styling patterns
export const invitationStyles = {
  // Invitation card styling
  invitationCard: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.4),
    backdropFilter: "blur(8px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    position: "relative",
    overflow: "hidden",
  }),

  // Icon container
  iconContainer: (theme: Theme) => ({
    bgcolor: theme.palette.primary.dark,
    color: "white",
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 2,
  }),

  // Divider styling
  invitationDivider: (theme: Theme) => ({
    my: 1,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  }),

  // Info item with icon
  infoItem: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    mb: 1,
    "& .MuiSvgIcon-root": {
      mr: 1,
      color: alpha(theme.palette.common.white, 0.7),
    },
    "& .MuiTypography-root": {
      color: alpha(theme.palette.common.white, 0.9),
    },
  }),

  // Button styles
  invitationButtons: {
    accept: () => ({
      mr: 1,
      minWidth: 100,
    }),
    decline: (theme: Theme) => ({
      color: theme.palette.error.light,
      borderColor: alpha(theme.palette.error.light, 0.5),
      "&:hover": {
        borderColor: theme.palette.error.light,
        backgroundColor: alpha(theme.palette.error.main, 0.1),
      },
    }),
  },

  // Empty state container
  emptyStateContainer: (theme: Theme) => ({
    textAlign: "center",
    py: 6,
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    borderRadius: 2,
    border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  // Empty state icon
  emptyStateIcon: (theme: Theme) => ({
    fontSize: 60,
    color: alpha(theme.palette.common.white, 0.3),
    mb: 2,
  }),

  // Typography variants for invitations
  typography: {
    title: {
      color: "white",
    },
    body: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
    }),
    muted: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
  },
};
