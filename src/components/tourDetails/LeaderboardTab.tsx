import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  useTheme,
} from "@mui/material";
import { Leaderboard as LeaderboardIcon } from "@mui/icons-material";
import { Tour } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import TeamLeaderboardTab from "./TeamLeaderboardTab";

interface LeaderboardTabProps {
  tour: Tour;
  leaderboard: any[];
  teamLeaderboard: any[];
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  tour,
  leaderboard,
  teamLeaderboard,
}) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Box sx={styles.tabs.panel}>
      <Typography variant="h6" sx={styles.headers.tour.sectionTitle}>
        Tour Leaderboard
      </Typography>

      {leaderboard.length === 0 ? (
        <Box sx={styles.feedback.emptyState.container}>
          <LeaderboardIcon sx={styles.feedback.emptyState.icon} />
          <Typography variant="h6" sx={styles.feedback.emptyState.title}>
            No Leaderboard Data Available
          </Typography>
          <Typography sx={styles.feedback.emptyState.description}>
            Leaderboard data will appear when tournaments have been completed.
          </Typography>
        </Box>
      ) : (
        <Paper elevation={0} sx={styles.card.glass}>
          <Box sx={styles.tables.leaderboard.header}>
            <Grid container>
              <Grid item xs={1} sx={{ textAlign: "center" }}>
                <Typography sx={styles.text.body.secondary}>#</Typography>
              </Grid>
              <Grid item xs={4} sm={3}>
                <Typography sx={styles.text.body.secondary}>Player</Typography>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Typography sx={styles.text.body.secondary}>Team</Typography>
              </Grid>
              <Grid item xs={4} sm={3}>
                <Typography sx={styles.text.body.secondary}>
                  Tournaments
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                sx={{
                  textAlign: "right",
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography sx={styles.text.body.secondary}>Points</Typography>
              </Grid>
            </Grid>
          </Box>

          {leaderboard.map((player, index) => {
            const tournamentCount = Object.keys(
              player.tournamentResults
            ).length;

            const positionStyle = styles.getPositionStyle(index);

            return (
              <Box
                key={player.playerId}
                sx={{
                  ...styles.tables.leaderboard.row,
                  bgcolor: positionStyle.bgcolor,
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={1} sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: positionStyle.color,
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={player.avatarUrl}
                        alt={player.playerName}
                        sx={styles.avatars.leaderboard()}
                      >
                        {player.playerName.charAt(0)}
                      </Avatar>
                      <Typography
                        sx={{
                          ...styles.text.body.primary,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {player.playerName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3} sm={2}>
                    {player.teamName ? (
                      <Chip
                        label={player.teamName}
                        size="small"
                        sx={styles.chips.eventType.custom(
                          player.teamColor || theme.palette.primary.main
                        )}
                      />
                    ) : (
                      <Typography sx={styles.text.body.muted}>
                        No Team
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Typography sx={styles.text.body.primary}>
                      {tournamentCount} / {tour.tournaments.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mt: { xs: 1, sm: 0 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      {player.totalPoints}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Paper>
      )}
      <TeamLeaderboardTab teamLeaderboard={teamLeaderboard} />
    </Box>
  );
};

export default LeaderboardTab;
