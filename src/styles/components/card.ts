// src/styles/components/card.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const card = {
  // Base card style
  base: () => ({
    borderRadius: 2,
    transition: "all 0.2s ease",
  }),

  // Glass effect card (blurred transparent background)
  glass: (theme: Theme) => ({
    ...card.base(),
    backgroundColor: alpha(theme.palette.common.black, 0.4),
    backdropFilter: "blur(10px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    p: { xs: 2, md: 4 },
    borderRadius: { xs: 0, sm: 2 },
  }),

  // Interactive card with hover effects
  interactive: (theme: Theme) => ({
    ...card.glass(theme),
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.4),
      transform: { sm: "translateY(-4px)" }, // Only apply hover effect on desktop
      boxShadow: {
        sm: `0 12px 20px ${alpha(theme.palette.common.black, 0.3)}`,
      },
    },
    "&:active": {
      transform: { xs: "scale(0.98)", sm: "translateY(-4px)" },
    },
    cursor: "pointer",
  }),

  // Event card style
  event: (theme: Theme) => ({
    ...card.interactive(theme),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    p: { xs: 3, md: 3 },
    borderRadius: { xs: 3, sm: 2 },
  }),

  // Event card content
  eventContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  // Event chips container
  eventChipsContainer: {
    mb: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  // Event info container
  eventInfoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    mb: 2,
  },

  // Invitation card style
  invitation: (theme: Theme) => ({
    ...card.glass(theme),
    position: "relative",
    overflow: "hidden",
    mb: 2,
  }),

  // Profile card style
  profile: (theme: Theme) => ({
    ...card.glass(theme),
    mb: 4,
    border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  // Tournament card style
  tournament: (theme: Theme) => ({
    ...card.interactive(theme),
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }),

  // Feature card style for homepage
  feature: (theme: Theme) => ({
    ...card.glass(theme),
    maxWidth: { xs: "100%", sm: "48%", md: "48%" },
    flex: "0 0 auto",
    p: 3,
  }),

  // Feature card content
  featureContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: 2,
  },

  // Card content sections
  content: {
    base: {
      p: 3,
    },
    withFlex: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
  },

  // Card header layout
  header: {
    withIcon: {
      display: "flex",
      alignItems: "center",
      mb: 2,
    },
    withActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    },
  },

  // Card footer/actions section
  actions: {
    base: {
      p: 2,
      pt: 0,
    },
    centered: {
      p: 2,
      pt: 0,
      display: "flex",
      justifyContent: "center",
    },
    spaceBetween: (theme: Theme) => ({
      p: 2,
      display: "flex",
      justifyContent: "space-between",
      borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    }),
  },

  // Card media section
  media: {
    hero: {
      height: 140,
      backgroundSize: "cover",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage:
          "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)",
      },
    },
    portrait: {
      height: 200,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  },

  // Specific card variations
  variations: {
    // For sections on the dashboard
    dashboardSection: (theme: Theme) => ({
      ...card.glass(theme),
      mb: 3,
      p: { xs: 2, md: 3 },
    }),

    // For settings panels
    settingsPanel: (theme: Theme) => ({
      ...card.glass(theme),
      mb: 4,
    }),
  },
};
