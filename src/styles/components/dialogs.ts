import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const dialogs = {
  paper: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.8),
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: {
      xs: 0, // No border radius on mobile (fullscreen)
      sm: 2, // Regular border radius on desktop
    },
    position: {
      xs: "fixed", // Fixed position on mobile
      sm: "relative", // Regular position on desktop
    },
    top: {
      xs: 0, // At the top on mobile
      sm: "auto",
    },
    left: {
      xs: 0, // Full width from left edge
      sm: "auto",
    },
    right: {
      xs: 0, // Full width to right edge
      sm: "auto",
    },
    bottom: {
      xs: 0, // Stretch to bottom
      sm: "auto",
    },
    margin: {
      xs: 0, // No margin on mobile (fullscreen)
      sm: undefined, // Default margin on desktop
    } as any,
    maxHeight: {
      xs: "100vh", // Full height of viewport on mobile
      sm: "90vh", // 90% of viewport height on desktop
    },
    width: {
      xs: "100%", // Full width on mobile
      sm: undefined, // Default width on desktop
    } as any,
    height: {
      xs: "100vh", // Full height on mobile
      sm: "auto", // Auto height on desktop
    },
    display: "flex",
    flexDirection: "column",
  }),

  title: (theme: Theme) => ({
    color: "white",
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    px: { xs: 3, sm: 3 }, // Consistent padding
    py: { xs: 3, sm: 2 }, // More padding on mobile for better touch targets
    position: "relative", // For positioning close button
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0, // Prevent title from shrinking
  }),

  content: {
    py: { xs: 3, sm: 2 }, // More padding on mobile for readability
    px: { xs: 3, sm: 3 }, // Consistent side padding
    overflowY: "auto", // Allow scrolling when content is too tall
    flex: 1, // Take available space in flex container
    display: "flex",
    flexDirection: "column", // Stack content vertically
  },

  actions: (theme: Theme) => ({
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    px: { xs: 3, sm: 3 },
    py: { xs: 3, sm: 2 }, // More padding on mobile for better touch targets
    flexDirection: { xs: "column", sm: "row" }, // Stack buttons on mobile
    alignItems: { xs: "stretch", sm: "center" }, // Full width buttons on mobile
    justifyContent: "flex-end", // Align buttons to the end
    gap: 2, // Space between buttons
    flexShrink: 0, // Prevent actions from shrinking
    "& > button": {
      m: { xs: 0.5, sm: 0 },
      flex: { xs: 1, sm: "none" }, // Grow buttons on mobile
      py: { xs: 1.5, sm: 1 }, // Taller buttons on mobile for better touch targets
    },
  }),

  closeButton: (theme: Theme) => ({
    position: "absolute",
    right: 8,
    top: 8,
    color: alpha(theme.palette.common.white, 0.7),
    "& svg": {
      fontSize: "1.5rem", // Larger icons on mobile for better touch targets
    },
  }),

  // For bottom sheets style (alternative to fullscreen)
  bottomSheet: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.8),
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: {
      xs: "16px 16px 0 0", // Rounded top corners for bottom sheet
      sm: 2,
    },
    position: {
      xs: "fixed",
      sm: "relative",
    },
    bottom: {
      xs: 0, // Aligned to bottom
      sm: "auto",
    },
    left: {
      xs: 0,
      sm: "auto",
    },
    right: {
      xs: 0,
      sm: "auto",
    },
    margin: {
      xs: 0,
      sm: undefined,
    },
    maxHeight: {
      xs: "90vh", // Max 90% of viewport height for bottom sheet
      sm: "90vh",
    },
    width: {
      xs: "100%",
      sm: undefined,
    },
    display: "flex",
    flexDirection: "column",
  }),

  // Specific styles for score dialog which might need special treatment
  scoreDialog: (theme: Theme) => ({
    ...dialogs.paper(theme),
    display: "flex",
    flexDirection: "column",
    // Make sure content area can scroll while headers and footers stay fixed
    "& .MuiDialogContent-root": {
      flex: 1,
      overflow: "auto",
    },
  }),
};
