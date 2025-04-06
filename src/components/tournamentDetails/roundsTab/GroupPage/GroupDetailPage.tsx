import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Collapse,
  Divider,
  AppBar,
  Toolbar,
  Container,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Menu as MenuIcon,
  GolfCourse as GolfCourseIcon,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { tournamentId, roundId, groupId } = useParams<{
    tournamentId: string;
    roundId: string;
    groupId: string;
  }>();

  const [currentHole, setCurrentHole] = useState<number>(1);
  const [expandedPlayerIds, setExpandedPlayerIds] = useState<string[]>([]);
  const [scoreDialogOpen, setScoreDialogOpen] = useState<boolean>(false);
  const [holePickerOpen, setHolePickerOpen] = useState<boolean>(false);
  const [dialogHole, setDialogHole] = useState<number>(1);

  const round = tournament.rounds.find((r) => r.id === roundId)!;
  const group = round?.playerGroups?.find((g) => g.id === groupId);

  const groupPlayers =
    (group?.playerIds
      .map((playerId) => tournament.players.find((p) => p.id === playerId))
      .filter(Boolean) as Player[]) || [];

  useEffect(() => {
    // Find the first hole that doesn't have a score for any player
    if (groupPlayers.length > 0 && round) {
      const holeCount = round.courseDetails?.holes || 18;

      for (let hole = 1; hole <= holeCount; hole++) {
        const holeIndex = hole - 1;
        let allPlayersHaveScore = true;

        for (const player of groupPlayers) {
          const playerScores = round.scores[player.id] || [];
          const holeScore = playerScores[holeIndex]?.score;

          if (holeScore === undefined) {
            allPlayersHaveScore = false;
            break;
          }
        }

        if (!allPlayersHaveScore) {
          setCurrentHole(hole);
          setDialogHole(hole);
          break;
        }
      }
    }
  }, [groupPlayers, round]);

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

  const openScoreDialog = (hole: number | null = null) => {
    // If a specific hole is provided, use it for the dialog
    if (hole !== null) {
      setDialogHole(hole);
    } else {
      // Otherwise use the current hole
      setDialogHole(currentHole);
    }

    setScoreDialogOpen(true);
    setHolePickerOpen(false);
  };

  const handleCloseScoreDialog = () => {
    setScoreDialogOpen(false);
    // Update the current hole to match the last viewed hole in the dialog
    setCurrentHole(dialogHole);
  };

  const handleSaveScore = (playerId: string, score: number) => {
    if (!roundId) return;

    // Get current scores for the player
    const currentScores = [...(round.scores[playerId] || [])];

    // Update the score for the dialogHole (not currentHole)
    while (currentScores.length < dialogHole) {
      currentScores.push({ score: undefined, hole: currentScores.length + 1 });
    }

    // Get the hole par
    const holePar = round.courseDetails?.holes
      ? round.courseDetails.par
        ? Math.floor(round.courseDetails.par / round.courseDetails.holes)
        : null
      : null;

    currentScores[dialogHole - 1] = {
      score,
      par: holePar || undefined,
      hole: dialogHole,
    };

    onUpdateScores(roundId, playerId, currentScores);
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

  // Format score to par as a string (e.g., "E", "+2", "-1")
  const formatScoreToPar = (scoreToPar: number | null): string => {
    if (scoreToPar === null) return "E";
    if (scoreToPar === 0) return "E";
    return scoreToPar > 0 ? `+${scoreToPar}` : `${scoreToPar}`;
  };

  // Get the color for a score relative to par
  const getScoreToParColor = (scoreToPar: number | null): string => {
    if (scoreToPar === null || scoreToPar === 0) return "#2e7d32"; // Green for even par
    if (scoreToPar < 0) return "#d32f2f"; // Red for under par
    return "#0288d1"; // Blue for over par
  };

  // Check if a hole has a score for all players
  const isHoleScored = (holeNumber: number): boolean => {
    if (!groupPlayers.length) return false;

    const holeIndex = holeNumber - 1;
    for (const player of groupPlayers) {
      const playerScore = round.scores[player.id]?.[holeIndex]?.score;
      if (playerScore === undefined) {
        return false;
      }
    }
    return true;
  };

  // Get a list of all holes for hole picker
  const getHolesList = (): number[] => {
    const holeCount = round.courseDetails?.holes || 18;
    return Array.from({ length: holeCount }, (_, i) => i + 1);
  };

  if (!round || !group) {
    return (
      <Container maxWidth="lg" disableGutters={isMobile}>
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
  const holePar = round.courseDetails?.par
    ? Math.floor(round.courseDetails.par / holeCount)
    : null;

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

      <Container
        maxWidth={false}
        disableGutters={isMobile}
        sx={{
          mt: isMobile ? 0 : 3,
          px: isMobile ? 0 : 2,
        }}
      >
        <Paper
          sx={{
            ...styles.card.glass,
            borderRadius: isMobile ? 0 : undefined,
            mb: 2,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6">{round.name}</Typography>
              <Typography variant="body2" sx={styles.text.body.secondary}>
                {new Date(round.date).toLocaleDateString()}
              </Typography>
              {round.courseDetails?.name && (
                <Typography variant="body2" sx={styles.text.body.secondary}>
                  {round.courseDetails.name}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                variant="text"
                onClick={() => setHolePickerOpen(!holePickerOpen)}
                startIcon={
                  holePickerOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
                // endIcon={<MenuIcon />}
                size="small"
                sx={{
                  ...styles.button.outlined,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                }}
              >
                Hole {currentHole}
              </Button>

              {/* {holePar && (
                <Chip
                  label={`Par ${holePar}`}
                  size="small"
                  variant="outlined"
                />
              )} */}
            </Box>
          </Box>

          <Collapse in={holePickerOpen}>
            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Grid container spacing={1}>
                {getHolesList().map((holeNumber) => {
                  const isCurrentHole = holeNumber === currentHole;
                  const hasScores = isHoleScored(holeNumber);

                  return (
                    <Grid item xs={2} key={`hole-${holeNumber}`}>
                      <Box
                        onClick={() => openScoreDialog(holeNumber)}
                        sx={{
                          width: "100%",
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          border: `2px solid ${
                            isCurrentHole
                              ? theme.palette.primary.main
                              : hasScores
                              ? theme.palette.success.main
                              : "rgba(255,255,255,0.2)"
                          }`,
                          bgcolor: isCurrentHole
                            ? `${theme.palette.primary.main}20`
                            : "transparent",
                          cursor: "pointer",
                          fontWeight: isCurrentHole ? "bold" : "normal",
                          color: isCurrentHole
                            ? theme.palette.primary.main
                            : hasScores
                            ? theme.palette.success.main
                            : "inherit",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.1)",
                          },
                        }}
                      >
                        {holeNumber}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Collapse>
        </Paper>

        <Paper
          sx={{
            mb: 3,
            ...styles.card.glass,
            borderRadius: isMobile ? 0 : undefined,
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Player Scores
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {groupPlayers.map((player, playerIndex) => {
              const playerScores = round.scores[player.id] || [];
              const currentHoleScore = playerScores[currentHole - 1]?.score;
              const totalScore = calculateTotalScore(player.id);
              const scoreToPar = calculateScoreToPar(player.id);

              return (
                <Box
                  key={player.id}
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
                  onClick={() => togglePlayerExpanded(player.id)}
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
                      />

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
                        {currentHoleScore === undefined
                          ? "-"
                          : currentHoleScore}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Hole {currentHole}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          openScoreDialog();
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

                  <Collapse
                    in={expandedPlayerIds.includes(player.id)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 2, opacity: 0.2 }} />
                      <PlayerScorecard
                        player={player}
                        tournament={{
                          ...tournament,
                          rounds: [round],
                        }}
                        showAllRounds={false}
                        currentPlayingHole={currentHole}
                      />
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Container>

      {/* Score dialog */}
      <ScoreDialog
        open={scoreDialogOpen}
        onClose={handleCloseScoreDialog}
        hole={dialogHole}
        holePar={holePar}
        players={groupPlayers}
        playerScores={round.scores}
        onSave={handleSaveScore}
      />
    </Box>
  );
};

export default GroupDetailPage;
