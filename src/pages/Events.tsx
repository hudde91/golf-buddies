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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";

import eventService from "../services/eventService";
import friendsService from "../services/friendsService";
import { Event, Tournament, Player, Tour, Round } from "../types/event";
import TournamentForm from "../components/tournament/TournamentForm";
import TourForm from "../components/tour/TourForm";
import RoundForm from "../components/round/RoundForm";
import InvitationList from "../components/invitation/InvitationList";
import LoadingState from "../components/tournament/LoadingState";

import { useStyles } from "../styles/hooks/useStyles";

const Events: React.FC = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [events, setEvents] = useState<Event[]>([]);
  const [invitations, setInvitations] = useState<Tournament[]>([]);
  const [roundInvitations, setRoundInvitations] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const [openNewEvent, setOpenNewEvent] = useState(false);
  const [eventType, setEventType] = useState<
    "tournament" | "tour" | "round" | null
  >(null);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      setIsLoading(true);

      // Get user's events and invitations
      const userEvents = eventService.getUserEvents(user.id);

      // Get all invitations (tournaments, tours, rounds)
      const userInvitationsAll = eventService.getUserInvitations(
        user.primaryEmailAddress?.emailAddress || ""
      );

      // Load friends for round creation
      const userFriends = friendsService.getAcceptedFriends(user.id);

      setEvents(userEvents);
      setInvitations(userInvitationsAll.tournaments);
      setRoundInvitations(userInvitationsAll.rounds || []);
      setFriends(userFriends);
      setLoadingFriends(false);
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

  const handleEventTypeSelect = (type: "tournament" | "tour" | "round") => {
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

  const handleRoundSubmit = (roundData: any) => {
    if (!user) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || undefined,
    };

    const newEvent = eventService.createRound(roundData, currentUser);
    setEvents([...events, newEvent]);
    setOpenNewEvent(false);
    setEventType(null);

    // Optionally navigate to the new round
    navigate(`/rounds/${newEvent.id}`);
  };

  const handleViewEvent = (eventId: string, eventType: string) => {
    if (eventType === "round") {
      navigate(`/rounds/${eventId}`);
    } else {
      navigate(`/events/${eventId}`);
    }
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

  const handleAcceptRound = (roundId: string) => {
    if (!user) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || undefined,
    };

    const acceptedEvent = eventService.acceptRoundInvitation(
      roundId,
      currentUser
    );

    if (acceptedEvent) {
      const updatedInvitations = roundInvitations.filter(
        (r) => r.id !== roundId
      );
      setRoundInvitations(updatedInvitations);

      // Check if the event is already in our events list
      if (!events.some((e) => e.id === acceptedEvent.id)) {
        setEvents([...events, acceptedEvent]);
      }
    }
  };

  const handleDeclineRound = (roundId: string) => {
    if (!user) return;

    eventService.declineRoundInvitation(
      roundId,
      user.primaryEmailAddress?.emailAddress || ""
    );

    // Update state
    const updatedInvitations = roundInvitations.filter((r) => r.id !== roundId);
    setRoundInvitations(updatedInvitations);
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
    const status = eventData.status!;

    // Get players array based on event type
    const players =
      event.type === "tournament"
        ? (eventData as Tournament).players
        : event.type === "tour"
        ? (eventData as Tour).players || []
        : (eventData as Round).players || [];

    // Get date and location based on event type
    const date =
      event.type === "tournament"
        ? (eventData as Tournament).startDate
        : event.type === "tour"
        ? (eventData as Tour).startDate
        : (eventData as Round).date;

    const location =
      event.type === "tournament"
        ? (eventData as Tournament).location
        : event.type === "round"
        ? (eventData as Round).location
        : undefined;

    // Get specific details based on event type
    const eventSpecificDetails = () => {
      if (event.type === "round") {
        const round = eventData as Round;
        return (
          <>
            {round.format && (
              <Chip
                label={round.format}
                size="small"
                sx={styles.chips.eventType.custom("secondary.light")}
              />
            )}
            {round.courseDetails?.holes && (
              <Chip
                label={`${round.courseDetails?.holes} holes`}
                size="small"
                sx={styles.chips.eventType.custom(theme.palette.info.light)}
              />
            )}
          </>
        );
      }
      return null;
    };

    // Get specific icon based on event type
    const getEventTypeIcon = () => {
      switch (event.type) {
        case "tournament":
          return <EmojiEventsIcon fontSize="small" />;
        case "tour":
          return <SportsTennisIcon fontSize="small" />;
        case "round":
          return <GolfCourseIcon fontSize="small" />;
        default:
          return <EventIcon fontSize="small" />;
      }
    };

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
              icon={getEventTypeIcon()}
              label={event.type}
              size="small"
              sx={
                event.type === "tournament"
                  ? styles.chips.eventType.tournament
                  : event.type === "tour"
                  ? styles.chips.eventType.tour
                  : styles.chips.eventType.custom("success.main")
              }
            />
          </Box>

          <Typography variant="h6" sx={styles.text.eventTitle}>
            {name}
          </Typography>

          <Typography variant="body2" sx={styles.text.eventDescription}>
            {description}
          </Typography>

          {/* Event-specific details */}
          {eventSpecificDetails() && (
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {eventSpecificDetails()}
            </Box>
          )}

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
            onClick={() => handleViewEvent(event.id, event.type)}
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

  const totalInvitations = invitations.length + roundInvitations.length;

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
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab label="My Events" />
              <Tab
                label={
                  <Badge badgeContent={totalInvitations} color="error" max={99}>
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
                {/* Replace with UpdatedInvitationList when implemented */}
                <InvitationList
                  invitations={invitations}
                  roundInvitations={roundInvitations}
                  onAcceptInvitation={handleAcceptInvitation}
                  onDeclineInvitation={handleDeclineInvitation}
                  onAcceptRound={handleAcceptRound}
                  onDeclineRound={handleDeclineRound}
                />

                {/* Display round invitations here */}
                {roundInvitations.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Round Invitations
                    </Typography>
                    <Grid container spacing={3}>
                      {roundInvitations.map((round) => (
                        <Grid item xs={12} key={round.id}>
                          {/* You'll need to create RoundInvitationCard component */}
                          <Box sx={styles.card.invitation}>
                            <Box sx={{ p: 3 }}>
                              <Typography variant="h6">
                                Round Invitation: {round.name}
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <CalendarTodayIcon sx={{ mr: 1 }} />
                                <Typography>
                                  {new Date(round.date).toLocaleDateString()}
                                </Typography>
                              </Box>
                              {round.location && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                  }}
                                >
                                  <LocationOnIcon sx={{ mr: 1 }} />
                                  <Typography>{round.location}</Typography>
                                </Box>
                              )}
                              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleAcceptRound(round.id)}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => handleDeclineRound(round.id)}
                                  sx={styles.button.danger}
                                >
                                  Decline
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </div>
        </Box>
      </Container>

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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                  mt: 3,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<GolfCourseIcon />}
                  onClick={() => handleEventTypeSelect("round")}
                  sx={{
                    p: 2,
                    minWidth: isMobile ? "100%" : "180px",
                    bgcolor: "success.main",
                    color: "white",
                    "&:hover": { bgcolor: "success.dark" },
                  }}
                >
                  Single Round
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EmojiEventsIcon />}
                  onClick={() => handleEventTypeSelect("tournament")}
                  sx={{
                    p: 2,
                    minWidth: isMobile ? "100%" : "180px",
                  }}
                >
                  Tournament
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SportsTennisIcon />}
                  onClick={() => handleEventTypeSelect("tour")}
                  sx={{
                    p: 2,
                    minWidth: isMobile ? "100%" : "180px",
                    bgcolor: "secondary.main",
                    "&:hover": { bgcolor: "secondary.dark" },
                  }}
                >
                  Tournament Series
                </Button>
              </Box>
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
        ) : eventType === "round" ? (
          <RoundForm
            onSubmit={handleRoundSubmit}
            onCancel={handleEventFormClose}
            friends={friends}
            loadingFriends={loadingFriends}
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
