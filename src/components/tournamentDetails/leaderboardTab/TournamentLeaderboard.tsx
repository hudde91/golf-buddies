import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Avatar,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { Tournament } from "../../../types/tournament";
import tournamentService from "../../../services/tournamentService";

interface TournamentLeaderboardProps {
  tournament: Tournament;
}

const TournamentLeaderboard: React.FC<TournamentLeaderboardProps> = ({
  tournament,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Sort rounds by date
  const sortedRounds = [...tournament.rounds].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get leaderboard data
  const leaderboard = tournamentService.getTournamentLeaderboard(tournament.id);

  // Calculate relative to par if available
  const hasParInfo = tournament.rounds.some(
    (round) => round.courseDetails?.par !== undefined
  );

  // Calculate total par for the tournament
  const totalPar = tournament.rounds.reduce((total, round) => {
    return total + (round.courseDetails?.par || 0);
  }, 0);

  // Helper to format score relative to par
  const formatScoreToPar = (score: number, par: number): string => {
    const diff = score - par;
    if (diff === 0) return "E";
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  const getScoreDisplay = (score: number, index: number) => {
    // For the first place player, or if there's no par info
    if (index === 0 || !hasParInfo || totalPar === 0) {
      return score.toString();
    }

    // For other players, show the difference from the leader
    const leaderScore = leaderboard[0].total;
    const diff = score - leaderScore;

    if (diff === 0) return score.toString();
    return `${score} (+${diff})`;
  };

  // For mobile views, we might need to show fewer columns
  const displayRounds = isXsScreen
    ? [] // On very small screens, don't show individual rounds
    : isMobile && sortedRounds.length > 2
    ? sortedRounds.slice(-2) // On mobile show only last 2 rounds
    : sortedRounds;

  // Helper function to check if a player is a captain
  const isPlayerCaptain = (playerId: string) => {
    if (!tournament) return false;
    return tournament.teams.some((team) => team.captain === playerId);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "white", mb: 2 }}>
        Leaderboard
      </Typography>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          overflowX: "auto",
          bgcolor: "transparent",
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          borderRadius: 1,
          boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.3)}`,
        }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: 50,
                  color: alpha(theme.palette.common.white, 0.9),
                  borderBottomColor: alpha(theme.palette.common.white, 0.2),
                  bgcolor: alpha(theme.palette.common.black, 0.4),
                }}
              >
                Pos
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: alpha(theme.palette.common.white, 0.9),
                  borderBottomColor: alpha(theme.palette.common.white, 0.2),
                  bgcolor: alpha(theme.palette.common.black, 0.4),
                }}
              >
                Player
              </TableCell>

              {!isXsScreen && tournament.isTeamEvent && (
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: alpha(theme.palette.common.white, 0.9),
                    borderBottomColor: alpha(theme.palette.common.white, 0.2),
                    bgcolor: alpha(theme.palette.common.black, 0.4),
                  }}
                >
                  Team
                </TableCell>
              )}

              {displayRounds.map((round) => (
                <TableCell
                  key={`round-${round.id}`}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: alpha(theme.palette.common.white, 0.9),
                    borderBottomColor: alpha(theme.palette.common.white, 0.2),
                    bgcolor: alpha(theme.palette.common.black, 0.4),
                  }}
                >
                  {round.name}
                </TableCell>
              ))}

              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: alpha(theme.palette.common.white, 0.9),
                  borderBottomColor: alpha(theme.palette.common.white, 0.2),
                  bgcolor: alpha(theme.palette.common.black, 0.4),
                }}
              >
                Total
              </TableCell>

              {hasParInfo && totalPar > 0 && !isXsScreen && (
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: alpha(theme.palette.common.white, 0.9),
                    borderBottomColor: alpha(theme.palette.common.white, 0.2),
                    bgcolor: alpha(theme.palette.common.black, 0.4),
                  }}
                >
                  vs Par
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((player, index) => {
              // Determine position (accounting for ties)
              let position = index + 1;
              if (index > 0 && player.total === leaderboard[index - 1].total) {
                position = parseInt(leaderboard[index - 1].playerId.toString());
              }

              const vsPar =
                hasParInfo && totalPar > 0
                  ? formatScoreToPar(player.total, totalPar)
                  : null;

              const playerObj = tournament.players.find(
                (p) => p.id === player.playerId
              );
              const playerTeam = playerObj?.teamId
                ? tournament.teams.find((t) => t.id === playerObj.teamId)
                : null;

              return (
                <TableRow
                  key={`leaderboard-${player.playerId}`}
                  sx={{
                    bgcolor:
                      index % 2 === 0
                        ? alpha(theme.palette.common.black, 0.1)
                        : "transparent",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: alpha(theme.palette.common.white, 0.1),
                      color: alpha(theme.palette.common.white, 0.9),
                      textAlign: "center",
                    }}
                  >
                    {position}
                    {index === 0 && tournament.status === "completed" && (
                      <Chip
                        label="Winner"
                        color="primary"
                        size="small"
                        sx={{ ml: 1, height: 20, fontSize: "0.6rem" }}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: alpha(theme.palette.common.white, 0.1),
                      color: alpha(theme.palette.common.white, 0.9),
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={playerObj?.avatarUrl}
                        alt={player.playerName}
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          border: playerTeam
                            ? `1px solid ${playerTeam.color}`
                            : `1px solid ${alpha(
                                theme.palette.common.white,
                                0.2
                              )}`,
                        }}
                      />
                      {player.playerName}
                      {isPlayerCaptain(player.playerId) && (
                        <Chip
                          label="Captain"
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: "0.6rem",
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.light,
                            border: `1px solid ${alpha(
                              theme.palette.success.light,
                              0.3
                            )}`,
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  {!isXsScreen && tournament.isTeamEvent && (
                    <TableCell
                      sx={{
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.1
                        ),
                        color: alpha(theme.palette.common.white, 0.9),
                      }}
                    >
                      {playerTeam ? (
                        <Chip
                          size="small"
                          label={playerTeam.name}
                          sx={{
                            bgcolor: alpha(playerTeam.color, 0.2),
                            color: playerTeam.color,
                            border: `1px solid ${alpha(playerTeam.color, 0.5)}`,
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: alpha(theme.palette.common.white, 0.5) }}
                        >
                          No team
                        </Typography>
                      )}
                    </TableCell>
                  )}

                  {displayRounds.map((round) => (
                    <TableCell
                      key={`${player.playerId}-round-${round.id}`}
                      align="center"
                      sx={{
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.1
                        ),
                        color: alpha(theme.palette.common.white, 0.9),
                      }}
                    >
                      {player.roundTotals[round.id] || "-"}
                    </TableCell>
                  ))}

                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      borderBottomColor: alpha(theme.palette.common.white, 0.1),
                      color: alpha(theme.palette.common.white, 0.9),
                    }}
                  >
                    {getScoreDisplay(player.total, index)}
                  </TableCell>

                  {hasParInfo && totalPar > 0 && !isXsScreen && (
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.1
                        ),
                        color: vsPar?.startsWith("+")
                          ? theme.palette.error.light
                          : vsPar?.startsWith("-")
                          ? theme.palette.success.light
                          : alpha(theme.palette.common.white, 0.9),
                      }}
                    >
                      {vsPar}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {isMobile && sortedRounds.length > 2 && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1,
            color: alpha(theme.palette.common.white, 0.7),
          }}
        >
          {isXsScreen
            ? "Individual round scores are hidden on small screens. View on a larger screen to see all rounds."
            : `Showing only the last ${displayRounds.length} rounds. View on a larger screen to see all rounds.`}
        </Typography>
      )}
    </Box>
  );
};

export default TournamentLeaderboard;
