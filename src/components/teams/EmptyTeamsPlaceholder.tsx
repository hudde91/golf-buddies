// src/components/shared/teams/EmptyTeamsPlaceholder.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon, GroupAdd as GroupAddIcon } from "@mui/icons-material";
import { useStyles } from "../../styles";

interface EmptyTeamsPlaceholderProps {
  isCreator: boolean;
  onCreateTeam: () => void;
}

const EmptyTeamsPlaceholder: React.FC<EmptyTeamsPlaceholderProps> = ({
  isCreator,
  onCreateTeam,
}) => {
  const styles = useStyles();

  return (
    <Box sx={styles.tournamentTeams.emptyState}>
      <GroupAddIcon sx={styles.tournamentTeams.emptyStateIcon} />
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.tournamentTeams.emptyStateTitle}
      >
        No Teams Created Yet
      </Typography>
      <Typography
        variant="body2"
        paragraph
        sx={styles.tournamentTeams.emptyStateMessage}
      >
        Create teams to track team scores in this event.
      </Typography>
      {isCreator && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateTeam}
          sx={styles.button.primary}
        >
          Create First Team
        </Button>
      )}
    </Box>
  );
};

export default EmptyTeamsPlaceholder;
