import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { card } from "../components/card";
import { text } from "../components/text";

export const profileCard = {
  container: (theme: Theme) => ({
    ...card.glass(theme),
    p: { xs: 3, md: 4 },
    mb: 4,
    border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  sectionTitle: (theme: Theme) => ({
    color: "white",
    fontWeight: 600,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    paddingBottom: "8px",
    mb: 2,
  }),

  formField: (theme: Theme) => ({
    input: {
      color: "white",
      fontSize: "1.1rem",
      lineHeight: 1.6,
    },
    label: {
      color: alpha(theme.palette.common.white, 0.7),
      fontSize: "1.1rem",
    },
    border: {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.common.white, 0.3),
        borderWidth: "2px",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.common.white, 0.5),
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
    },
  }),

  avatar: (theme: Theme) => ({
    border: `4px solid ${alpha(theme.palette.common.white, 0.2)}`,
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
    width: { xs: 180, md: 220 },
    height: { xs: 180, md: 220 },
  }),

  typography: {
    heading: () => ({
      ...text.heading.profile(),
      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
    }),
    subtitle: (theme: Theme) => ({
      ...text.subtitle.section(theme),
      fontWeight: 600,
      fontSize: "1.2rem",
      mb: 1,
    }),
    body: (theme: Theme) => ({
      ...text.body.primary(theme),
      fontSize: "1.2rem",
      lineHeight: 1.7,
      letterSpacing: "0.2px",
    }),
    muted: (theme: Theme) => ({
      ...text.body.muted(theme),
      fontSize: "0.95rem",
    }),
  },

  buttons: {
    edit: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.white, 0.1),
      padding: "12px",
      color: "white",
      "&:hover": {
        bgcolor: alpha(theme.palette.common.white, 0.2),
      },
    }),
    save: (theme: Theme) => ({
      padding: "12px 24px",
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "white",
      bgcolor: theme.palette.primary.main,
      "&:hover": {
        bgcolor: theme.palette.primary.dark,
      },
    }),
  },
};
