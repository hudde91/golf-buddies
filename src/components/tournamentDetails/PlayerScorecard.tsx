import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { Tournament, Player, Round } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import {
  calculateSectionTotal,
  calculateTotal,
  formatScoreToPar,
  getScoreColor,
  getScoreClass,
} from "./roundsTab/scorecardUtils";

interface PlayerScorecardProps {
  player: Player;
  tournament: Tournament;
  showAllRounds?: boolean; // Optional prop to show all rounds or just first one
  currentPlayingHole?: number; // Optional prop to highlight the current hole being played
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`round-tabpanel-${index}`}
      aria-labelledby={`round-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `round-tab-${index}`,
    "aria-controls": `round-tabpanel-${index}`,
  };
};

const PlayerScorecard: React.FC<PlayerScorecardProps> = ({
  player,
  tournament,
  showAllRounds = true, // Default to showing all rounds
  currentPlayingHole,
}) => {
  const theme = useTheme();
  const styles = useStyles();

  // Sort rounds by date for consistent tab order
  const sortedRounds = [...tournament.rounds].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // If showAllRounds is false, only show the first round
  const displayRounds = showAllRounds ? sortedRounds : [sortedRounds[0]];

  const [selectedRound, setSelectedRound] = useState(0);

  const handleRoundChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedRound(newValue);
  };

  // Calculate tournament totals for the player
  const tournamentTotal = sortedRounds.reduce((total, round) => {
    const roundTotal = calculateTotal(player.id, round);
    return total + roundTotal;
  }, 0);

  const playerTeam = player.teamId
    ? tournament.teams.find((t) => t.id === player.teamId)
    : null;

  const getRoundSections = (round: Round) => {
    const holeCount = round.courseDetails?.holes || 18;
    if (holeCount === 9) {
      return [
        { label: "Front 9", holes: Array.from({ length: 9 }, (_, i) => i + 1) },
      ];
    } else {
      return [
        { label: "Front 9", holes: Array.from({ length: 9 }, (_, i) => i + 1) },
        { label: "Back 9", holes: Array.from({ length: 9 }, (_, i) => i + 10) },
      ];
    }
  };

  // Calculate total par for the tournament
  const totalTournamentPar = tournament.rounds.reduce((total, round) => {
    return total + (round.courseDetails?.par || 0);
  }, 0);

  // Function to determine if a hole needs highlighting (is being played)
  const isCurrentlyPlayingHole = (holeNum: number): boolean => {
    if (!currentPlayingHole) return false;
    return holeNum === currentPlayingHole;
  };

  // Function to determine the first hole that has no score
  const findFirstUnscoredHole = (round: Round): number | null => {
    const playerScores = round.scores[player.id] || [];

    for (let i = 0; i < playerScores.length; i++) {
      if (playerScores[i]?.score === undefined) {
        return i + 1; // Return 1-based hole number
      }
    }

    // If all holes have scores, check if we have less scores than holes
    const totalHoles = round.courseDetails?.holes || 18;
    if (playerScores.length < totalHoles) {
      return playerScores.length + 1;
    }

    return null; // All holes scored
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch", // For momentum scrolling on iOS
      }}
    >
      {/* Scorecard header with scrollable container */}
      {showAllRounds && (
        <Box
          sx={{
            maxWidth: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <Typography variant="h6">Scorecard</Typography>

            {tournament.isTeamEvent && playerTeam && (
              <Chip
                label={playerTeam.name}
                size="small"
                sx={styles.chips.team(playerTeam.color || "primary.main")}
              />
            )}
          </Box>

          {tournament.status === "completed" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 2,
                flexShrink: 0,
              }}
            >
              <Typography
                variant="body1"
                sx={{ mr: 1, fontWeight: "bold", whiteSpace: "nowrap" }}
              >
                Tournament Total: {tournamentTotal}
              </Typography>

              {totalTournamentPar > 0 && (
                <Chip
                  label={formatScoreToPar(tournamentTotal, totalTournamentPar)}
                  color={
                    tournamentTotal <= totalTournamentPar
                      ? "success"
                      : "default"
                  }
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>
      )}
      {displayRounds.length > 1 && (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedRound}
            onChange={handleRoundChange}
            aria-label="Round tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={styles.tabs.container}
          >
            {displayRounds.map((round, index) => (
              <Tab
                key={round.id}
                label={round.name || `Round ${index + 1}`}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>
      )}
      {displayRounds.map((round, roundIndex) => {
        const sections = getRoundSections(round);
        const firstUnscoredHole = findFirstUnscoredHole(round);

        return (
          <TabPanel key={round.id} value={selectedRound} index={roundIndex}>
            <Box
              sx={{
                maxWidth: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {showAllRounds && (
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {round.courseDetails?.name &&
                    `${round.courseDetails.name} - `}
                  {new Date(round.date).toLocaleDateString()}
                </Typography>
              )}
              <Box sx={{ minWidth: { xs: "600px", md: "auto" } }}>
                {sections.map((section, sectionIndex) => (
                  <TableContainer
                    key={`section-${sectionIndex}`}
                    component={Paper}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ width: "100px", fontWeight: "bold" }}
                          >
                            {section.label}
                          </TableCell>

                          {section.holes.map((holeNum) => (
                            <TableCell
                              key={`hole-${holeNum}`}
                              align="center"
                              sx={{ width: "40px", fontWeight: "bold" }}
                            >
                              {holeNum}
                            </TableCell>
                          ))}

                          <TableCell
                            align="center"
                            sx={{ width: "60px", fontWeight: "bold" }}
                          >
                            {sectionIndex === 0 ? "Subtotal" : "Total"}
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {round.courseDetails?.par && (
                          <TableRow
                            sx={{ bgcolor: theme.palette.action.hover }}
                          >
                            <TableCell sx={{ fontWeight: "medium" }}>
                              Par
                            </TableCell>

                            {section.holes.map((holeNum) => {
                              const holeIndex = holeNum - 1;
                              const holePar =
                                round.scores[Object.keys(round.scores)[0]]?.[
                                  holeIndex
                                ]?.par ||
                                (round.courseDetails?.par
                                  ? Math.floor(round.courseDetails.par / 18)
                                  : "-");

                              return (
                                <TableCell
                                  key={`par-${holeNum}`}
                                  align="center"
                                >
                                  {holePar}
                                </TableCell>
                              );
                            })}

                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {section.holes.length *
                                (round.courseDetails?.par
                                  ? Math.floor(round.courseDetails.par / 18)
                                  : 0)}
                            </TableCell>
                          </TableRow>
                        )}

                        <TableRow>
                          <TableCell sx={{ fontWeight: "medium" }}>
                            Score
                          </TableCell>

                          {section.holes.map((holeNum) => {
                            const holeIndex = holeNum - 1;
                            const holeScore =
                              round.scores[player.id]?.[holeIndex];
                            const score = holeScore?.score;
                            // Use standard par value from course details or specific hole par if available
                            const holePar =
                              holeScore?.par ||
                              (round.courseDetails?.par
                                ? Math.floor(round.courseDetails.par / 18)
                                : undefined);
                            const scoreClass = getScoreClass(score, holePar);

                            // Check if this is the current playing hole
                            const isCurrentHole =
                              isCurrentlyPlayingHole(holeNum) ||
                              holeNum === firstUnscoredHole ||
                              holeNum === currentPlayingHole;

                            return (
                              <TableCell
                                key={`score-${holeNum}`}
                                align="center"
                                sx={{
                                  padding: "4px",
                                  position: "relative",
                                  backgroundColor: isCurrentHole
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : "inherit",
                                }}
                              >
                                {/* TODO: Instead of highlighting isCurrentHole like this, wrap the whole hole, (the hole number, the par value and the score value) */}
                                {isCurrentHole && (
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      height: "3px",
                                      backgroundColor:
                                        theme.palette.primary.main,
                                    }}
                                  />
                                )}
                                <Box
                                  sx={{
                                    ...styles.tournamentScorecard.scoreCell.container(
                                      theme,
                                      scoreClass
                                    ),
                                    border: isCurrentHole
                                      ? `2px solid ${theme.palette.primary.main}`
                                      : undefined,
                                  }}
                                >
                                  {score === undefined ? "-" : score}
                                </Box>
                              </TableCell>
                            );
                          })}

                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            {calculateSectionTotal(
                              player.id,
                              round,
                              section.holes
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ))}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Typography variant="h6">
                  Round Total: {calculateTotal(player.id, round)}
                  {round.courseDetails?.par && (
                    <span
                      style={{
                        marginLeft: "8px",
                        color: getScoreColor(
                          calculateTotal(player.id, round),
                          round.courseDetails.par
                        ),
                      }}
                    >
                      (
                      {formatScoreToPar(
                        calculateTotal(player.id, round),
                        round.courseDetails.par
                      )}
                      )
                    </span>
                  )}
                </Typography>
              </Box>
            </Box>
          </TabPanel>
        );
      })}
      {showAllRounds &&
        sortedRounds.length > 0 &&
        tournament.status === "completed" && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: theme.palette.background.default,
              borderRadius: "4px",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Round Performance
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {sortedRounds.map((round, index) => {
                const roundTotal = calculateTotal(player.id, round);
                const roundPar = round.courseDetails?.par || 0;

                if (roundTotal === 0) return null;

                return (
                  <Chip
                    key={`stat-${round.id}`}
                    label={`${
                      round.name || `Round ${index + 1}`
                    }: ${roundTotal} ${
                      roundPar
                        ? `(${formatScoreToPar(roundTotal, roundPar)})`
                        : ""
                    }`}
                    variant="outlined"
                    sx={{
                      borderColor: roundPar
                        ? getScoreColor(roundTotal, roundPar)
                        : "inherit",
                      color: roundPar
                        ? getScoreColor(roundTotal, roundPar)
                        : "inherit",
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}
    </Box>
  );
};

export default PlayerScorecard;
