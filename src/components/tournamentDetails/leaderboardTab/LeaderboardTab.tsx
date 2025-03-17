import React from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { Tournament } from "../../../types/tournament";
import TournamentLeaderboard from "./TournamentLeaderboard";
import TeamLeaderboard from "./TeamLeaderboard";

interface LeaderboardTabProps {
  tournament: Tournament;
  isCreator: boolean;
  // isCaptain: boolean;
  onAddRound: () => void;
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  tournament,
  isCreator,
  // isCaptain,
  onAddRound,
}) => {
  const theme = useTheme();

  if (tournament.rounds.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          backgroundColor: alpha(theme.palette.common.black, 0.2),
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
        }}
      >
        <TrophyIcon
          sx={{
            fontSize: 60,
            color: alpha(theme.palette.common.white, 0.3),
            mb: 2,
          }}
        />
        <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
          No Rounds Added Yet
        </Typography>
        <Typography
          variant="body2"
          color={alpha(theme.palette.common.white, 0.7)}
          paragraph
          sx={{ maxWidth: 500, mx: "auto" }}
        >
          Add rounds to see the tournament leaderboard.
        </Typography>
        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
          >
            Add First Round
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <TournamentLeaderboard tournament={tournament} />
      </Box>

      {tournament.isTeamEvent && tournament.scoringType !== "individual" && (
        <Box sx={{ mt: 6 }}>
          <Divider
            sx={{ mb: 4, bgcolor: alpha(theme.palette.common.white, 0.1) }}
          />
          <TeamLeaderboard tournament={tournament} />
        </Box>
      )}
    </Box>
  );
};

export default LeaderboardTab;
