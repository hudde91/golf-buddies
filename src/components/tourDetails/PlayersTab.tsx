// components/tour/tabs/PlayersTab.tsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  alpha,
} from "@mui/material";
import { People as PeopleIcon } from "@mui/icons-material";
import { Tour } from "../../types/event";
import { EmptyState } from "../common/index";
import { useTourStyles } from "../../theme/hooks";

interface PlayersTabProps {
  tour: Tour;
}

const PlayersTab: React.FC<PlayersTabProps> = ({ tour }) => {
  const styles = useTourStyles();

  return (
    <Box sx={styles.tourTabPanel}>
      <Typography variant="h6" sx={styles.tourSectionTitle}>
        Tour Participants
      </Typography>

      {!tour.players || tour.players.length === 0 ? (
        <EmptyState
          icon={<PeopleIcon />}
          title="No Players Yet"
          description="Players will be added when they join tournaments in this tour."
        />
      ) : (
        <Grid container spacing={2}>
          {tour.players.map((player) => {
            const team = tour.teams?.find((t) => t.id === player.teamId);

            return (
              <Grid item xs={12} sm={6} md={4} key={player.id}>
                <Paper
                  sx={{
                    p: 2,
                    ...styles.tourContainer,
                    mb: 0,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.name}
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      {player.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={styles.tourTypography.title}>
                        {player.name}
                      </Typography>
                      {team && (
                        <Chip
                          label={team.name}
                          size="small"
                          sx={{
                            mt: 0.5,
                            backgroundColor: alpha(team.color, 0.2),
                            color: team.color,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default PlayersTab;
