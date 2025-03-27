import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTournamentPlayerStyles } from "../../../theme/hooks";

interface ProfileInfoItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({
  icon,
  title,
  value,
  color,
}) => {
  const styles = useTournamentPlayerStyles();

  return (
    <Box sx={styles.profileInfoItem}>
      <Avatar sx={styles.getInfoIconContainer(color)}>{icon}</Avatar>
      <Box>
        <Typography
          variant="subtitle1"
          sx={styles.playerTypography.getInfoItemTitle(color)}
        >
          {title}
        </Typography>
        <Typography variant="body1" sx={styles.playerTypography.infoItemValue}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileInfoItem;
