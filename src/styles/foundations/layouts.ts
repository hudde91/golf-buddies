// src/styles/patterns/layouts.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { spacing } from "../tokens/spacing";

export const layouts = {
  // Page layouts
  pageContainer: {
    minHeight: "calc(100vh - 64px)", // 64px is the header height
    pt: { xs: spacing.sm, md: spacing.lg },
    pb: spacing.xl,
  },

  pageWithBackground: {
    minHeight: "calc(100vh - 64px)",
    pt: { xs: spacing.sm, md: spacing.lg },
    pb: spacing.xl,
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)",
  },

  // Section layouts
  responsiveSection: {
    mb: 4,
  },

  // Container layouts
  responsiveContainer: {
    width: "100%",
    px: { xs: 2, sm: 3, md: 4 },
  },

  // Grid layouts
  responsiveGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
      lg: "repeat(4, 1fr)",
    },
    gap: 2,
  },

  // Flex layouts
  responsiveFlex: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    gap: 2,
  },

  responsiveStack: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  centerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Tab layouts
  tabHeader: {
    display: "flex",
    justifyContent: "space-between",
    mb: 3,
    alignItems: { xs: "flex-start", sm: "center" },
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
  },

  // Utility layouts
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
    minHeight: 200,
  },
};
