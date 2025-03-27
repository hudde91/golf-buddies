import React from "react";
import { Box, TextField } from "@mui/material";
import { getScoreClass } from "./scorecardUtils";
import { useTournamentScorecardStyles } from "../../../theme/hooks";

interface ScoreCellProps {
  holeIndex: number;
  score?: number;
  par?: number;
  isEditing: boolean;
  editScore?: number;
  onScoreChange?: (holeIndex: number, value: string) => void;
}

const ScoreCell: React.FC<ScoreCellProps> = ({
  holeIndex,
  score,
  par,
  isEditing,
  editScore,
  onScoreChange,
}) => {
  const styles = useTournamentScorecardStyles();
  const scoreClass = getScoreClass(score, par);

  if (isEditing) {
    return (
      <TextField
        type="number"
        value={editScore === undefined ? "" : editScore}
        onChange={(e) =>
          onScoreChange && onScoreChange(holeIndex, e.target.value)
        }
        InputProps={{
          inputProps: {
            min: 1,
            max: 15,
            style: styles.scoreCell.editFieldInput,
          },
          sx: styles.scoreCell.editField,
        }}
        variant="standard"
        size="small"
      />
    );
  }

  return (
    <Box sx={styles.scoreCell.getContainer(scoreClass)}>
      {score === undefined ? "-" : score}
    </Box>
  );
};

export default ScoreCell;
