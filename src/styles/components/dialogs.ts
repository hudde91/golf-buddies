import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const dialogs = {
  paper: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.8),
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
  }),

  title: (theme: Theme) => ({
    color: "white",
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  content: {
    py: 1,
  },

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

  closeButton: (theme: Theme) => ({
    position: "absolute",
    right: 8,
    top: 8,
    color: alpha(theme.palette.common.white, 0.7),
  }),
};
