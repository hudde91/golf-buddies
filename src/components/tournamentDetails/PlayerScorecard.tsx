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
} from "@mui/material";
import { Tournament, Player, Round } from "../../types/event";
import { useTournamentScorecardStyles } from "../../theme/hooks";
import {
  calculateSectionTotal,
  calculateTotal,
  formatScoreToPar,
  getScoreColor,
} from "./roundsTab/scorecardUtils";
import { getScoreClass } from "./roundsTab/scorecardUtils";

interface PlayerScorecardProps {
  player: Player;
  tournament: Tournament;
  showAllRounds?: boolean; // Optional prop to show all rounds or just first one
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
}) => {
  const theme = useTheme();
  const styles = useTournamentScorecardStyles();

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

  return (
    <Box>
      {showAllRounds && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">{player.name}'s Scorecard</Typography>

            {tournament.isTeamEvent && playerTeam && (
              <Chip
                label={playerTeam.name}
                size="small"
                sx={{
                  bgcolor: playerTeam.color || theme.palette.primary.main,
                  color: "#fff",
                  mt: 0.5,
                }}
              />
            )}
          </Box>

          {tournament.status === "completed" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 1, fontWeight: "bold" }}>
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

        return (
          <TabPanel key={round.id} value={selectedRound} index={roundIndex}>
            <Box>
              {showAllRounds && (
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {round.courseDetails?.name &&
                    `${round.courseDetails.name} - `}
                  {new Date(round.date).toLocaleDateString()}
                </Typography>
              )}

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
                        <TableCell sx={{ width: "100px", fontWeight: "bold" }}>
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
                        <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
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
                              <TableCell key={`par-${holeNum}`} align="center">
                                {holePar}
                              </TableCell>
                            );
                          })}

                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
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

                          return (
                            <TableCell
                              key={`score-${holeNum}`}
                              align="center"
                              sx={{ padding: "4px" }}
                            >
                              <Box
                                sx={{
                                  ...styles.scoreCell.getContainer(scoreClass),
                                  color: "#000",
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
