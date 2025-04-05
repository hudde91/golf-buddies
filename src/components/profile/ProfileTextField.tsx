import React from "react";
import { TextField } from "@mui/material";
import { useStyles } from "../../styles/hooks/useStyles";

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
  const styles = useStyles();

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      multiline={rows > 1}
      rows={rows}
      fullWidth
      margin="normal"
      sx={{ mb: 3 }}
      InputLabelProps={{
        style: styles.profileCard.formField.label,
      }}
      InputProps={{
        style: styles.profileCard.formField.input,
        sx: styles.profileCard.formField.border,
      }}
    />
  );
};

export default ProfileTextField;
