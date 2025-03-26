import { Paper, Typography } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useTournamentHighlightsStyles } from "../../../theme/hooks";

const EmptyHighlightsState = () => {
  const styles = useTournamentHighlightsStyles();

  return (
    <Paper sx={styles.emptyState}>
      <TrophyIcon sx={styles.emptyStateIcon} />
      <Typography variant="h6" sx={styles.emptyStateTitle}>
        No highlights yet
      </Typography>
      <Typography variant="body1" sx={styles.emptyStateText}>
        Share photos, videos, or wait for achievements like birdies, eagles, and
        holes-in-one to appear here.
      </Typography>
    </Paper>
  );
};

export default EmptyHighlightsState;
