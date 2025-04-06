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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import eventService from "../services/eventService";
import { Event, Tour, TournamentFormData, Player } from "../types/event";
import TournamentForm from "../components/tournament/TournamentForm";
import TourForm from "../components/tour/TourForm";
import LoadingState from "../components/tournament/LoadingState";
import TourHeader from "../components/tour/TourHeader";
import TourTabs from "../components/tourDetails/TourTabs";
import { colors, useStyles } from "../styles";

const TourDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = useStyles();

  const [event, setEvent] = useState<Event | null>(null);
  const [tour, setTour] = useState<Tour | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openAddTournament, setOpenAddTournament] = useState(false);
  const [openEditTour, setOpenEditTour] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || !id) return;

    const fetchData = () => {
      setIsLoading(true);
      const fetchedEvent = eventService.getEventById(id);

      if (fetchedEvent && fetchedEvent.type === "tour") {
        setEvent(fetchedEvent);
        setTour(fetchedEvent.data as Tour);
        setIsCreator(fetchedEvent.data.createdBy === user.id);

        const tourLeaderboard = eventService.getTourLeaderboard(id);
        setLeaderboard(tourLeaderboard);
      } else {
        // If it's not a tour, redirect to events page
        navigate("/events");
      }

      setIsLoading(false);
    };

    fetchData();
  }, [id, user, isLoaded, navigate]);

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
    if (!user || !tour) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || undefined,
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

  return (
    <Box
      sx={{
        background: colors.background.main,
        minHeight: "calc(100vh - 64px)",
        py: { xs: 3, md: 4 },
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

        <TourTabs
          tour={tour}
          tabValue={tabValue}
          leaderboard={leaderboard}
          isCreator={isCreator}
          onTabChange={handleTabChange}
          onAddTournament={handleAddTournament}
          navigateToTournament={(tournamentId) =>
            navigate(`/tournaments/${tournamentId}`)
          }
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

export default TourDetails;
