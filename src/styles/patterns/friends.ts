// src/styles/patterns/friends.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const friends = {
  dialog: {
    paper: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.common.black, 0.8),
      backdropFilter: "blur(20px)",
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: { xs: 0, sm: 2 },
      margin: { xs: 0, sm: 2 },
      maxHeight: { xs: "100vh", sm: "80vh" },
      width: { xs: "100%", sm: "auto" },
    }),
    title: (theme: Theme) => ({
      color: "white",
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      px: 3,
      py: { xs: 3, sm: 2 }, // Larger touch target on mobile
    }),
    content: {
      p: { xs: 2, sm: 3 },
    },
  },

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
    container: (theme: Theme) => ({
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

  search: {
    container: (theme: Theme) => ({
      p: { xs: 2, sm: 3 },
      borderRadius: 2,
    }),
    field: (theme: Theme) => ({
      "& .MuiInputLabel-root": {
        color: alpha(theme.palette.common.white, 0.7),
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: alpha(theme.palette.common.white, 0.2),
        },
        "&:hover fieldset": {
          borderColor: alpha(theme.palette.common.white, 0.3),
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
        },
      },
      "& .MuiInputBase-input": {
        color: "white",
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 1 },
      },
    }),
  },

  empty: {
    container: (theme: Theme) => ({
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
    title: (theme: Theme) => ({
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

  actions: {
    container: (theme: Theme) => ({
      display: "flex",
      justifyContent: { xs: "center", sm: "flex-end" },
      gap: 1,
      mt: { xs: 3, sm: 2 },
    }),
    accept: (theme: Theme) => ({
      backgroundColor: theme.palette.success.main,
      color: "white",
      "&:hover": {
        backgroundColor: theme.palette.success.dark,
      },
      py: { xs: 1, sm: 0.5 },
      px: { xs: 3, sm: 2 },
      minHeight: { xs: 48, sm: "auto" },
    }),
    reject: (theme: Theme) => ({
      color: theme.palette.error.main,
      borderColor: theme.palette.error.main,
      "&:hover": {
        borderColor: theme.palette.error.dark,
        backgroundColor: alpha(theme.palette.error.main, 0.05),
      },
      py: { xs: 1, sm: 0.5 },
      px: { xs: 3, sm: 2 },
      minHeight: { xs: 48, sm: "auto" },
    }),
    remove: (theme: Theme) => ({
      color: theme.palette.error.main,
      "&:hover": {
        backgroundColor: alpha(theme.palette.error.main, 0.05),
      },
      py: { xs: 1, sm: 0.5 },
      minHeight: { xs: 48, sm: "auto" },
    }),
  },

  buttons: {
    add: (theme: Theme) => ({
      py: { xs: 1.5, sm: 1 },
      px: { xs: 4, sm: 3 },
      minHeight: { xs: 48, sm: "auto" },
    }),
    // Enhanced action button for mobile
    actionButton: {
      mr: 1,
      borderRadius: 2,
      py: { xs: 1, sm: 0.5 },
      minWidth: { xs: 100, sm: "auto" },
    },
  },

  badge: {
    container: (theme: Theme) => ({
      "& .MuiBadge-badge": {
        fontSize: "0.7rem",
        minWidth: 20,
        height: 20,
        padding: "0 6px",
      },
    }),
  },
};
