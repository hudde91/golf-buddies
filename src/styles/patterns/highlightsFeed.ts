// src/styles/patterns/highlightsFeed.ts
import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { feedback } from "../components/feedback";

export const highlightsFeed = {
  container: {
    py: 3,
  },

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
    fontWeight: 500,
  },

  headerSubtitle: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    mt: 0.5,
  }),

  feedContainer: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.common.black, 0.2),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
    overflow: "hidden",
  }),

  feedItem: (theme: Theme) => ({
    py: 2,
    "&:hover": {
      bgcolor: alpha(theme.palette.common.black, 0.3),
    },
  }),

  divider: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.common.white, 0.1),
  }),

  itemHeader: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },

  playerName: {
    color: "white",
    fontWeight: 600,
    mr: 1,
  },

  getTypeChip: (color: string, theme: Theme) => ({
    bgcolor: alpha(color, 0.15),
    color: color,
    fontWeight: 600,
    mr: 1,
  }),

  contentText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
    my: 0.5,
  }),

  highlightTitle: {
    color: "white",
    fontWeight: 500,
    my: 0.5,
  },

  mediaContainer: (theme: Theme) => ({
    mt: 1,
    mb: 2,
    width: "100%",
    maxHeight: 240,
    overflow: "hidden",
    borderRadius: 1,
    bgcolor: alpha(theme.palette.common.black, 0.3),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),

  metadataContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    mt: 1,
  },

  metadataText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.5),
    mr: 2,
  }),

  getAvatarStyle: (type: string, color: string, theme: Theme) => ({
    bgcolor: type === "highlight" ? alpha(color, 0.8) : color,
  }),

  // Empty state
  emptyState: (theme: Theme) => ({
    ...feedback.emptyState.container(theme),
    p: 3,
    textAlign: "center",
  }),

  emptyStateIcon: (theme: Theme) => ({
    fontSize: 48,
    color: alpha(theme.palette.common.white, 0.5),
    mb: 2,
  }),

  emptyStateTitle: {
    color: "white",
    mb: 1,
  },

  emptyStateText: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
  }),

  formDialog: {
    paper: (theme: Theme) => ({
      bgcolor: alpha(theme.palette.common.black, 0.9),
      backgroundImage: "none",
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 2,
    }),
    title: {
      color: "white",
    },
    content: {
      py: 1,
    },
    actions: (theme: Theme) => ({
      borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      px: 3,
      py: 2,
    }),
  },

  uploadBox: (theme: Theme) => ({
    border: `2px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    textAlign: "center",
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  }),

  uploadIcon: {
    fontSize: 40,
    color: "primary.main",
    mb: 1,
  },

  uploadTitle: {
    color: "white",
  },

  uploadSubtext: (theme: Theme) => ({
    color: alpha(theme.palette.common.white, 0.7),
  }),

  uploadError: {
    color: "error.main",
    display: "block",
    mt: 1,
  },

  previewContainer: (theme: Theme) => ({
    position: "relative",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    maxWidth: "100%",
    backgroundColor: alpha(theme.palette.common.black, 0.04),
  }),

  removeButton: (theme: Theme) => ({
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: alpha(theme.palette.common.white, 0.7),
    "&:hover": {
      backgroundColor: theme.palette.common.white,
    },
  }),

  videoPlaceholder: {
    p: 4,
    textAlign: "center",
  },

  videoIcon: (theme: Theme) => ({
    fontSize: 48,
    color: theme.palette.secondary.main,
  }),

  videoText: (theme: Theme) => ({
    display: "block",
    color: alpha(theme.palette.common.white, 0.5),
  }),

  formField: (theme: Theme) => ({
    mb: 2,
    input: {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
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
    "& .MuiInputLabel-root": {
      color: alpha(theme.palette.common.white, 0.7),
    },
  }),

  getItemTypeColor: (type: string, mediaType?: string, theme: Theme) => {
    if (type === "highlight") {
      return mediaType === "image"
        ? theme.palette.info.main
        : theme.palette.secondary.main;
    } else {
      switch (type) {
        case "birdie":
          return theme.palette.success.main;
        case "eagle":
          return theme.palette.warning.main;
        case "hole-in-one":
          return theme.palette.error.main;
        default:
          return theme.palette.primary.main;
      }
    }
  },
};
