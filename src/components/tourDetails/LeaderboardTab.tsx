// components/tour/tabs/LeaderboardTab.tsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  alpha,
} from "@mui/material";
import { Leaderboard as LeaderboardIcon } from "@mui/icons-material";
import { Tour } from "../../types/event";
import { EmptyState } from "../common/index";
import { useTourStyles } from "../../theme/hooks";
import { useTheme } from "@mui/material";

interface LeaderboardTabProps {
  tour: Tour;
  leaderboard: any[];
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  tour,
  leaderboard,
}) => {
  const styles = useTourStyles();
  const theme = useTheme();

  return (
    <Box sx={styles.tourTabPanel}>
      <Typography variant="h6" sx={styles.tourSectionTitle}>
        Tour Leaderboard
      </Typography>

      {leaderboard.length === 0 ? (
        <EmptyState
          icon={<LeaderboardIcon />}
          title="No Leaderboard Data Available"
          description="Leaderboard data will appear when tournaments have been completed."
        />
      ) : (
        <Paper elevation={0} sx={styles.leaderboardTable}>
          <Box sx={styles.leaderboardHeader}>
            <Grid container>
              <Grid item xs={1} sx={{ textAlign: "center" }}>
                #
              </Grid>
              <Grid item xs={4} sm={3}>
                Player
              </Grid>
              <Grid item xs={3} sm={2}>
                Team
              </Grid>
              <Grid item xs={4} sm={3}>
                Tournaments
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
                Points
              </Grid>
            </Grid>
          </Box>

          {leaderboard.map((player, index) => {
            const tournamentCount = Object.keys(
              player.tournamentResults
            ).length;

            const medalStyle = styles.getMedalStyle(index);

            return (
              <Box
                key={player.playerId}
                sx={{
                  ...styles.tourPlayerItem,
                  bgcolor: medalStyle.bgcolor,
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={1} sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: medalStyle.color,
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
                        sx={styles.tourAvatar}
                      >
                        {player.playerName.charAt(0)}
                      </Avatar>
                      <Typography
                        sx={{
                          ...styles.tourTypography.body,
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
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          ),
                          color: theme.palette.primary.main,
                        }}
                      />
                    ) : (
                      <Typography sx={styles.tourTypography.muted}>
                        No Team
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <Typography sx={styles.tourTypography.body}>
                      {tournamentCount} / {tour.tournaments.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mt: { xs: 1, sm: 0 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          mr: 2,
                          display: { xs: "block", sm: "none" },
                        }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={
                            (player.totalPoints /
                              (leaderboard[0]?.totalPoints || 1)) *
                            100
                          }
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(
                              theme.palette.common.white,
                              0.1
                            ),
                            "& .MuiLinearProgress-bar": {
                              backgroundColor:
                                index === 0
                                  ? theme.palette.warning.main
                                  : theme.palette.primary.main,
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          ...styles.tourTypography.title,
                          textAlign: "right",
                        }}
                      >
                        {player.totalPoints}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

export default LeaderboardTab;
