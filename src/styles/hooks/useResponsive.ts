// src/styles/hooks/useResponsive.ts
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

export const useResponsive = () => {
  const theme = useTheme();

  return {
    // Breakpoint checks
    isMobile: useMediaQuery(theme.breakpoints.down("sm")),
    isTablet: useMediaQuery(theme.breakpoints.between("sm", "md")),
    isDesktop: useMediaQuery(theme.breakpoints.up("md")),

    // Responsive spacing
    spacing: {
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, md: 3 },
    },

    // Responsive containers
    container: {
      maxWidth: { xs: "100%", sm: "100%", md: 1200 },
      mx: "auto",
      px: { xs: 2, sm: 3, md: 4 },
    },

    // Responsive grid
    grid: {
      columns: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
      },
    },

    // Responsive typography
    text: {
      fontSize: {
        xs: "1rem",
        sm: "1.1rem",
        md: "1.2rem",
      },
      heading: {
        xs: "1.5rem",
        sm: "2rem",
        md: "2.5rem",
      },
    },
  };
};
