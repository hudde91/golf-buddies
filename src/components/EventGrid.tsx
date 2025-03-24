import React from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  useTheme,
  alpha,
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
import { getStatusColor } from "./util";

interface EventCardProps {
  event: Event;
  userId: string;
  onViewDetails: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  userId,
  onViewDetails,
}) => {
  const theme = useTheme();

  // Get common data based on event type
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
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: alpha(theme.palette.common.black, 0.6),
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 20px ${alpha(theme.palette.common.black, 0.3)}`,
        },
      }}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
              backgroundColor: alpha(getStatusColor(status, theme), 0.2),
              color: getStatusColor(status, theme),
              fontWeight: "medium",
              borderRadius: 1,
            }}
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
            sx={{
              backgroundColor: alpha(
                event.type === "tournament"
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
                0.2
              ),
              color:
                event.type === "tournament"
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
              fontWeight: "medium",
              borderRadius: 1,
            }}
          />
        </Box>

        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: alpha(theme.palette.common.white, 0.9),
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 2,
              color: alpha(theme.palette.common.white, 0.7),
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </Typography>
        )}

        <Box sx={{ flex: 1 }} />

        <Divider
          sx={{ my: 2, borderColor: alpha(theme.palette.common.white, 0.1) }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventIcon
              fontSize="small"
              sx={{ color: alpha(theme.palette.common.white, 0.5) }}
            />
            <Typography
              variant="body2"
              sx={{ color: alpha(theme.palette.common.white, 0.7) }}
            >
              {format(new Date(startDate), "MMM d, yyyy")} -{" "}
              {format(new Date(endDate), "MMM d, yyyy")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RoomIcon
              fontSize="small"
              sx={{ color: alpha(theme.palette.common.white, 0.5) }}
            />
            <Typography
              variant="body2"
              sx={{ color: alpha(theme.palette.common.white, 0.7) }}
            >
              {location}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PeopleIcon
              fontSize="small"
              sx={{ color: alpha(theme.palette.common.white, 0.5) }}
            />
            <Typography
              variant="body2"
              sx={{ color: alpha(theme.palette.common.white, 0.7) }}
            >
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

      <Box
        sx={{
          p: 2,
          pt: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onViewDetails(event.id)}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            py: 1,
          }}
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
  const theme = useTheme();

  if (events.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
          textAlign: "center",
          backgroundColor: alpha(theme.palette.common.black, 0.4),
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
        }}
      >
        <GolfCourseIcon
          sx={{
            fontSize: 64,
            color: alpha(theme.palette.common.white, 0.3),
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          sx={{ color: alpha(theme.palette.common.white, 0.9), mb: 1 }}
        >
          No Events Yet
        </Typography>
        <Typography
          sx={{
            color: alpha(theme.palette.common.white, 0.7),
            mb: 3,
            maxWidth: 450,
          }}
        >
          Create your first tournament or tour series to start organizing your
          competitions.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateEvent}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
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
