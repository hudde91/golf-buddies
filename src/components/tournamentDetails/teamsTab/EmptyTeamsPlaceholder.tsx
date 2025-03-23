import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon, GroupAdd as GroupAddIcon } from "@mui/icons-material";
import { useTournamentTeamStyles } from "../../../theme/hooks";

interface EmptyTeamsPlaceholderProps {
  isCreator: boolean;
  onCreateTeam: () => void;
}

const EmptyTeamsPlaceholder: React.FC<EmptyTeamsPlaceholderProps> = ({
  isCreator,
  onCreateTeam,
}) => {
  const styles = useTournamentTeamStyles();

  return (
    <Box sx={styles.emptyState}>
      <GroupAddIcon sx={styles.emptyStateIcon} />
      <Typography variant="h6" gutterBottom sx={styles.emptyStateTitle}>
        No Teams Created Yet
      </Typography>
      <Typography variant="body2" paragraph sx={styles.emptyStateMessage}>
        Create teams to track team scores in this tournament.
      </Typography>
      {isCreator && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateTeam}
        >
          Create First Team
        </Button>
      )}
    </Box>
  );
};

export default EmptyTeamsPlaceholder;
