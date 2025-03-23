import { Theme } from "@mui/material";

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

export const getColorBasedOnStatus = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "upcoming":
      return "primary";
    case "completed":
      return "info";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};
