import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import eventService from "../services/eventService";
import {
  Event,
  Tour,
  TournamentFormData,
  Player,
  RoundFormData,
  PlayerGroup,
} from "../types/event";
import TournamentForm from "../components/tournament/TournamentForm";
import RoundForm from "../components/round/RoundForm";
import TourForm from "../components/tour/TourForm";
import LoadingState from "../components/tournament/LoadingState";
import TourHeader from "../components/tour/TourHeader";
import TourTabs from "../components/tourDetails/TourTabs";
import { colors, useStyles } from "../styles";
import MobileTourBottomNavigation from "../components/tourDetails/MobileTourBottomNavigation";
import SharedPlayerCard from "../components/SharedPlayerCard";
import PlayerProfileDialog from "../components/tournamentDetails/playersTab/PlayerProfileDialog";
import friendsService from "../services/friendsService";

const TourDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [event, setEvent] = useState<Event | null>(null);
  const [tour, setTour] = useState<Tour | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openAddTournament, setOpenAddTournament] = useState(false);
  const [openAddRound, setOpenAddRound] = useState(false); // New state for add round dialog
  const [openEditTour, setOpenEditTour] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);

  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(
    tour?.rounds && tour.rounds.length > 0 ? tour.rounds[0].id : null
  );

  const handleSelectRound = (roundId: string) => {
    setSelectedRoundId(roundId);
  };

  // useEffect(() => {
  //   if (!isLoaded || !user || !id) return;

  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const fetchedEvent = await eventService.getEventById(id);

  //     if (fetchedEvent && fetchedEvent.type === "tour") {
  //       setEvent(fetchedEvent);

  //       // Initialize rounds array if it doesn't exist (backward compatibility)
  //       const tourData = fetchedEvent.data as Tour;
  //       if (!tourData.rounds) {
  //         tourData.rounds = [];
  //       }

  //       setTour(tourData);
  //       setIsCreator(tourData.createdBy === user.id);

  //       const tourLeaderboard = eventService.getTourLeaderboard(id);
  //       setLeaderboard(tourLeaderboard);
  //     } else {
  //       // If it's not a tour, redirect to events page
  //       navigate("/events");
  //     }

  //     setIsLoading(false);
  //   };

  //   fetchData();
  // }, [id, user, isLoaded, navigate]);

  useEffect(() => {
    if (!isLoaded || !user || !id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch tour data
        const fetchedEvent = await eventService.getEventById(id);

        if (fetchedEvent && fetchedEvent.type === "tour") {
          setEvent(fetchedEvent);

          const tourData = fetchedEvent.data as Tour;
          if (!tourData.rounds) {
            tourData.rounds = [];
          }

          setTour(tourData);
          setIsCreator(tourData.createdBy === user.id);

          const tourLeaderboard = eventService.getTourLeaderboard(id);
          setLeaderboard(tourLeaderboard);

          try {
            const fetchedFriends = await friendsService.getFriends(user.id);
            setFriends(fetchedFriends || []);
          } catch (friendsError) {
            console.error("Error fetching friends:", friendsError);
            setFriends([]);
          }
        } else {
          navigate("/events");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tour data:", error);
        navigate("/events");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user, isLoaded, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddTournament = () => {
    setOpenAddTournament(true);
  };

  const handleAddRound = () => {
    setOpenAddRound(true);
  };

  const handleAddTournamentClose = () => {
    setOpenAddTournament(false);
  };

  const handleAddRoundClose = () => {
    setOpenAddRound(false);
  };

  const handleEditTour = () => {
    setOpenEditTour(true);
  };

  const handleEditTourClose = () => {
    setOpenEditTour(false);
  };

  const handleTournamentFormSubmit = (data: TournamentFormData) => {
    if (!user || !tour) return;

    const currentUser: Player = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim() || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
    };

    const updatedEvent = eventService.addTournamentToTour(
      id!,
      data,
      currentUser
    );

    if (updatedEvent) {
      setEvent(updatedEvent);
      setTour(updatedEvent.data as Tour);
    }

    setOpenAddTournament(false);
  };

  const handleRoundFormSubmit = (data: RoundFormData) => {
    if (!user || !tour) return;
    debugger;
    const currentUser: Player = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim() || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
    };

    // Add a new function to your event service to handle adding a round to a tour
    const updatedEvent = eventService.addRoundToTour(id!, data, currentUser);

    if (updatedEvent) {
      setEvent(updatedEvent);
      setTour(updatedEvent.data as Tour);
    }

    setOpenAddRound(false);
  };

  const handleEditTourSubmit = (data: any) => {
    if (!tour) return;

    const updatedTour = {
      ...tour,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    };

    const updatedEvent = eventService.updateEvent(id!, {
      data: updatedTour,
    });

    if (updatedEvent) {
      setEvent(updatedEvent);
      setTour(updatedEvent.data as Tour);
    }

    setOpenEditTour(false);
  };

  const handleDeleteTour = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this tour? This action cannot be undone."
      )
    ) {
      eventService.deleteEvent(id!);
      navigate("/events");
    }
  };

  const handleBackToEvents = () => {
    navigate("/events");
  };

  if (isLoading || !isLoaded) {
    return <LoadingState />;
  }

  const handleDeleteRound = (roundId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this round? This action cannot be undone."
      )
    ) {
      const updatedEvent = eventService.deleteRoundFromTour(id!, roundId);
      if (updatedEvent) {
        setEvent(updatedEvent);
        setTour(updatedEvent.data as Tour);
      }
    }
  };

  const handleUpdatePlayerGroups = (
    roundId: string,
    playerGroups: PlayerGroup[]
  ) => {
    const updatedEvent = eventService.updateTourRoundPlayerGroups(
      id!,
      roundId,
      playerGroups
    );
    if (updatedEvent) {
      setEvent(updatedEvent);
      setTour(updatedEvent.data as Tour);
    }
  };

  if (!tour) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5">Tour not found</Typography>
          <Button
            variant="contained"
            onClick={handleBackToEvents}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  // Calculate counts for badge indicators in mobile nav
  const roundCount = tour.rounds?.length || 0;
  const tournamentCount = tour.tournaments.length || 0;
  const playerCount = tour.players?.length || 0;
  const teamCount = tour.teams?.length || 0;
  const hasTeams = Boolean(tour.teams && tour.teams.length > 0);

  return (
    <Box
      sx={{
        background: colors.background.main,
        minHeight: "calc(100vh - 64px)",
        py: { xs: 3, md: 4 },
        pb: isMobile ? "56px" : undefined,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={styles.navigation.backButtonContainer}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToEvents}
            sx={styles.navigation.backButton}
          >
            Back to Events
          </Button>
        </Box>

        <TourHeader
          tour={tour}
          isCreator={isCreator}
          onEdit={handleEditTour}
          onDelete={handleDeleteTour}
        />

        {!isMobile ? (
          <TourTabs
            tour={tour}
            tabValue={tabValue}
            leaderboard={leaderboard}
            isCreator={isCreator}
            selectedRoundId={selectedRoundId}
            onTabChange={handleTabChange}
            onAddTournament={handleAddTournament}
            onAddRound={handleAddRound}
            onDeleteRound={handleDeleteRound}
            onUpdatePlayerGroups={handleUpdatePlayerGroups}
            navigateToTournament={(tournamentId) =>
              navigate(`/tournaments/${tournamentId}`)
            }
            onSelectRound={handleSelectRound}
            navigateToRound={(roundId) => {
              debugger;
              navigate(`/rounds/${roundId}`);
            }}
          />
        ) : (
          <Box sx={styles.card.glass}>
            <div
              role="tabpanel"
              hidden={tabValue !== 0}
              id="tour-tabpanel-0"
              aria-labelledby="tour-tab-0"
            >
              {tabValue === 0 && (
                <Box sx={styles.tabs.panel}>
                  <Box sx={styles.headers.tour.headerContainer}>
                    <Typography
                      variant="h6"
                      sx={styles.headers.tour.sectionTitle}
                    >
                      Rounds in this Tour
                    </Typography>
                    {isCreator && (
                      <Button
                        variant="contained"
                        sx={styles.button.primary}
                        onClick={handleAddRound}
                      >
                        Add Round
                      </Button>
                    )}
                  </Box>

                  {!tour.rounds || tour.rounds.length === 0 ? (
                    <Box sx={styles.feedback.emptyState.container}>
                      <Typography
                        variant="h6"
                        sx={styles.feedback.emptyState.title}
                      >
                        No Rounds Added Yet
                      </Typography>
                      {isCreator && (
                        <Button
                          variant="contained"
                          sx={styles.button.primary}
                          onClick={handleAddRound}
                        >
                          Add First Round
                        </Button>
                      )}
                    </Box>
                  ) : (
                    tour.rounds.map((round) => (
                      <Box
                        key={round.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.common.black, 0.3),
                          border: `1px solid ${alpha(
                            theme.palette.common.white,
                            0.1
                          )}`,
                        }}
                        onClick={() => {
                          debugger;
                          navigate(`/rounds/${round.id}`);
                        }}
                      >
                        <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                          {round.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: alpha(theme.palette.common.white, 0.7),
                            mb: 1,
                          }}
                        >
                          Status: {round.status || "Upcoming"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: alpha(theme.palette.common.white, 0.7) }}
                        >
                          Players: {Object.keys(round.scores).length}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </div>

            <div
              role="tabpanel"
              hidden={tabValue !== 1}
              id="tour-tabpanel-1"
              aria-labelledby="tour-tab-1"
            >
              {tabValue === 1 && (
                <Box sx={styles.tabs.panel}>
                  <Box sx={styles.headers.tour.headerContainer}>
                    <Typography
                      variant="h6"
                      sx={styles.headers.tour.sectionTitle}
                    >
                      Tournaments in this Tour
                    </Typography>
                    {isCreator && (
                      <Button
                        variant="contained"
                        sx={styles.button.primary}
                        onClick={handleAddTournament}
                      >
                        Add Tournament
                      </Button>
                    )}
                  </Box>

                  {tournamentCount === 0 ? (
                    <Box sx={styles.feedback.emptyState.container}>
                      <Typography
                        variant="h6"
                        sx={styles.feedback.emptyState.title}
                      >
                        No Tournaments Added Yet
                      </Typography>
                      {isCreator && (
                        <Button
                          variant="contained"
                          sx={styles.button.primary}
                          onClick={handleAddTournament}
                        >
                          Add First Tournament
                        </Button>
                      )}
                    </Box>
                  ) : (
                    tour.tournaments.map((tournament) => (
                      <Box
                        key={tournament.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.common.black, 0.3),
                          border: `1px solid ${alpha(
                            theme.palette.common.white,
                            0.1
                          )}`,
                        }}
                        onClick={() =>
                          navigate(`/tournaments/${tournament.id}`)
                        }
                      >
                        <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                          {tournament.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: alpha(theme.palette.common.white, 0.7),
                            mb: 1,
                          }}
                        >
                          Status: {tournament.status}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: alpha(theme.palette.common.white, 0.7) }}
                        >
                          Players: {tournament.players.length}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </div>

            <div
              role="tabpanel"
              hidden={tabValue !== 2}
              id="tour-tabpanel-2"
              aria-labelledby="tour-tab-2"
            >
              {tabValue === 2 && (
                <Box sx={styles.tabs.panel}>
                  <Typography
                    variant="h6"
                    sx={styles.headers.tour.sectionTitle}
                  >
                    Tour Leaderboard
                  </Typography>

                  {leaderboard.length === 0 ? (
                    <Box sx={styles.feedback.emptyState.container}>
                      <Typography
                        variant="h6"
                        sx={styles.feedback.emptyState.title}
                      >
                        No Leaderboard Data
                      </Typography>
                      <Typography sx={styles.feedback.emptyState.description}>
                        Leaderboard data will appear when tournaments and rounds
                        have been completed.
                      </Typography>
                    </Box>
                  ) : (
                    leaderboard.map((player, index) => (
                      <Box
                        key={player.playerId}
                        sx={{
                          mb: 1,
                          p: 2,
                          borderRadius: 2,
                          bgcolor:
                            index % 2 === 0
                              ? alpha(theme.palette.common.black, 0.4)
                              : alpha(theme.palette.common.black, 0.2),
                          border: `1px solid ${alpha(
                            theme.palette.common.white,
                            0.1
                          )}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="h5"
                            sx={{ color: "white", mr: 2, fontWeight: "bold" }}
                          >
                            {index + 1}.
                          </Typography>
                          <Box>
                            <Typography variant="body1" sx={{ color: "white" }}>
                              {player.playerName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: alpha(theme.palette.common.white, 0.7),
                              }}
                            >
                              Tournaments:{" "}
                              {Object.keys(player.tournamentResults).length}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ color: "white", fontWeight: "bold" }}
                        >
                          {player.totalPoints}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </div>

            <div
              role="tabpanel"
              hidden={tabValue !== 3}
              id="tour-tabpanel-3"
              aria-labelledby="tour-tab-3"
            >
              {tabValue === 3 && (
                <Box sx={styles.tabs.panel}>
                  <Typography
                    variant="h6"
                    sx={styles.headers.tour.sectionTitle}
                  >
                    Tour Participants
                  </Typography>

                  {!tour.players || tour.players.length === 0 ? (
                    <Box sx={styles.feedback.emptyState.container}>
                      <Typography
                        variant="h6"
                        sx={styles.feedback.emptyState.title}
                      >
                        No Players Yet
                      </Typography>
                      <Typography sx={styles.feedback.emptyState.description}>
                        Players will be added when they join tournaments or
                        rounds in this tour.
                      </Typography>
                    </Box>
                  ) : (
                    tour.players.map((player) => (
                      <Box key={player.id} sx={{ mb: 2 }}>
                        <SharedPlayerCard
                          player={player}
                          event={tour}
                          onClick={(player) => {
                            setSelectedPlayer(player);
                            setProfileDialogOpen(true);
                          }}
                        />
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </div>

            {hasTeams && (
              <div
                role="tabpanel"
                hidden={tabValue !== 4}
                id="tour-tabpanel-4"
                aria-labelledby="tour-tab-4"
              >
                {tabValue === 4 && (
                  <Box sx={styles.tabs.panel}>
                    <Typography
                      variant="h6"
                      sx={styles.headers.tour.sectionTitle}
                    >
                      Tour Teams
                    </Typography>

                    {tour.teams.map((team) => {
                      const teamPlayers =
                        tour.players?.filter((p) => p.teamId === team.id) || [];

                      return (
                        <Box
                          key={team.id}
                          sx={{
                            mb: 2,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: `1px solid ${alpha(team.color, 0.3)}`,
                          }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: alpha(team.color, 0.15),
                              borderBottom: `1px solid ${alpha(
                                team.color,
                                0.3
                              )}`,
                            }}
                          >
                            <Typography variant="h6" sx={{ color: "white" }}>
                              {team.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: alpha(theme.palette.common.white, 0.7),
                              }}
                            >
                              {teamPlayers.length} member
                              {teamPlayers.length !== 1 ? "s" : ""}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.common.black, 0.3),
                            }}
                          >
                            {teamPlayers.length === 0 ? (
                              <Typography
                                sx={{
                                  color: alpha(theme.palette.common.white, 0.5),
                                  fontStyle: "italic",
                                }}
                              >
                                No players assigned to this team
                              </Typography>
                            ) : (
                              teamPlayers.map((player) => (
                                <Box
                                  key={player.id}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                  }}
                                >
                                  <Typography sx={{ color: "white" }}>
                                    {player.name}
                                  </Typography>
                                  {player.id === team.captain && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        ml: 1,
                                        color: team.color,
                                        px: 0.75,
                                        py: 0.25,
                                        borderRadius: 1,
                                        bgcolor: alpha(team.color, 0.1),
                                        border: `1px solid ${alpha(
                                          team.color,
                                          0.3
                                        )}`,
                                      }}
                                    >
                                      Captain
                                    </Typography>
                                  )}
                                </Box>
                              ))
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </div>
            )}
          </Box>
        )}
      </Container>

      {isMobile && (
        <MobileTourBottomNavigation
          activeTab={tabValue}
          hasTeams={hasTeams}
          tournamentCount={tournamentCount}
          playerCount={playerCount}
          teamCount={teamCount}
          roundCount={roundCount}
          onTabChange={handleTabChange}
        />
      )}

      <Dialog
        open={openAddTournament}
        onClose={handleAddTournamentClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            borderRadius: 2,
          },
        }}
      >
        <TournamentForm
          onSubmit={handleTournamentFormSubmit}
          onCancel={handleAddTournamentClose}
        />
      </Dialog>

      <Dialog
        open={openAddRound}
        onClose={handleAddRoundClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            borderRadius: 2,
          },
        }}
      >
        <RoundForm
          onSubmit={handleRoundFormSubmit}
          onCancel={handleAddRoundClose}
          friends={friends}
          loadingFriends={isLoading}
        />
      </Dialog>

      {/* Edit Tour Dialog */}
      <Dialog
        open={openEditTour}
        onClose={handleEditTourClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            borderRadius: 2,
          },
        }}
      >
        <TourForm
          onSubmit={handleEditTourSubmit}
          onCancel={handleEditTourClose}
          initialData={
            tour
              ? {
                  name: tour.name,
                  startDate: tour.startDate,
                  endDate: tour.endDate,
                  description: tour.description || "",
                }
              : undefined
          }
        />
      </Dialog>

      {/* Player Profile Dialog */}
      <PlayerProfileDialog
        open={profileDialogOpen}
        player={selectedPlayer}
        tournament={{
          ...tour,
          startDate: tour.startDate,
          endDate: tour.endDate,
          rounds: [],
          location: "",
          format: "",
          players: tour.players || [],
          teams: tour.teams || [],
          invitations: [],
          isTeamEvent: true,
          scoringType: "individual",
          status: tour.status || "active",
        }}
        onClose={() => setProfileDialogOpen(false)}
      />
    </Box>
  );
};

export default TourDetails;
