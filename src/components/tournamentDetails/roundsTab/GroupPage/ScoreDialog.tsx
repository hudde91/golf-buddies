import React, { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { Player } from "../../../../types/event";
import { useStyles } from "../../../../styles/hooks/useStyles";

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
  const styles = useStyles();
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: styles.dialogs.paper }}
    >
      <DialogTitle sx={styles.dialogs.title}>
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
                      ? `2px solid ${"primary.main"}`
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
      <DialogContent sx={styles.dialogs.content}>
        <Box sx={{ mb: 1 }}>
          {/* Make selectedScore with this text displayed center and bigger */}
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
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${"divider"}`,
                  borderRadius: 2,
                  px: 1,
                }}
              >
                <IconButton
                  disabled={!selectedScore || selectedScore <= 1}
                  onClick={() =>
                    selectedScore && setSelectedScore(selectedScore - 1)
                  }
                  sx={styles.button.icon}
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
                  sx={styles.button.icon}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box> */}
            </Box>
          </Box>

          <Box
            sx={{
              // TODO: Display the scores in a grid with 3 columns
              // or come up with a better way to display the scores in order to not make it scrollable
              display: "flex",
              overflowX: "auto",
              py: 1,
              gap: 1,
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": {
                display: "none", // Chrome, Safari, Edge
              },
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
                      score === selectedScore ? "primary.main" : "divider"
                    }`,
                    bgcolor:
                      score === selectedScore
                        ? `${"primary.main"}10`
                        : scoreStatus.label
                        ? `${scoreStatus.color}10`
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor:
                        score === selectedScore
                          ? `${"primary.main"}20`
                          : `${"action.hover"}`,
                    },
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={score === selectedScore ? "bold" : "normal"}
                    color={score === selectedScore ? "primary.main" : "inherit"}
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
        sx={{
          ...styles.dialogs.actions,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* TODO: Should now save the selectedScore and also move on focus to select the score for the next person in the group.
          When it is the last person in the group, it should save the selectedScore and close the dialog.
        */}
        <Button
          onClick={handleSaveAndNext}
          variant="contained"
          color="primary"
          disabled={selectedScore === undefined || players.length <= 1}
          endIcon={<NavigateNextIcon />}
          sx={styles.button.primary}
        >
          Next
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={styles.button.outlined}
        >
          Cancel
        </Button>
        {/* TODO: Remove Save button and instead add functionality to Next button so save selectedScore */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={selectedScore === undefined}
            sx={styles.button.primary}
          >
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
export default ScoreDialog;
