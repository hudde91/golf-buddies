export const animations = {
  transitions: {
    default: "all 0.2s ease",
    fast: "all 0.1s ease",
    slow: "all 0.3s ease",
  },

  hover: {
    scale: {
      transform: "scale(1.05)",
    },
    lift: {
      transform: "translateY(-4px)",
    },
    glow: (theme: any) => ({
      boxShadow: `0 0 8px ${theme.palette.primary.main}`,
    }),
  },
};
