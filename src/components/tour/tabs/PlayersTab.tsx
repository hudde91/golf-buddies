import React from "react";
import { Box, Grid } from "@mui/material";
import { People as PeopleIcon } from "@mui/icons-material";
import { Tour } from "../../../types/event";
import { EmptyState, SectionHeader } from "../../common/index";
import { GlassCard } from "../../ui";
import { PlayerRow } from "../../player";

interface PlayersTabProps {
  tour: Tour;
}

const PlayersTab: React.FC<PlayersTabProps> = ({ tour }) => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <SectionHeader title="Tour Participants" />

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
            const isCaptain = team?.captain === player.id;

            return (
              <Grid item xs={12} sm={6} md={4} key={player.id}>
                <GlassCard>
                  <PlayerRow
                    player={player}
                    team={
                      team
                        ? {
                            id: team.id,
                            name: team.name,
                            color: team.color,
                          }
                        : null
                    }
                    isCaptain={isCaptain}
                  />
                </GlassCard>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default PlayersTab;
