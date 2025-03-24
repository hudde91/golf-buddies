import React from "react";
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Round, Player, HoleScore } from "../../../types/event";
import ParRow from "./ParRow";
import PlayerScoreRow from "./PlayerScoreRow";
import { useTournamentScorecardStyles } from "../../../theme/hooks";

interface ScorecardSectionProps {
  round: Round;
  players: Player[];
  section: { label: string; holes: number[] };
  sectionIndex: number;
  sectionsCount: number;
  isCreator: boolean;
  editingPlayerId: string | null;
  editScores: HoleScore[];
  onStartEdit: (playerId: string) => void;
  onCancelEdit: () => void;
  onSaveScores: () => void;
  onScoreChange: (holeIndex: number, value: string) => void;
}

const ScorecardSection: React.FC<ScorecardSectionProps> = ({
  round,
  players,
  section,
  sectionIndex,
  sectionsCount,
  isCreator,
  editingPlayerId,
  editScores,
  onStartEdit,
  onCancelEdit,
  onSaveScores,
  onScoreChange,
}) => {
  const styles = useTournamentScorecardStyles();

  return (
    <Box sx={styles.section.container}>
      <Typography variant="subtitle1" gutterBottom sx={styles.section.title}>
        {section.label}
      </Typography>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={styles.section.tableContainer}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...styles.tableHeaderCell,
                  minWidth: { xs: 100, sm: 150 },
                }}
              >
                Player
              </TableCell>
              {section.holes.map((holeNum) => (
                <TableCell
                  key={`hole-${holeNum}`}
                  align="center"
                  sx={{
                    ...styles.tableHeaderCell,
                    width: 50,
                  }}
                >
                  {holeNum}
                </TableCell>
              ))}
              <TableCell align="center" sx={styles.tableHeaderCell}>
                {section.label === "Holes" ? "Total" : "Sub"}
              </TableCell>
              {sectionIndex === sectionsCount - 1 && (
                <TableCell align="center" sx={styles.tableHeaderCell}>
                  Total
                </TableCell>
              )}
              {isCreator && (
                <TableCell
                  align="center"
                  sx={{
                    ...styles.tableHeaderCell,
                    minWidth: 100,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Par row (if available) */}
            {round.courseDetails?.par && (
              <ParRow
                round={round}
                section={section}
                sectionIndex={sectionIndex}
                sectionsCount={sectionsCount}
                isCreator={isCreator}
              />
            )}

            {/* Player Scores */}
            {players.map((player, playerIndex) => (
              <PlayerScoreRow
                key={`player-${player.id}`}
                player={player}
                round={round}
                section={section}
                sectionIndex={sectionIndex}
                sectionsCount={sectionsCount}
                playerIndex={playerIndex}
                isCreator={isCreator}
                editingPlayerId={editingPlayerId}
                editScores={editScores}
                onStartEdit={onStartEdit}
                onCancelEdit={onCancelEdit}
                onSaveScores={onSaveScores}
                onScoreChange={onScoreChange}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScorecardSection;
