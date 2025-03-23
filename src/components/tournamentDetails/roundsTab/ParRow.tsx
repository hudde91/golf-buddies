import React from "react";
import { TableRow, TableCell, Typography } from "@mui/material";
import { Round } from "../../../types/event";
import { calculateParTotal } from "./scorecardUtils";
import { useTournamentScorecardStyles } from "../../../theme/hooks";

interface ParRowProps {
  round: Round;
  section: { label: string; holes: number[] };
  sectionIndex: number;
  sectionsCount: number;
  isCreator: boolean;
}

const ParRow: React.FC<ParRowProps> = ({
  round,
  section,
  sectionIndex,
  sectionsCount,
  isCreator,
}) => {
  const styles = useTournamentScorecardStyles();
  const totalPar = calculateParTotal(round);

  if (!round.courseDetails?.par) return null;

  return (
    <TableRow>
      <TableCell component="th" scope="row" sx={styles.parRow.cell}>
        <Typography variant="body2" fontWeight="bold" sx={styles.parRow.text}>
          Par
        </Typography>
      </TableCell>

      {section.holes.map((holeNum) => {
        const holeIndex = holeNum - 1;
        const parValue =
          round.scores[Object.keys(round.scores)[0]]?.[holeIndex]?.par ||
          Math.floor(round.courseDetails!.par! / round.courseDetails!.holes);

        return (
          <TableCell
            key={`par-hole-${holeNum}`}
            align="center"
            sx={styles.parRow.cell}
          >
            {parValue || "-"}
          </TableCell>
        );
      })}

      <TableCell
        align="center"
        sx={{
          ...styles.parRow.cell,
          fontWeight: "bold",
        }}
      >
        {Math.floor(totalPar / sectionsCount)}
      </TableCell>

      {sectionIndex === sectionsCount - 1 && (
        <TableCell
          align="center"
          sx={{
            ...styles.parRow.cell,
            fontWeight: "bold",
          }}
        >
          {totalPar}
        </TableCell>
      )}

      {isCreator && (
        <TableCell
          sx={{
            ...styles.parRow.cell,
            color: "transparent",
          }}
        />
      )}
    </TableRow>
  );
};

export default ParRow;
