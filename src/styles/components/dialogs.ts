import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const dialogs = {
  paper: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.8),
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: { xs: "16px 16px 0 0", sm: 2 }, // Bottom sheet style on mobile
    position: { xs: "absolute", sm: "relative" }, // Position at bottom on mobile
    top: { xs: 0, sm: "auto" }, // Set to top on mobile
    // bottom: { xs: 0, sm: "auto" }, // Anchor to bottom on mobile
    margin: { xs: 0, sm: undefined }, // Remove margin on mobile
    maxHeight: { xs: "85vh", sm: undefined }, // Limit height on mobile
    width: { xs: "100%", sm: undefined }, // Full width on mobile
    height: { xs: "100%", sm: undefined }, // Auto height on mobile
  }),

  title: (theme: Theme) => ({
    color: "white",
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    px: { xs: 3, sm: 3 }, // Consistent padding
    py: { xs: 2, sm: 2 }, // Consistent padding
  }),

  content: {
    py: { xs: 2, sm: 1 }, // More padding on mobile
    px: { xs: 2, sm: 3 }, // Less side padding on mobile
  },

  actions: (theme: Theme) => ({
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    px: { xs: 2, sm: 3 },
    py: { xs: 3, sm: 2 }, // More padding on mobile
    flexDirection: { xs: "column", sm: "row" }, // Stack buttons on mobile
    alignItems: { xs: "stretch", sm: "center" }, // Full width buttons on mobile
    "& > button": {
      m: { xs: 0.5, sm: 0 },
      flex: { xs: 1, sm: "none" }, // Grow buttons on mobile
    },
  }),

  closeButton: (theme: Theme) => ({
    position: "absolute",
    right: 8,
    top: 8,
    color: alpha(theme.palette.common.white, 0.7),
  }),
};
