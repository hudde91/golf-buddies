// src/styles/patterns/mobile.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const mobilePatterns = {
  // Existing patterns
  container: {
    fullWidth: (theme: Theme) => ({
      width: "100%",
      px: { xs: 0, sm: 2, md: 3 },
    }),
    edgeToEdge: {
      mx: { xs: -2, sm: 0 },
    },
  },

  card: {
    bottomAnchored: (theme: Theme) => ({
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      borderRadius: "16px 16px 0 0",
      borderBottom: "none",
      borderLeft: "none",
      borderRight: "none",
      borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      py: 2,
      px: 3,
      backgroundColor: alpha(theme.palette.common.black, 0.8),
      backdropFilter: "blur(10px)",
    }),
    touchFeedback: {
      "&:active": {
        transform: { xs: "scale(0.98)", sm: "none" },
        transition: "transform 0.1s ease",
      },
    },
  },

  button: {
    touchable: (theme: Theme) => ({
      py: { xs: 1.5, sm: 1 },
      minHeight: { xs: 48, sm: "auto" },
      borderRadius: { xs: 4, sm: 4 },
      "&:active": {
        transform: { xs: "scale(0.98)", sm: "none" },
        transition: "transform 0.1s ease",
      },
    }),
    fullWidthMobile: {
      width: { xs: "100%", sm: "auto" },
    },
    touchFeedback: {
      "&:active": {
        transform: { xs: "scale(0.98)", sm: "none" },
        transition: "transform 0.1s ease",
      },
    },
  },

  // Existing patterns continued
  tabs: {
    scrollable: {
      ".MuiTabs-flexContainer": {
        overflowX: "auto",
        flexWrap: "nowrap",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
  },

  list: {
    touchable: (theme: Theme) => ({
      "& .MuiListItem-root": {
        py: { xs: 2, sm: 1.5 },
        "&:active": {
          backgroundColor: {
            xs: alpha(theme.palette.primary.main, 0.1),
            sm: "transparent",
          },
        },
      },
    }),
    horizontal: {
      display: "flex",
      overflowX: "auto",
      flexWrap: "nowrap",
      py: 1,
      px: { xs: 2, sm: 0 },
      "&::-webkit-scrollbar": {
        display: "none",
      },
      "& > *": {
        flex: "0 0 auto",
        mr: 2,
        minWidth: { xs: 160, sm: 200 },
      },
    },
  },

  dialog: {
    bottomSheet: (theme: Theme) => ({
      position: { xs: "fixed", sm: "relative" },
      bottom: { xs: 0, sm: "auto" },
      left: { xs: 0, sm: "auto" },
      right: { xs: 0, sm: "auto" },
      margin: { xs: 0, sm: 2 },
      borderRadius: { xs: "16px 16px 0 0", sm: 2 },
      maxHeight: { xs: "90vh", sm: "80vh" },
      width: { xs: "100%", sm: "auto" },
      backgroundColor: alpha(theme.palette.common.black, 0.8),
      backdropFilter: "blur(10px)",
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    }),
  },

  grid: {
    responsive: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
      },
      gap: { xs: 2, sm: 3 },
    },
  },

  typography: {
    responsive: {
      h4: {
        fontSize: { xs: "1.5rem", sm: "2rem" },
        lineHeight: { xs: 1.3, sm: 1.4 },
      },
      h5: {
        fontSize: { xs: "1.25rem", sm: "1.5rem" },
        lineHeight: { xs: 1.3, sm: 1.4 },
      },
      h6: {
        fontSize: { xs: "1.1rem", sm: "1.25rem" },
        lineHeight: { xs: 1.3, sm: 1.4 },
      },
      subtitle: {
        fontSize: { xs: "0.875rem", sm: "1rem" },
      },
    },
    adaptive: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: { xs: 2, sm: 3 },
      WebkitBoxOrient: "vertical",
    },
  },

  spacing: {
    touch: {
      mb: { xs: 3, sm: 2 },
      mt: { xs: 3, sm: 2 },
      mx: { xs: 2, sm: 0 },
      py: { xs: 2, sm: 1.5 },
      px: { xs: 2, sm: 3 },
    },
  },

  layout: {
    stackedOnMobile: {
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "stretch", sm: "center" },
      gap: { xs: 2, sm: 3 },
    },
  },

  navigation: {
    bottom: {
      container: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: "block", sm: "none" }, // Only show on mobile
        backgroundColor: (theme: Theme) =>
          alpha(theme.palette.common.black, 0.8),
        backdropFilter: "blur(10px)",
        borderTop: (theme: Theme) =>
          `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      },
      fab: {
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1001,
        display: { xs: "flex", sm: "none" }, // Only show on mobile
      },
      action: {
        color: "white",
        "&.Mui-selected": {
          color: (theme: Theme) => theme.palette.primary.main,
        },
      },
    },
  },

  friends: {
    listItem: {
      responsive: (theme: Theme) => ({
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        py: { xs: 2, sm: 1 },
        "& .MuiListItemText-root": {
          mb: { xs: 2, sm: 0 },
        },
      }),
      actionsContainer: {
        display: "flex",
        justifyContent: { xs: "flex-start", sm: "flex-end" },
        width: { xs: "100%", sm: "auto" },
        ml: { xs: 9, sm: 0 },
        mt: { xs: 1, sm: 0 },
      },
    },
    actionButton: {
      mr: 1,
      borderRadius: 2,
      py: { xs: 1, sm: 0.5 },
      minWidth: { xs: 100, sm: "auto" },
    },
  },

  events: {
    card: {
      responsive: (theme: Theme) => ({
        ...theme.card.event(theme),
        width: { xs: "100%", sm: "auto" },
        height: { xs: "auto", sm: "100%" },
        minHeight: { xs: "auto", sm: "280px" },
        p: { xs: 2, sm: 3 },
      }),
      content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
      },
      infoContainer: {
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: { xs: 1, sm: 2 },
        "& > *": {
          width: { xs: "100%", sm: "auto" },
        },
      },
      chips: {
        container: {
          flexWrap: "wrap",
          gap: { xs: 1, sm: 1.5 },
        },
      },
      title: {
        fontSize: { xs: "1.1rem", sm: "1.25rem" },
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
      },
      description: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: { xs: 2, sm: 3 },
        WebkitBoxOrient: "vertical",
      },
      infoItem: {
        width: { xs: "100%", sm: "auto" },
        "& .MuiTypography-root": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: { xs: "240px", sm: "160px" },
        },
      },
      actions: {
        mt: { xs: 2, sm: "auto" },
        "& .MuiButton-root": {
          py: { xs: 1.2, sm: 1 },
        },
      },
    },
  },
};
