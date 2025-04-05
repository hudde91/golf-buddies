import React, { useState } from "react";
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
  Collapse,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Tournament } from "../../../types/event";
import tournamentService from "../../../services/eventService";
import { useStyles } from "../../../styles/hooks/useStyles";
import { useTheme } from "@mui/material";
import PlayerScorecard from "../PlayerScorecard";

interface TournamentLeaderboardProps {
  tournament: Tournament;
}

const TournamentLeaderboard: React.FC<TournamentLeaderboardProps> = ({
  tournament,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  const handleToggleExpand = (playerId: string) => {
    setExpandedPlayerId(expandedPlayerId === playerId ? null : playerId);
  };

  // Sort rounds by date
  const sortedRounds = [...tournament.rounds].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const leaderboard = tournamentService.getTournamentLeaderboard(tournament.id);

  // Calculate relative to par if available
  const hasParInfo = tournament.rounds.some(
    (round) => round.courseDetails?.par !== undefined
  );

  const totalPar = tournament.rounds.reduce((total, round) => {
    return total + (round.courseDetails?.par || 0);
  }, 0);

  // For mobile views, we might need to show fewer columns
  const displayRounds = isXsScreen
    ? [] // On very small screens, don't show individual rounds
    : isMobile && sortedRounds.length > 2
    ? sortedRounds.slice(-2) // On mobile show only last 2 rounds
    : sortedRounds;

  const isPlayerCaptain = (playerId: string) => {
    if (!tournament) return false;
    return tournament.teams.some((team) => team.captain === playerId);
  };

  // Calculate the number of columns in the table for the colspan
  const calculateColspan = () => {
    let count = 2; // Position and Player columns
    if (!isXsScreen && tournament.isTeamEvent) count++; // Team column
    count += displayRounds.length; // Round columns
    count++; // Total column
    if (hasParInfo && totalPar > 0 && !isXsScreen) count++; // vs Par column
    return count;
  };

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={styles.tournamentLeaderboard.leaderboardTypography.title}
      >
        Leaderboard
      </Typography>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={styles.tournamentLeaderboard.tableContainer}
      >
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tournamentLeaderboard.positionHeaderCell}>
                Pos
              </TableCell>
              <TableCell sx={styles.tournamentLeaderboard.headerCell}>
                Player
              </TableCell>

              {!isXsScreen && tournament.isTeamEvent && (
                <TableCell sx={styles.tournamentLeaderboard.headerCell}>
                  Team
                </TableCell>
              )}

              {displayRounds.map((round) => (
                <TableCell
                  key={`round-${round.id}`}
                  align="center"
                  sx={styles.tournamentLeaderboard.headerCell}
                >
                  {round.name}
                </TableCell>
              ))}

              <TableCell
                align="center"
                sx={styles.tournamentLeaderboard.headerCell}
              >
                Total
              </TableCell>

              {hasParInfo && totalPar > 0 && !isXsScreen && (
                <TableCell
                  align="center"
                  sx={styles.tournamentLeaderboard.headerCell}
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
                  ? styles.tournamentLeaderboard.formatScoreToPar(
                      player.total,
                      totalPar
                    )
                  : null;

              const playerObj = tournament.players.find(
                (p) => p.id === player.playerId
              );
              const playerTeam = playerObj?.teamId
                ? tournament.teams.find((t) => t.id === playerObj.teamId)
                : null;

              const isExpanded = expandedPlayerId === player.playerId;

              return (
                <React.Fragment key={`leaderboard-${player.playerId}`}>
                  <TableRow
                    sx={{
                      ...styles.tournamentLeaderboard.getTableRowStyle(index),
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => handleToggleExpand(player.playerId)}
                  >
                    <TableCell
                      sx={styles.tournamentLeaderboard.centeredDataCell}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(player.playerId);
                          }}
                          sx={{ mr: 1 }}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                        <Box component="span">
                          {position}
                          {index === 0 && tournament.status === "completed" && (
                            <Chip
                              label="Winner"
                              color="primary"
                              size="small"
                              sx={styles.tournamentLeaderboard.winnerChip}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={styles.tournamentLeaderboard.dataCell}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={playerObj?.avatarUrl}
                          alt={player.playerName}
                          sx={styles.tournamentLeaderboard.getPlayerAvatar(
                            playerTeam?.color
                          )}
                        />
                        {player.playerName}
                        {isPlayerCaptain(player.playerId) && (
                          <Chip
                            label="Captain"
                            size="small"
                            sx={styles.tournamentLeaderboard.captainChip}
                          />
                        )}
                      </Box>
                    </TableCell>

                    {!isXsScreen && tournament.isTeamEvent && (
                      <TableCell sx={styles.tournamentLeaderboard.dataCell}>
                        {playerTeam ? (
                          <Chip
                            size="small"
                            label={playerTeam.name}
                            sx={styles.tournamentLeaderboard.getTeamChip(
                              playerTeam.color
                            )}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={
                              styles.tournamentLeaderboard.leaderboardTypography
                                .noTeamText
                            }
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
                        sx={styles.tournamentLeaderboard.dataCell}
                      >
                        {player.roundTotals[round.id] || "-"}
                      </TableCell>
                    ))}

                    <TableCell
                      align="center"
                      sx={{
                        ...styles.tournamentLeaderboard.dataCell,
                        fontWeight: "bold",
                      }}
                    >
                      {styles.tournamentLeaderboard.getScoreDisplay(
                        player.total,
                        index,
                        leaderboard
                      )}
                    </TableCell>

                    {hasParInfo && totalPar > 0 && !isXsScreen && (
                      <TableCell
                        align="center"
                        sx={{
                          ...styles.tournamentLeaderboard.dataCell,
                          fontWeight: "bold",
                          color: vsPar
                            ? styles.tournamentLeaderboard.getScoreVsParColor(
                                vsPar
                              )
                            : undefined,
                        }}
                      >
                        {vsPar}
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell
                      colSpan={calculateColspan()}
                      sx={{
                        padding: 0,
                        borderBottom: isExpanded
                          ? "1px solid rgba(224, 224, 224, 1)"
                          : "none",
                      }}
                    >
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box
                          sx={{
                            margin: 2,
                            padding: 2,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: "8px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                          }}
                        >
                          {playerObj && (
                            <PlayerScorecard
                              player={playerObj}
                              tournament={tournament}
                            />
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {isMobile && sortedRounds.length > 2 && (
        <Typography
          variant="caption"
          sx={styles.tournamentLeaderboard.mobileInfoText}
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
