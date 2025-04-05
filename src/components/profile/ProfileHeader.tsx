import React from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Grid,
  alpha,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useStyles } from "../../styles/hooks/useStyles";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  profileImage: string;
  uploadedImage: string | null;
  editing: boolean;
  onEditToggle: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  email,
  profileImage,
  uploadedImage,
  editing,
  onEditToggle,
  onImageUpload,
}) => {
  const styles = useStyles();

  return (
    <Grid container spacing={4}>
      <Grid
        item
        xs={12}
        md={4}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={editing ? uploadedImage || profileImage : profileImage}
            sx={styles.profileCard.avatar}
            alt={fullName || "User"}
          />
          {editing && (
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: alpha("black", 0.6),
                border: `2px solid ${"primary.main"}`,
                padding: "12px",
                "&:hover": {
                  bgcolor: alpha("black", 0.8),
                },
              }}
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={onImageUpload}
              />
              <PhotoCameraIcon sx={{ color: "white", fontSize: "1.5rem" }} />
            </IconButton>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={8}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            alignItems: "center",
          }}
        >
          <Typography variant="h3" sx={styles.profileCard.typography.heading}>
            {fullName || "User Profile"}
          </Typography>

          <IconButton
            color="primary"
            onClick={onEditToggle}
            sx={styles.profileCard.buttons.edit}
          >
            <EditIcon sx={{ color: "white", fontSize: "1.5rem" }} />
          </IconButton>
        </Box>

        <Typography
          variant="body1"
          sx={{
            ...styles.profileCard.typography.muted,
            mb: 4,
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
          }}
        >
          {email}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ProfileHeader;
