import { Paper, Box, Typography, Chip } from "@mui/material";
import { format } from "date-fns";
import { useStyles } from "../../styles/hooks/useStyles";
import { Achievement } from "../../types";
import { getPositionText } from "./utils";

const AchievementItem: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const styles = useStyles();

  const getBadgeStyle = (position: number) => {
    return styles.getPositionStyle(position - 1);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        ...styles.card.glass,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: getBadgeStyle(achievement.position).bgcolor,
          color: getBadgeStyle(achievement.position).color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mr: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
          }}
        >
          {getPositionText(achievement.position)}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" sx={styles.text.body.primary}>
          {achievement.displayText}
        </Typography>
        <Typography variant="caption" sx={styles.text.body.muted}>
          {format(new Date(achievement.date), "MMMM d, yyyy")}
        </Typography>
      </Box>
      <Chip
        size="small"
        label={achievement.type === "tournament" ? "Tournament" : "Tour"}
        sx={
          achievement.type === "tournament"
            ? styles.chips.eventType.tournament
            : styles.chips.eventType.tour
        }
      />
    </Paper>
  );
};

export default AchievementItem;
