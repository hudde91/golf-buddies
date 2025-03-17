// src/components/profile/ProfileHeader.tsx
import React from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

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
  const theme = useTheme();

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
            sx={{
              width: 220,
              height: 220,
              border: `4px solid ${alpha(theme.palette.common.white, 0.2)}`,
              boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
            }}
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
                bgcolor: alpha(theme.palette.common.black, 0.6),
                border: `2px solid ${theme.palette.primary.main}`,
                padding: "12px",
                "&:hover": {
                  bgcolor: alpha(theme.palette.common.black, 0.8),
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
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 600,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            {fullName || "User Profile"}
          </Typography>

          <IconButton
            color="primary"
            onClick={onEditToggle}
            sx={{
              bgcolor: alpha(theme.palette.common.white, 0.1),
              padding: "12px",
              "&:hover": {
                bgcolor: alpha(theme.palette.common.white, 0.2),
              },
            }}
          >
            <EditIcon sx={{ color: "white", fontSize: "1.5rem" }} />
          </IconButton>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: alpha(theme.palette.common.white, 0.7),
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
