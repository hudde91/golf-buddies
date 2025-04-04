import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { spacing } from "../tokens";

export const mixins = {
  glassBox: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  backgroundBlur: (theme: Theme, opacity: number = 0.3) => ({
    backgroundColor: alpha(theme.palette.common.black, opacity),
    backdropFilter: "blur(10px)",
  }),

  card: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.4),
    },
  }),

  interactiveCard: (theme: Theme) => ({
    ...mixins.card(theme),
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      ...mixins.card(theme)["&:hover"],
      transform: "translateY(-4px)",
      boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.3)}`,
    },
  }),

  coloredBorder: (
    color: string,
    position: "left" | "right" | "top" | "bottom" = "left",
    width: number = 4
  ) => ({
    [`border${
      position.charAt(0).toUpperCase() + position.slice(1)
    }`]: `${width}px solid ${color}`,
  }),

  statusChip: (color: string, theme: Theme) => ({
    backgroundColor: alpha(color, 0.2),
    color: color,
    fontWeight: "medium",
    borderRadius: 1,
    fontSize: "0.75rem",
    px: 1,
    py: 0.5,
  }),

  formFieldStyles: (theme: Theme) => ({
    input: {
      color: "white",
    },
    label: {
      color: alpha(theme.palette.common.white, 0.7),
    },
    outline: {
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

  infoItem: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    mb: 0.5,
    "& .MuiSvgIcon-root": {
      color: alpha(theme.palette.common.white, 0.5),
      mr: 1,
      fontSize: "1.2rem",
    },
    "& .MuiTypography-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
  }),

  divider: (theme: Theme) => ({
    my: 1.5,
    borderColor: alpha(theme.palette.common.white, 0.1),
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
};
