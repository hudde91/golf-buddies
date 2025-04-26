import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Collapse,
  Toolbar,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { Round, Player, PlayerGroup } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import ScoreDialog from "./ScoreDialog";
import { useGroupScoring } from "./hooks/useGroupScoring";
import PlayerScoreDisplay from "./PlayerScoreDisplay";
import { getHolesList, isHoleScored } from "./scoringUtils";

interface GroupDetailsProps {
  round: Round;
  group: PlayerGroup;
  groupPlayers: Player[];
  onBack: () => void;
  onSaveScore: (playerId: string, holeNumber: number, score: number) => void;
  containerType?: "standalone" | "tournament" | "tour";
}

const GroupDetails: React.FC<GroupDetailsProps> = ({
  round,
  group,
  groupPlayers,
  onBack,
  onSaveScore,
  containerType = "standalone",
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Use the shared group scoring hook
  const {
    currentHole,
    setCurrentHole,
    dialogHole,
    setDialogHole,
    expandedPlayerIds,
    scoreDialogOpen,
    holePickerOpen,
    togglePlayerExpanded,
    openScoreDialog,
    handleCloseScoreDialog,
    setHolePickerOpen,
  } = useGroupScoring({
    round,
    groupPlayers,
  });

  const handleSaveScore = (playerId: string, score: number) => {
    onSaveScore(playerId, dialogHole, score);
  };

  const holeCount = round.courseDetails?.holes || 18;
  const holePar = round.courseDetails?.par
    ? Math.floor(round.courseDetails.par / holeCount)
    : null;

  const getBackText = () => {
    switch (containerType) {
      case "tournament":
        return "Back to tournament details";
      case "tour":
        return "Back to tour details";
      default:
        return "Back to round details";
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Toolbar>
        <Box sx={styles.navigation.backButtonContainer}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={styles.navigation.backButton}
          >
            {getBackText()}
          </Button>
        </Box>
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
              <ExpandMoreIcon
                sx={{
                  color: theme.palette.primary.main,
                  transform: holePickerOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.3s ease",
                }}
              />
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
            {groupPlayers.map((player) => (
              <PlayerScoreDisplay
                key={player.id}
                player={player}
                round={round}
                currentHole={currentHole}
                isExpanded={expandedPlayerIds.includes(player.id)}
                onToggleExpand={togglePlayerExpanded}
                onOpenScoreDialog={openScoreDialog}
              />
            ))}
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

export default GroupDetails;
