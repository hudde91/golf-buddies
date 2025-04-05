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
import { useStyles } from "../../styles/hooks/useStyles";

interface TeamsTabProps {
  tour: Tour;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ tour }) => {
  const styles = useStyles();

  return (
    <Box sx={styles.tabs.panel}>
      <Typography variant="h6" sx={styles.headers.tour.sectionTitle}>
        Tour Teams
      </Typography>

      <Grid container spacing={3}>
        {tour.teams?.map((team) => {
          const teamPlayers =
            tour.players?.filter((p) => p.teamId === team.id) || [];

          return (
            <Grid item xs={12} sm={6} md={4} key={team.id}>
              <Paper sx={styles.tour.teamCard}>
                <Box sx={styles.tour.getTeamHeader(team.color)}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" sx={styles.tour.typography.title}>
                      {team.name}
                    </Typography>
                    <TeamsIcon sx={{ color: team.color }} />
                  </Box>
                </Box>

                <Box sx={styles.tour.teamContent}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={styles.tour.typography.subtitle}
                    >
                      Team Members
                    </Typography>

                    {teamPlayers.length === 0 ? (
                      <Typography sx={styles.tour.typography.muted}>
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
