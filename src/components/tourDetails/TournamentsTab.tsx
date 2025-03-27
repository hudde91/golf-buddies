import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import {
  Add as AddIcon,
  GolfCourse as TournamentIcon,
} from "@mui/icons-material";
import { Tour, Tournament } from "../../types/event";
import { EmptyState } from "../common/index";
import TournamentCard from "./TournamentCard";
import { useTourStyles } from "../../theme/hooks";

interface TournamentsTabProps {
  tour: Tour;
  isCreator: boolean;
  onAddTournament: () => void;
  navigateToTournament: (tournamentId: string) => void;
}

const TournamentsTab: React.FC<TournamentsTabProps> = ({
  tour,
  isCreator,
  onAddTournament,
  navigateToTournament,
}) => {
  const styles = useTourStyles();

  return (
    <Box sx={styles.tourTabPanel}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={styles.tourSectionTitle}>
          Tournaments in this Tour
        </Typography>
        {isCreator && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddTournament}
          >
            Add Tournament
          </Button>
        )}
      </Box>

      {tour.tournaments.length === 0 ? (
        <EmptyState
          icon={<TournamentIcon />}
          title="No Tournaments Added Yet"
          description="Start by adding tournaments to your tour."
          buttonText={isCreator ? "Add First Tournament" : undefined}
          onButtonClick={isCreator ? onAddTournament : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {tour.tournaments.map((tournament: Tournament) => (
            <Grid item xs={12} sm={6} md={4} key={tournament.id}>
              <TournamentCard
                tournament={tournament}
                onViewTournament={() => navigateToTournament(tournament.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TournamentsTab;
