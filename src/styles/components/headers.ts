// src/styles/components/headers.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const headers = {
  // Base page header
  page: {
    container: {
      mb: 4,
    },
    title: {
      color: "white",
      fontWeight: 600,
      mb: 1,
    },
    subtitle: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
  },

  // Section header
  section: {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    },
    title: {
      color: "white",
      fontWeight: 500,
    },
  },

  // Feature-specific headers
  event: {
    container: {
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "center" },
      mb: 4,
      gap: { xs: 2, sm: 0 },
    },
    iconContainer: {
      display: "flex",
      alignItems: "center",
    },
    icon: {
      fontSize: { xs: 32, md: 40 },
      color: "white",
      mr: 2,
    },
    title: {
      fontWeight: "bold",
      color: "white",
    },
    subtitle: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      maxWidth: "600px",
    }),
  },

  // Dashboard header
  dashboard: {
    container: {
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", md: "center" },
      mb: 3,
    },
    title: {
      color: "white",
      fontWeight: 600,
      mb: { xs: 1, md: 0 },
    },
    actions: {
      display: "flex",
      gap: 1,
      mt: { xs: 1, md: 0 },
    },
  },

  // Tournament header
  tournament: {
    container: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.common.black, 0.4),
      backdropFilter: "blur(10px)",
      borderRadius: 2,
      p: 3,
      mb: 4,
      position: "relative",
      overflow: "hidden",
    }),
    title: {
      color: "white",
      fontWeight: 700,
      mb: 1,
      position: "relative",
      zIndex: 1,
    },
    subtitle: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 2,
      position: "relative",
      zIndex: 1,
    }),
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.15,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  },

  tabs: {
    container: {
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "stretch", sm: "center" },
      mb: 2,
      gap: 2,
    },
    title: {
      color: "white",
      fontWeight: 600,
    },
    actions: {
      display: "flex",
      gap: 1,
    },
  },

  tour: {
    sectionTitle: {
      color: "white",
      fontWeight: 600,
      mb: 2,
    },
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
    },
  },
};
