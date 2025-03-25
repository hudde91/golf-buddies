import { Paper, Typography, alpha, useTheme } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";

const EmptyHighlightsState = () => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: alpha(theme.palette.common.black, 0.2),
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <TrophyIcon
        sx={{
          fontSize: 48,
          color: alpha(theme.palette.common.white, 0.5),
          mb: 2,
        }}
      />
      <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
        No highlights yet
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: alpha(theme.palette.common.white, 0.7) }}
      >
        Share photos, videos, or wait for achievements like birdies, eagles, and
        holes-in-one to appear here.
      </Typography>
    </Paper>
  );
};

export default EmptyHighlightsState;
