import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const feedback = {
  // Empty state styles
  emptyState: {
    container: (theme: Theme) => ({
      textAlign: "center",
      py: 6,
      px: 2,
      backgroundColor: alpha(theme.palette.common.black, 0.2),
      borderRadius: 2,
      border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
    }),

    icon: (theme: Theme) => ({
      fontSize: 60,
      color: alpha(theme.palette.common.white, 0.3),
      mb: 2,
    }),

    title: (theme: Theme) => ({
      color: theme.palette.common.white,
      mb: 1,
    }),

    description: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 3,
    }),

    action: {
      mt: 2,
    },
  },

  loading: {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      height: "100%",
      minHeight: 200,
    },

    icon: (theme: Theme) => ({
      color: theme.palette.primary.main,
      mb: 2,
    }),

    text: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mt: 2,
    }),
  },

  // Dialog styles
  dialog: {
    paper: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.common.black, 0.85),
      backdropFilter: "blur(10px)",
      borderRadius: 2,
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      overflow: "hidden",
    }),

    content: {
      p: 4,
    },

    title: (theme: Theme) => ({
      color: theme.palette.common.white,
      mb: 1,
    }),

    description: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      mb: 3,
    }),

    actions: {
      p: 2,
      pt: 0,
      display: "flex",
      justifyContent: "flex-end",
      gap: 1,
    },

    // For centered content dialogs (like confirmations)
    centered: {
      content: {
        p: 4,
        textAlign: "center",
      },
      actions: {
        p: 2,
        pt: 0,
        display: "flex",
        justifyContent: "center",
        gap: 1,
      },
    },
  },

  // Alerts and notifications
  alert: {
    container: () => ({
      borderRadius: 1,
      p: 2,
      mb: 2,
    }),

    success: (theme: Theme) => ({
      ...feedback.alert.container(),
      backgroundColor: alpha(theme.palette.success.main, 0.1),
      borderLeft: `4px solid ${theme.palette.success.main}`,
    }),

    error: (theme: Theme) => ({
      ...feedback.alert.container(),
      backgroundColor: alpha(theme.palette.error.main, 0.1),
      borderLeft: `4px solid ${theme.palette.error.main}`,
    }),

    warning: (theme: Theme) => ({
      ...feedback.alert.container(),
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
      borderLeft: `4px solid ${theme.palette.warning.main}`,
    }),

    info: (theme: Theme) => ({
      ...feedback.alert.container(),
      backgroundColor: alpha(theme.palette.info.main, 0.1),
      borderLeft: `4px solid ${theme.palette.info.main}`,
    }),
  },
};
