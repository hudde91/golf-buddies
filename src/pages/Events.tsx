import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Badge,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";

import eventService from "../services/eventService";
import { Event, Tournament, Player, Tour } from "../types/event";
import TournamentForm from "../components/tournament/TournamentForm";
import TourForm from "../components/tour/TourForm";
import InvitationList from "../components/invitation/InvitationList";
import LoadingState from "../components/tournament/LoadingState";

import { useStyles } from "../styles/hooks/useStyles";

const Events: React.FC = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const styles = useStyles();

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

  const renderEventHeader = () => {
    return (
      <Box sx={styles.headers.event.container}>
        <Box sx={styles.headers.event.iconContainer}>
          <EventIcon sx={styles.headers.event.icon} />
          <Box>
            <Typography variant="h4" sx={styles.headers.event.title}>
              Events
            </Typography>
            <Typography variant="body1" sx={styles.headers.event.subtitle}>
              Create, join, and manage your golf events
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={handleCreateEvent}
          sx={styles.button.create}
        >
          Create Event
        </Button>
      </Box>
    );
  };

  const renderEventCard = (event: Event) => {
    // Extract the common data based on event type
    const eventData = event.data;
    const name = eventData.name;
    const description = eventData.description || "No description";
    const status = eventData.status;

    // Get players array based on event type
    const players =
      event.type === "tournament"
        ? (eventData as Tournament).players
        : (eventData as Tour).players || [];

    // Get date and location based on event type
    const date =
      event.type === "tournament"
        ? (eventData as Tournament).startDate
        : (eventData as Tour).startDate;

    const location =
      event.type === "tournament"
        ? (eventData as Tournament).location
        : undefined;

    return (
      <Box sx={styles.card.event}>
        <Box sx={styles.card.eventContent}>
          <Box sx={styles.card.eventChipsContainer}>
            <Chip
              label={status}
              size="small"
              sx={styles.getStatusChip(status)}
            />

            <Chip
              label={event.type}
              size="small"
              sx={
                event.type === "tournament"
                  ? styles.chips.eventType.tournament
                  : styles.chips.eventType.tour
              }
            />
          </Box>

          <Typography variant="h6" sx={styles.text.eventTitle}>
            {name}
          </Typography>

          <Typography variant="body2" sx={styles.text.eventDescription}>
            {description}
          </Typography>

          <Divider sx={styles.divider.standard} />

          <Box sx={styles.infoItem.container}>
            {date && (
              <Box sx={styles.infoItem.base}>
                <CalendarTodayIcon sx={styles.icon.infoIcon} />
                <Typography sx={styles.text.body.muted}>
                  {new Date(date).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            {location && (
              <Box sx={styles.infoItem.base}>
                <LocationOnIcon sx={styles.icon.infoIcon} />
                <Typography sx={styles.text.body.muted}>{location}</Typography>
              </Box>
            )}

            {players && players.length > 0 && (
              <Box sx={styles.infoItem.base}>
                <PeopleIcon sx={styles.icon.infoIcon} />
                <Typography sx={styles.text.body.muted}>
                  {players.length} players
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Card Actions */}
        <Box sx={styles.card.actions.centered}>
          <Button
            variant="contained"
            onClick={() => handleViewEvent(event.id)}
            sx={styles.button.viewDetails}
            fullWidth
          >
            View Details
          </Button>
        </Box>
      </Box>
    );
  };

  // Render Empty State
  const renderEmptyState = () => {
    return (
      <Box sx={styles.feedback.emptyState.container}>
        <CalendarTodayIcon sx={styles.feedback.emptyState.icon} />
        <Typography variant="h6" sx={styles.feedback.emptyState.title}>
          No Events Found
        </Typography>
        <Typography sx={styles.feedback.emptyState.description}>
          You don't have any events yet. Create a new event to get started.
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreateEvent}
          sx={styles.button.create}
        >
          Create Event
        </Button>
      </Box>
    );
  };

  return (
    <Box sx={styles.layout.page.withBackground}>
      <Container maxWidth="lg" sx={styles.layout.container.responsive}>
        <Box sx={styles.card.glass}>
          {renderEventHeader()}

          <Box sx={styles.tabs.container}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="event tabs"
              textColor="inherit"
            >
              <Tab label="My Events" />
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

          {/* Tab Panels */}
          <div
            role="tabpanel"
            hidden={tabValue !== 0}
            id="events-tabpanel-0"
            aria-labelledby="events-tab-0"
          >
            {tabValue === 0 && (
              <Box sx={styles.tabs.panel}>
                {events.length > 0 ? (
                  <Grid container spacing={3}>
                    {events.map((event) => (
                      <Grid item xs={12} sm={6} md={4} key={event.id}>
                        {renderEventCard(event)}
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  renderEmptyState()
                )}
              </Box>
            )}
          </div>

          <div
            role="tabpanel"
            hidden={tabValue !== 1}
            id="events-tabpanel-1"
            aria-labelledby="events-tab-1"
          >
            {tabValue === 1 && (
              <Box sx={styles.tabs.panel}>
                <InvitationList
                  invitations={invitations}
                  onAcceptInvitation={handleAcceptInvitation}
                  onDeclineInvitation={handleDeclineInvitation}
                />
              </Box>
            )}
          </div>
        </Box>
      </Container>

      {/* Create New Event Dialog */}
      <Dialog
        open={openNewEvent}
        onClose={handleEventFormClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: styles.dialogs.paper,
        }}
      >
        {!eventType ? (
          <>
            <DialogContent sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h5" sx={styles.text.dialog.title}>
                Create New Event
              </Typography>
              <Typography variant="body1" sx={styles.text.dialog.description}>
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
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleEventFormClose}
                sx={styles.button.outlined}
              >
                Cancel
              </Button>
            </DialogActions>
          </>
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
