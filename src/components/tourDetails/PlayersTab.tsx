import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";
import { People as PeopleIcon } from "@mui/icons-material";
import { Tour } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";

interface PlayersTabProps {
  tour: Tour;
}

const PlayersTab: React.FC<PlayersTabProps> = ({ tour }) => {
  const styles = useStyles();

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
            const team = tour.teams?.find((t) => t.id === player.teamId);
            const teamColor = team?.color;

            return (
              <Grid item xs={12} sm={6} md={4} key={player.id}>
                <Card sx={styles.card.glass}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={player.avatarUrl}
                        alt={player.name}
                        sx={styles.avatars.player(teamColor)}
                      >
                        {player.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={styles.text.heading.card}>
                          {player.name}
                        </Typography>
                        {team && (
                          <Chip
                            label={team.name}
                            size="small"
                            sx={styles.chips.team(team.color)}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default PlayersTab;
