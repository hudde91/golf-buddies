import { Paper, Typography } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useStyles } from "../../../styles/hooks/useStyles";

const EmptyHighlightsState = () => {
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
        holes-in-one to appear here.
      </Typography>
    </Paper>
  );
};

export default EmptyHighlightsState;
