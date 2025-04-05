import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import {
  Add as AddIcon,
  GolfCourse as TournamentIcon,
} from "@mui/icons-material";
import { Tour, Tournament } from "../../types/event";
import TournamentCard from "./TournamentCard";
import { useStyles } from "../../styles/hooks/useStyles";

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
  const styles = useStyles();

  return (
    <Box sx={styles.tabs.tourPanel}>
      <Box sx={styles.headers.tour.headerContainer}>
        <Typography variant="h6" sx={styles.headers.tour.sectionTitle}>
          Tournaments in this Tour
        </Typography>
        {isCreator && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={styles.button.primary}
            onClick={onAddTournament}
          >
            Add Tournament
          </Button>
        )}
      </Box>

      {tour.tournaments.length === 0 ? (
        <Box sx={styles.feedback.emptyState.container}>
          <TournamentIcon sx={styles.feedback.emptyState.icon} />
          <Typography variant="h6" sx={styles.feedback.emptyState.title}>
            No Tournaments Added Yet
          </Typography>
          <Typography sx={styles.feedback.emptyState.description}>
            Start by adding tournaments to your tour.
          </Typography>
          {isCreator && (
            <Button
              variant="contained"
              sx={styles.button.primary}
              onClick={onAddTournament}
            >
              Add First Tournament
            </Button>
          )}
        </Box>
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
