import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";

const InvitationEmptyState: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        backgroundColor: alpha(theme.palette.common.black, 0.2),
        borderRadius: 2,
        border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
      }}
    >
      <EmailIcon
        sx={{
          fontSize: 60,
          color: alpha(theme.palette.common.white, 0.3),
          mb: 2,
        }}
      />
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        No Invitations
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: alpha(theme.palette.common.white, 0.7) }}
      >
        You don't have any pending tournament invitations.
      </Typography>
    </Box>
  );
};

export default InvitationEmptyState;
