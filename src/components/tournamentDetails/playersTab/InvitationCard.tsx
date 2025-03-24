import React from "react";
import { Box, Typography, Paper, Avatar, useTheme, alpha } from "@mui/material";

interface InvitationCardProps {
  email: string;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ email }) => {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        backgroundColor: alpha(theme.palette.common.black, 0.3),
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            bgcolor: alpha(theme.palette.primary.light, 0.5),
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
