import React, { useState } from "react";
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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TournamentFormData, Player, Tour } from "../types/event";
import TournamentForm from "../components/tournament/TournamentForm";
import TourForm from "../components/tour/TourForm";
import LoadingState from "../components/tournament/LoadingState";
import TourHeader from "../components/tour/TourHeader";
import TourTabs from "../components/tourDetails/TourTabs";
import { BackButton } from "../components/common/index";
import { colors } from "../theme/theme";
import {
  QUERY_KEYS,
  useEventById,
  useTourLeaderboard,
  useAddTournamentToTour,
  useUpdateEvent,
  useDeleteEvent,
} from "../hooks/useEventApi";

const TourDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();

  // Replace useState and useEffect with Tanstack Query hooks
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useEventById(id || "");

  // Extract tour from event data
  const tour = event?.type === "tour" ? (event.data as Tour) : null;

  // Fetch leaderboard using a separate query
  const { data: leaderboard = [], isLoading: isLeaderboardLoading } =
    useTourLeaderboard(id || "", {
      enabled: !!id && !!tour, // Only run if we have a tour
    });

  // Mutations for tour operations
  const addTournamentMutation = useAddTournamentToTour();
  const updateTourMutation = useUpdateEvent();
  const deleteTourMutation = useDeleteEvent();

  const [tabValue, setTabValue] = useState(0);
  const [openAddTournament, setOpenAddTournament] = useState(false);
  const [openEditTour, setOpenEditTour] = useState(false);

  // Is the current user the creator of this tour?
  const isCreator = tour?.createdBy === user?.id;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddTournament = () => {
    setOpenAddTournament(true);
  };

  const handleAddTournamentClose = () => {
    setOpenAddTournament(false);
  };

  const handleEditTour = () => {
    setOpenEditTour(true);
  };

  const handleEditTourClose = () => {
    setOpenEditTour(false);
  };

  const handleTournamentFormSubmit = (data: TournamentFormData) => {
    if (!user || !tour || !id) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || undefined,
      teamId: "",
      bio: "",
      question1: "",
      question2: "",
      question3: "",
      question4: "",
    };

    // Optimistic update
    addTournamentMutation.mutate(
      { tourId: id, tournamentData: data, currentUser },
      {
        onMutate: async (variables) => {
          // Cancel any outgoing refetches
          await queryClient.cancelQueries({
            queryKey: QUERY_KEYS.events.detail(id),
          });

          // Snapshot the previous value
          const previousEvent = queryClient.getQueryData(
            QUERY_KEYS.events.detail(id)
          );

          // Optimistically update to the new value
          queryClient.setQueryData(
            QUERY_KEYS.events.detail(id),
            (oldData: any) => {
              if (!oldData || oldData.type !== "tour") return oldData;

              // Create an optimistic new tournament
              const newTournament = {
                id: `temp-${Date.now()}`, // Temporary ID
                name: data.name,
                format: "Standard",
                startDate: data.startDate,
                endDate: data.endDate,
                location: data.location,
                description: data.description,
                createdBy: currentUser.id,
                createdAt: new Date().toISOString(),
                players: [...(oldData.data.players || [])],
                teams: [...(oldData.data.teams || [])],
                rounds: [],
                invitations: [],
                isTeamEvent: data.isTeamEvent,
                scoringType: data.scoringType,
                status: getEventStatus(data.startDate, data.endDate),
              };

              // Add tournament to the tour's tournaments array
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  tournaments: [...oldData.data.tournaments, newTournament],
                },
              };
            }
          );

          return { previousEvent };
        },
        onError: (err, variables, context) => {
          if (context?.previousEvent) {
            queryClient.setQueryData(
              QUERY_KEYS.events.detail(id),
              context.previousEvent
            );
          }
          console.error("Error adding tournament:", err);
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.events.detail(id),
          });
        },
      }
    );

    setOpenAddTournament(false);
  };

  const handleEditTourSubmit = (data: any) => {
    if (!tour || !id) return;

    const updatedTour = {
      ...tour,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    };

    // Optimistic update
    updateTourMutation.mutate(
      {
        id,
        updates: { data: updatedTour },
      },
      {
        onMutate: async (variables) => {
          // Cancel any outgoing refetches
          await queryClient.cancelQueries({
            queryKey: QUERY_KEYS.events.detail(id),
          });

          // Snapshot the previous value
          const previousEvent = queryClient.getQueryData(
            QUERY_KEYS.events.detail(id)
          );

          // Optimistically update to the new value
          queryClient.setQueryData(
            QUERY_KEYS.events.detail(id),
            (oldData: any) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                data: updatedTour,
              };
            }
          );

          return { previousEvent };
        },
        onError: (err, variables, context) => {
          if (context?.previousEvent) {
            queryClient.setQueryData(
              QUERY_KEYS.events.detail(id),
              context.previousEvent
            );
          }
          console.error("Error updating tour:", err);
        },
      }
    );

    setOpenEditTour(false);
  };

  const handleDeleteTour = () => {
    if (!id) return;

    if (
      window.confirm(
        "Are you sure you want to delete this tour? This action cannot be undone."
      )
    ) {
      deleteTourMutation.mutate(id, {
        onSuccess: () => {
          navigate("/events");
        },
        onError: (err) => {
          console.error("Error deleting tour:", err);
          alert("Failed to delete tour. Please try again.");
        },
      });
    }
  };

  const handleBackToEvents = () => {
    navigate("/events");
  };

  // Handle all possible loading/error states
  if (!isLoaded || isEventLoading || isLeaderboardLoading) {
    return <LoadingState />;
  }

  if (eventError || !tour) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5">
            {eventError ? "Error loading tour" : "Tour not found"}
          </Typography>
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
        background: colors.backgrounds.dark,
        minHeight: "calc(100vh - 64px)",
        py: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <BackButton onClick={handleBackToEvents} label="Back to Events" />

        <TourHeader
          tour={tour}
          isCreator={isCreator}
          onEdit={handleEditTour}
          onDelete={handleDeleteTour}
          theme={theme}
        />

        <TourTabs
          tour={tour}
          tabValue={tabValue}
          leaderboard={leaderboard}
          isCreator={isCreator}
          onTabChange={handleTabChange}
          onAddTournament={handleAddTournament}
          navigateToTournament={(tournamentId) => {
            // Prefetch tournament details when navigating
            queryClient.prefetchQuery({
              queryKey: QUERY_KEYS.tournaments.detail(tournamentId),
              queryFn: () =>
                fetch(`/api/tournaments/${tournamentId}`).then((res) =>
                  res.json()
                ),
            });
            navigate(`/tournaments/${tournamentId}`);
          }}
        />
      </Container>

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
    </Box>
  );
};

// Helper function to determine event status
const getEventStatus = (
  startDate: string,
  endDate: string
): "upcoming" | "active" | "completed" => {
  const today = new Date().toISOString().split("T")[0];

  if (startDate <= today && endDate >= today) {
    return "active";
  } else if (endDate < today) {
    return "completed";
  } else {
    return "upcoming";
  }
};

export default TourDetails;
