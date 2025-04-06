// src/styles/components/navigation.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const navigation = {
  // Back button styling
  backButton: (theme: Theme) => ({
    color: theme.palette.common.white,
    mt: { xs: 2, sm: 0 },
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
  }),

  // Back button container
  backButtonContainer: {
    display: "flex",
    mb: 2,
  },

  // Navigation link styling
  link: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.9),
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  }),

  // Breadcrumbs styling
  breadcrumbs: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    mb: 2,
    "& .MuiBreadcrumbs-separator": {
      color: alpha(theme.palette.common.white, 0.5),
    },
    "& .MuiLink-root": {
      color: alpha(theme.palette.common.white, 0.9),
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  }),
};
