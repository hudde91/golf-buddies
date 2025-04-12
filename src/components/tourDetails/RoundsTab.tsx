import React, { useState } from "react";
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
  Card,
  CardContent,
  Divider,
  Chip,
  alpha,
} from "@mui/material";
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
import { format, parseISO } from "date-fns";
import { useStyles } from "../../styles";
import { Tour, PlayerGroup } from "../../types/event";
import PlayerGroupManager from "../tournamentDetails/roundsTab/GroupPage/PlayerGroupManager";

interface RoundsTabProps {
  tour: Tour;
  isCreator: boolean;
  selectedRoundId: string | null;
  onSelectRound: (roundId: string) => void;
  onDeleteRound: (roundId: string) => void;
  onUpdatePlayerGroups: (roundId: string, playerGroups: PlayerGroup[]) => void;
  onAddRound: () => void;
  navigateToRound: (roundId: string) => void;
}

const RoundsTab: React.FC<RoundsTabProps> = ({
  tour,
  isCreator,
  selectedRoundId,
  onSelectRound,
  onDeleteRound,
  onUpdatePlayerGroups,
  onAddRound,
  navigateToRound,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // Initialize rounds with an empty array if it doesn't exist (for backward compatibility)
  const rounds = tour.rounds || [];

  const [groupManagementOpen, setGroupManagementOpen] = useState(false);

  const getSelectedRound = () => {
    if (!selectedRoundId) return null;
    return rounds.find((round) => round.id === selectedRoundId) || null;
  };

  const selectedRound = getSelectedRound();

  const handleSavePlayerGroups = (playerGroups: PlayerGroup[]) => {
    if (selectedRoundId) {
      onUpdatePlayerGroups(selectedRoundId, playerGroups);
      setGroupManagementOpen(false);
    }
  };

  if (rounds.length === 0) {
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
          Add rounds to track scores for this tour.
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
  const ungroupedPlayers =
    selectedRound && tour.players
      ? tour.players.filter(
          (player) =>
            !playerGroups.some((group) => group.playerIds.includes(player.id))
        )
      : [];

  return (
    <Box>
      <Box
        sx={{
          ...styles.tournamentRounds.roundsTab.header,
          ...styles.mobile.layout.stackedOnMobile,
        }}
      >
        <Typography variant="h6" sx={styles.headers.section.title}>
          Tour Rounds
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
            {[...rounds]
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
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.common.black, 0.3),
                    border: `1px solid ${alpha(
                      theme.palette.common.white,
                      0.1
                    )}`,
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {selectedRound.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {format(parseISO(selectedRound.date), "MMMM d, yyyy")}
                  </Typography>

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {selectedRound.courseDetails?.name && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Course
                        </Typography>
                        <Typography variant="body1">
                          {selectedRound.courseDetails.name}
                        </Typography>
                      </Grid>
                    )}

                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Format
                      </Typography>
                      <Typography variant="body1">
                        {selectedRound.format}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Holes
                      </Typography>
                      <Typography variant="body1">
                        {selectedRound.courseDetails?.holes || 18}
                        {selectedRound.courseDetails?.par &&
                          ` (Par ${selectedRound.courseDetails.par})`}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigateToRound(selectedRound.id)}
                      sx={styles.button.primary}
                    >
                      View Round Details
                    </Button>

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
                </Box>

                {/* Player Groups Section */}
                {playerGroups.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Player Groups
                    </Typography>

                    <Grid container spacing={2}>
                      {playerGroups.map((group) => (
                        <Grid item xs={12} sm={6} md={4} key={group.id}>
                          <Card
                            variant="outlined"
                            sx={{
                              bgcolor: alpha(theme.palette.common.black, 0.3),
                              backdropFilter: "blur(10px)",
                              border: `1px solid ${alpha(
                                theme.palette.common.white,
                                0.1
                              )}`,
                              borderRadius: 2,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: { sm: "translateY(-4px)" },
                                boxShadow: (theme) =>
                                  `0 8px 16px ${alpha(
                                    theme.palette.common.black,
                                    0.3
                                  )}`,
                                bgcolor: alpha(theme.palette.common.black, 0.4),
                              },
                              cursor: "pointer",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                            onClick={() => navigateToRound(selectedRound.id)}
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
                                      color: alpha(
                                        theme.palette.common.white,
                                        0.7
                                      ),
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
                                        bgcolor: alpha(
                                          theme.palette.info.main,
                                          0.1
                                        ),
                                        color: theme.palette.info.light,
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
                                        bgcolor: alpha(
                                          theme.palette.success.main,
                                          0.1
                                        ),
                                        color: theme.palette.success.light,
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
                                  borderColor: alpha(
                                    theme.palette.common.white,
                                    0.1
                                  ),
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
                                  const player = tour.players?.find(
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
                                        bgcolor: alpha(
                                          theme.palette.common.white,
                                          0.1
                                        ),
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
                  </Box>
                )}

                {/* Ungrouped players section */}
                {ungroupedPlayers && ungroupedPlayers.length > 0 && (
                  <Box sx={{ mb: 3 }}>
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
                        bgcolor: alpha(theme.palette.common.black, 0.2),
                        border: `1px solid ${alpha(
                          theme.palette.common.white,
                          0.1
                        )}`,
                        overflow: "hidden",
                      }}
                    >
                      <Grid container spacing={0}>
                        {ungroupedPlayers.map((player) => (
                          <Grid item xs={12} sm={6} md={4} key={player.id}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderBottom: `1px solid ${alpha(
                                  theme.palette.common.white,
                                  0.05
                                )}`,
                                borderRight: `1px solid ${alpha(
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
                                  border: `1px solid ${alpha(
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
                                      color: alpha(
                                        theme.palette.common.white,
                                        0.7
                                      ),
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
              </Box>

              {/* Player Group Management Dialog */}
              {selectedRound && (
                <PlayerGroupManager
                  round={selectedRound}
                  players={tour.players || []}
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
                Select a round to view its details
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoundsTab;
