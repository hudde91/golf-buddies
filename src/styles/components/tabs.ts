// src/styles/components/tabs.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const tabs = {
  container: (theme: Theme) => ({
    px: 2,
    pt: 2,
    borderBottom: 1,
    borderColor: alpha(theme.palette.common.white, 0.1),
    "& .MuiTab-root": {
      color: alpha(theme.palette.common.white, 0.7),
      textTransform: "none",
      "&.Mui-selected": {
        color: "white",
      },
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "white",
    },
  }),

  panel: {
    p: { xs: 2, md: 3 },
  },

  tourPanel: {
    p: { xs: 2, md: 3 },
    mb: 3,
  },
};
