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
import { useStyles } from "../../../styles/hooks/useStyles";
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
  const styles = useStyles();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
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
      <Box sx={styles.tournamentRounds.roundsTab.emptyState}>
        <EventIcon sx={styles.tournamentRounds.roundsTab.emptyStateIcon} />
        <Typography
          variant="h6"
          gutterBottom
          sx={styles.tournamentRounds.roundsTab.emptyStateTitle}
        >
          No Rounds Added Yet
        </Typography>
        <Typography
          variant="body2"
          paragraph
          sx={styles.tournamentRounds.roundsTab.emptyStateMessage}
        >
          Add rounds to track scores for this tournament.
        </Typography>
        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
            sx={styles.button.primary}
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
      {selectedRound && <ScorecardHeader round={selectedRound} />}

      <Box
        sx={{
          ...styles.tournamentRounds.roundsTab.header,
          ...styles.mobile.layout.stackedOnMobile,
        }}
      >
        <Typography variant="h6" sx={styles.headers.section.title}>
          Tournament Rounds
        </Typography>

        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
            fullWidth={isSmall}
            sx={{
              ...styles.button.primary,
              ...styles.mobile.button.touchable,
            }}
          >
            Add Round
          </Button>
        )}
      </Box>

      <Grid container spacing={styles.mobile.grid.responsive.spacing}>
        <Grid item xs={12} md={3}>
          <List
            component={Paper}
            variant="outlined"
            sx={{
              ...styles.tournamentRounds.roundsTab.roundsList,
              ...styles.mobile.list.horizontal,
            }}
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
                  sx={styles.tournamentRounds.roundsTab.roundItem}
                >
                  <ListItemAvatar
                    sx={styles.tournamentRounds.roundsTab.roundItemAvatar}
                  >
                    <Avatar sx={styles.tournamentRounds.roundsTab.avatar}>
                      <EventIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        sx={styles.tournamentRounds.roundsTab.roundName}
                      >
                        {round.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={styles.tournamentRounds.roundsTab.roundDate}
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
                        sx={styles.tournamentRounds.roundsTab.deleteButton}
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
              <Box sx={styles.layout.flex.spaceBetween} mb={3}>
                {isCreator && (
                  <Button
                    variant="outlined"
                    startIcon={<GroupsIcon />}
                    onClick={() => setGroupManagementOpen(true)}
                    sx={styles.button.outlined}
                  >
                    Manage Groups
                  </Button>
                )}
              </Box>

              <Box sx={{ mb: 4 }}>
                {playerGroups.map((group) => (
                  <Box
                    key={group.id}
                    sx={styles.tournamentRounds.group.container}
                  >
                    <Paper
                      variant="outlined"
                      sx={styles.tournamentRounds.group.header}
                      onClick={() =>
                        navigate(
                          `/tournaments/${tournament.id}/rounds/${selectedRoundId}/groups/${group.id}`
                        )
                      }
                    >
                      <Box sx={styles.tournamentRounds.group.headerContent}>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={styles.tournamentRounds.group.title}
                          >
                            {group.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={styles.tournamentRounds.group.playerCount}
                          >
                            {group.playerIds.length} players
                          </Typography>
                        </Box>
                        <Box sx={styles.tournamentRounds.group.chips}>
                          {group.teeTime && (
                            <Chip
                              icon={<ScheduleIcon />}
                              label={`${group.teeTime}`}
                              variant="filled"
                              size="small"
                              sx={styles.tournamentRounds.group.timeChip}
                            />
                          )}
                          {group.startingHole && (
                            <Chip
                              icon={<FlagIcon />}
                              label={`Hole ${group.startingHole}`}
                              variant="filled"
                              size="small"
                              sx={styles.tournamentRounds.group.holeChip}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={styles.tournamentRounds.group.playerChips}>
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
                              sx={styles.tournamentRounds.group.playerChip}
                            />
                          );
                        })}
                        {group.playerIds.length > 3 && (
                          <Chip
                            label={`+${group.playerIds.length - 3} more`}
                            variant="filled"
                            size="small"
                            sx={styles.tournamentRounds.group.playerChip}
                          />
                        )}
                      </Box>
                    </Paper>
                  </Box>
                ))}

                {ungroupedPlayers.length > 0 && (
                  <Box sx={styles.tournamentRounds.ungrouped.container}>
                    <Paper
                      variant="outlined"
                      sx={styles.tournamentRounds.ungrouped.header}
                    >
                      <Typography variant="h6">Ungrouped Players</Typography>
                    </Paper>

                    <Box sx={styles.tournamentRounds.ungrouped.playerList}>
                      {ungroupedPlayers.map((player, playerIndex) => (
                        <Box
                          key={player.id}
                          sx={{
                            ...styles.tournamentRounds.ungrouped.playerItem,
                            borderBottom:
                              playerIndex < ungroupedPlayers.length - 1
                                ? `1px solid ${theme.palette.divider}`
                                : "none",
                          }}
                        >
                          <ListItem
                            sx={{
                              bgcolor: theme.palette.background.paper,
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
                                  sx={
                                    styles.tournamentRounds.ungrouped.playerName
                                  }
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="medium"
                                  >
                                    {player.name}
                                  </Typography>
                                  {player.handicap !== undefined && (
                                    <Chip
                                      icon={<GolfCourseIcon fontSize="small" />}
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
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

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
            <Box sx={styles.tournamentRounds.roundsTab.noSelection}>
              <Typography
                variant="h6"
                sx={styles.tournamentRounds.roundsTab.noSelectionText}
              >
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
