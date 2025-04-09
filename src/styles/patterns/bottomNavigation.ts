import { alpha, Theme } from "@mui/material";

export const bottomNavigation = {
  navigation: {
    // TODO: When I scroll down, the bottom navigation moves half out of the screen below the bottom
    container: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      py: 1,
      display: { xs: "block", sm: "none" }, // Only show on mobile
      backgroundColor: (theme: Theme) => alpha(theme.palette.common.black, 0.8),
      backdropFilter: "blur(10px)",
      borderTop: (theme: Theme) =>
        `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    },
    fab: {
      position: "fixed",
      bottom: 16,
      right: 16,
      zIndex: 1001,
      display: { xs: "flex", sm: "none" }, // Only show on mobile
    },
    action: {
      color: "white",
      "&.Mui-selected": {
        color: (theme: Theme) => theme.palette.primary.main,
      },
    },
  },
};
