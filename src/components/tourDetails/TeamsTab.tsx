// components/tour/tabs/TeamsTab.tsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  alpha,
} from "@mui/material";
import { Groups as TeamsIcon } from "@mui/icons-material";
import { Tour } from "../../types/event";
import { useTourStyles } from "../../theme/hooks";

interface TeamsTabProps {
  tour: Tour;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ tour }) => {
  const styles = useTourStyles();

  return (
    <Box sx={styles.tourTabPanel}>
      <Typography variant="h6" sx={styles.tourSectionTitle}>
        Tour Teams
      </Typography>

      <Grid container spacing={3}>
        {tour.teams?.map((team) => {
          const teamPlayers =
            tour.players?.filter((p) => p.teamId === team.id) || [];

          return (
            <Grid item xs={12} sm={6} md={4} key={team.id}>
              <Paper
                sx={{
                  ...styles.tourTeamCard,
                  border: `1px solid ${alpha(team.color, 0.2)}`,
                }}
              >
                <Box sx={styles.getTeamHeaderStyle(team.color)}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" sx={styles.tourTypography.title}>
                      {team.name}
                    </Typography>
                    <TeamsIcon sx={{ color: team.color }} />
                  </Box>
                </Box>

                <Box sx={{ p: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={styles.tourTypography.subtitle}
                    >
                      Team Members
                    </Typography>

                    {teamPlayers.length === 0 ? (
                      <Typography sx={styles.tourTypography.muted}>
                        No players assigned to this team
                      </Typography>
                    ) : (
                      <List dense disablePadding>
                        {teamPlayers.map((player) => (
                          <ListItem
                            key={player.id}
                            disablePadding
                            sx={{ mb: 1, px: 0, py: 0.5 }}
                          >
                            <ListItemAvatar sx={{ minWidth: 40 }}>
                              <Avatar
                                src={player.avatarUrl}
                                alt={player.name}
                                sx={{ width: 28, height: 28 }}
                              >
                                {player.name.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={player.name}
                              primaryTypographyProps={{
                                variant: "body2",
                                color: "white",
                                noWrap: true,
                              }}
                            />
                            {player.id === team.captain && (
                              <Chip
                                label="Captain"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.6rem",
                                  bgcolor: alpha(team.color, 0.2),
                                  color: team.color,
                                }}
                              />
                            )}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TeamsTab;
