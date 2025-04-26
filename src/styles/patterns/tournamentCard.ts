import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const getStatusColor = (status: string, theme: Theme) => {
  switch (status?.toLowerCase()) {
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
};
