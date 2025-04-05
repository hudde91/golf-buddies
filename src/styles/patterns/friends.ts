// src/styles/patterns/friends.ts
import { Theme, alpha } from "@mui/material/styles";

export const friends = {
  dialog: {
    paper: (theme: Theme) => ({
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius * 2,
      maxHeight: "80vh",
    }),
    title: (theme: Theme) => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(2, 3),
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    }),
    content: {
      padding: 0,
    },
  },

  tabs: {
    container: (theme: Theme) => ({
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    }),
  },

  list: {
    container: (theme: Theme) => ({
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    }),
    item: (theme: Theme) => ({
      padding: theme.spacing(1.5, 2),
      transition: "background-color 0.2s ease",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
      },
    }),
    avatar: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.primary.main, 0.9),
    }),
    name: {
      fontWeight: 500,
    },
    email: (theme: Theme) => ({
      color: alpha(theme.palette.text.primary, 0.7),
      fontSize: "0.875rem",
    }),
  },

  search: {
    container: (theme: Theme) => ({
      padding: theme.spacing(3),
    }),
    field: (theme: Theme) => ({
      marginBottom: theme.spacing(2),
      "& .MuiOutlinedInput-root": {
        borderRadius: theme.shape.borderRadius * 1.5,
      },
    }),
  },

  empty: {
    container: (theme: Theme) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(6, 2),
      textAlign: "center",
    }),
    icon: (theme: Theme) => ({
      fontSize: 64,
      color: alpha(theme.palette.text.primary, 0.2),
      marginBottom: theme.spacing(2),
    }),
    title: (theme: Theme) => ({
      fontWeight: 500,
      marginBottom: theme.spacing(1),
    }),
    description: (theme: Theme) => ({
      color: alpha(theme.palette.text.primary, 0.7),
      marginBottom: theme.spacing(3),
    }),
  },

  actions: {
    container: (theme: Theme) => ({
      display: "flex",
      gap: theme.spacing(1),
    }),
    accept: (theme: Theme) => ({
      color: theme.palette.success.main,
      "&:hover": {
        backgroundColor: alpha(theme.palette.success.main, 0.1),
      },
    }),
    reject: (theme: Theme) => ({
      color: theme.palette.error.main,
      "&:hover": {
        backgroundColor: alpha(theme.palette.error.main, 0.1),
      },
    }),
    remove: (theme: Theme) => ({
      color: theme.palette.grey[500],
      "&:hover": {
        backgroundColor: alpha(theme.palette.text.primary, 0.1),
      },
    }),
  },

  buttons: {
    add: (theme: Theme) => ({
      borderRadius: theme.shape.borderRadius * 1.5,
      boxShadow: theme.shadows[1],
      padding: theme.spacing(1, 3),
      textTransform: "none",
    }),
  },

  badge: {
    container: (theme: Theme) => ({
      "& .MuiBadge-badge": {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
      },
    }),
  },
};

export default friends;
