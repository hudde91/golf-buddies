import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useStyles } from "../../styles/hooks/useStyles";

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
  const styles = useStyles();

  if (editing) {
    return (
      <TextField
        label="About Me"
        value={bio}
        onChange={onBioChange}
        placeholder="Write a short summary about yourself..."
        multiline
        rows={4}
        fullWidth
        margin="normal"
        InputLabelProps={{
          style: styles.profileCard.formField.label,
        }}
        InputProps={{
          style: styles.profileCard.formField.input,
          sx: styles.profileCard.formField.border,
        }}
      />
    );
  }

  return (
    <Box sx={{ mt: 2, mb: 5 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={styles.profileCard.sectionTitle}
      >
        About Me
      </Typography>
      <Typography
        variant="body1"
        paragraph
        sx={styles.profileCard.typography.body}
      >
        {bio ||
          "No bio yet. Click the edit button to add information about yourself!"}
      </Typography>
    </Box>
  );
};

export default BioSection;
