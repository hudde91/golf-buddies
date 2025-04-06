// src/styles/patterns/mobile.ts
// This new file will contain mobile-specific style patterns

import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const mobilePatterns = {
  // Container and layout patterns
  container: {
    fullWidth: (theme: Theme) => ({
      width: "100%",
      maxWidth: { xs: "100%", sm: "lg" },
      px: { xs: 0, sm: 2, md: 4 },
      mx: "auto",
    }),
    edgeToEdge: {
      mx: { xs: -2, sm: 0 },
      width: { xs: "calc(100% + 32px)", sm: "100%" },
    },
  },

  // Card patterns
  card: {
    edgeToEdge: (theme: Theme) => ({
      borderRadius: { xs: 0, sm: 2 },
      border: {
        xs: "none",
        sm: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      },
    }),
    bottomAnchored: (theme: Theme) => ({
      borderRadius: { xs: "16px 16px 0 0", sm: 2 },
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      position: { xs: "absolute", sm: "relative" },
      bottom: { xs: 0, sm: "auto" },
      width: { xs: "100%", sm: "auto" },
    }),
    touchFeedback: {
      transition: "transform 0.2s",
      "&:active": {
        transform: { xs: "scale(0.98)", sm: "none" },
      },
    },
  },

  // Button patterns
  button: {
    touchable: (theme: Theme) => ({
      borderRadius: { xs: 28, sm: 8 },
      py: { xs: 1.2, sm: 1 },
      px: { xs: 3, sm: 2 },
      textTransform: "none",
      fontWeight: 500,
      "&:active": {
        transform: { xs: "scale(0.98)", sm: "none" },
      },
      minHeight: { xs: "44px", sm: "36px" },
    }),
    fullWidthMobile: {
      width: { xs: "100%", sm: "auto" },
    },
    touchFeedback: {
      "&:active": {
        transform: { xs: "scale(0.98)", sm: "none" },
      },
    },
  },

  // Tab patterns
  tabs: {
    scrollable: {
      "& .MuiTabs-flexContainer": {
        gap: { xs: 1, sm: 0 },
      },
      "& .MuiTab-root": {
        minWidth: { xs: "auto", sm: 100 },
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 1 },
        fontSize: { xs: "0.85rem", sm: "0.9rem" },
      },
    },
  },

  // List patterns
  list: {
    touchable: (theme: Theme) => ({
      "& .MuiListItem-root": {
        py: { xs: 1.5, sm: 1 },
        minHeight: "48px",
        "&:active": {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
      },
    }),
    horizontal: {
      display: { xs: "flex", md: "block" },
      flexDirection: "column",
      overflowX: { xs: "auto", md: "hidden" },
      whiteSpace: { xs: "nowrap", md: "normal" },
      py: { xs: 1, md: 0 },
    },
  },

  // Dialog patterns
  dialog: {
    bottomSheet: (theme: Theme) => ({
      position: { xs: "absolute", sm: "relative" },
      bottom: { xs: 0, sm: "auto" },
      m: { xs: 0, sm: 2 },
      borderRadius: { xs: "16px 16px 0 0", sm: 2 },
      maxHeight: { xs: "85vh", sm: "none" },
      width: { xs: "100%", sm: "auto" },
    }),
  },

  // Grid patterns
  grid: {
    responsive: {
      spacing: { xs: 1, sm: 3 },
    },
  },

  // Typography patterns
  typography: {
    responsive: {
      fontSize: { xs: "0.9rem", sm: "1rem" },
    },
    adaptive: {
      h5: {
        fontSize: { xs: "1.2rem", sm: "1.5rem" },
      },
      h6: {
        fontSize: { xs: "1rem", sm: "1.25rem" },
      },
      body1: {
        fontSize: { xs: "0.9rem", sm: "1rem" },
      },
      body2: {
        fontSize: { xs: "0.8rem", sm: "0.875rem" },
      },
    },
  },

  // Spacing patterns
  spacing: {
    touch: {
      mt: { xs: 2, sm: 1.5 },
      mb: { xs: 2, sm: 1.5 },
      py: { xs: 1.5, sm: 1 },
      px: { xs: 2, sm: 1.5 },
    },
  },

  // Layout patterns
  layout: {
    stackedOnMobile: {
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      gap: { xs: 2, sm: 0 },
    },
  },
};
