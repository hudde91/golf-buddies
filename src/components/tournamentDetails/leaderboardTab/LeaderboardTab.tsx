import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { Tournament } from "../../../types/event";
import TournamentLeaderboard from "./TournamentLeaderboard";
import TeamLeaderboard from "./TeamLeaderboard";
import { useTournamentLeaderboardStyles } from "../../../theme/hooks";

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
  const styles = useTournamentLeaderboardStyles();

  if (tournament.rounds.length === 0) {
    return (
      <Box sx={styles.leaderboardEmptyState}>
        <TrophyIcon sx={styles.leaderboardEmptyStateIcon} />
        <Typography
          variant="h6"
          gutterBottom
          sx={styles.tournamentTypography.title}
        >
          No Rounds Added Yet
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ...styles.tournamentTypography.muted,
            maxWidth: 500,
            mx: "auto",
          }}
          paragraph
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
          <Divider sx={styles.leaderboardDivider} />
          <TeamLeaderboard tournament={tournament} />
        </Box>
      )}
    </Box>
  );
};

export default LeaderboardTab;
