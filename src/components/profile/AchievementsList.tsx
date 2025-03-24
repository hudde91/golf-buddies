import React from "react";
import { Achievement } from "../../types";
import { format } from "date-fns";
import { useProfileStyles } from "../../theme";

// Material UI imports
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from "@mui/material";
import {
  EmojiEvents as TournamentIcon,
  Tour as TourIcon,
} from "@mui/icons-material";

interface AchievementsListProps {
  achievements: Achievement[];
}

const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements,
}) => {
  const styles = useProfileStyles();

  // Sort achievements by date (most recent first)
  const sortedAchievements = [...achievements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedAchievements.length === 0) {
    return (
      <Box sx={styles.achievements.emptyState}>
        <Typography>No achievements yet.</Typography>
      </Box>
    );
  }

  const getPositionBadge = (position: number) => {
    if (position === 1) {
      return (
        <Avatar
          sx={{
            ...styles.achievements.positionBadge.base,
            ...styles.achievements.positionBadge.first,
          }}
          title="1st Place"
        >
          {position}
        </Avatar>
      );
    } else if (position === 2) {
      return (
        <Avatar
          sx={{
            ...styles.achievements.positionBadge.base,
            ...styles.achievements.positionBadge.second,
          }}
          title="2nd Place"
        >
          {position}
        </Avatar>
      );
    } else if (position === 3) {
      return (
        <Avatar
          sx={{
            ...styles.achievements.positionBadge.base,
            ...styles.achievements.positionBadge.third,
          }}
          title="3rd Place"
        >
          {position}
        </Avatar>
      );
    }
    return null;
  };

  const getAchievementIcon = (type: "tournament" | "tour") => {
    return type === "tournament" ? (
      <TournamentIcon color="primary" />
    ) : (
      <TourIcon color="secondary" />
    );
  };

  return (
    <Box sx={styles.achievements.container}>
      <Typography sx={styles.achievements.title}>Achievements</Typography>

      <List disablePadding sx={styles.achievements.list}>
        {sortedAchievements.map((achievement, index) => (
          <React.Fragment key={achievement.id}>
            {index > 0 && (
              <Divider
                sx={styles.achievements.divider}
                variant="inset"
                component="li"
              />
            )}
            <ListItem
              sx={{
                ...styles.achievements.item,
                ...styles.achievements.getItemBackground(achievement.position),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {getPositionBadge(achievement.position)}
                <ListItemIcon sx={styles.achievements.iconContainer}>
                  {getAchievementIcon(achievement.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={styles.achievements.displayText}>
                      {achievement.displayText}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={styles.achievements.dateText}>
                      {format(new Date(achievement.date), "MMMM d, yyyy")}
                    </Typography>
                  }
                />
              </Box>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default AchievementsList;
