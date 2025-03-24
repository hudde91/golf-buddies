import React from "react";
import {
  TableRow,
  TableCell,
  Box,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { Round, Player, HoleScore } from "../../../types/event";
import ScoreCell from "./ScoreCell";
import { calculateSectionTotal, calculateTotal } from "./scorecardUtils";
import { useTournamentScorecardStyles } from "../../../theme/hooks";

interface PlayerScoreRowProps {
  player: Player;
  round: Round;
  section: { label: string; holes: number[] };
  sectionIndex: number;
  sectionsCount: number;
  playerIndex: number;
  isCreator: boolean;
  editingPlayerId: string | null;
  editScores: HoleScore[];
  onStartEdit: (playerId: string) => void;
  onCancelEdit: () => void;
  onSaveScores: () => void;
  onScoreChange: (holeIndex: number, value: string) => void;
}

const PlayerScoreRow: React.FC<PlayerScoreRowProps> = ({
  player,
  round,
  section,
  sectionIndex,
  sectionsCount,
  playerIndex,
  isCreator,
  editingPlayerId,
  editScores,
  onStartEdit,
  onCancelEdit,
  onSaveScores,
  onScoreChange,
}) => {
  const styles = useTournamentScorecardStyles();
  const playerScores = round.scores[player.id] || [];
  const sectionTotal = calculateSectionTotal(player.id, round, section.holes);
  const totalScore = calculateTotal(player.id, round);
  const isEditing = editingPlayerId === player.id;

  return (
    <TableRow sx={styles.playerScoreRow.getContainer(playerIndex)}>
      <TableCell component="th" scope="row" sx={styles.playerScoreRow.cell}>
        <Box sx={styles.playerScoreRow.nameCell}>
          <Avatar
            src={player.avatarUrl}
            alt={player.name}
            sx={styles.playerScoreRow.avatar}
          />
          <Typography variant="body2" sx={styles.playerScoreRow.playerName}>
            {player.name}
          </Typography>
        </Box>
      </TableCell>

      {section.holes.map((holeNum) => {
        const holeIndex = holeNum - 1;
        const holeScore = playerScores[holeIndex];

        return (
          <TableCell
            key={`player-${player.id}-hole-${holeNum}`}
            align="center"
            sx={{
              ...styles.playerScoreRow.cell,
              ...styles.playerScoreRow.scoreCell,
            }}
          >
            <ScoreCell
              playerId={player.id}
              holeIndex={holeIndex}
              score={holeScore?.score}
              par={holeScore?.par}
              isEditing={isEditing}
              editScore={isEditing ? editScores[holeIndex]?.score : undefined}
              onScoreChange={onScoreChange}
            />
          </TableCell>
        );
      })}

      <TableCell
        align="center"
        sx={{
          ...styles.playerScoreRow.cell,
          ...styles.playerScoreRow.totalCell,
        }}
      >
        {sectionTotal > 0 ? sectionTotal : "-"}
      </TableCell>

      {sectionIndex === sectionsCount - 1 && (
        <TableCell
          align="center"
          sx={{
            ...styles.playerScoreRow.cell,
            ...styles.playerScoreRow.totalCell,
          }}
        >
          {totalScore > 0 ? totalScore : "-"}
        </TableCell>
      )}

      {isCreator && (
        <TableCell align="center" sx={styles.playerScoreRow.cell}>
          {isEditing ? (
            <Box sx={styles.actionButtons.container}>
              <IconButton
                color="primary"
                size="small"
                onClick={onSaveScores}
                sx={styles.actionButtons.save}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="default"
                size="small"
                onClick={onCancelEdit}
                sx={styles.actionButtons.cancel}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <IconButton
              color="primary"
              size="small"
              onClick={() => onStartEdit(player.id)}
              sx={styles.actionButtons.edit}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

export default PlayerScoreRow;
