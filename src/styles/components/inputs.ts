import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const inputs = {
  formField: (theme: Theme) => ({
    mb: 3,
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
    },
  }),

  select: (theme: Theme) => ({
    color: "white",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.common.white, 0.3),
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.common.white, 0.5),
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    ".MuiSvgIcon-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
  }),

  slider: {
    height: 8,
    borderRadius: 4,
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 16,
      width: 16,
      backgroundColor: (theme: Theme) => theme.palette.primary.main,
      border: (theme: Theme) => `2px solid ${theme.palette.primary.main}`,
    },
  },

  menuPaper: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.common.black, 0.9),
    backgroundImage: "none",
    borderRadius: 1,
    boxShadow: 3,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  }),

  menuItem: (theme: Theme) => ({
    color: "white",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.3),
      },
    },
  }),
};
