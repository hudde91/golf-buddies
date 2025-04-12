// src/styles/components/tournamentHighlights.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const tournamentHighlights = {
  // Container styles
  container: {
    width: "100%",
    mb: 4,
  },

  // Header styles
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    mb: 3,
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
  },

  headerTitle: {
    color: "white",
    fontWeight: 600,
  },

  headerSubtitle: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    mt: 1,
    fontSize: "0.875rem",
  }),

  // Empty state
  emptyState: (theme: Theme) => ({
    textAlign: "center",
    py: 6,
    px: 2,
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    borderRadius: 2,
    border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
  }),

  emptyStateIcon: (theme: Theme) => ({
    fontSize: 60,
    color: alpha(theme.palette.common.white, 0.3),
    mb: 2,
  }),

  emptyStateTitle: {
    color: "white",
    mb: 1,
  },

  emptyStateText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    maxWidth: 500,
    mx: "auto",
  }),

  // Feed container
  feedContainer: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    overflow: "hidden",
  }),

  // Feed item
  feedItem: (theme: Theme) => ({
    py: 2.5,
    px: { xs: 1, sm: 2 },
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.05),
    },
  }),

  // Divider
  divider: (theme: Theme) => ({
    borderColor: alpha(theme.palette.common.white, 0.1),
  }),

  // Item content styling
  itemHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 1,
  },

  playerName: {
    color: "white",
    fontWeight: 500,
  },

  typeChip: (color: string) => () => ({
    backgroundColor: alpha(color, 0.1),
    color: color,
    fontWeight: "medium",
    borderRadius: 1,
  }),

  contentText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.9),
    mb: 1,
  }),

  highlightTitle: {
    color: "white",
    fontWeight: 500,
    mb: 1,
  },

  metadataContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    mt: 1,
  },

  metadataText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.6),
  }),

  mediaContainer: {
    mt: 2,
    mb: 2,
    textAlign: "center",
    borderRadius: 1,
    overflow: "hidden",
  },

  videoPlaceholder: (theme: Theme) => ({
    height: 180,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: alpha(theme.palette.common.black, 0.2),
  }),

  videoIcon: (theme: Theme) => ({
    fontSize: 40,
    color: alpha(theme.palette.common.white, 0.5),
    mb: 1,
  }),

  videoText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
  }),

  // Avatar styles
  avatarStyle: (color: string) => ({
    bgcolor: alpha(color, 0.2),
    color: color,
  }),

  // Form styles
  formDialog: {
    paper: (theme: Theme) => ({
      backgroundColor: alpha(theme.palette.common.black, 0.85),
      backdropFilter: "blur(10px)",
      borderRadius: 2,
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    }),

    title: (theme: Theme) => ({
      color: "white",
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    }),

    content: {
      py: 2,
    },

    actions: (theme: Theme) => ({
      borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      px: 3,
      py: 2,
    }),
  },

  formField: (theme: Theme) => ({
    "& .MuiInputLabel-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": {
        borderColor: alpha(theme.palette.common.white, 0.3),
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.common.white, 0.5),
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiSelect-icon": {
      color: alpha(theme.palette.common.white, 0.7),
    },
    "& .MuiFormHelperText-root": {
      color: theme.palette.error.main,
    },
  }),

  uploadBox: (theme: Theme) => ({
    textAlign: "center",
    py: 4,
    px: 2,
    mb: 2,
    mt: 2,
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    border: `2px dashed ${alpha(theme.palette.common.white, 0.2)}`,
    borderRadius: 2,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.3),
      borderColor: alpha(theme.palette.common.white, 0.3),
    },
  }),

  uploadIcon: (theme: Theme) => ({
    fontSize: 40,
    color: alpha(theme.palette.common.white, 0.5),
    mb: 1,
  }),

  uploadTitle: {
    color: "white",
    fontWeight: 500,
  },

  uploadSubtext: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.6),
  }),

  uploadError: {
    mt: 2,
  },

  previewContainer: {
    position: "relative",
    textAlign: "center",
    mb: 2,
    mt: 2,
    borderRadius: 2,
    overflow: "hidden",
  },

  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.7)",
    },
  },

  // Color palette for different highlight types
  getItemTypeColor: (type: string, mediaType?: string) => {
    // Map of colors by type
    const colorMap: Record<string, { main: string; light: string }> = {
      birdie: { main: "#4caf50", light: "#81c784" },
      eagle: { main: "#f44336", light: "#e57373" },
      "hole-in-one": { main: "#ff9800", light: "#ffb74d" },
      custom: { main: "#2196f3", light: "#64b5f6" },
      highlight: { main: "#9c27b0", light: "#ba68c8" }, // Default for highlights
    };

    // Handle media-specific highlight colors
    if (type === "highlight" && mediaType) {
      if (mediaType === "image") {
        return { main: "#9c27b0", light: "#ba68c8" }; // Purple for images
      } else if (mediaType === "video") {
        return { main: "#e91e63", light: "#f48fb1" }; // Pink for videos
      }
    }

    return colorMap[type] || colorMap["custom"];
  },
};
