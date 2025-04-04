import React from "react";
import { Box, Typography } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { useStyles } from "../../styles/hooks";

const InvitationEmptyState: React.FC = () => {
  const styles = useStyles();

  return (
    <Box sx={styles.feedback.emptyState.container}>
      <EmailIcon sx={styles.icon.emptyState} />
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.feedback.emptyState.title}
      >
        No Invitations
      </Typography>
      <Typography variant="body2" sx={styles.text.body.muted}>
        You don't have any pending tournament invitations.
      </Typography>
    </Box>
  );
};

export default InvitationEmptyState;
