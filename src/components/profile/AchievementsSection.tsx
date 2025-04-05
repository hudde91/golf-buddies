import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Achievement } from "../../types";
import AchievementItem from "./AchievementItem";
import { useStyles } from "../../styles/hooks/useStyles";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
}) => {
  const styles = useStyles();

  // Sort achievements by date (most recent first)
  const sortedAchievements = [...achievements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={styles.divider.section} />

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <EmojiEventsIcon
          sx={{
            color: "warning.main",
            mr: 1,
          }}
        />
        <Typography
          variant="h5"
          component="h2"
          sx={styles.text.heading.section}
        >
          Achievements
        </Typography>
      </Box>

      {sortedAchievements.length > 0 ? (
        sortedAchievements.map((achievement) => (
          <AchievementItem key={achievement.id} achievement={achievement} />
        ))
      ) : (
        <Box sx={styles.feedback.emptyState.container}>
          <Typography sx={styles.text.body.muted}>
            No achievements yet. Compete in tournaments to earn awards!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AchievementsSection;
