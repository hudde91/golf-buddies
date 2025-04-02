import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AddCircle as AddCircleIcon,
  Event as EventIcon,
  Delete as DeleteIcon,
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  GolfCourse as GolfCourseIcon,
} from "@mui/icons-material";
import { Tournament, PlayerGroup } from "../../../types/event";
import PlayerScoreEditor from "./GroupPage/PlayerScoreEditor";
import PlayerGroupManager from "./GroupPage/PlayerGroupManager";
import { useTournamentScorecardStyles } from "../../../theme/hooks";
import WeatherDisplay from "./WeatherDisplay";
import {
  fetchWeather,
  getInitialWeatherState,
} from "../../../services/weatherService";
import ScorecardHeader from "./ScorecardHeader";

interface RoundsTabProps {
  tournament: Tournament;
  isCreator: boolean;
  selectedRoundId: string | null;
  onSelectRound: (roundId: string) => void;
  onDeleteRound: (roundId: string) => void;
  onUpdatePlayerGroups: (roundId: string, playerGroups: PlayerGroup[]) => void;
  onAddRound: () => void;
}

const RoundsTab: React.FC<RoundsTabProps> = ({
  tournament,
  isCreator,
  selectedRoundId,
  onSelectRound,
  onDeleteRound,
  onUpdatePlayerGroups,
  onAddRound,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const styles = useTournamentScorecardStyles();
  const navigate = useNavigate();

  const [groupManagementOpen, setGroupManagementOpen] = useState(false);
  const [weather, setWeather] = useState(getInitialWeatherState());

  const getSelectedRound = () => {
    if (!selectedRoundId) return null;
    return (
      tournament.rounds.find((round) => round.id === selectedRoundId) || null
    );
  };

  const selectedRound = getSelectedRound();
  // Fetch weather data when component mounts or round changes
  useEffect(() => {
    const getWeather = async () => {
      // Only fetch if we have both location and date
      if (selectedRound?.courseDetails?.name && selectedRound?.date) {
        setWeather((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const result = await fetchWeather(
            selectedRound?.courseDetails.name,
            selectedRound?.date
          );
          setWeather(result);
        } catch (error) {
          setWeather((prev) => ({
            ...prev,
            loading: false,
            error: "Could not load weather data",
          }));
        }
      }
    };

    getWeather();
  }, [selectedRound?.courseDetails?.name, selectedRound?.date]);

  const handleSavePlayerGroups = (playerGroups: PlayerGroup[]) => {
    if (selectedRoundId) {
      onUpdatePlayerGroups(selectedRoundId, playerGroups);
      setGroupManagementOpen(false);
    }
  };

  if (tournament.rounds.length === 0) {
    return (
      <Box sx={styles.roundsTab.emptyState}>
        <EventIcon sx={styles.roundsTab.emptyStateIcon} />
        <Typography
          variant="h6"
          gutterBottom
          sx={styles.roundsTab.emptyStateTitle}
        >
          No Rounds Added Yet
        </Typography>
        <Typography
          variant="body2"
          paragraph
          sx={styles.roundsTab.emptyStateMessage}
        >
          Add rounds to track scores for this tournament.
        </Typography>
        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
          >
            Add First Round
          </Button>
        )}
      </Box>
    );
  }

  // Get all player groups for the selected round
  const playerGroups = selectedRound?.playerGroups || [];

  // Get players that are not in any group
  const ungroupedPlayers = selectedRound
    ? tournament.players.filter(
        (player) =>
          !playerGroups.some((group) => group.playerIds.includes(player.id))
      )
    : [];

  return (
    <Box>
      <ScorecardHeader round={selectedRound!} />
      <Box sx={styles.roundsTab.header}>
        <Typography variant="h6" sx={styles.header.title}>
          Tournament Rounds
        </Typography>

        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
            fullWidth={isSmall}
          >
            Add Round
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <List
            component={Paper}
            variant="outlined"
            sx={styles.roundsTab.roundsList}
          >
            {[...tournament.rounds]
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((round) => (
                <ListItem
                  key={round.id}
                  button
                  selected={selectedRoundId === round.id}
                  onClick={() => onSelectRound(round.id)}
                  sx={styles.roundsTab.roundItem}
                >
                  <ListItemAvatar sx={styles.roundsTab.roundItemAvatar}>
                    <Avatar sx={styles.roundsTab.avatar}>
                      <EventIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={styles.roundsTab.roundName}>
                        {round.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={styles.roundsTab.roundDate}
                      >
                        {new Date(round.date).toLocaleDateString()}
                      </Typography>
                    }
                  />
                  {isCreator && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onDeleteRound(round.id)}
                        sx={styles.roundsTab.deleteButton}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
          </List>
        </Grid>

        <Grid item xs={12} md={9}>
          {selectedRound ? (
            <Box>
              <WeatherDisplay
                weather={weather}
                courseName={selectedRound.courseDetails?.name}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                {isCreator && (
                  <Button
                    variant="outlined"
                    startIcon={<GroupsIcon />}
                    onClick={() => setGroupManagementOpen(true)}
                  >
                    Manage Groups
                  </Button>
                )}
              </Box>

              <Box sx={{ mb: 4 }}>
                {playerGroups.map((group) => (
                  <Box key={group.id} sx={{ mb: 4 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: theme.palette.primary.dark,
                        },
                      }}
                      onClick={() =>
                        navigate(
                          `/tournaments/${tournament.id}/rounds/${selectedRoundId}/groups/${group.id}`
                        )
                      }
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {group.name}
                          </Typography>
                          <Typography variant="body2">
                            {group.playerIds.length} players
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                          }}
                        >
                          {group.teeTime && (
                            <Chip
                              icon={<ScheduleIcon />}
                              label={`${group.teeTime}`}
                              variant="filled"
                              size="small"
                              sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                              }}
                            />
                          )}
                          {group.startingHole && (
                            <Chip
                              icon={<FlagIcon />}
                              label={`Hole ${group.startingHole}`}
                              variant="filled"
                              size="small"
                              sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {group.playerIds.slice(0, 3).map((playerId) => {
                          const player = tournament.players.find(
                            (p) => p.id === playerId
                          );
                          if (!player) return null;

                          return (
                            <Chip
                              key={player.id}
                              avatar={
                                <Avatar
                                  src={player.avatarUrl}
                                  alt={player.name}
                                />
                              }
                              label={player.name}
                              variant="filled"
                              size="small"
                              sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                              }}
                            />
                          );
                        })}
                        {group.playerIds.length > 3 && (
                          <Chip
                            label={`+${group.playerIds.length - 3} more`}
                            variant="filled"
                            size="small"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              color: "white",
                            }}
                          />
                        )}
                      </Box>
                    </Paper>
                  </Box>
                ))}

                {ungroupedPlayers.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        mb: 2,
                        p: 2,
                        bgcolor: theme.palette.grey[700],
                        color: "white",
                        borderRadius: "4px 4px 0 0",
                        borderBottom: "none",
                      }}
                    >
                      <Typography variant="h6">Ungrouped Players</Typography>
                    </Paper>

                    <Box
                      sx={{
                        mb: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderTop: "none",
                        borderRadius: "0 0 4px 4px",
                        overflow: "hidden",
                      }}
                    >
                      {ungroupedPlayers.map((player, playerIndex) => {
                        return (
                          <Box
                            key={player.id}
                            sx={{
                              borderBottom:
                                playerIndex < ungroupedPlayers.length - 1
                                  ? `1px solid ${theme.palette.divider}`
                                  : "none",
                            }}
                          >
                            <ListItem
                              sx={{
                                // cursor: "pointer",
                                bgcolor: theme.palette.background.paper,
                                // "&:hover": {
                                //   bgcolor: theme.palette.action.hover,
                                // },
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  src={player.avatarUrl}
                                  alt={player.name}
                                />
                              </ListItemAvatar>

                              <ListItemText
                                primary={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight="medium"
                                    >
                                      {player.name}
                                    </Typography>
                                    {player.handicap !== undefined && (
                                      <Chip
                                        icon={
                                          <GolfCourseIcon fontSize="small" />
                                        }
                                        label={`HCP: ${player.handicap}`}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
              {/* 
              {selectedRound && editingPlayerId && (
                <PlayerScoreEditor
                  playerId={editingPlayerId}
                  playerName={
                    tournament.players.find((p) => p.id === editingPlayerId)
                      ?.name || "Player"
                  }
                  round={selectedRound}
                  open={!!editingPlayerId}
                  onClose={() => setEditingPlayerId(null)}
                  onSave={onUpdateScores}
                />
              )} */}

              {selectedRound && (
                <PlayerGroupManager
                  round={selectedRound}
                  players={tournament.players}
                  open={groupManagementOpen}
                  onClose={() => setGroupManagementOpen(false)}
                  onSave={handleSavePlayerGroups}
                />
              )}
            </Box>
          ) : (
            <Box sx={styles.roundsTab.noSelection}>
              <Typography variant="h6" sx={styles.roundsTab.noSelectionText}>
                Select a round to view its scorecard
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoundsTab;
