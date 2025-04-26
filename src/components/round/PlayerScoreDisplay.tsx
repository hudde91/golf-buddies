import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Collapse,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import { GolfCourse as GolfCourseIcon } from "@mui/icons-material";
import { Player, Round } from "../../types/event";
import PlayerScorecard from "../tournamentDetails/PlayerScorecard";
import {
  calculateTotalScore,
  calculateScoreToPar,
  formatScoreToPar,
  getScoreToParColor,
} from "./scoringUtils";

interface PlayerScoreDisplayProps {
  player: Player;
  round: Round;
  currentHole: number;
  isExpanded: boolean;
  onToggleExpand: (playerId: string) => void;
  onOpenScoreDialog: () => void;
}

const PlayerScoreDisplay: React.FC<PlayerScoreDisplayProps> = ({
  player,
  round,
  currentHole,
  isExpanded,
  onToggleExpand,
  onOpenScoreDialog,
}) => {
  const theme = useTheme();
  const playerScores = round.scores[player.id] || [];
  const currentHoleScore = playerScores[currentHole - 1]?.score;
  const totalScore = calculateTotalScore(player.id, round.scores);
  const scoreToPar = calculateScoreToPar(
    player.id,
    round.scores,
    round.courseDetails?.par,
    round.courseDetails?.holes
  );

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.08)",
        },
      }}
      onClick={() => onToggleExpand(player.id)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={player.avatarUrl}
            alt={player.name}
            sx={{ width: 48, height: 48 }}
          >
            {player.name ? player.name[0].toUpperCase() : "P"}
          </Avatar>

          <Box>
            <Typography variant="h6">{player.name}</Typography>
            <Typography
              variant="body2"
              sx={{
                color: getScoreToParColor(scoreToPar),
                fontWeight: "medium",
              }}
            >
              Total: {totalScore} ({formatScoreToPar(scoreToPar)})
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color:
                currentHoleScore === undefined
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            {currentHoleScore === undefined ? "-" : currentHoleScore}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Hole {currentHole}
          </Typography>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onOpenScoreDialog();
            }}
            sx={{
              mt: 0.5,
              color: theme.palette.primary.main,
            }}
          >
            <GolfCourseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2, opacity: 0.2 }} />
          <PlayerScorecard
            player={player}
            tournament={{
              ...round,
              id: round.id,
              name: round.name,
              startDate: round.date,
              endDate: round.date,
              rounds: [round],
              location: round.location || "",
              format: round.format,
              createdBy: round.createdBy || "",
              createdAt: round.createdAt || new Date().toISOString(),
              players: round.players || [],
              teams: [],
              invitations: round.invitations || [],
              isTeamEvent: false,
              scoringType: "individual",
              status: round.status || "upcoming",
            }}
            showAllRounds={false}
            currentPlayingHole={currentHole}
            key={`scorecard-${player.id}-${currentHole}`}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default PlayerScoreDisplay;
