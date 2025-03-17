// src/components/profile/BioSection.tsx
import React from "react";
import { Box, Typography, TextField, useTheme, alpha } from "@mui/material";

interface BioSectionProps {
  bio: string;
  editing: boolean;
  onBioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BioSection: React.FC<BioSectionProps> = ({
  bio,
  editing,
  onBioChange,
}) => {
  const theme = useTheme();

  if (editing) {
    return (
      <TextField
        label="About Me"
        multiline
        rows={4}
        value={bio}
        onChange={onBioChange}
        fullWidth
        variant="outlined"
        margin="normal"
        placeholder="Write a short summary about yourself..."
        InputLabelProps={{
          style: {
            color: alpha(theme.palette.common.white, 0.7),
            fontSize: "1.1rem",
          },
        }}
        InputProps={{
          style: {
            color: "white",
            fontSize: "1.1rem",
            lineHeight: "1.6",
          },
          sx: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.common.white, 0.3),
              borderWidth: "2px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.common.white, 0.5),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
              borderWidth: "2px",
            },
          },
        }}
      />
    );
  }

  return (
    <Box sx={{ mt: 2, mb: 5 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: "white",
          mb: 2,
          fontWeight: 600,
          borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          paddingBottom: "8px",
        }}
      >
        About Me
      </Typography>
      <Typography
        variant="body1"
        paragraph
        sx={{
          color: alpha(theme.palette.common.white, 0.9),
          fontSize: "1.2rem",
          lineHeight: 1.7,
          letterSpacing: "0.2px",
          padding: "0 8px",
        }}
      >
        {bio ||
          "No bio yet. Click the edit button to add information about yourself!"}
      </Typography>
    </Box>
  );
};

export default BioSection;
