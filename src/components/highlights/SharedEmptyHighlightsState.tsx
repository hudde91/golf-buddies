import React from "react";
import { Paper, Typography } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useStyles } from "../../styles";

interface SharedEmptyHighlightsStateProps {
  eventType: "tournament" | "tour";
}

const SharedEmptyHighlightsState: React.FC<SharedEmptyHighlightsStateProps> = ({
  eventType,
}) => {
  const styles = useStyles();

  return (
    <Paper sx={styles.tournamentHighlights.emptyState}>
      <TrophyIcon sx={styles.tournamentHighlights.emptyStateIcon} />
      <Typography variant="h6" sx={styles.tournamentHighlights.emptyStateTitle}>
        No highlights yet
      </Typography>
      <Typography
        variant="body1"
        sx={styles.tournamentHighlights.emptyStateText}
      >
        Share photos, videos, or wait for achievements like birdies, eagles, and
        holes-in-one to appear here in this {eventType}.
      </Typography>
    </Paper>
  );
};

export default SharedEmptyHighlightsState;
