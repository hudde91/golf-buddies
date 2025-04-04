import { createTheme, alpha } from "@mui/material/styles";
import { baseColors, breakpoints } from "./tokens";

// Extend the Material UI theme types to add custom properties
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

// Create the Material UI theme with our tokens
const theme = createTheme({
  palette: {
    primary: {
      main: baseColors.primary,
    },
    secondary: {
      main: baseColors.secondary,
    },
    brown: {
      300: baseColors.bronze,
    },
  },

  breakpoints: {
    values: breakpoints,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(baseColors.black, 0.3),
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(baseColors.black, 0.3),
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
