import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Helper function for truncated text
const createTruncatedStyle = (lines: number = 2) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
});

export const text = {
  // Base text styles
  base: {
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Heading styles
  heading: {
    page: {
      color: "white",
      fontWeight: 600,
      mb: 1,
    },

    section: {
      color: "white",
      fontWeight: 500,
      mb: 2,
    },

    card: {
      color: "white",
      fontWeight: 600,
      mb: 1,
    },

    profile: () => ({
      color: "white",
      fontWeight: 600,
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
    }),

    dialog: {
      color: "white",
      fontWeight: 600,
      mb: 1,
    },
  },

  // Body text styles
  body: {
    primary: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
      fontSize: "1.1rem",
      lineHeight: 1.6,
    }),

    secondary: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),

    muted: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.6),
      fontSize: "0.95rem",
    }),
  },

  // Specific text usages
  subtitle: {
    page: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 4,
    }),

    section: (theme: Theme) => ({
      color: theme.palette.primary.light,
      fontWeight: 600,
      fontSize: "1.2rem",
      mb: 1,
    }),

    dialog: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 3,
    }),
  },

  // Dynamic text generation
  truncated: createTruncatedStyle,

  // Event-specific styles
  eventTitle: {
    fontWeight: "bold",
    color: "white",
    mb: 1,
    ...createTruncatedStyle(2),
  },

  eventDescription: (theme: Theme) => ({
    mb: 2,
    color: alpha(theme.palette.common.white, 0.7),
    ...createTruncatedStyle(2),
  }),

  // Empty state text styles
  emptyState: {
    title: {
      color: "white",
      mb: 1,
    },
    description: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 3,
    }),
  },

  // Event header text styles
  eventHeader: {
    title: {
      fontWeight: "bold",
      color: "white",
    },
    subtitle: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      maxWidth: "600px",
    }),
  },

  // Feature card text
  feature: {
    title: {
      color: "white",
      fontWeight: "bold",
      mb: 1,
    },
    description: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
  },

  // Info item text
  infoItem: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    fontSize: "0.875rem",
  }),

  // Dialog text
  dialog: {
    title: {
      color: "white",
      fontWeight: 600,
      mb: 1,
    },
    description: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 3,
    }),
  },

  // Other page specific styles
  notFoundTitle: {
    fontSize: "4rem",
    fontWeight: 600,
    color: "white",
    mb: 2,
  },
};
