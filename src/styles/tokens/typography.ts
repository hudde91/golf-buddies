import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const typography = {
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  text: {
    h1: {
      color: "white",
      fontWeight: 600,
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    h2: {
      color: "white",
      fontWeight: 500,
    },
    h3: {
      color: "white",
      fontWeight: 500,
    },
    body: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.9),
      fontSize: "1.1rem",
      lineHeight: 1.6,
    }),
    subtitle: (theme: Theme) => ({
      color: theme.palette.primary.light,
      fontWeight: 600,
      fontSize: "1.2rem",
    }),
    muted: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.6),
      fontSize: "0.95rem",
    }),
  },
};
