import { Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const course = {
  // Container for the course info in the course card
  courseInfoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    mb: 2,
  },

  // Course header styles
  courseHeader: {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "center" },
      mb: 3,
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
    },
    title: {
      color: "white",
      fontWeight: "bold",
    },
    subtitle: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      maxWidth: "600px",
    }),
  },

  // Course card styles
  courseCard: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.3),
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s ease",
    p: 3,
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.4),
      transform: "translateY(-4px)",
      boxShadow: `0 6px 12px ${alpha(theme.palette.common.black, 0.3)}`,
    },
    cursor: "pointer",
  }),

  // Course info item
  courseInfoItem: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.5,
    "& svg": {
      color: (theme: Theme) => alpha(theme.palette.common.white, 0.6),
    },
  },

  // Golf course icon
  courseIcon: {
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.2),
    color: (theme: Theme) => theme.palette.primary.main,
    borderRadius: "50%",
    p: 1,
    mr: 1,
  },

  // Course selection container
  courseSelection: {
    container: {
      display: "flex",
      alignItems: "flex-start",
      gap: 1,
    },
    addButton: (theme: Theme) => ({
      color: "white",
      borderColor: alpha(theme.palette.common.white, 0.3),
      mt: 1,
      minWidth: "auto",
    }),
  },

  // Course form styles
  courseForm: {
    sectionTitle: (theme: Theme) => ({
      color: theme.palette.primary.light,
      fontWeight: 600,
      fontSize: "1.1rem",
      mb: 1,
    }),
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
    }),
  },

  // Course rating display
  courseRating: {
    container: (theme: Theme) => ({
      display: "flex",
      gap: 2,
      mb: 2,
      p: 2,
      borderRadius: 1,
      backgroundColor: alpha(theme.palette.common.black, 0.2),
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    }),
    label: {
      color: "white",
      fontWeight: "medium",
    },
    value: (theme: Theme) => ({
      color: theme.palette.primary.light,
      fontWeight: "bold",
    }),
  },

  // Course list styles
  courseList: {
    item: (theme: Theme) => ({
      borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      p: 2,
      "&:last-child": {
        borderBottom: "none",
      },
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    }),
    name: {
      color: "white",
      fontWeight: 500,
    },
    details: (theme: Theme) => ({
      color: alpha(theme.palette.common.white, 0.7),
      fontSize: "0.875rem",
    }),
    ratings: (theme: Theme) => ({
      display: "flex",
      gap: 2,
      mt: 1,
      color: alpha(theme.palette.common.white, 0.7),
      fontSize: "0.75rem",
      "& > span": {
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      },
    }),
  },

  // Course chip - for displaying selected course
  courseChip: (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.light,
    border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
    borderRadius: 1,
    py: 0.5,
    px: 1,
    fontSize: "0.75rem",
    fontWeight: 500,
  }),
};
