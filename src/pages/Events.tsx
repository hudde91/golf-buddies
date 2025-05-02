import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Badge,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  useMediaQuery,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import UpdateIcon from "@mui/icons-material/Update";

import {
  useGetUserEvents,
  useGetUserInvitations,
  useCreateTournament,
  useCreateTour,
  useCreateRound,
  useAcceptInvitation,
  useDeclineInvitation,
} from "../services/eventService";
import { useGetAcceptedFriends } from "../services/friendsService";
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

  const [tabValue, setTabValue] = useState(0);
  const [openNewEvent, setOpenNewEvent] = useState(false);
  const [eventType, setEventType] = useState<
    "tournament" | "tour" | "round" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // React Query hooks
  const { data: userEvents, isLoading: isEventsLoading } = useGetUserEvents(
    user?.id || ""
  );
  const { data: userInvitations, isLoading: isInvitationsLoading } =
    useGetUserInvitations(user?.primaryEmailAddress?.emailAddress || "");
  const { data: friends, isLoading: friendsLoading } = useGetAcceptedFriends(
    user?.id || ""
  );

  const { mutate: createTournament, isPending: isCreatingTournament } =
    useCreateTournament();
  const { mutate: createTour, isPending: isCreatingTour } = useCreateTour();
  const { mutate: createRound, isPending: isCreatingRound } = useCreateRound();
  const { mutate: acceptInvitation } = useAcceptInvitation();
  const { mutate: declineInvitation } = useDeclineInvitation();

  // Type assertion for better type safety
  const tourInvitations: Tour[] = userInvitations?.tours || [];
  const tournamentInvitations: Tournament[] =
    userInvitations?.tournaments || [];
  const roundInvitations: Round[] = userInvitations?.rounds || [];

  const totalInvitations =
    tourInvitations.length +
    tournamentInvitations.length +
    roundInvitations.length;

  // Event handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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
    setErrorMessage(null);

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
    };

    createTournament(
      {
        tournamentData,
        currentUser,
      },
      {
        onSuccess: (newEvent) => {
          console.log("Tournament created:", newEvent);
          setOpenNewEvent(false);
          setEventType(null);

          // Optionally navigate to the new tournament
          navigate(`/tournaments/${newEvent.id}`);
        },
        onError: (error) => {
          console.error("Failed to create tournament:", error);
          setErrorMessage("Failed to create tournament. Please try again.");
        },
      }
    );
  };

  const handleTourSubmit = (tourData: any) => {
    if (!user) return;
    setErrorMessage(null);

    createTour(
      {
        tourData,
        userId: user.id,
        userName: user.fullName || "Unknown User",
      },
      {
        onSuccess: (newEvent) => {
          console.log("Tour created:", newEvent);
          setOpenNewEvent(false);
          setEventType(null);

          // Optionally navigate to the new tour
          navigate(`/tours/${newEvent.id}`);
        },
        onError: (error) => {
          console.error("Failed to create tour:", error);
          setErrorMessage("Failed to create tour. Please try again.");
        },
      }
    );
  };

  const handleRoundSubmit = (roundData: any) => {
    if (!user) return;
    setErrorMessage(null);

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
    };

    createRound(
      {
        roundData,
        currentUser,
      },
      {
        onSuccess: (newEvent) => {
          console.log("Round created:", newEvent);
          setOpenNewEvent(false);
          setEventType(null);

          // Navigate to the new round
          navigate(`/rounds/${newEvent.id}`);
        },
        onError: (error) => {
          console.error("Failed to create round:", error);
          setErrorMessage("Failed to create round. Please try again.");
        },
      }
    );
  };

  const handleViewEvent = (eventId: string, eventType: string) => {
    if (eventType === "round") {
      navigate(`/rounds/${eventId}`);
    } else if (eventType === "tournament") {
      navigate(`/tournaments/${eventId}`);
    } else {
      navigate(`/tours/${eventId}`);
    }
  };

  const handleAcceptInvitation = (eventId: string) => {
    if (!user) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
    };

    acceptInvitation({
      eventId,
      player: currentUser,
    });
  };

  const handleDeclineInvitation = (eventId: string) => {
    if (!user) return;

    declineInvitation({
      eventId,
      userEmail: user.primaryEmailAddress?.emailAddress || "",
    });
  };

  // Use same handlers for round invitations for now
  const handleAcceptRound = handleAcceptInvitation;
  const handleDeclineRound = handleDeclineInvitation;

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  const isLoading = isEventsLoading || isInvitationsLoading || !isLoaded;
  const isSubmitLoading =
    isCreatingTournament || isCreatingTour || isCreatingRound;

  if (isLoading) {
    return <LoadingState />;
  }

  const renderEventCard = (event: Event) => {
    // Extract the common data based on event type
    const name = event.name;
    const description = event.description || "No description";
    const status = event.status || "active";

    // Get players array based on event type
    const players =
      event.type === "tournament"
        ? (event as Tournament).players
        : event.type === "tour"
        ? (event as Tour).players || []
        : event.type === "round"
        ? (event as Round).players || []
        : [];

    // Get date and location based on event type
    const date =
      event.type === "tournament"
        ? (event as Tournament).startDate
        : event.type === "tour"
        ? (event as Tour).startDate
        : (event as Round).date;

    const location =
      event.type === "tournament"
        ? (event as Tournament).location
        : event.type === "round"
        ? (event as Round).location
        : undefined;

    const eventSpecificDetails = () => {
      if (event.type === "round") {
        const round = event as Round;
        return (
          <>
            {round.format && (
              <Chip
                label={round.format}
                size="small"
                sx={styles.chips.eventType.custom(
                  theme.palette.secondary.light
                )}
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

    const getEventTypeIcon = () => {
      switch (event.type) {
        case "tournament":
          return <EmojiEventsIcon fontSize="small" />;
        case "tour":
          return <EmojiEventsIcon fontSize="small" />;
        case "round":
          return <GolfCourseIcon fontSize="small" />;
        default:
          return <EventIcon fontSize="small" />;
      }
    };

    return (
      <Box
        sx={styles.card.event}
        onClick={() => handleViewEvent(event.id, event.type)}
      >
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
                  : styles.chips.eventType.custom(theme.palette.success.main)
              }
            />
          </Box>

          <Typography variant="h6" sx={styles.text.eventTitle}>
            {name}
          </Typography>

          <Typography variant="body2" sx={styles.text.eventDescription}>
            {description}
          </Typography>

          {eventSpecificDetails() && (
            <Box
              sx={{
                mt: 1,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
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

        <Box sx={styles.card.actions.centered}>
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              handleViewEvent(event.id, event.type);
            }}
            sx={styles.button.primary}
            fullWidth
          >
            View Details
          </Button>
        </Box>
      </Box>
    );
  };

  // Render Empty State
  const renderEmptyState = (type: "active" | "upcoming" | "completed") => {
    let icon, title, description;

    switch (type) {
      case "active":
        icon = <PlayArrowIcon sx={styles.feedback.emptyState.icon} />;
        title = "No Active Events";
        description = "You don't have any active events right now.";
        break;
      case "upcoming":
        icon = <UpdateIcon sx={styles.feedback.emptyState.icon} />;
        title = "No Upcoming Events";
        description = "You don't have any upcoming events scheduled.";
        break;
      case "completed":
        icon = <HistoryIcon sx={styles.feedback.emptyState.icon} />;
        title = "No Completed Events";
        description = "You don't have any completed events yet.";
        break;
    }

    return (
      <Box sx={styles.feedback.emptyState.container}>
        {icon}
        <Typography variant="h6" sx={styles.feedback.emptyState.title}>
          {title}
        </Typography>
        <Typography sx={styles.feedback.emptyState.description}>
          {description}
        </Typography>
        {type !== "completed" && (
          <Button
            variant="contained"
            onClick={handleCreateEvent}
            sx={styles.button.create}
          >
            Create gameplay
          </Button>
        )}
      </Box>
    );
  };

  // Filter events based on status
  const activeEvents = (userEvents || []).filter(
    (event) => !event.status || event.status.toLowerCase() === "active"
  );

  const upcomingEvents = (userEvents || []).filter(
    (event) => event.status?.toLowerCase() === "upcoming"
  );

  const completedEvents = (userEvents || []).filter(
    (event) => event.status?.toLowerCase() === "completed"
  );

  return (
    <Box sx={styles.layout.page.withBackground}>
      <Container maxWidth="lg" sx={styles.layout.container.responsive}>
        <Box sx={styles.card.glass}>
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
              sx={{
                ...styles.button.create,
                display: { xs: "none", sm: "block" },
              }}
            >
              Play golf
            </Button>
          </Box>
          <Box
            sx={{
              ...styles.tabs.container,
              display: { xs: "none", sm: "block" },
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="event tabs"
              textColor="inherit"
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PlayArrowIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                    <Typography sx={{ color: "white" }}>Active</Typography>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <UpdateIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                    <Typography sx={{ color: "white" }}>Upcoming</Typography>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HistoryIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                    <Typography sx={{ color: "white" }}>Completed</Typography>
                  </Box>
                }
              />
              <Tab
                label={
                  <Badge badgeContent={totalInvitations} color="error" max={99}>
                    <Typography sx={{ color: "white" }}>Invitations</Typography>
                  </Badge>
                }
              />
            </Tabs>
          </Box>

          {/* Active Events Tab */}
          <div
            role="tabpanel"
            hidden={tabValue !== 0}
            id="events-tabpanel-0"
            aria-labelledby="events-tab-0"
          >
            {tabValue === 0 && (
              <Box sx={styles.tabs.panel}>
                {activeEvents.length > 0 ? (
                  <Grid container spacing={3}>
                    {activeEvents.map((event) => (
                      <Grid item xs={12} sm={6} md={4} key={event.id}>
                        {renderEventCard(event)}
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  renderEmptyState("active")
                )}
              </Box>
            )}
          </div>

          {/* Upcoming Events Tab */}
          <div
            role="tabpanel"
            hidden={tabValue !== 1}
            id="events-tabpanel-1"
            aria-labelledby="events-tab-1"
          >
            {tabValue === 1 && (
              <Box sx={styles.tabs.panel}>
                {upcomingEvents.length > 0 ? (
                  <Grid container spacing={3}>
                    {upcomingEvents.map((event) => (
                      <Grid item xs={12} sm={6} md={4} key={event.id}>
                        {renderEventCard(event)}
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  renderEmptyState("upcoming")
                )}
              </Box>
            )}
          </div>

          {/* Completed Events Tab */}
          <div
            role="tabpanel"
            hidden={tabValue !== 2}
            id="events-tabpanel-2"
            aria-labelledby="events-tab-2"
          >
            {tabValue === 2 && (
              <Box sx={styles.tabs.panel}>
                {completedEvents.length > 0 ? (
                  <Grid container spacing={3}>
                    {completedEvents.map((event) => (
                      <Grid item xs={12} sm={6} md={4} key={event.id}>
                        {renderEventCard(event)}
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  renderEmptyState("completed")
                )}
              </Box>
            )}
          </div>

          {/* Invitations Tab */}
          <div
            role="tabpanel"
            hidden={tabValue !== 3}
            id="events-tabpanel-3"
            aria-labelledby="events-tab-3"
          >
            {tabValue === 3 && (
              <Box sx={styles.tabs.panel}>
                <InvitationList
                  tourInvitations={tourInvitations}
                  tournamentInvitations={tournamentInvitations}
                  roundInvitations={roundInvitations}
                  onAcceptInvitation={handleAcceptInvitation}
                  onDeclineInvitation={handleDeclineInvitation}
                  onAcceptRound={handleAcceptRound}
                  onDeclineRound={handleDeclineRound}
                />
              </Box>
            )}
          </div>
        </Box>
      </Container>

      <Paper
        sx={{
          ...styles.bottomNavigation.container,
          overflow: "visible", // Allow the FAB to overflow
        }}
      >
        <Box sx={{ position: "relative", height: "100%" }}>
          <Fab
            color="primary"
            aria-label="create gameplay"
            onClick={handleCreateEvent}
            sx={{
              position: "absolute",
              top: "-28px", // Pull up to overlap with the navigation
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1101, // Above the bottom navigation
              width: "60px",
              height: "60px",
              boxShadow: (theme) =>
                `0 4px 10px ${alpha(theme.palette.common.black, 0.3)}`,
            }}
          >
            <AddIcon sx={{ fontSize: "28px" }} />
          </Fab>

          <BottomNavigation
            value={tabValue}
            onChange={handleTabChange}
            showLabels
            sx={{
              height: "100%",
              width: "100%",
            }}
          >
            <BottomNavigationAction
              label="Active"
              icon={<PlayArrowIcon />}
              sx={styles.bottomNavigation.action}
            />
            <BottomNavigationAction
              label="Upcoming"
              icon={<UpdateIcon />}
              sx={styles.bottomNavigation.action}
            />
            <BottomNavigationAction
              label="Completed"
              icon={<HistoryIcon />}
              sx={styles.bottomNavigation.action}
            />
            <BottomNavigationAction
              label="Invites"
              icon={
                <Badge badgeContent={totalInvitations} color="error" max={99}>
                  <NotificationsIcon />
                </Badge>
              }
              sx={styles.bottomNavigation.action}
            />
          </BottomNavigation>
        </Box>
      </Paper>
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
                  startIcon={<EmojiEventsIcon />}
                  endIcon={<EmojiEventsIcon />}
                  onClick={() => handleEventTypeSelect("tour")}
                  sx={{
                    p: 2,
                    minWidth: isMobile ? "100%" : "180px",
                    bgcolor: "secondary.main",
                    "&:hover": { bgcolor: "secondary.dark" },
                  }}
                >
                  Tour
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
            friends={friends || []}
            loadingFriends={friendsLoading}
          />
        ) : (
          <TourForm
            onSubmit={handleTourSubmit}
            onCancel={handleEventFormClose}
          />
        )}
      </Dialog>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Events;
