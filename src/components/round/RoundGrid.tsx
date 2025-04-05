import React from "react";
import { Grid } from "@mui/material";
import { Round } from "../../types/event";
import RoundCard from "./RoundCard";
import RoundEmptyState from "./RoundEmptyState";
import { useStyles } from "../../styles/hooks/useStyles";

interface RoundGridProps {
  rounds: Round[];
  userId: string;
  onViewDetails: (roundId: string) => void;
  onCreateRound: () => void;
}

const RoundGrid: React.FC<RoundGridProps> = ({
  rounds,
  userId,
  onViewDetails,
  onCreateRound,
}) => {
  const styles = useStyles();

  if (rounds.length === 0) {
    return <RoundEmptyState onCreateRound={onCreateRound} />;
  }

  return (
    <Grid container spacing={3} sx={styles.layout.grid.responsive}>
      {rounds.map((round) => (
        <Grid item xs={12} sm={6} md={4} key={round.id}>
          <RoundCard
            round={round}
            userId={userId}
            onViewDetails={onViewDetails}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default RoundGrid;
