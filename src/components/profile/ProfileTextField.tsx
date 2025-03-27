import React from "react";
import { TextField } from "@mui/material";
import { useProfileStyles } from "../../theme/hooks";

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
  const styles = useProfileStyles();

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      sx={{ mb: 3 }}
      {...styles.getProfileTextFieldProps(rows)}
    />
  );
};

export default ProfileTextField;
