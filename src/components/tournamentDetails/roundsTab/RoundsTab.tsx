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
  Card,
  CardContent,
  Divider,
  alpha,
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
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Tournament, PlayerGroup } from "../../../types/event";
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
            selectedRound?.courseDetails.name
            // selectedRound?.date
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

  const navigateToGroupDetail = (roundId: string, groupId: string) => {
    navigate(
      `/tournaments/${tournament.id}/rounds/${roundId}/groups/${groupId}`
    );
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

      <Grid container spacing={isSmall ? 2 : 3}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRound(round.id);
                        }}
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

              {/* Groups section with improved styling */}
              <Box sx={{ mb: 3, mt: 2 }}>
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  {isCreator && (
                    <Button
                      variant={isSmall ? "contained" : "outlined"}
                      startIcon={<GroupsIcon />}
                      onClick={() => setGroupManagementOpen(true)}
                      fullWidth={isSmall}
                      sx={
                        isSmall
                          ? {
                              ...styles.button.primary,
                              ...styles.mobile.button.touchable,
                            }
                          : styles.button.outlined
                      }
                    >
                      Manage Groups
                    </Button>
                  )}
                </Box>

                {playerGroups.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: (theme) =>
                        alpha(theme.palette.common.black, 0.2),
                      border: (theme) =>
                        `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
                      borderRadius: 2,
                    }}
                  >
                    <GroupsIcon
                      sx={{
                        fontSize: 48,
                        color: (theme) =>
                          alpha(theme.palette.common.white, 0.3),
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, color: "white" }}
                    >
                      No Groups Created Yet
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        color: (theme) =>
                          alpha(theme.palette.common.white, 0.7),
                      }}
                    >
                      Create groups to organize players for this round.
                    </Typography>
                    {isCreator && (
                      <Button
                        variant="outlined"
                        startIcon={<GroupsIcon />}
                        onClick={() => setGroupManagementOpen(true)}
                        sx={styles.button.outlined}
                      >
                        Create First Group
                      </Button>
                    )}
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {playerGroups.map((group) => (
                      <Grid item xs={12} sm={6} md={6} lg={4} key={group.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            bgcolor: (theme) =>
                              alpha(theme.palette.common.black, 0.3),
                            backdropFilter: "blur(10px)",
                            border: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.common.white,
                                0.1
                              )}`,
                            borderRadius: 2,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: { sm: "translateY(-4px)" },
                              boxShadow: {
                                sm: (theme) =>
                                  `0 8px 16px ${alpha(
                                    theme.palette.common.black,
                                    0.3
                                  )}`,
                              },
                              bgcolor: (theme) =>
                                alpha(theme.palette.common.black, 0.4),
                            },
                            cursor: "pointer",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          onClick={() =>
                            navigateToGroupDetail(selectedRound.id, group.id)
                          }
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1.5,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "white",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {group.name}
                                  <ChevronRightIcon
                                    sx={{
                                      ml: 0.5,
                                      opacity: 0.7,
                                      fontSize: "1.2rem",
                                    }}
                                  />
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: (theme) =>
                                      alpha(theme.palette.common.white, 0.7),
                                  }}
                                >
                                  {group.playerIds.length} player
                                  {group.playerIds.length !== 1 ? "s" : ""}
                                </Typography>
                              </Box>

                              <Box sx={{ display: "flex", gap: 1 }}>
                                {group.teeTime && (
                                  <Chip
                                    icon={<ScheduleIcon fontSize="small" />}
                                    label={group.teeTime}
                                    size="small"
                                    sx={{
                                      bgcolor: (theme) =>
                                        alpha(theme.palette.info.main, 0.1),
                                      color: (theme) =>
                                        theme.palette.info.light,
                                      borderRadius: "4px",
                                      height: "24px",
                                    }}
                                  />
                                )}
                                {group.startingHole && (
                                  <Chip
                                    icon={<FlagIcon fontSize="small" />}
                                    label={`Hole ${group.startingHole}`}
                                    size="small"
                                    sx={{
                                      bgcolor: (theme) =>
                                        alpha(theme.palette.success.main, 0.1),
                                      color: (theme) =>
                                        theme.palette.success.light,
                                      borderRadius: "4px",
                                      height: "24px",
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>

                            <Divider
                              sx={{
                                my: 1.5,
                                borderColor: (theme) =>
                                  alpha(theme.palette.common.white, 0.1),
                              }}
                            />

                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                                mt: 1,
                              }}
                            >
                              {group.playerIds.map((playerId) => {
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
                                    size="small"
                                    sx={{
                                      bgcolor: (theme) =>
                                        alpha(theme.palette.common.white, 0.1),
                                      color: "white",
                                      "& .MuiChip-avatar": {
                                        width: 24,
                                        height: 24,
                                      },
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              {/* Ungrouped players section with improved styling */}
              {ungroupedPlayers.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    Ungrouped Players ({ungroupedPlayers.length})
                  </Typography>

                  <Paper
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        alpha(theme.palette.common.black, 0.2),
                      border: (theme) =>
                        `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                      overflow: "hidden",
                    }}
                  >
                    <Grid container spacing={0}>
                      {ungroupedPlayers.map((player) => (
                        <Grid item xs={12} sm={6} md={4} key={player.id}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderBottom: (theme) =>
                                `1px solid ${alpha(
                                  theme.palette.common.white,
                                  0.05
                                )}`,
                              borderRight: (theme) =>
                                `1px solid ${alpha(
                                  theme.palette.common.white,
                                  0.05
                                )}`,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Avatar
                              src={player.avatarUrl}
                              alt={player.name}
                              sx={{
                                width: 36,
                                height: 36,
                                mr: 1.5,
                                border: (theme) =>
                                  `1px solid ${alpha(
                                    theme.palette.common.white,
                                    0.2
                                  )}`,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: "medium",
                                  color: "white",
                                }}
                              >
                                {player.name}
                              </Typography>

                              {player.handicap !== undefined && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: (theme) =>
                                      alpha(theme.palette.common.white, 0.7),
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <GolfCourseIcon
                                    sx={{ fontSize: 14, mr: 0.5 }}
                                  />
                                  Handicap: {player.handicap}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              )}

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
