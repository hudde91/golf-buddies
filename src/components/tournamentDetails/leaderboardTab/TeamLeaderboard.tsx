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

interface TeamLeaderboardProps {
  tournament: Tournament;
}

const TeamLeaderboard: React.FC<TeamLeaderboardProps> = ({ tournament }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Sort rounds by date
  const sortedRounds = [...tournament.rounds].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get leaderboard data
  const teamLeaderboard = tournamentService.getTeamLeaderboard(tournament.id);

  // Default sorting is by total (low to high for stroke play, high to low for match play)
  const isMatchPlay = tournament.rounds.some(
    (round) => round.format.includes("Match Play") || round.matchResults
  );

  // Sort based on format (in match play, higher scores are better)
  const sortedLeaderboard = isMatchPlay
    ? [...teamLeaderboard].sort((a, b) => b.total - a.total)
    : teamLeaderboard;

  if (teamLeaderboard.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
          Team Leaderboard
        </Typography>
        <Typography
          variant="body2"
          color={alpha(theme.palette.common.white, 0.7)}
          sx={{ textAlign: "center", p: 2 }}
        >
          No team data available. Create teams and assign players to see the
          team leaderboard.
        </Typography>
      </Box>
    );
  }

  // For mobile views, we might need to show fewer columns
  const displayRounds = isXsScreen
    ? [] // On very small screens, don't show individual rounds
    : isMobile && sortedRounds.length > 2
    ? sortedRounds.slice(-2) // On mobile show only last 2 rounds
    : sortedRounds;

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "white", mb: 2 }}>
        Team Leaderboard
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
                Team
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: alpha(theme.palette.common.white, 0.9),
                  borderBottomColor: alpha(theme.palette.common.white, 0.2),
                  bgcolor: alpha(theme.palette.common.black, 0.4),
                }}
              >
                Players
              </TableCell>

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
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLeaderboard.map((team, index) => {
              // Determine position (accounting for ties)
              let position = index + 1;
              if (
                index > 0 &&
                team.total === sortedLeaderboard[index - 1].total
              ) {
                position = parseInt(
                  sortedLeaderboard[index - 1].teamId.toString()
                );
              }

              return (
                <TableRow
                  key={`leaderboard-${team.teamId}`}
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
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          bgcolor: team.teamColor,
                        }}
                      >
                        {team.teamName[0].toUpperCase()}
                      </Avatar>
                      <Typography
                        sx={{ color: alpha(theme.palette.common.white, 0.9) }}
                      >
                        {team.teamName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      borderBottomColor: alpha(theme.palette.common.white, 0.1),
                      color: alpha(theme.palette.common.white, 0.9),
                    }}
                  >
                    {team.playerCount}
                  </TableCell>

                  {displayRounds.map((round) => (
                    <TableCell
                      key={`${team.teamId}-round-${round.id}`}
                      align="center"
                      sx={{
                        borderBottomColor: alpha(
                          theme.palette.common.white,
                          0.1
                        ),
                        color: alpha(theme.palette.common.white, 0.9),
                      }}
                    >
                      {team.roundTotals[round.id] || "-"}
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
                    {team.total || "-"}
                  </TableCell>
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

export default TeamLeaderboard;
