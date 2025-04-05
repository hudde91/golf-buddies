import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse,
  Divider,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  GolfCourse as GolfCourseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { Tournament, Player } from "../../../../types/event";
import PlayerScorecard from "../../PlayerScorecard";
import ScoreDialog from "./ScoreDialog";
import { useStyles } from "../../../../styles/hooks/useStyles";

interface GroupDetailPageProps {
  tournament: Tournament;
  onUpdateScores: (roundId: string, playerId: string, scores: any[]) => void;
}

const GroupDetailPage: React.FC<GroupDetailPageProps> = ({
  tournament,
  onUpdateScores,
}) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tournamentId, roundId, groupId } = useParams<{
    tournamentId: string;
    roundId: string;
    groupId: string;
  }>();

  const [currentHole, setCurrentHole] = useState<number>(1);
  const [expandedPlayerIds, setExpandedPlayerIds] = useState<string[]>([]);
  const [scoreDialogOpen, setScoreDialogOpen] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<{
    id: string;
    name: string;
    currentScore?: number;
  } | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  const round = tournament.rounds.find((r) => r.id === roundId)!;

  const group = round?.playerGroups?.find((g) => g.id === groupId);

  const groupPlayers =
    (group?.playerIds
      .map((playerId) => tournament.players.find((p) => p.id === playerId))
      .filter(Boolean) as Player[]) || [];

  const togglePlayerExpanded = (playerId: string) => {
    setExpandedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleBack = () => {
    navigate(`/tournaments/${tournamentId}?tab=rounds`);
  };

  const navigateToPrevHole = () => {
    if (currentHole > 1) {
      setCurrentHole(currentHole - 1);
    }
  };

  const navigateToNextHole = (holeCount: number) => {
    if (currentHole < holeCount) {
      setCurrentHole(currentHole + 1);
    }
  };

  const openScoreDialog = (
    playerId: string,
    playerName: string,
    currentScore?: number
  ) => {
    const playerIndex = groupPlayers.findIndex((p) => p.id === playerId);
    if (playerIndex !== -1) {
      setCurrentPlayerIndex(playerIndex);
    }

    setSelectedPlayer({
      id: playerId,
      name: playerName,
      currentScore,
    });
    setScoreDialogOpen(true);
  };

  const handleSaveScore = (score: number) => {
    if (!selectedPlayer || !roundId) return;

    // Get current scores for the player
    const currentScores = [...(round.scores[selectedPlayer.id] || [])];

    // Update the score for the current hole
    while (currentScores.length < currentHole) {
      currentScores.push({ score: undefined, hole: currentHole });
    }

    // Get the hole par
    const holePar = round.courseDetails?.holes
      ? round.courseDetails.par
        ? Math.floor(round.courseDetails.par / round.courseDetails.holes)
        : null
      : null;

    currentScores[currentHole - 1] = {
      score,
      par: holePar || undefined,
      hole: currentHole,
    };

    onUpdateScores(roundId, selectedPlayer.id, currentScores);
  };

  // Handle selecting a specific player in the dialog
  const handleSelectPlayer = (playerId: string) => {
    if (!groupPlayers.length) return;

    const playerIndex = groupPlayers.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return;

    const player = groupPlayers[playerIndex];
    const playerScores = round.scores[player.id] || [];
    const currentScore = playerScores[currentHole - 1]?.score;

    setCurrentPlayerIndex(playerIndex);
    setSelectedPlayer({
      id: player.id,
      name: player.name,
      currentScore,
    });
  };

  // Handle moving to next player
  const handleNextPlayer = () => {
    if (groupPlayers.length <= 1) return;

    const nextPlayerIndex = (currentPlayerIndex + 1) % groupPlayers.length;
    handleSelectPlayer(groupPlayers[nextPlayerIndex].id);
  };

  // Calculate total score for a player
  const calculateTotalScore = (playerId: string): number => {
    const playerScores = round?.scores[playerId] || [];
    return playerScores.reduce(
      (total, hole) => total + (hole.score !== undefined ? hole.score : 0),
      0
    );
  };

  // Calculate score to par for a player
  const calculateScoreToPar = (playerId: string): number | null => {
    const playerScores = round?.scores[playerId] || [];

    if (!round?.courseDetails?.par || playerScores.length === 0) {
      return null;
    }

    const validScores = playerScores.filter((hole) => hole.score !== undefined);

    if (validScores.length === 0) {
      return null;
    }

    const totalPar = validScores.reduce(
      (total, hole) =>
        total +
        (hole.par !== undefined
          ? hole.par
          : Math.floor(
              round?.courseDetails!.par! / (round?.courseDetails?.holes || 18)
            )),
      0
    );

    const totalScore = validScores.reduce(
      (total, hole) => total + (hole.score !== undefined ? hole.score : 0),
      0
    );

    return totalScore - totalPar;
  };

  if (!round || !group) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Group or round not found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mt: 2, ...styles.button.primary }}
          >
            Back to Tournament
          </Button>
        </Box>
      </Container>
    );
  }

  const holeCount = round.courseDetails?.holes || 18;

  return (
    <Box sx={{ pb: 6 }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="back"
            sx={styles.navigation.backButton}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
            {group.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {group.teeTime && (
              <Chip
                icon={<ScheduleIcon />}
                label={`${group.teeTime}`}
                size="small"
                sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)" }}
              />
            )}
            {group.startingHole && (
              <Chip
                icon={<FlagIcon />}
                label={`Hole ${group.startingHole}`}
                size="small"
                sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)" }}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Paper sx={{ p: 2, ...styles.card.glass }}>
          <Typography variant="h6">{round.name}</Typography>
          <Typography variant="body2" sx={styles.text.body.secondary}>
            {new Date(round.date).toLocaleDateString()}
          </Typography>
          {round.courseDetails?.name && (
            <Typography variant="body2" sx={styles.text.body.secondary}>
              {round.courseDetails.name}
            </Typography>
          )}
        </Paper>

        <Paper sx={{ mb: 3, overflow: "hidden", ...styles.card.glass }}>
          <List disablePadding>
            {groupPlayers.map((player, playerIndex) => {
              const playerScores = round.scores[player.id] || [];
              const currentHoleScore = playerScores[currentHole - 1]?.score;

              const holePar =
                playerScores[currentHole - 1]?.par ||
                (round.courseDetails?.par
                  ? Math.floor(round.courseDetails.par / holeCount)
                  : null);

              let scoreStatus = "";
              let scoreColor = "";
              if (currentHoleScore !== undefined && holePar !== null) {
                const relation = currentHoleScore - holePar;
                if (relation < -1) {
                  scoreStatus = "Eagle";
                  scoreColor = "#d32f2f";
                } else if (relation === -1) {
                  scoreStatus = "Birdie";
                  scoreColor = "#f44336";
                } else if (relation === 0) {
                  scoreStatus = "Par";
                  scoreColor = "#2e7d32";
                } else if (relation === 1) {
                  scoreStatus = "Bogey";
                  scoreColor = "#0288d1";
                } else if (relation > 1) {
                  scoreStatus =
                    relation === 2 ? "Double Bogey" : `+${relation}`;
                  scoreColor = "#9e9e9e";
                }
              }

              const totalScore = calculateTotalScore(player.id);

              const scoreToPar = calculateScoreToPar(player.id);
              let scoreToParText = "";
              let scoreToParColor = "";

              if (scoreToPar !== null) {
                if (scoreToPar < 0) {
                  scoreToParText = `${scoreToPar}`;
                  scoreToParColor = "#d32f2f";
                } else if (scoreToPar === 0) {
                  scoreToParText = "E";
                  scoreToParColor = "#2e7d32";
                } else {
                  scoreToParText = `+${scoreToPar}`;
                  scoreToParColor = "#0288d1";
                }
              }

              return (
                <React.Fragment key={player.id}>
                  {playerIndex > 0 && <Divider sx={styles.divider.standard} />}
                  <ListItem
                    button
                    onClick={() => togglePlayerExpanded(player.id)}
                    sx={{
                      py: 2,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={player.avatarUrl}
                        alt={player.name}
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="h6">{player.name}</Typography>
                          {player.handicap !== undefined && (
                            <Chip
                              icon={<GolfCourseIcon fontSize="small" />}
                              label={`HCP: ${player.handicap}`}
                              size="small"
                              sx={{ ml: 2 }}
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {/* TODO: Don't hide the button, just disable it instead */}
                            {currentHole > 1 && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToPrevHole();
                                }}
                                sx={{
                                  border: `1px solid ${"divider"}`,
                                  borderRadius: "50%",
                                  width: 36,
                                  height: 36,
                                }}
                              >
                                <NavigateBeforeIcon fontSize="small" />
                              </IconButton>
                            )}

                            <Chip
                              label={`Hole ${currentHole}`}
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                openScoreDialog(
                                  player.id,
                                  player.name,
                                  currentHoleScore
                                );
                              }}
                              sx={{ cursor: "pointer" }}
                            />

                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                bgcolor: scoreStatus
                                  ? `${scoreColor}20`
                                  : "action.hover",
                                color: scoreStatus ? scoreColor : "inherit",
                                border: `1px solid ${
                                  scoreStatus ? scoreColor : "divider"
                                }`,
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openScoreDialog(
                                  player.id,
                                  player.name,
                                  currentHoleScore
                                );
                              }}
                            >
                              {currentHoleScore === undefined
                                ? "-"
                                : currentHoleScore}
                            </Box>

                            {scoreStatus && (
                              <Typography
                                variant="body2"
                                sx={{ color: scoreColor, fontWeight: "medium" }}
                              >
                                {scoreStatus}
                              </Typography>
                            )}
                            {/* TODO: Don't hide the button, just disable it instead */}
                            {currentHole < holeCount && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToNextHole(holeCount);
                                }}
                                sx={{
                                  border: `1px solid ${"divider"}`,
                                  borderRadius: "50%",
                                  width: 36,
                                  height: 36,
                                }}
                              >
                                <NavigateNextIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>

                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={styles.text.body.secondary}
                            >
                              Total: <strong>{totalScore}</strong>
                            </Typography>

                            {scoreToPar !== null && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: scoreToParColor,
                                  fontWeight: "medium",
                                }}
                              >
                                {scoreToParText} to par
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>

                  <Collapse
                    in={expandedPlayerIds.includes(player.id)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ p: 3, bgcolor: "action.hover" }}>
                      <PlayerScorecard
                        player={player}
                        tournament={{
                          ...tournament,
                          rounds: [round],
                        }}
                        showAllRounds={false}
                      />
                    </Box>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      </Container>

      {/* Score edit dialog */}
      {selectedPlayer && (
        <ScoreDialog
          open={scoreDialogOpen}
          onClose={() => setScoreDialogOpen(false)}
          playerId={selectedPlayer.id}
          playerName={selectedPlayer.name}
          hole={currentHole}
          holePar={
            round.courseDetails?.par
              ? Math.floor(round.courseDetails.par / holeCount)
              : null
          }
          currentScore={selectedPlayer.currentScore}
          onSave={handleSaveScore}
          players={groupPlayers}
          onNextPlayer={handleNextPlayer}
          onSelectPlayer={handleSelectPlayer}
          playerScores={round.scores}
        />
      )}
    </Box>
  );
};

export default GroupDetailPage;
