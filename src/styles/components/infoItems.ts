// src/styles/components/infoItems.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Define base styles that will be used by variations
const baseItem = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  gap: 1,
});

const baseIcon = (theme: Theme) => ({
  fontSize: "small",
  color: alpha(theme.palette.common.white, 0.5),
});

const baseContainer = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

export const infoItems = {
  // Base info item container
  container: baseContainer,

  // Individual info item with icon
  item: baseItem,

  // Icon within info item
  icon: baseIcon,

  // Text within info item
  text: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    fontSize: "0.875rem",
  }),

  // Variations
  variations: {
    // For event info
    event: {
      item: (theme: Theme) => ({
        ...baseItem(theme),
        mb: 0.5,
      }),
    },

    // For profile info
    profile: {
      item: (theme: Theme) => ({
        ...baseItem(theme),
        mb: 1,
      }),
      icon: (theme: Theme) => ({
        ...baseIcon(theme),
        color: theme.palette.primary.light,
      }),
    },

    // For tournament details
    tournament: {
      container: {
        ...baseContainer,
        backgroundColor: alpha("#000", 0.2),
        p: 2,
        borderRadius: 1,
      },
    },
  },

  // Layout variations
  layout: {
    // For horizontal layout (label and value side by side)
    horizontal: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 1,
    },

    // For grid layout
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 2,
    },
  },

  // Label/value pair style (for settings, profile info, etc.)
  labelValue: {
    container: {
      mb: 2,
    },
    label: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.6),
      fontSize: "0.875rem",
      mb: 0.5,
    }),
    value: (theme: Theme) => ({
      color: theme.palette.common.white,
    }),
  },
};
