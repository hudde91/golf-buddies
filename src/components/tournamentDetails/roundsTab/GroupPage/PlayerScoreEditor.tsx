import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Paper,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { HoleScore, Round } from "../../../../types/event";
import { useStyles } from "../../../../styles/hooks/useStyles";
import theme from "../../../../theme/theme";

interface PlayerScoreEditorProps {
  playerId: string;
  playerName: string;
  round: Round;
  open: boolean;
  onClose: () => void;
  onSave: (roundId: string, playerId: string, scores: HoleScore[]) => void;
}

const PlayerScoreEditor: React.FC<PlayerScoreEditorProps> = ({
  playerId,
  playerName,
  round,
  open,
  onClose,
  onSave,
}) => {
  const styles = useStyles();
  const [scores, setScores] = useState<HoleScore[]>([]);
  const [currentTab, setCurrentTab] = useState(0);

  const getHoleSections = () => {
    const totalHoles = round.courseDetails?.holes || 18;

    if (totalHoles <= 9) {
      return [
        {
          label: "All Holes",
          holes: Array.from({ length: totalHoles }, (_, i) => i + 1),
        },
      ];
    } else if (totalHoles === 18) {
      return [
        {
          label: "Front 9",
          holes: Array.from({ length: 9 }, (_, i) => i + 1),
        },
        {
          label: "Back 9",
          holes: Array.from({ length: 9 }, (_, i) => i + 10),
        },
      ];
    } else {
      // For courses with non-standard hole counts, create sections of 9
      const sections = [];
      for (let i = 0; i < totalHoles; i += 9) {
        const end = Math.min(i + 9, totalHoles);
        sections.push({
          label: `Holes ${i + 1}-${end}`,
          holes: Array.from({ length: end - i }, (_, idx) => i + idx + 1),
        });
      }
      return sections;
    }
  };

  useEffect(() => {
    // Initialize scores from the round data when the dialog opens
    if (open) {
      const playerScores = round.scores[playerId] || [];
      // Make a deep copy to avoid modifying the original
      setScores([...playerScores.map((score) => ({ ...score }))]);

      // If the scores array is shorter than the number of holes, pad it
      const totalHoles = round.courseDetails?.holes || 18;
      if (playerScores.length < totalHoles) {
        const newScores = [...playerScores.map((score) => ({ ...score }))];
        for (let i = playerScores.length; i < totalHoles; i++) {
          newScores[i] = {
            score: undefined,
            par: Math.floor((round.courseDetails?.par || 72) / 18),
            hole: i + 1,
          };
        }
        setScores(newScores);
      }
    }
  }, [open, playerId, round]);

  const handleScoreChange = (holeIndex: number, value: string) => {
    const numValue = value === "" ? undefined : parseInt(value, 10);

    setScores((prev) => {
      const newScores = [...prev];
      newScores[holeIndex] = {
        ...newScores[holeIndex],
        score: numValue,
      };
      return newScores;
    });
  };

  const handleIncrementScore = (holeIndex: number) => {
    setScores((prev) => {
      const newScores = [...prev];
      const currentScore = newScores[holeIndex]?.score;
      const newScore = currentScore === undefined ? 1 : currentScore + 1;

      newScores[holeIndex] = {
        ...newScores[holeIndex],
        score: newScore,
      };
      return newScores;
    });
  };

  const handleDecrementScore = (holeIndex: number) => {
    setScores((prev) => {
      const newScores = [...prev];
      const currentScore = newScores[holeIndex]?.score;

      if (currentScore === undefined || currentScore <= 1) {
        return prev;
      }

      newScores[holeIndex] = {
        ...newScores[holeIndex],
        score: currentScore - 1,
      };
      return newScores;
    });
  };

  const handleSave = () => {
    onSave(round.id, playerId, scores);
    onClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const sections = getHoleSections();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: styles.dialogs.paper }}
    >
      <DialogTitle sx={styles.dialogs.title}>
        Edit Scores for {playerName} - {round.name}
      </DialogTitle>

      <DialogContent sx={styles.dialogs.content}>
        {sections.length > 1 && (
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            {sections.map((section, index) => (
              <Tab key={`tab-${index}`} label={section.label} />
            ))}
          </Tabs>
        )}

        {sections.map((section, sectionIndex) => (
          <Box
            key={`section-${sectionIndex}`}
            sx={{
              mb: 3,
              display: currentTab === sectionIndex ? "block" : "none",
            }}
          >
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {section.holes.map((holeNum) => {
                  const holeIndex = holeNum - 1;
                  return (
                    <Grid item xs={6} sm={4} md={3} key={`hole-${holeNum}`}>
                      <Box
                        sx={{
                          textAlign: "center",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: "8px",
                          p: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          gutterBottom
                        >
                          Hole {holeNum}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleDecrementScore(holeIndex)}
                            disabled={
                              !scores[holeIndex]?.score ||
                              scores[holeIndex]?.score <= 1
                            }
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <TextField
                            type="number"
                            value={
                              scores[holeIndex]?.score === undefined
                                ? ""
                                : scores[holeIndex]?.score
                            }
                            onChange={(e) =>
                              handleScoreChange(holeIndex, e.target.value)
                            }
                            variant="outlined"
                            size="small"
                            inputProps={{
                              min: 1,
                              max: 15,
                              style: { textAlign: "center" },
                            }}
                            sx={{ width: "60px" }}
                            InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                              theme
                            )}
                            InputProps={styles.tournamentCard.formStyles.inputProps(
                              theme
                            )}
                          />

                          <IconButton
                            size="small"
                            onClick={() => handleIncrementScore(holeIndex)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        {round.courseDetails?.par && (
                          <Typography
                            variant="caption"
                            sx={{ display: "block", mt: 1 }}
                          >
                            Par: {Math.floor(round.courseDetails.par / 18)}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Box>
        ))}

        {sections.length > 1 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => setCurrentTab(Math.max(0, currentTab - 1))}
              disabled={currentTab === 0}
            >
              Previous Section
            </Button>

            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={() =>
                setCurrentTab(Math.min(sections.length - 1, currentTab + 1))
              }
              disabled={currentTab === sections.length - 1}
            >
              Next Section
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={styles.dialogs.actions}>
        <Button onClick={onClose} sx={styles.button.cancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          sx={styles.button.primary}
        >
          Save Scores
        </Button>
      </DialogActions>
    </Dialog>
  );
};
// Is not used today!!
export default PlayerScoreEditor;
