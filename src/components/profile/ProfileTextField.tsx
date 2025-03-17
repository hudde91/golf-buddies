// src/components/profile/ProfileTextField.tsx
import React from "react";
import { TextField, useTheme, alpha } from "@mui/material";

interface ProfileTextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rows?: number;
}

const ProfileTextField: React.FC<ProfileTextFieldProps> = ({
  label,
  value,
  onChange,
  rows = 2,
}) => {
  const theme = useTheme();

  return (
    <TextField
      label={label}
      multiline
      rows={rows}
      value={value}
      onChange={onChange}
      fullWidth
      variant="outlined"
      margin="normal"
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
      sx={{ mb: 3 }}
    />
  );
};

export default ProfileTextField;
