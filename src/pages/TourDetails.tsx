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
import {
  useGetEventById,
  useUpdateEvent,
  useDeleteEvent,
  useAddRoundToTour,
  useAddTournamentToTour,
  useUpdatePlayerGroups,
} from "../services/eventService";
import {
  Tour,
  TournamentFormData,
  Player,
  RoundFormData,
  PlayerGroup,
  Team,
  TeamFormData,
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
import PlayerProfileDialog from "../components/players/PlayerProfileDialog";
import { useGetAcceptedFriends } from "../services/friendsService";
import TeamManagement from "../components/teams/TeamManagement";

const TourDetails: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabValue, setTabValue] = useState(0);
  const [openAddTournament, setOpenAddTournament] = useState(false);
  const [openAddRound, setOpenAddRound] = useState(false);
  const [openEditTour, setOpenEditTour] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  // React Query hooks
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useGetEventById(id);
  const { data: friends, isLoading: friendsLoading } = useGetAcceptedFriends(
    user?.id || ""
  );
  const { mutate: updateEvent } = useUpdateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutate: addRoundToTour } = useAddRoundToTour();
  const { mutate: addTournamentToTour } = useAddTournamentToTour();
  const { mutate: updatePlayerGroups } = useUpdatePlayerGroups();

  // Derived state
  const tour = event && event.type === "tour" ? (event as Tour) : null;
  const isCreator = tour ? tour.createdBy === user?.id : false;
  const roundCount = tour?.rounds?.length || 0;
  const tournamentCount = tour?.tournaments?.length || 0;
  const playerCount = tour?.players?.length || 0;
  const teamCount = tour?.teams?.length || 0;
  const hasTeams = Boolean(tour?.teams && tour.teams.length > 0);

  // Calculate leaderboard data
  const leaderboard = tour ? calculateTourLeaderboard(tour) : [];
  const teamLeaderboard =
    tour && hasTeams ? calculateTeamLeaderboard(tour) : [];

  // Set selected round ID when tour data is loaded
  useEffect(() => {
    if (tour?.rounds && tour.rounds.length > 0 && !selectedRoundId) {
      setSelectedRoundId(tour.rounds[0].id);
    }
  }, [tour, selectedRoundId]);

  const handleSelectRound = (roundId: string) => {
    setSelectedRoundId(roundId);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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

  const handleTournamentFormSubmit = (
    data: TournamentFormData & { inviteFriends?: string[] }
  ) => {
    if (!user || !tour) return;

    const currentUser: Player = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim() || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
    };

    addTournamentToTour({
      tourId: id,
      tournamentData: data,
      currentUser,
    });

    setOpenAddTournament(false);
  };

  const handleRoundFormSubmit = (
    data: RoundFormData & { inviteFriends?: string[] }
  ) => {
    if (!user || !tour) return;

    const currentUser: Player = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim() || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
    };

    addRoundToTour({
      tourId: id,
      roundData: data,
      currentUser,
    });

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

    updateEvent({
      eventId: id,
      updates: updatedTour,
    });

    setOpenEditTour(false);
  };

  const handleDeleteTour = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this tour? This action cannot be undone."
      )
    ) {
      deleteEvent(id);
      navigate("/events");
    }
  };

  const handleDeleteRound = (roundId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this round? This action cannot be undone."
      )
    ) {
      // We need to update the tour by removing the round
      if (tour) {
        const updatedTour = {
          ...tour,
          rounds: tour.rounds.filter((round) => round.id !== roundId),
        };

        updateEvent({
          eventId: id,
          updates: updatedTour,
        });
      }
    }
  };

  const handleUpdatePlayerGroups = (
    roundId: string,
    playerGroups: PlayerGroup[]
  ) => {
    updatePlayerGroups({
      eventId: id,
      roundId,
      playerGroups,
    });
  };

  const handleBackToEvents = () => {
    navigate("/events");
  };

  // Team management handlers
  const handleAddTeam = (teamData: TeamFormData) => {
    if (!tour) return;

    // Add the team to the existing teams array
    const updatedTeams = [
      ...(tour.teams || []),
      {
        id: Math.random().toString(36).substring(2, 9), // Temporary ID, will be replaced by the server
        name: teamData.name,
        color: teamData.color,
        players: [],
      },
    ];

    updateEvent({
      eventId: id,
      updates: {
        ...tour,
        teams: updatedTeams,
      },
    });
  };

  const handleUpdateTeam = (teamId: string, teamData: Partial<Team>) => {
    if (!tour || !tour.teams) return;

    // Update the specific team
    const updatedTeams = tour.teams.map((team) =>
      team.id === teamId ? { ...team, ...teamData } : team
    );

    updateEvent({
      eventId: id,
      updates: {
        ...tour,
        teams: updatedTeams,
      },
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    if (!tour || !tour.teams) return;

    // Remove the team
    const updatedTeams = tour.teams.filter((team) => team.id !== teamId);

    // Also remove team assignments from players
    const updatedPlayers = tour.players?.map((player) =>
      player.teamId === teamId ? { ...player, teamId: "" } : player
    );

    updateEvent({
      eventId: id,
      updates: {
        ...tour,
        teams: updatedTeams,
        players: updatedPlayers,
      },
    });
  };

  const handleAssignPlayerToTeam = (playerId: string, teamId?: string) => {
    if (!tour || !tour.players) return;

    // Update the player's team assignment
    const updatedPlayers = tour.players.map((player) =>
      player.id === playerId ? { ...player, teamId: teamId || "" } : player
    );

    updateEvent({
      eventId: id,
      updates: {
        ...tour,
        players: updatedPlayers,
      },
    });
  };

  // Helper function to calculate tour leaderboard
  function calculateTourLeaderboard(tour: Tour) {
    // Create a simple leaderboard calculation for tours
    // This is a basic implementation - you might need to adjust based on your scoring system
    const playerScores: Record<
      string,
      {
        playerId: string;
        playerName: string;
        totalPoints: number;
        tournamentResults: Record<string, number>;
      }
    > = {};

    // Process tournaments
    tour.tournaments?.forEach((tournament) => {
      // Add tournament results to player scores
      tournament.players?.forEach((player) => {
        if (!playerScores[player.id]) {
          playerScores[player.id] = {
            playerId: player.id,
            playerName: player.name,
            totalPoints: 0,
            tournamentResults: {},
          };
        }

        // Add tournament points (simplified calculation)
        const playerTotalScore =
          tournament.rounds?.reduce((total, round) => {
            const playerScores = round.scores[player.id] || [];
            const roundScore = playerScores.reduce(
              (sum, hole) => sum + (hole.score || 0),
              0
            );
            return total + roundScore;
          }, 0) || 0;

        playerScores[player.id].tournamentResults[tournament.id] =
          playerTotalScore;
        playerScores[player.id].totalPoints += playerTotalScore;
      });
    });

    // Process individual rounds not part of tournaments
    tour.rounds?.forEach((round) => {
      Object.entries(round.scores || {}).forEach(([playerId, scores]) => {
        // Find player name
        const player = tour.players?.find((p) => p.id === playerId);
        if (!player) return;

        if (!playerScores[playerId]) {
          playerScores[playerId] = {
            playerId,
            playerName: player.name,
            totalPoints: 0,
            tournamentResults: {},
          };
        }

        // Calculate round score
        const roundScore = scores.reduce(
          (sum, hole) => sum + (hole.score || 0),
          0
        );
        playerScores[playerId].totalPoints += roundScore;
      });
    });

    // Convert to array and sort
    return Object.values(playerScores).sort(
      (a, b) => a.totalPoints - b.totalPoints
    );
  }

  // Helper function to calculate team leaderboard
  function calculateTeamLeaderboard(tour: Tour) {
    if (!tour.teams || tour.teams.length === 0) return [];

    // Create team score tracking
    const teamScores: Record<
      string,
      {
        teamId: string;
        teamName: string;
        teamColor: string;
        playerCount: number;
        totalPoints: number;
        tournamentResults: Record<string, number>;
      }
    > = {};

    // Initialize teams
    tour.teams.forEach((team) => {
      teamScores[team.id] = {
        teamId: team.id,
        teamName: team.name,
        teamColor: team.color || "#ffffff",
        playerCount: 0,
        totalPoints: 0,
        tournamentResults: {},
      };
    });

    // Count players per team
    tour.players?.forEach((player) => {
      if (player.teamId && teamScores[player.teamId]) {
        teamScores[player.teamId].playerCount++;
      }
    });

    // Calculate team scores from tournaments
    tour.tournaments?.forEach((tournament) => {
      // Group players by team
      const teamPlayers: Record<string, Player[]> = {};

      tournament.players?.forEach((player) => {
        if (player.teamId) {
          if (!teamPlayers[player.teamId]) {
            teamPlayers[player.teamId] = [];
          }
          teamPlayers[player.teamId].push(player);
        }
      });

      // Calculate team scores for this tournament
      Object.entries(teamPlayers).forEach(([teamId, players]) => {
        if (!teamScores[teamId]) return;

        let teamTournamentScore = 0;

        // Sum player scores
        players.forEach((player) => {
          const playerTournamentScore =
            tournament.rounds?.reduce((total, round) => {
              const playerRoundScores = round.scores[player.id] || [];
              const roundScore = playerRoundScores.reduce(
                (sum, hole) => sum + (hole.score || 0),
                0
              );
              return total + roundScore;
            }, 0) || 0;

          teamTournamentScore += playerTournamentScore;
        });

        // Average by number of players if needed
        if (players.length > 0) {
          teamTournamentScore = teamTournamentScore / players.length;
        }

        teamScores[teamId].tournamentResults[tournament.id] =
          teamTournamentScore;
        teamScores[teamId].totalPoints += teamTournamentScore;
      });
    });

    // Convert to array and sort
    return Object.values(teamScores).sort(
      (a, b) => a.totalPoints - b.totalPoints
    );
  }

  // Loading state
  if (isEventLoading || !isLoaded) {
    return <LoadingState />;
  }

  // Error state
  if (eventError || !tour) {
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
            teamLeaderboard={teamLeaderboard}
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
              navigate(`/rounds/${roundId}`);
            }}
            onDeleteTeam={handleDeleteTeam}
            onUpdateTeam={handleUpdateTeam}
            onAddTeam={handleAddTeam}
            onAssignPlayer={handleAssignPlayerToTeam}
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
                          Players: {Object.keys(round.scores || {}).length}
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

            {tour.isTeamEvent && hasTeams && (
              <div
                role="tabpanel"
                hidden={tabValue !== 4}
                id="tour-tabpanel-4"
                aria-labelledby="tour-tab-4"
              >
                {tabValue === 4 && (
                  <Box sx={styles.tabs.panel}>
                    <TeamManagement
                      event={tour}
                      isCreator={isCreator}
                      onAddTeam={handleAddTeam}
                      onUpdateTeam={handleUpdateTeam}
                      onDeleteTeam={handleDeleteTeam}
                      onAssignPlayer={handleAssignPlayerToTeam}
                    />
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
          hasTeams={Boolean(tour.teams && tour.teams.length > 0)}
          tournamentCount={tournamentCount}
          playerCount={playerCount}
          teamCount={teamCount || 0}
          roundCount={roundCount}
          onTabChange={handleTabChange}
          highlightCount={0}
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
          friends={friends || []}
          loadingFriends={friendsLoading}
        />
      </Dialog>

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
        event={tour}
        onClose={() => setProfileDialogOpen(false)}
      />
    </Box>
  );
};

export default TourDetails;
