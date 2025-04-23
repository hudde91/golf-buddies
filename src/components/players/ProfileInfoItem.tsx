import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useStyles } from "../../styles";

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
  const styles = useStyles();

  return (
    <Box sx={styles.tournamentPlayers.profileInfoItem}>
      <Avatar sx={styles.tournamentPlayers.getInfoIconContainer(color)}>
        {icon}
      </Avatar>
      <Box>
        <Typography
          variant="subtitle1"
          sx={styles.tournamentPlayers.getInfoItemTitle(color)}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={styles.tournamentPlayers.playerTypography.infoItemValue}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileInfoItem;
