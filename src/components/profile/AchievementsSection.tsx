import React from "react";
import { Box, Typography, useTheme, alpha, Divider } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useProfileStyles } from "../../theme/hooks";
import { Achievement } from "../../types";
import AchievementItem from "./AchievementItem";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
}) => {
  const theme = useTheme();

  // Sort achievements by date (most recent first)
  const sortedAchievements = [...achievements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Divider
        sx={{
          mb: 3,
          borderColor: alpha(theme.palette.common.white, 0.2),
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <EmojiEventsIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: theme.palette.common.white }}
        >
          Achievements
        </Typography>
      </Box>

      {sortedAchievements.length > 0 ? (
        sortedAchievements.map((achievement) => (
          <AchievementItem key={achievement.id} achievement={achievement} />
        ))
      ) : (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: alpha(theme.palette.common.white, 0.05),
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          }}
        >
          <Typography sx={{ color: alpha(theme.palette.common.white, 0.7) }}>
            No achievements yet. Compete in tournaments to earn awards!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AchievementsSection;
