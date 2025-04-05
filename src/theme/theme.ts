import { createTheme, alpha } from "@mui/material/styles";
import { baseColors, breakpoints } from "../styles/tokens";

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
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#121212",
      paper: alpha("#000000", 0.6),
    },
    text: {
      primary: "#ffffff",
      secondary: alpha("#ffffff", 0.7),
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

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
        },
      },
    },
  },
});

export default theme;
