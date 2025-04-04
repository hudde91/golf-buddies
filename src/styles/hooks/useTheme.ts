import { useTheme as useMuiTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export const useTheme = () => {
  const theme = useMuiTheme();

  return {
    ...theme,
    // Add helper functions to easily work with the theme
    alpha: (color: string, opacity: number) => alpha(color, opacity),
    withOpacity: (color: string, opacity: number) => alpha(color, opacity),
  };
};
