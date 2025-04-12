import { alpha } from "@mui/material/styles";

export const statusIndicator = {
  // Function to generate a status chip style based on status type
  chip: (color: string) => ({
    backgroundColor: alpha(color, 0.1),
    color: color,
    fontWeight: "medium",
    borderRadius: 1,
    fontSize: "0.75rem",
    px: 1,
    py: 0.5,
  }),
};
