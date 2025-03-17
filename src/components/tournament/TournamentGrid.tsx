import React from "react";
import { Grid } from "@mui/material";
import { Tournament } from "../../types/tournament";
import TournamentCard from "./TournamentCard";
import TournamentEmptyState from "./TournamentEmptyState";

interface TournamentGridProps {
  tournaments: Tournament[];
  userId: string;
  onViewDetails: (tournamentId: string) => void;
  onCreateTournament: () => void;
}

const TournamentGrid: React.FC<TournamentGridProps> = ({
  tournaments,
  userId,
  onViewDetails,
  onCreateTournament,
}) => {
  if (tournaments.length === 0) {
    return <TournamentEmptyState onCreateTournament={onCreateTournament} />;
  }

  return (
    <Grid container spacing={3}>
      {tournaments.map((tournament) => (
        <Grid item xs={12} sm={6} md={4} key={tournament.id}>
          <TournamentCard
            tournament={tournament}
            userId={userId}
            onViewDetails={onViewDetails}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TournamentGrid;
