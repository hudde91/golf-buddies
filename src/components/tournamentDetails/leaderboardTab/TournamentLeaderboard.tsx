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

interface TournamentLeaderboardProps {
  tournament: Tournament;
}

const TournamentLeaderboard: React.FC<TournamentLeaderboardProps> = ({
  tournament,
}) => {
  const styles = useTournamentLeaderboardStyles();
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
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.leaderboardTypography.title}
      >
        Leaderboard
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
              <TableCell sx={styles.headerCell}>Player</TableCell>

              {!isXsScreen && tournament.isTeamEvent && (
                <TableCell sx={styles.headerCell}>Team</TableCell>
              )}

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

              {hasParInfo && totalPar > 0 && !isXsScreen && (
                <TableCell align="center" sx={styles.headerCell}>
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
                  ? styles.formatScoreToPar(player.total, totalPar)
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
                      <Avatar
                        src={playerObj?.avatarUrl}
                        alt={player.playerName}
                        sx={styles.getPlayerAvatar(playerTeam?.color)}
                      />
                      {player.playerName}
                      {isPlayerCaptain(player.playerId) && (
                        <Chip
                          label="Captain"
                          size="small"
                          sx={styles.captainChip}
                        />
                      )}
                    </Box>
                  </TableCell>

                  {!isXsScreen && tournament.isTeamEvent && (
                    <TableCell sx={styles.dataCell}>
                      {playerTeam ? (
                        <Chip
                          size="small"
                          label={playerTeam.name}
                          sx={styles.getTeamChip(playerTeam.color)}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={styles.leaderboardTypography.noTeamText}
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
                      sx={styles.dataCell}
                    >
                      {player.roundTotals[round.id] || "-"}
                    </TableCell>
                  ))}

                  <TableCell
                    align="center"
                    sx={{
                      ...styles.dataCell,
                      fontWeight: "bold",
                    }}
                  >
                    {styles.getScoreDisplay(player.total, index, leaderboard)}
                  </TableCell>

                  {hasParInfo && totalPar > 0 && !isXsScreen && (
                    <TableCell
                      align="center"
                      sx={{
                        ...styles.dataCell,
                        fontWeight: "bold",
                        color: vsPar
                          ? styles.getScoreVsParColor(vsPar)
                          : undefined,
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
        <Typography variant="caption" sx={styles.mobileInfoText}>
          {isXsScreen
            ? "Individual round scores are hidden on small screens. View on a larger screen to see all rounds."
            : `Showing only the last ${displayRounds.length} rounds. View on a larger screen to see all rounds.`}
        </Typography>
      )}
    </Box>
  );
};

export default TournamentLeaderboard;
