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
} from "@mui/material";
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

  const getHoleSections = () => {
    const totalHoles = round.courseDetails?.holes || 18;

    if (totalHoles <= 9) {
      return [
        {
          label: "Holes",
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

  const handleSave = () => {
    onSave(round.id, playerId, scores);
    onClose();
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
        {sections.map((section, sectionIndex) => (
          <Box key={`section-${sectionIndex}`} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              {section.label}
            </Typography>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {section.holes.map((holeNum) => {
                  const holeIndex = holeNum - 1;
                  return (
                    <Grid item xs={4} sm={3} md={2} key={`hole-${holeNum}`}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2" gutterBottom>
                          Hole {holeNum}
                        </Typography>
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
                          inputProps={{ min: 1, max: 15 }}
                          fullWidth
                          InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                            theme
                          )}
                          InputProps={styles.tournamentCard.formStyles.inputProps(
                            theme
                          )}
                        />
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Box>
        ))}
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

export default PlayerScoreEditor;
