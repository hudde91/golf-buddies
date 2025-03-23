import React from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  LinearProgress,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useProfileStyles } from "../../theme/hooks";

interface Achievement {
  id: string;
  title: string;
  date: string;
  progress: number; // 0-100
  type: "tournament" | "personal" | "milestone";
}

interface AchievementsSectionProps {
  achievements: Achievement[];
  editing: boolean;
  onAddAchievement: () => void;
  onRemoveAchievement: (id: string) => void;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  editing,
  onAddAchievement,
  onRemoveAchievement,
}) => {
  const styles = useProfileStyles();
  const theme = useTheme();

  // Get color based on achievement type
  const getTypeColor = (type: Achievement["type"]) => {
    switch (type) {
      case "tournament":
        return theme.palette.secondary.main;
      case "personal":
        return theme.palette.info.main;
      case "milestone":
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ mt: 5, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={styles.profileSectionTitle}>
          Golf Achievements
        </Typography>

        {editing && (
          <Tooltip title="Add new achievement">
            <IconButton
              onClick={onAddAchievement}
              sx={styles.profileButtons.edit}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {achievements.length === 0 ? (
        <Typography
          variant="body1"
          sx={{
            ...styles.profileTypography.muted,
            mt: 2,
            fontStyle: "italic",
            textAlign: "center",
            padding: 3,
          }}
        >
          No achievements added yet.{" "}
          {editing && "Click the + button to add your golf accomplishments!"}
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {achievements.map((achievement) => (
            <Grid item xs={12} sm={6} key={achievement.id}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  position: "relative",
                  bgcolor: alpha(theme.palette.common.white, 0.05),
                  border: `1px solid ${alpha(
                    getTypeColor(achievement.type),
                    0.3
                  )}`,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.common.white, 0.08),
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EmojiEventsIcon
                    sx={{
                      color: getTypeColor(achievement.type),
                      mr: 1,
                      fontSize: "1.5rem",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      ...styles.profileTypography.heading,
                      fontSize: "1.2rem",
                      flex: 1,
                    }}
                  >
                    {achievement.title}
                  </Typography>
                  {editing && (
                    <IconButton
                      size="small"
                      onClick={() => onRemoveAchievement(achievement.id)}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Typography
                  variant="caption"
                  sx={styles.profileTypography.muted}
                >
                  {achievement.date}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 1, mt: 1 }}
                >
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={achievement.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.common.white, 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: getTypeColor(achievement.type),
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: getTypeColor(achievement.type),
                      fontWeight: "bold",
                    }}
                  >
                    {achievement.progress}%
                  </Typography>
                </Box>

                <Chip
                  label={
                    achievement.type.charAt(0).toUpperCase() +
                    achievement.type.slice(1)
                  }
                  size="small"
                  sx={{
                    bgcolor: alpha(getTypeColor(achievement.type), 0.1),
                    color: getTypeColor(achievement.type),
                    borderRadius: "4px",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {!editing && achievements.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={styles.outlinedButton}
          >
            View All Achievements
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AchievementsSection;
