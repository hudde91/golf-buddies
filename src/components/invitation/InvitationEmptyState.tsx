import React from "react";
import { Box, Typography } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { useInvitationStyles } from "../../theme/hooks";

const InvitationEmptyState: React.FC = () => {
  const styles = useInvitationStyles();

  return (
    <Box sx={styles.emptyStateContainer}>
      <EmailIcon sx={styles.emptyStateIcon} />
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.invitationTypography.title}
      >
        No Invitations
      </Typography>
      <Typography variant="body2" sx={styles.invitationTypography.muted}>
        You don't have any pending tournament invitations.
      </Typography>
    </Box>
  );
};

export default InvitationEmptyState;
