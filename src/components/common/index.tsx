// TODO: File to be replaced with new design pattern
import React from "react";
import { Box, Button, alpha, useTheme } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

export const BackButton: React.FC<{
  onClick: () => void;
  label?: string;
}> = ({ onClick, label = "Back" }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", mb: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onClick}
        sx={{
          color: theme.palette.common.white,
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};
