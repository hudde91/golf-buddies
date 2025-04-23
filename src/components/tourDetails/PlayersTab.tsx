import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { People as PeopleIcon } from "@mui/icons-material";
import { Player, Tour } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import SharedPlayerCard from "../SharedPlayerCard";
import PlayerProfileDialog from "../players/PlayerProfileDialog";

interface PlayersTabProps {
  tour: Tour;
}

const PlayersTab: React.FC<PlayersTabProps> = ({ tour }) => {
  const styles = useStyles();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setProfileDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setProfileDialogOpen(false);
  };

  return (
    <Box sx={styles.tabs.panel}>
      <Typography variant="h6" sx={styles.headers.tour.sectionTitle}>
        Tour Participants
      </Typography>

      {!tour.players || tour.players.length === 0 ? (
        <Box sx={styles.feedback.emptyState.container}>
          <PeopleIcon sx={styles.feedback.emptyState.icon} />
          <Typography variant="h6" sx={styles.feedback.emptyState.title}>
            No Players Yet
          </Typography>
          <Typography sx={styles.feedback.emptyState.description}>
            Players will be added when they join tournaments in this tour.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {tour.players.map((player) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={player.id}>
                <SharedPlayerCard
                  player={player}
                  event={tour}
                  onClick={handlePlayerClick}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
      <PlayerProfileDialog
        open={profileDialogOpen}
        player={selectedPlayer}
        event={{
          ...tour,
          startDate: tour.startDate,
          endDate: tour.endDate,
          // rounds: [],
          // location: "",
          // format: "",
          players: tour.players || [],
          teams: tour.teams || [],
          // invitations: [],
          // isTeamEvent: true,
          // scoringType: "individual",
          // status: tour.status || "active",
        }}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default PlayersTab;
