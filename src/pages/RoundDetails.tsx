import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  useMediaQuery,
  useTheme,
  Divider,
  alpha,
  Card,
  CardContent,
} from "@mui/material";
import {
  GolfCourse as GolfCourseIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import eventService from "../services/eventService";
import friendsService from "../services/friendsService";
import { Round, RoundFormData, PlayerGroup, Player } from "../types/event";
import RoundForm from "../components/round/RoundForm";
import PlayerScorecard from "../components/tournamentDetails/PlayerScorecard";
import { Friend } from "../services/friendsService";
import { useStyles } from "../styles/hooks/useStyles";
import FriendsSelectionDialog from "../components/FriendsSelectionDialog";
import {
  calculateTotal,
  formatScoreToPar,
  getScoreColor,
} from "../components/tournamentDetails/leaderboardTab/scorecardUtils";

const RoundDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const styles = useStyles();

  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openFriendsDialog, setOpenFriendsDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    if (!id || !isLoaded || !user) return;

    const fetchRound = async () => {
      setLoading(true);
      try {
        const roundData = await eventService.getRoundById(id);

        if (roundData) {
          setRound(roundData);
        } else {
          navigate("/events");
        }
      } catch (error) {
        console.error("Error fetching round data:", error);
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchRound();

    const fetchFriends = async () => {
      setLoadingFriends(true);
      if (user) {
        const userFriends = friendsService.getAcceptedFriends(user.id);
        setFriends(userFriends);
        setLoadingFriends(false);
      }
    };

    fetchRound();
    fetchFriends();
  }, [id, isLoaded, user, navigate]);

  const handleEditRound = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateRound = (
    data: RoundFormData & { inviteFriends: string[] }
  ) => {
    if (!id) return;

    // Update the round
    const updatedRound = eventService.updateRoundEvent(id, data);

    // If there are new invitations, send them
    if (data.inviteFriends && data.inviteFriends.length > 0) {
      eventService.invitePlayersToRound(id, data.inviteFriends);
    }

    if (updatedRound) {
      setRound(updatedRound);
    }

    setOpenEditDialog(false);
  };

  const handleDeleteRound = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (!id) return;

    eventService.deleteRoundEvent(id);
    navigate("/events");
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleBackClick = () => {
    navigate("/events");
  };

  const handleOpenFriendsDialog = () => {
    setOpenFriendsDialog(true);
  };

  const handleCloseFriendsDialog = () => {
    setOpenFriendsDialog(false);
  };

  const handleAddFriendsToGroup = async (
    friendIds: string[],
    groupId: string,
    roundId: string
  ) => {
    if (!round) return;

    // Create player objects from selected friends
    const newPlayers: Player[] = friendIds
      .map((friendId) => {
        const friend = friends.find((f) => f.id === friendId);
        return {
          id: friend?.id || "",
          name: friend?.name || "",
          email: friend?.email || "",
        };
      })
      .filter((player) => player.id !== "");

    // Get the existing players in the round
    const existingPlayers = round.players || [];

    // Update the existing group with new player IDs
    const updatedGroups = round.playerGroups!.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          playerIds: [...group.playerIds, ...friendIds],
        };
      }
      return group;
    });

    // Update round with new players and updated groups
    const updatedRound = {
      ...round,
      players: [...existingPlayers, ...newPlayers],
      playerGroups: updatedGroups,
    };

    // In a real app, you would call an API to update the round
    const savedRound = eventService.updateRoundEvent(roundId, updatedRound);
    if (savedRound) {
      setRound(savedRound);
    }
  };

  const handleCreateNewGroup = async (name: string, playerIds: string[]) => {
    if (!round) return;

    // Create player objects from selected friends
    const newPlayers: Player[] = playerIds
      .map((playerId) => {
        const friend = friends.find((f) => f.id === playerId);
        return {
          id: friend?.id || "",
          name: friend?.name || "",
          email: friend?.email || "",
        };
      })
      .filter((player) => player.id !== "");

    // Create a new group with the selected player IDs
    const newGroup: PlayerGroup = {
      id: uuidv4(),
      name,
      playerIds,
    };

    // Update round with new players and new group
    const updatedRound = {
      ...round,
      players: [...(round.players || []), ...newPlayers],
      playerGroups: [...round.playerGroups!, newGroup],
    };

    // In a real app, you would call an API to update the round
    const savedRound = eventService.updateRoundEvent(round.id, updatedRound);
    if (savedRound) {
      setRound(savedRound);
    }
  };

  const handleNavigateToGroup = (roundId: string, groupId: string) => {
    // Navigate to the group detail page
    navigate(`/rounds/${roundId}/groups/${groupId}`);
  };

  if (loading || !isLoaded) {
    return (
      <Box sx={styles.feedback.loading.container}>
        <CircularProgress sx={styles.feedback.loading.icon} />
        <Typography sx={styles.feedback.loading.text}>
          Loading round details...
        </Typography>
      </Box>
    );
  }

  if (!round) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Round not found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ mt: 2, ...styles.button.primary }}
          >
            Back to Rounds
          </Button>
        </Box>
      </Container>
    );
  }

  // Initialize empty player groups if needed
  if (!round.playerGroups) {
    round.playerGroups = [];
  }

  console.log("Round Details:", round);

  return (
    <Box sx={styles.layout.page.withBackground}>
      <Container maxWidth="lg">
        <Box sx={styles.navigation.backButtonContainer}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={styles.navigation.backButton}
          >
            Back to Events
          </Button>
        </Box>
        <Box sx={styles.headers.event.container}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 1,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={styles.headers.event.title}
            >
              {round.name}
            </Typography>

            {round.status && (
              <Chip
                label={
                  round.status.charAt(0).toUpperCase() + round.status.slice(1)
                }
                color={
                  round.status === "active"
                    ? "success"
                    : round.status === "completed"
                    ? "primary"
                    : "info"
                }
                size={isMobile ? "small" : "medium"}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              mt: { xs: 1, sm: 0 },
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", sm: "auto" },
              gap: 1,
            }}
          >
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteRound}
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
              variant="outlined"
              sx={styles.button.danger}
            >
              Delete
            </Button>
            <Button
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditRound}
              fullWidth={isMobile}
              size={isMobile ? "small" : "medium"}
              sx={styles.button.primary}
            >
              Edit
            </Button>
          </Box>
        </Box>

        <Paper sx={styles.card.glass}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ ...styles.tournamentCard.infoItem, mb: { xs: 1, md: 2 } }}
              >
                <CalendarIcon />
                <Typography variant="subtitle1" sx={styles.text.body.primary}>
                  Date: {new Date(round.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={styles.tournamentCard.infoItem}>
                <LocationIcon />
                <Typography variant="subtitle1" sx={styles.text.body.primary}>
                  Location: {round.location || "Not specified"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ ...styles.tournamentCard.infoItem, mb: { xs: 1, md: 2 } }}
              >
                <GolfCourseIcon />
                <Typography variant="subtitle1" sx={styles.text.body.primary}>
                  Course: {round.courseDetails?.name || "Not specified"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Chip
                  label={`Format: ${round.format}`}
                  size="small"
                  sx={styles.chips.eventType.tournament}
                />

                <Chip
                  label={`${round.courseDetails?.holes || 18} holes`}
                  size="small"
                  sx={styles.chips.eventType.tour}
                />

                {round.courseDetails?.par && (
                  <Chip
                    label={`Par: ${round.courseDetails?.par}`}
                    size="small"
                    sx={styles.chips.eventType.custom(theme.palette.info.light)}
                  />
                )}
              </Box>
            </Grid>
            {round.description && (
              <Grid item xs={12}>
                <Divider sx={styles.divider.standard} />
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ ...styles.text.body.primary, mt: 1 }}
                >
                  Description:
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={styles.text.body.primary}
                >
                  {round.description}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenFriendsDialog}
              sx={styles.button.primary}
            >
              Add Players
            </Button>
          </Box>

          <Grid container spacing={2}>
            {round.playerGroups.map((group) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={group.id}>
                <Card
                  variant="outlined"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.common.black, 0.3),
                    backdropFilter: "blur(10px)",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
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
                  onClick={() => handleNavigateToGroup(round.id, group.id)}
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
                              color: (theme) => theme.palette.info.light,
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
                              color: (theme) => theme.palette.success.light,
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
                        const player = round.players!.find(
                          (p) => p.id === playerId
                        );
                        if (!player) return null;

                        return (
                          <Chip
                            key={player.id}
                            avatar={
                              <Avatar src={player.avatarUrl} alt={player.name}>
                                {player.name[0].toUpperCase()}
                              </Avatar>
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
        </Box>

        {round.players && round.players.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Leaderboard
            </Typography>
            <Paper sx={styles.card.glass}>
              {/* Sort players by their scores */}
              {round.players
                .sort((a, b) => {
                  const aTotal = calculateTotal(a.id, round);
                  const bTotal = calculateTotal(b.id, round);

                  return aTotal - bTotal;
                })
                .map((player, index) => (
                  <Box key={player.id} sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{ mr: 2, fontWeight: "bold" }}
                      >
                        {index + 1}.
                      </Typography>
                      <Avatar
                        src={player.avatarUrl}
                        alt={player.name}
                        sx={{ mr: 2 }}
                      >
                        {player.name[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="h6">{player.name}</Typography>

                      <Typography
                        variant="h6"
                        sx={{ ml: "auto", fontWeight: "bold" }}
                      >
                        {calculateTotal(player.id, round)}
                        {round.courseDetails?.par && (
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              ml: 1,
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
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    <PlayerScorecard
                      player={player}
                      tournament={{
                        ...round,
                        id: round.id,
                        name: round.name,
                        startDate: round.date,
                        endDate: round.date,
                        rounds: [round],
                        location: round.location || "",
                        format: round.format,
                        createdBy: round.createdBy || "",
                        createdAt: round.createdAt || new Date().toISOString(),
                        players: round.players || [],
                        teams: [],
                        invitations: round.invitations || [],
                        isTeamEvent: false,
                        scoringType: "individual",
                        status: round.status || "upcoming",
                      }}
                      showAllRounds={false}
                    />
                  </Box>
                ))}
            </Paper>
          </Box>
        )}
      </Container>

      {/* Edit Round Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <RoundForm
          initialData={{
            name: round.name,
            date: round.date,
            courseName: round.courseDetails?.name,
            description: round.description,
            holes: round.courseDetails?.holes || 18,
            par: round.courseDetails?.par || 72,
            format: round.format,
          }}
          onSubmit={handleUpdateRound}
          onCancel={handleCloseEditDialog}
          friends={friends}
          loadingFriends={loadingFriends}
        />
      </Dialog>

      <FriendsSelectionDialog
        open={openFriendsDialog}
        onClose={handleCloseFriendsDialog}
        friends={friends}
        loadingFriends={loadingFriends}
        currentPlayers={round.players || []}
        playerGroups={round.playerGroups || []}
        roundId={round.id}
        shouldNotShowGroups
        onAddFriendsToGroup={handleAddFriendsToGroup}
        onCreateNewGroup={handleCreateNewGroup}
      />

      <Dialog
        open={confirmDelete}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <DialogTitle sx={styles.dialogs.title}>Confirm Delete</DialogTitle>
        <DialogContent sx={styles.dialogs.content}>
          <Typography sx={styles.text.body.primary}>
            Are you sure you want to delete this round? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={styles.dialogs.actions}>
          <Button onClick={handleCancelDelete} sx={styles.button.outlined}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              ...styles.button.danger,
              bgcolor: "error.main",
              color: "white",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoundDetails;
