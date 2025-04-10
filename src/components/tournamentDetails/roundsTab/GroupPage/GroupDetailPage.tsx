import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  AppBar,
  Toolbar,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  GolfCourse as GolfCourseIcon,
} from "@mui/icons-material";
import { useGroupScoring } from "../../../../hooks/useScoreUpdater";
import { useStyles } from "../../../../styles";
import { Tournament, Player } from "../../../../types/event";
import ScoreDialog from "../../../round/ScoreDialog";
import {
  getHolesList,
  isHoleScored,
  calculateTotalScore,
  calculateScoreToPar,
  getScoreToParColor,
  formatScoreToPar,
} from "../../../round/scoringUtils";
import PlayerScorecard from "../../PlayerScorecard";

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

  const round = tournament.rounds.find((r) => r.id === roundId)!;
  const group = round?.playerGroups?.find((g) => g.id === groupId);

  // Get the players in the group
  const groupPlayers =
    (group?.playerIds
      .map((playerId) => tournament.players.find((p) => p.id === playerId))
      .filter(Boolean) as Player[]) || [];

  // Use the shared group scoring hook
  const {
    currentHole,
    setCurrentHole,
    dialogHole,
    setDialogHole,
    expandedPlayerIds,
    scoreDialogOpen,
    setScoreDialogOpen,
    holePickerOpen,
    togglePlayerExpanded,
    openScoreDialog,
    handleCloseScoreDialog,
    setHolePickerOpen,
    navigateHole,
  } = useGroupScoring({
    round,
    groupPlayers,
  });

  const handleBack = () => {
    navigate(`/tournaments/${tournamentId}?tab=rounds`);
  };

  const handleSaveScore = (playerId: string, score: number) => {
    if (!roundId || !round) {
      console.error("Cannot save score: round or roundId is missing");
      return;
    }

    console.log(
      `Saving score for player ${playerId} on hole ${dialogHole}: ${score}`
    );

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

    // Update the scores via the parent component
    try {
      // Create a complete new scores array
      onUpdateScores(roundId, playerId, [...currentScores]);
      console.log("Scores updated successfully");
    } catch (error) {
      console.error("Error updating scores:", error);
    }
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
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">{round.name}</Typography>
            <Typography variant="body2" sx={styles.text.body.secondary}>
              {new Date(round.date).toLocaleDateString()}
            </Typography>
            {round.courseDetails?.name && (
              <Typography variant="body2" sx={styles.text.body.secondary}>
                {round.courseDetails.name}{" "}
                {round.courseDetails.par && `(Par ${round.courseDetails.par})`}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              p: 2,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
            onClick={() => setHolePickerOpen(!holePickerOpen)}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
            >
              Hole {currentHole}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: alpha(theme.palette.common.white, 0.7), mt: 0.5 }}
            >
              {!holePickerOpen
                ? "Tap to select hole"
                : "Select a hole to score"}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.primary.main,
                }}
              >
                {holePickerOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
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
                {getHolesList(holeCount).map((holeNumber) => {
                  const isCurrentHole = holeNumber === currentHole;
                  const hasScores = isHoleScored(
                    holeNumber,
                    groupPlayers,
                    round.scores
                  );

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
            {groupPlayers.map((player) => {
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
                        tournament={tournament}
                        showAllRounds={false}
                        currentPlayingHole={currentHole}
                        key={`scorecard-${player.id}-${currentHole}`} // Add key to force re-render on hole change
                      />
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Container>

      <ScoreDialog
        open={scoreDialogOpen}
        onClose={handleCloseScoreDialog}
        onHoleChange={(newHole) => {
          setDialogHole(newHole);
          setCurrentHole(newHole);
        }}
        hole={dialogHole}
        holePar={holePar}
        players={groupPlayers}
        playerScores={round.scores}
        onSave={handleSaveScore}
        totalHoles={holeCount}
      />
    </Box>
  );
};

export default GroupDetailPage;
