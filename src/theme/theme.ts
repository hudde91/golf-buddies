import { createTheme, alpha } from "@mui/material/styles";
import { Theme } from "@mui/material";

// Extend the palette to include custom colors
declare module "@mui/material/styles" {
  interface Palette {
    brown: {
      300: string;
    };
  }

  interface PaletteOptions {
    brown?: {
      300: string;
    };
  }
}

// Define reusable breakpoints
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// Define base colors
export const colors = {
  primary: "#30b3ff",
  secondary: "#dc004e",
  brown: {
    300: "#BA8C63", // Bronze color
  },
  backgrounds: {
    dark: "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)",
    card: "rgba(255, 255, 255, 0.95)",
    glass: (theme: Theme) => alpha(theme.palette.common.black, 0.3),
    glassBorder: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  },
  text: {
    primary: "#ffffff",
    secondary: "rgba(255,255,255,0.8)",
    subtle: "rgba(255,255,255,0.7)",
    muted: "rgba(255,255,255,0.5)",
  },
  white: "#ffffff",
  black: "#000000",
};

export const spacing = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

export const styleHelpers = {
  glassBox: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),
  backgroundBlur: (theme: Theme, opacity: number = 0.3) => ({
    backgroundColor: alpha(theme.palette.common.black, opacity),
    backdropFilter: "blur(10px)",
  }),
  pageContainer: {
    minHeight: "calc(100vh - 64px)", // 64px is the header height
    pt: { xs: spacing.sm, md: spacing.lg },
    pb: spacing.xl,
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    brown: {
      300: colors.brown[300],
    },
  },
  breakpoints: {
    values: breakpoints,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.backgrounds.card,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.backgrounds.card,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1976d2",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
