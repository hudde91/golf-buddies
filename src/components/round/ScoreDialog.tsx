// src/components/shared/ScoreDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  NavigateNext as NavigateNextIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Player } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import { getScoreToParColor } from "./scoringUtils";

interface ScoreDialogProps {
  open: boolean;
  onClose: () => void;
  onHoleChange: (newHole: number) => void;
  hole: number;
  holePar: number | null;
  players: Player[];
  playerScores: Record<
    string,
    { score?: number; par?: number; hole?: number }[]
  >;
  onSave: (playerId: string, score: number) => void;
  totalHoles?: number;
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({
  open,
  onClose,
  onHoleChange,
  hole,
  holePar,
  players,
  playerScores,
  onSave,
  totalHoles = 18,
}) => {
  const styles = useStyles();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [currentHole, setCurrentHole] = useState<number>(hole);

  // Reset current hole when the hole prop changes or when dialog opens/closes
  useEffect(() => {
    if (open) {
      console.log(`ScoreDialog opened, setting currentHole to: ${hole}`);
      setCurrentHole(hole);
    }
  }, [hole, open]);

  // Initialize scores whenever open changes or the hole changes
  useEffect(() => {
    if (open) {
      // Initialize scores from existing player scores
      const initialScores: Record<string, number> = {};
      players.forEach((player) => {
        const playerScore = playerScores[player.id]?.[currentHole - 1]?.score;
        if (playerScore !== undefined) {
          initialScores[player.id] = playerScore;
        } else {
          // Default to par if available
          initialScores[player.id] = holePar || 4; // Default to 4 if no par available
        }
      });
      setScores(initialScores);
    }
  }, [open, players, playerScores, currentHole, holePar]);

  const getScoreStatus = (score: number) => {
    if (!holePar) return { label: "", color: "" };

    const relation = score - holePar;
    if (relation < -1) return { label: "Eagle", color: "#d32f2f" };
    if (relation === -1) return { label: "Birdie", color: "#f44336" };
    if (relation === 0) return { label: "Par", color: "#2e7d32" };
    if (relation === 1) return { label: "Bogey", color: "#0288d1" };
    if (relation === 2) return { label: "Double Bogey", color: "#9e9e9e" };
    if (relation > 2) return { label: `+${relation}`, color: "#9e9e9e" };
    return { label: "", color: "" };
  };

  const handleIncrement = (playerId: string) => {
    setScores((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
  };

  const handleDecrement = (playerId: string) => {
    setScores((prev) => ({
      ...prev,
      [playerId]: Math.max(1, (prev[playerId] || 0) - 1),
    }));
  };

  const handleSaveAndNext = () => {
    // Save all player scores for the current hole
    Object.entries(scores).forEach(([playerId, score]) => {
      onSave(playerId, score);
    });

    // Move to next hole or close if last hole
    if (currentHole < totalHoles) {
      const nextHole = currentHole + 1;

      // Important: This updates both the internal state and parent component state
      setCurrentHole(nextHole);
      onHoleChange(nextHole);
    } else {
      // We're on the last hole, so close dialog
      onClose();
    }
  };

  // Get total strokes for a player
  const getPlayerTotal = (playerId: string): number => {
    const playerScoresList = playerScores[playerId] || [];
    return playerScoresList.reduce((total, hole) => {
      return total + (hole.score !== undefined ? hole.score : 0);
    }, 0);
  };

  // Get relative to par for a player
  const getPlayerRelativeToPar = (playerId: string): string => {
    const total = getPlayerTotal(playerId);

    // Calculate total par for all holes with scores
    let totalPar = 0;
    let holesWithScores = 0;

    playerScores[playerId]?.forEach((hole) => {
      if (hole.score !== undefined) {
        totalPar += hole.par || holePar || 4;
        holesWithScores++;
      }
    });

    if (holesWithScores === 0) return "E";

    const diff = total - totalPar;
    if (diff === 0) return "E";
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  // Get the hole par value, which might vary depending on the hole
  const getHolePar = (): number => {
    // Try to get hole-specific par if available
    const anyPlayerWithPar = Object.values(playerScores).find(
      (scores) => scores && scores[currentHole - 1]?.par !== undefined
    );

    if (anyPlayerWithPar && anyPlayerWithPar[currentHole - 1]?.par) {
      return anyPlayerWithPar[currentHole - 1].par!;
    }

    // Fallback to the provided general hole par
    return holePar || 4;
  };

  const currentHolePar = getHolePar();

  const handleDialogClose = () => {
    // Make sure we pass back the current hole when closing
    console.log(`Dialog closing, updating parent with hole: ${currentHole}`);
    onHoleChange(currentHole);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#ffffff",
          color: "#000000",
          borderRadius: { xs: 0, sm: 2 },
          position: { xs: "fixed", sm: "relative" },
          top: { xs: 0, sm: "auto" },
          left: { xs: 0, sm: "auto" },
          right: { xs: 0, sm: "auto" },
          bottom: { xs: 0, sm: "auto" },
          margin: { xs: 0, sm: undefined },
          maxHeight: { xs: "100vh", sm: "90vh" },
          width: { xs: "100%", sm: undefined },
          height: { xs: "100vh", sm: "auto" },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #eaeaea",
          px: 3,
          py: 2,
          textAlign: "center",
          color: "#000000",
          position: "relative",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Hole {currentHole}
        </Typography>
        {currentHolePar && (
          <Chip
            label={`Par ${currentHolePar}`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        )}
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#000000",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          px: 3,
          py: 3,
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Box sx={{ mb: 2, mt: 1 }}>
          {players.map((player, index) => {
            const playerScore = scores[player.id] || currentHolePar || 4;
            const scoreStatus = getScoreStatus(playerScore);
            const relativeToPar = getPlayerRelativeToPar(player.id);
            const scoreToParColor = getScoreToParColor(
              relativeToPar === "E" ? 0 : parseInt(relativeToPar)
            );

            return (
              <React.Fragment key={player.id}>
                {index > 0 && <Divider sx={{ my: 3 }} />}

                <Box sx={{ mb: 2, mt: index === 0 ? 1 : 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={player.avatarUrl}
                        alt={player.name}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            lineHeight: 1.2,
                            fontSize: "1.1rem",
                          }}
                        >
                          {player.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: scoreToParColor,
                            fontWeight: "medium",
                            fontSize: "0.9rem",
                            mt: 0.5,
                          }}
                        >
                          {relativeToPar} to par
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 3,
                      px: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => handleDecrement(player.id)}
                      disabled={playerScore <= 1}
                      sx={{
                        bgcolor: "#f5f5f5",
                        color: "#000000",
                        borderRadius: 2,
                        width: 52,
                        height: 52,
                        "&:hover": {
                          bgcolor: "#e0e0e0",
                        },
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: "1.7rem" }} />
                    </IconButton>

                    <Box
                      sx={{
                        textAlign: "center",
                        minWidth: "120px",
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "2.5rem",
                        }}
                      >
                        {playerScore}
                      </Typography>
                      {scoreStatus.label && (
                        <Chip
                          label={scoreStatus.label}
                          size="small"
                          sx={{
                            color: "white",
                            bgcolor: scoreStatus.color,
                            fontWeight: "medium",
                            mt: 1,
                            fontSize: "0.85rem",
                            height: 24,
                          }}
                        />
                      )}
                    </Box>

                    <IconButton
                      onClick={() => handleIncrement(player.id)}
                      sx={{
                        bgcolor: "#f5f5f5",
                        color: "#000000",
                        borderRadius: 2,
                        width: 52,
                        height: 52,
                        "&:hover": {
                          bgcolor: "#e0e0e0",
                        },
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <AddIcon sx={{ fontSize: "1.7rem" }} />
                    </IconButton>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: "1px solid #eaeaea",
          px: 3,
          py: 3,
        }}
      >
        {/* TODO: Add a button to step back to previous hole. Should not call save when do so */}
        <Button
          onClick={handleSaveAndNext}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          endIcon={<NavigateNextIcon />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {currentHole < totalHoles ? "Save & Next Hole" : "Save & Finish"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScoreDialog;
