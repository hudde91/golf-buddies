import React from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import RoomIcon from "@mui/icons-material/Room";
import PeopleIcon from "@mui/icons-material/People";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { Event, Tournament, Tour } from "../types/event";
import { useEventStyles } from "../styles/modules/event";

interface EventCardProps {
  event: Event;
  userId: string;
  onViewDetails: (eventId: string) => void;
}

// To be removed, not used
const EventCard: React.FC<EventCardProps> = ({
  event,
  userId,
  onViewDetails,
}) => {
  const styles = useEventStyles();

  let name = "";
  let description = "";
  let startDate = "";
  let endDate = "";
  let location = "";
  let isCreator = false;
  let status: "upcoming" | "active" | "completed" = "upcoming";
  let participants = 0;
  let eventType = event.type;
  let tournamentCount = 0;

  if (event.type === "tournament") {
    const tournament = event.data as Tournament;
    name = tournament.name;
    description = tournament.description || "";
    startDate = tournament.startDate;
    endDate = tournament.endDate;
    location = tournament.location;
    isCreator = tournament.createdBy === userId;
    status = tournament.status;
    participants = tournament.players.length;
  } else if (event.type === "tour") {
    const tour = event.data as Tour;
    name = tour.name;
    description = tour.description || "";
    startDate = tour.startDate;
    endDate = tour.endDate;
    location =
      tour.tournaments.length > 0
        ? `${tour.tournaments.length} locations`
        : "No tournaments yet";
    isCreator = tour.createdBy === userId;
    status = tour.status;
    participants = tour.players?.length || 0;
    tournamentCount = tour.tournaments.length;
  }

  return (
    <Card sx={styles.eventCard}>
      <CardContent sx={styles.eventCardContent}>
        <Box sx={styles.eventChipsContainer}>
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={styles.getStatusChip(status)}
          />

          <Chip
            label={event.type === "tournament" ? "Tournament" : "Tour Series"}
            size="small"
            icon={
              event.type === "tournament" ? (
                <GolfCourseIcon />
              ) : (
                <MoreHorizIcon />
              )
            }
            sx={styles.getEventTypeChip(event.type)}
          />
        </Box>

        <Typography variant="h6" component="h2" sx={styles.eventTitle}>
          {name}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={styles.eventDescription}
          >
            {description}
          </Typography>
        )}

        <Box sx={{ flex: 1 }} />

        <Divider sx={styles.eventDivider} />

        <Box sx={styles.eventInfoContainer}>
          <Box sx={styles.eventInfoItem}>
            <EventIcon fontSize="small" sx={styles.eventInfoIcon} />
            <Typography variant="body2" sx={styles.eventInfoText}>
              {format(new Date(startDate), "MMM d, yyyy")} -{" "}
              {format(new Date(endDate), "MMM d, yyyy")}
            </Typography>
          </Box>

          <Box sx={styles.eventInfoItem}>
            <RoomIcon fontSize="small" sx={styles.eventInfoIcon} />
            <Typography variant="body2" sx={styles.eventInfoText}>
              {location}
            </Typography>
          </Box>

          <Box sx={styles.eventInfoItem}>
            <PeopleIcon fontSize="small" sx={styles.eventInfoIcon} />
            <Typography variant="body2" sx={styles.eventInfoText}>
              {participants} participant{participants !== 1 ? "s" : ""}
              {event.type === "tour" &&
                tournamentCount > 0 &&
                ` • ${tournamentCount} tournament${
                  tournamentCount !== 1 ? "s" : ""
                }`}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Box sx={styles.eventCardActions}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onViewDetails(event.id)}
          sx={styles.viewDetailsButton}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

interface EventGridProps {
  events: Event[];
  userId: string;
  onViewDetails: (eventId: string) => void;
  onCreateEvent: () => void;
}

const EventGrid: React.FC<EventGridProps> = ({
  events,
  userId,
  onViewDetails,
  onCreateEvent,
}) => {
  const styles = useEventStyles();

  if (events.length === 0) {
    return (
      <Box sx={styles.emptyStateContainer}>
        <GolfCourseIcon sx={styles.emptyStateIcon} />
        <Typography variant="h6" sx={styles.emptyStateTitle}>
          No Events Yet
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          Create your first tournament or tour series to start organizing your
          competitions.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateEvent}
          sx={styles.createEventButton}
        >
          Create Event
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <EventCard
            event={event}
            userId={userId}
            onViewDetails={onViewDetails}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventGrid;
