import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useProfileStyles } from "../../theme/hooks";

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
  const styles = useProfileStyles();

  if (editing) {
    return (
      <TextField
        label="About Me"
        value={bio}
        onChange={onBioChange}
        placeholder="Write a short summary about yourself..."
        {...styles.getProfileTextFieldProps(4)}
      />
    );
  }

  return (
    <Box sx={{ mt: 2, mb: 5 }}>
      <Typography variant="h5" gutterBottom sx={styles.profileSectionTitle}>
        About Me
      </Typography>
      <Typography variant="body1" paragraph sx={styles.profileTypography.body}>
        {bio ||
          "No bio yet. Click the edit button to add information about yourself!"}
      </Typography>
    </Box>
  );
};

export default BioSection;
