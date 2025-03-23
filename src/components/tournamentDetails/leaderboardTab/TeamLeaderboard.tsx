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
  useMediaQuery,
} from "@mui/material";
import { Tournament } from "../../../types/event";
import tournamentService from "../../../services/eventService";
import { useTournamentLeaderboardStyles } from "../../../theme/hooks";
import { useTheme } from "@mui/material";

interface TeamLeaderboardProps {
  tournament: Tournament;
}

const TeamLeaderboard: React.FC<TeamLeaderboardProps> = ({ tournament }) => {
  const styles = useTournamentLeaderboardStyles();
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
        <Typography
          variant="h6"
          gutterBottom
          sx={styles.leaderboardTypography.title}
        >
          Team Leaderboard
        </Typography>
        <Typography
          variant="body2"
          sx={styles.leaderboardTypography.noDataText}
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
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.leaderboardTypography.title}
      >
        Team Leaderboard
      </Typography>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={styles.tableContainer}
      >
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={styles.positionHeaderCell}>Pos</TableCell>
              <TableCell sx={styles.headerCell}>Team</TableCell>
              <TableCell align="center" sx={styles.headerCell}>
                Players
              </TableCell>

              {displayRounds.map((round) => (
                <TableCell
                  key={`round-${round.id}`}
                  align="center"
                  sx={styles.headerCell}
                >
                  {round.name}
                </TableCell>
              ))}

              <TableCell align="center" sx={styles.headerCell}>
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
                  sx={styles.getTableRowStyle(index)}
                >
                  <TableCell sx={styles.centeredDataCell}>
                    {position}
                    {index === 0 && tournament.status === "completed" && (
                      <Chip
                        label="Winner"
                        color="primary"
                        size="small"
                        sx={styles.winnerChip}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={styles.dataCell}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={styles.getTeamAvatar(team.teamColor)}>
                        {team.teamName[0].toUpperCase()}
                      </Avatar>
                      <Typography sx={styles.tournamentTypography.body}>
                        {team.teamName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center" sx={styles.dataCell}>
                    {team.playerCount}
                  </TableCell>

                  {displayRounds.map((round) => (
                    <TableCell
                      key={`${team.teamId}-round-${round.id}`}
                      align="center"
                      sx={styles.dataCell}
                    >
                      {team.roundTotals[round.id] || "-"}
                    </TableCell>
                  ))}

                  <TableCell
                    align="center"
                    sx={{
                      ...styles.dataCell,
                      fontWeight: "bold",
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
        <Typography variant="caption" sx={styles.mobileInfoText}>
          {isXsScreen
            ? "Individual round scores are hidden on small screens. View on a larger screen to see all rounds."
            : `Showing only the last ${displayRounds.length} rounds. View on a larger screen to see all rounds.`}
        </Typography>
      )}
    </Box>
  );
};

export default TeamLeaderboard;
