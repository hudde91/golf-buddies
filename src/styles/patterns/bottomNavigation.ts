import { alpha, Theme } from "@mui/material";

export const bottomNavigation = {
  navigation: {
    container: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1100,
      py: 1,
      height: 66,
      display: { xs: "block", sm: "none" }, // Only show on mobile
      backgroundColor: (theme: Theme) => alpha(theme.palette.common.black, 0.8),
      backdropFilter: "blur(10px)",
      borderTop: (theme: Theme) =>
        `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      "& .MuiBottomNavigation-root": {
        position: "relative",
        height: "100%",
      },
    },
    action: {
      color: "white",
      "&.Mui-selected": {
        color: (theme: Theme) => theme.palette.primary.main,
      },
    },
  },
};
