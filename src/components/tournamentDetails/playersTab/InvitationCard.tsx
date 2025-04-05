import React from "react";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useStyles } from "../../../styles/hooks/useStyles";

interface InvitationCardProps {
  email: string;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ email }) => {
  const styles = useStyles();

  return (
    <Paper variant="outlined" sx={styles.card.glass}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{
            ...styles.avatars.standard(),
            bgcolor: (theme) => theme.palette.primary.light,
          }}
        >
          {email[0].toUpperCase()}
        </Avatar>
        <Typography
          variant="body1"
          sx={{
            color: "white",
            wordBreak: "break-all",
          }}
        >
          {email}
        </Typography>
      </Box>
    </Paper>
  );
};

export default InvitationCard;
