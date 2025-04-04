// src/styles/patterns/divider.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const divider = {
  // Standard divider
  standard: (theme: Theme) => ({
    my: 1.5,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  // Section divider with more spacing
  section: (theme: Theme) => ({
    my: 3,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  // Vertical divider
  vertical: (theme: Theme) => ({
    mx: 2,
    height: "100%",
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),
};
