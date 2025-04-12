// src/styles/patterns/friends.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const friends = {
  tabs: {
    container: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.common.black, 0.3),
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      "& .MuiTab-root": {
        color: alpha(theme.palette.common.white, 0.7),
        minHeight: { xs: 56, sm: 48 }, // Taller tabs on mobile
        "&.Mui-selected": {
          color: "white",
        },
      },
      "& .MuiBadge-badge": {
        fontSize: "0.7rem",
      },
    }),
  },

  list: {
    container: () => ({
      borderRadius: 2,
      backgroundColor: "transparent",
    }),
    item: (theme: Theme) => ({
      py: { xs: 2, sm: 1.5 }, // More padding on mobile
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.05),
      },
    }),
    avatar: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.2),
      color: theme.palette.primary.main,
    }),
    name: {
      color: "white",
      fontWeight: 500,
    },
    email: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      fontSize: "0.85rem",
    }),
    responsive: () => ({
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

  empty: {
    container: () => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      py: { xs: 6, sm: 8 },
      px: { xs: 2, sm: 3 },
    }),
    icon: (theme: Theme) => ({
      fontSize: { xs: 48, sm: 60 },
      color: alpha(theme.palette.common.white, 0.2),
      mb: 2,
    }),
    title: () => ({
      color: "white",
      fontWeight: 600,
      mb: 1,
      fontSize: { xs: "1.2rem", sm: "1.5rem" },
    }),
    description: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 3,
      maxWidth: "400px",
    }),
  },

  buttons: {
    add: () => ({
      py: { xs: 1.5, sm: 1 },
      px: { xs: 4, sm: 3 },
      minHeight: { xs: 48, sm: "auto" },
    }),
    actionButton: {
      mr: 1,
      borderRadius: 2,
      py: { xs: 1, sm: 0.5 },
      minWidth: { xs: 100, sm: "auto" },
    },
  },
};
