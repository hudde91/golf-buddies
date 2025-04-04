import { alpha, Theme } from "@mui/material";

export const elevation = {
  subtle: (theme: Theme) =>
    `0 2px 4px ${alpha(theme.palette.common.black, 0.2)}`,
  medium: (theme: Theme) =>
    `0 4px 8px ${alpha(theme.palette.common.black, 0.3)}`,
  high: (theme: Theme) =>
    `0 8px 16px ${alpha(theme.palette.common.black, 0.4)}`,
  raised: (theme: Theme) =>
    `0 12px 20px -10px ${alpha(theme.palette.common.black, 0.5)}`,
};
