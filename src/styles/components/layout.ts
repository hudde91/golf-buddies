// src/styles/components/layout.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const layout = {
  page: {
    base: {
      minHeight: "calc(100vh - 64px)",
      pt: { xs: 0, md: 4 },
      pb: { xs: 6, md: 6 },
    },

    withBackground: {
      background:
        "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)",
      minHeight: "calc(100vh - 64px)",
      py: { xs: 0, md: 4 },
    },
  },

  // Container modifiers
  container: {
    responsive: {
      width: "100%",
      px: { xs: 0, sm: 2, md: 4 },
    },

    fullWidth: {
      width: "100%",
      maxWidth: "100%",
      px: 0,
    },

    withGutter: {
      py: { xs: 0, sm: 2, md: 3 },
    },
  },

  // Section layouts
  section: {
    base: {
      mb: 4,
    },

    withHeader: {
      mb: 4,
      mt: 2,
    },

    card: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.common.black, 0.3),
      backdropFilter: "blur(10px)",
      borderRadius: 2,
      p: { xs: 2, md: 4 },
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      mb: 4,
    }),
  },

  // Grid layouts
  grid: {
    responsive: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      },
      gap: 2,
    },

    twoColumn: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "repeat(2, 1fr)",
      },
      gap: 2,
    },
  },

  // Flex layouts
  flex: {
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },

    column: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 2,
    },

    responsive: {
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      alignItems: "center",
      gap: 2,
    },

    centered: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    wrap: {
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
    },

    spaceBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    header: {
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "center" },
      mb: 4,
      gap: { xs: 2, sm: 0 },
    },
    headers: {
      section: {
        container: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        },
      },
    },
  },
};
