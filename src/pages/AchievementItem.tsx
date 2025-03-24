import { alpha, Paper, Box, Typography, Chip, useTheme } from "@mui/material";
import { format } from "date-fns";
import { Achievement } from "../types";
import { getBadgeColor, getPositionText } from "./util";

const AchievementItem: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: alpha(theme.palette.common.white, 0.08),
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: getBadgeColor(achievement.position, theme),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mr: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: achievement.position === 2 ? "black" : "white",
            fontWeight: "bold",
          }}
        >
          {getPositionText(achievement.position)}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
          {achievement.displayText}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: alpha(theme.palette.common.white, 0.7) }}
        >
          {format(new Date(achievement.date), "MMMM d, yyyy")}
        </Typography>
      </Box>
      <Chip
        size="small"
        label={achievement.type === "tournament" ? "Tournament" : "Tour"}
        sx={{
          backgroundColor:
            achievement.type === "tournament"
              ? alpha(theme.palette.primary.main, 0.2)
              : alpha(theme.palette.secondary.main, 0.2),
          color:
            achievement.type === "tournament"
              ? theme.palette.primary.light
              : theme.palette.secondary.light,
        }}
      />
    </Paper>
  );
};

export default AchievementItem;
