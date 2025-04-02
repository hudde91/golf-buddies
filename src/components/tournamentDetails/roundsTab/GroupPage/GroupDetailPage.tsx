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
  useTheme,
  Divider,
  AppBar,
  Toolbar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

interface GroupDetailPageProps {
  tournament: Tournament;
  onUpdateScores: (roundId: string, playerId: string, scores: any[]) => void;
}

interface ScoreDialogProps {
  open: boolean;
  onClose: () => void;
  playerId: string;
  playerName: string;
  hole: number;
  holePar: number | null;
  currentScore: number | undefined;
  onSave: (score: number) => void;
  players: Player[];
  onNextPlayer: () => void;
  onSelectPlayer: (playerId: string) => void;
  playerScores: Record<string, { score?: number }[]>;
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({
  open,
  onClose,
  playerId,
  playerName,
  hole,
  holePar,
  currentScore,
  onSave,
  players,
  onNextPlayer,
  onSelectPlayer,
  playerScores,
}) => {
  const theme = useTheme();
  const [selectedScore, setSelectedScore] = useState<number | undefined>(
    currentScore
  );
  const scoreOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const getScoreStatus = (score: number) => {
    if (!holePar) return { label: "", color: "" };

    const relation = score - holePar;
    if (relation < -1) return { label: "Eagle", color: "#d32f2f" };
    if (relation === -1) return { label: "Birdie", color: "#f44336" };
    if (relation === 0) return { label: "Par", color: "#2e7d32" };
    if (relation === 1) return { label: "Bogey", color: "#0288d1" };
    if (relation === 2) return { label: "Double", color: "#9e9e9e" };
    if (relation > 2) return { label: `+${relation}`, color: "#9e9e9e" };
    return { label: "", color: "" };
  };

  const handleSave = () => {
    if (selectedScore !== undefined) {
      onSave(selectedScore);
      onClose();
    }
  };

  const handleSaveAndNext = () => {
    if (selectedScore !== undefined) {
      onSave(selectedScore);
      onNextPlayer();
    }
  };

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score);
  };

  const handlePlayerSelect = (playerId: string) => {
    if (selectedScore !== undefined) {
      onSave(selectedScore);
    }
    onSelectPlayer(playerId);

    // Update selected score for new player
    const playerHoleScore = playerScores[playerId]?.[hole - 1]?.score;
    setSelectedScore(playerHoleScore);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h6">{playerName}</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
              <Chip label={`Hole ${hole}`} size="small" color="primary" />
              {holePar && (
                <Chip
                  label={`Par ${holePar}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {players.map((player) => (
              <Avatar
                key={player.id}
                src={player.avatarUrl}
                alt={player.name}
                sx={{
                  width: 40,
                  height: 40,
                  opacity: player.id === playerId ? 1 : 0.6,
                  border:
                    player.id === playerId
                      ? `2px solid ${theme.palette.primary.main}`
                      : "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (player.id !== playerId) {
                    handlePlayerSelect(player.id);
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 0 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Score:
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {selectedScore || "-"}
              </Typography>
              {selectedScore && holePar && (
                <Typography
                  variant="body2"
                  sx={{
                    color: getScoreStatus(selectedScore).color,
                    fontWeight: "medium",
                  }}
                >
                  {getScoreStatus(selectedScore).label}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  px: 1,
                }}
              >
                <IconButton
                  disabled={!selectedScore || selectedScore <= 1}
                  onClick={() =>
                    selectedScore && setSelectedScore(selectedScore - 1)
                  }
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <Box sx={{ width: 80, textAlign: "center" }}>
                  <Typography variant="h5">{selectedScore || "-"}</Typography>
                </Box>
                <IconButton
                  disabled={!selectedScore || selectedScore >= 12}
                  onClick={() =>
                    selectedScore && setSelectedScore(selectedScore + 1)
                  }
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              py: 1,
              gap: 1,
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": {
                display: "none", // Chrome, Safari, Edge
              },
              // Add padding to ensure all items are visible when scrolling
              px: 1,
              mx: -1,
            }}
          >
            {scoreOptions.map((score) => {
              const scoreStatus = holePar
                ? getScoreStatus(score)
                : { label: "", color: "" };
              return (
                <Box
                  key={score}
                  onClick={() => handleScoreSelect(score)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 60,
                    height: 60,
                    borderRadius: 1,
                    border: `1px solid ${
                      score === selectedScore
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                    bgcolor:
                      score === selectedScore
                        ? `${theme.palette.primary.main}10`
                        : scoreStatus.label
                        ? `${scoreStatus.color}10`
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor:
                        score === selectedScore
                          ? `${theme.palette.primary.main}20`
                          : `${theme.palette.action.hover}`,
                    },
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={score === selectedScore ? "bold" : "normal"}
                    color={
                      score === selectedScore
                        ? theme.palette.primary.main
                        : "inherit"
                    }
                  >
                    {score}
                  </Typography>
                  {scoreStatus.label && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: scoreStatus.color,
                        fontWeight: score === selectedScore ? "bold" : "medium",
                        mt: -0.5,
                      }}
                    >
                      {scoreStatus.label}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ px: 3, py: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={selectedScore === undefined}
          >
            Save
          </Button>
          <Button
            onClick={handleSaveAndNext}
            variant="contained"
            color="primary"
            disabled={selectedScore === undefined || players.length <= 1}
            endIcon={<NavigateNextIcon />}
          >
            Next
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

const GroupDetailPage: React.FC<GroupDetailPageProps> = ({
  tournament,
  onUpdateScores,
}) => {
  const theme = useTheme();
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
            sx={{ mt: 2 }}
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
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">{round.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(round.date).toLocaleDateString()}
          </Typography>
          {round.courseDetails?.name && (
            <Typography variant="body2" color="text.secondary">
              {round.courseDetails.name}
            </Typography>
          )}
        </Paper>

        <Paper sx={{ mb: 3, overflow: "hidden" }}>
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
                  {playerIndex > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => togglePlayerExpanded(player.id)}
                    sx={{
                      py: 2,
                      "&:hover": { bgcolor: theme.palette.action.hover },
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
                                  border: `1px solid ${theme.palette.divider}`,
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
                                  : theme.palette.action.hover,
                                color: scoreStatus ? scoreColor : "inherit",
                                border: `1px solid ${
                                  scoreStatus
                                    ? scoreColor
                                    : theme.palette.divider
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
                                  border: `1px solid ${theme.palette.divider}`,
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
                            <Typography variant="body2" color="text.secondary">
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
                    <Box sx={{ p: 3, bgcolor: theme.palette.action.hover }}>
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
