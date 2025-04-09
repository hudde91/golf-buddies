import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const tabs = {
  container: (theme: Theme) => ({
    px: { xs: 0, sm: 2 }, // No padding on mobile
    pt: 2,
    borderBottom: 1,
    borderColor: alpha(theme.palette.common.white, 0.1),
    "& .MuiTab-root": {
      color: alpha(theme.palette.common.white, 0.7),
      textTransform: "none",
      minWidth: { xs: "auto", sm: "initial" }, // Autosize tabs on mobile
      px: { xs: 2, sm: 3 }, // Less padding on mobile
      "&.Mui-selected": {
        color: "white",
      },
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "white",
      height: { xs: 3, sm: 2 }, // Thicker indicator on mobile
    },
  }),

  panel: {
    p: { xs: 1, sm: 2, md: 3 }, // Less padding on mobile
  },

  tourPanel: {
    p: { xs: 1, sm: 2, md: 3 }, // Less padding on mobile
    mb: 3,
  },
};
