import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const divider = {
  standard: (theme: Theme) => ({
    my: 1.5,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  section: (theme: Theme) => ({
    my: 3,
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  vertical: (theme: Theme) => ({
    mx: 2,
    height: "100%",
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),
};
