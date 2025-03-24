// components/tour/tabs/LeaderboardTab.tsx
import React from "react";
import { Box, Grid, Typography, useTheme, alpha } from "@mui/material";
import { Leaderboard as LeaderboardIcon } from "@mui/icons-material";
import { Tour } from "../../../types/event";
import { EmptyState, SectionHeader } from "../../common/index";
import { GlassCard, CardHeader, ProgressBar, MobileOnly } from "../../ui";

interface LeaderboardTabProps {
  tour: Tour;
  leaderboard: any[];
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  tour,
  leaderboard,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <SectionHeader title="Tour Leaderboard" />

      {leaderboard.length === 0 ? (
        <EmptyState
          icon={<LeaderboardIcon />}
          title="No Leaderboard Data Available"
          description="Leaderboard data will appear when tournaments have been completed."
        />
      ) : (
        <GlassCard>
          <CardHeader
            title="Player Rankings"
            icon={
              <LeaderboardIcon sx={{ color: theme.palette.primary.main }} />
            }
          />

          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            }}
          >
            <Grid
              container
              sx={{ fontWeight: "bold", color: theme.palette.common.white }}
            >
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

            return (
              <Box
                key={player.playerId}
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.common.white,
                    0.1
                  )}`,
                  "&:last-child": { borderBottom: "none" },
                  bgcolor:
                    index === 0
                      ? alpha(theme.palette.warning.main, 0.1)
                      : index === 1
                      ? alpha(theme.palette.grey[300], 0.05)
                      : index === 2
                      ? alpha(theme.palette.brown[300], 0.05)
                      : "transparent",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.common.white, 0.05),
                  },
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={1} sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color:
                          index < 3
                            ? [
                                theme.palette.warning.main,
                                theme.palette.grey[400],
                                theme.palette.brown[300],
                              ][index]
                            : theme.palette.common.white,
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} sm={3}>
                    <Typography
                      sx={{
                        color: theme.palette.common.white,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {player.playerName}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} sm={2}>
                    {player.teamName ? (
                      <Typography
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {player.teamName}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          color: alpha(theme.palette.common.white, 0.5),
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        No Team
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={4} sm={3}>
                    <Typography sx={{ color: theme.palette.common.white }}>
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
                      <MobileOnly sx={{ flex: 1, mr: 2 }}>
                        <ProgressBar
                          value={
                            (player.totalPoints /
                              (leaderboard[0]?.totalPoints || 1)) *
                            100
                          }
                          color={
                            index === 0 ? theme.palette.warning.main : undefined
                          }
                        />
                      </MobileOnly>
                      <Typography
                        variant="h6"
                        sx={{
                          color: theme.palette.common.white,
                          fontWeight: "bold",
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
        </GlassCard>
      )}
    </Box>
  );
};

export default LeaderboardTab;
