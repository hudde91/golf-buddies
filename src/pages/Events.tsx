import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Badge,
  Typography,
  Dialog,
  useTheme,
  alpha,
  Button,
  ButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import eventService from "../services/eventService";
import { Event, Tournament, Player } from "../types/event";
import TournamentForm from "../components/tournament/TournamentForm";
import TourForm from "../components/tour/TourForm";
import EventHeader from "../components/EventHeader";
import EventGrid from "../components/EventGrid";
import InvitationList from "../components/invitation/InvitationList";
import LoadingState from "../components/tournament/LoadingState";
import { TabPanel } from "../components/common/index";

const Events: React.FC = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();

  const [events, setEvents] = useState<Event[]>([]);
  const [invitations, setInvitations] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const [openNewEvent, setOpenNewEvent] = useState(false);
  const [eventType, setEventType] = useState<"tournament" | "tour" | null>(
    null
  );

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = () => {
      setIsLoading(true);

      // Get user's events and invitations
      const userEvents = eventService.getUserEvents(user.id);
      const userInvitations = eventService.getUserInvitations(
        user.primaryEmailAddress?.emailAddress || ""
      );

      setEvents(userEvents);
      setInvitations(userInvitations);
      setIsLoading(false);
    };

    fetchData();
  }, [user, isLoaded]);

  // Event handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateEvent = () => {
    setOpenNewEvent(true);
  };

  const handleEventTypeSelect = (type: "tournament" | "tour") => {
    setEventType(type);
  };

  const handleEventFormClose = () => {
    setOpenNewEvent(false);
    setEventType(null);
  };

  const handleTournamentSubmit = (tournamentData: any) => {
    if (!user) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || undefined,
    };

    const newEvent = eventService.createTournament(tournamentData, currentUser);
    setEvents([...events, newEvent]);
    setOpenNewEvent(false);
    setEventType(null);
  };

  const handleTourSubmit = (tourData: any) => {
    if (!user) return;

    const newEvent = eventService.createTour(
      tourData,
      user.id,
      user.fullName || "Unknown User"
    );
    setEvents([...events, newEvent]);
    setOpenNewEvent(false);
    setEventType(null);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleAcceptInvitation = (tournamentId: string) => {
    if (!user) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || undefined,
    };

    const acceptedEvent = eventService.acceptInvitation(
      tournamentId,
      currentUser
    );

    if (acceptedEvent) {
      // Update state
      const updatedInvitations = invitations.filter(
        (t) => t.id !== tournamentId
      );
      setInvitations(updatedInvitations);

      // Check if the event is already in our events list
      if (!events.some((e) => e.id === acceptedEvent.id)) {
        setEvents([...events, acceptedEvent]);
      }
    }
  };

  const handleDeclineInvitation = (tournamentId: string) => {
    if (!user) return;

    eventService.declineInvitation(
      tournamentId,
      user.primaryEmailAddress?.emailAddress || ""
    );

    // Update state
    const updatedInvitations = invitations.filter((t) => t.id !== tournamentId);
    setInvitations(updatedInvitations);
  };

  if (isLoading || !isLoaded) {
    return <LoadingState />;
  }

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
        minHeight: "calc(100vh - 64px)",
        py: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.common.black, 0.3),
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
        >
          <EventHeader onCreateEvent={handleCreateEvent} />

          <Box
            sx={{
              borderBottom: 1,
              borderColor: alpha(theme.palette.common.white, 0.2),
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="event tabs"
              textColor="inherit"
              TabIndicatorProps={{
                style: { background: "white" },
              }}
            >
              <Tab label="My Events" sx={{ color: "white" }} />
              <Tab
                label={
                  <Badge
                    badgeContent={invitations.length}
                    color="error"
                    max={99}
                  >
                    <Typography sx={{ color: "white" }}>Invitations</Typography>
                  </Badge>
                }
              />
            </Tabs>
          </Box>

          <TabPanel id="events" value={tabValue} index={0}>
            <EventGrid
              events={events}
              userId={user?.id || ""}
              onViewDetails={handleViewEvent}
              onCreateEvent={handleCreateEvent}
            />
          </TabPanel>

          <TabPanel id="invitations" value={tabValue} index={1}>
            <InvitationList
              invitations={invitations}
              onAcceptInvitation={handleAcceptInvitation}
              onDeclineInvitation={handleDeclineInvitation}
            />
          </TabPanel>
        </Box>
      </Container>

      {/* Create New Event Dialog */}
      <Dialog
        open={openNewEvent}
        onClose={handleEventFormClose}
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
        {!eventType ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" color="white" gutterBottom>
              Create New Event
            </Typography>
            <Typography variant="body1" color="white" sx={{ mb: 4 }}>
              Choose the type of event you want to create
            </Typography>
            <ButtonGroup variant="contained" size="large" sx={{ mb: 2 }}>
              <Button
                onClick={() => handleEventTypeSelect("tournament")}
                sx={{ p: 2, minWidth: "180px" }}
              >
                Single Tournament
              </Button>
              <Button
                onClick={() => handleEventTypeSelect("tour")}
                sx={{ p: 2, minWidth: "180px" }}
              >
                Tournament Series (Tour)
              </Button>
            </ButtonGroup>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleEventFormClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : eventType === "tournament" ? (
          <TournamentForm
            onSubmit={handleTournamentSubmit}
            onCancel={handleEventFormClose}
          />
        ) : (
          <TourForm
            onSubmit={handleTourSubmit}
            onCancel={handleEventFormClose}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default Events;
