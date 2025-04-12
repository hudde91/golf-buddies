import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { card } from "../components/card";
import { text } from "../components/text";

export const getStatusColor = (status: string, theme: Theme) => {
  switch (status.toLowerCase()) {
    case "upcoming":
      return theme.palette.info.main;
    case "active":
      return theme.palette.success.main;
    case "completed":
      return theme.palette.primary.main;
    case "cancelled":
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
};

export const tournamentCard = {
  container: (theme: Theme) => ({
    ...card.interactive(theme),
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }),

  media: {
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

  divider: (theme: Theme) => ({
    my: 1.5,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  infoItem: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    mb: 0.5,
    "& .MuiSvgIcon-root": {
      color: alpha(theme.palette.common.white, 0.5),
      mr: 1,
      fontSize: "small",
    },
    "& .MuiTypography-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
  }),

  emptyState: (theme: Theme) => ({
    textAlign: "center",
    py: 6,
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    borderRadius: 2,
    border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  emptyStateIcon: (theme: Theme) => ({
    fontSize: 60,
    color: alpha(theme.palette.common.white, 0.3),
    mb: 2,
  }),

  formStyles: {
    inputProps: (theme: Theme) => ({
      style: { color: "white" },
      sx: {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.common.white, 0.3),
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.common.white, 0.5),
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      },
    }),

    labelProps: (theme: Theme) => ({
      style: { color: alpha(theme.palette.common.white, 0.7) },
    }),
  },

  dialogStyles: {
    title: (theme: Theme) => ({
      color: "white",
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    }),

    actions: (theme: Theme) => ({
      borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      px: 3,
      py: 2,
      flexDirection: { xs: "column", sm: "row" },
      alignItems: "stretch",
      "& > button": {
        m: { xs: 0.5, sm: 0 },
      },
    }),
  },

  typography: {
    title: (theme: Theme) => ({
      ...text.eventTitle,
      fontWeight: "bold",
      color: theme.palette.common.white,
      mb: 1,
    }),
    cardTitle: {
      color: "white",
      fontWeight: 500,
      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
    },
    header: {
      color: "white",
      fontWeight: 500,
    },
    body: (theme: Theme) => ({
      ...text.eventDescription(theme),
    }),
    muted: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
    }),
  },

  loadingState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    p: 3,
    minHeight: "calc(100vh - 64px)",
  },
};
