// src/styles/components/chips.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const chips = {
  // Base chip styles
  base: {
    borderRadius: 1,
    fontWeight: 500,
    fontSize: "0.75rem",
  },

  // Status chip variants
  status: {
    base: () => ({
      ...chips.base,
      px: 1,
      py: 0.5,
    }),

    // Status type variants
    active: (theme: Theme) => ({
      ...chips.status.base(),
      backgroundColor: alpha(theme.palette.success.main, 0.1),
      color: theme.palette.success.main,
    }),

    completed: (theme: Theme) => ({
      ...chips.status.base(),
      backgroundColor: alpha(theme.palette.info.main, 0.1),
      color: theme.palette.info.main,
    }),

    pending: (theme: Theme) => ({
      ...chips.status.base(),
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
      color: theme.palette.warning.main,
    }),

    cancelled: (theme: Theme) => ({
      ...chips.status.base(),
      backgroundColor: alpha(theme.palette.error.main, 0.1),
      color: theme.palette.error.main,
    }),

    upcoming: (theme: Theme) => ({
      ...chips.status.base(),
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
    }),

    draft: (theme: Theme) => ({
      ...chips.status.base(),
      backgroundColor: alpha(theme.palette.grey[500], 0.1),
      color: theme.palette.grey[500],
    }),

    // Generic status that takes a color
    custom: (color: string) => ({
      ...chips.status.base(),
      backgroundColor: alpha(color, 0.1),
      color: color,
    }),
  },

  // Event type chips
  eventType: {
    base: () => ({
      ...chips.base,
      px: 1,
      py: 0.5,
    }),

    tournament: (theme: Theme) => ({
      ...chips.eventType.base(),
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
    }),

    tour: (theme: Theme) => ({
      ...chips.eventType.base(),
      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
      color: theme.palette.secondary.main,
    }),

    custom: (color: string) => ({
      ...chips.eventType.base(),
      backgroundColor: alpha(color, 0.1),
      color: color,
    }),
  },
};
