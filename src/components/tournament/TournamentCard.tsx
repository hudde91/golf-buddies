import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { Tournament } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";

interface TournamentCardProps {
  tournament: Tournament;
  userId: string;
  onViewDetails: (tournamentId: string) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  userId,
  onViewDetails,
}) => {
  const styles = useStyles();

  // Get the appropriate color for status
  const getColorForStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return styles.chips.status.upcoming;
      case "active":
        return styles.chips.status.active;
      case "completed":
        return styles.chips.status.completed;
      case "cancelled":
        return styles.chips.status.cancelled;
      default:
        return styles.chips.status.draft;
    }
  };

  return (
    <Card
      sx={styles.tournamentCard.container}
      onClick={() => onViewDetails(tournament.id)}
    >
      <CardMedia sx={styles.tournamentCard.media}>
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
          }}
        >
          <Chip
            size="small"
            label={
              tournament.status.charAt(0).toUpperCase() +
              tournament.status.slice(1)
            }
            sx={getColorForStatus(tournament.status)}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            zIndex: 2,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={styles.tournamentCard.typography.cardTitle}
            noWrap
          >
            {tournament.name}
          </Typography>
        </Box>
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, py: 2 }}>
        <Box sx={styles.tournamentCard.infoItem}>
          <CalendarIcon fontSize="small" />
          <Typography variant="body2">
            {new Date(tournament.startDate).toLocaleDateString()}
            {tournament.startDate !== tournament.endDate &&
              ` - ${new Date(tournament.endDate).toLocaleDateString()}`}
          </Typography>
        </Box>

        <Box sx={styles.tournamentCard.infoItem}>
          <LocationIcon fontSize="small" />
          <Typography variant="body2" noWrap>
            {tournament.location}
          </Typography>
        </Box>

        <Box sx={styles.tournamentCard.infoItem}>
          <GroupIcon fontSize="small" />
          <Typography variant="body2">
            {tournament.players.length} players
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            size="small"
            label={`${tournament.rounds.length} rounds`}
            variant="outlined"
            sx={styles.chips.eventType.custom("secondary.light")}
          />

          {tournament.format && (
            <Chip
              size="small"
              label={tournament.format}
              variant="outlined"
              sx={styles.button.outlined}
            />
          )}

          {tournament.createdBy === userId && (
            <Chip
              size="small"
              label="Creator"
              sx={styles.chips.status.custom("success.light")}
            />
          )}
        </Box>
      </CardContent>
      <CardActions sx={styles.card.actions.base}>
        <Button
          size="small"
          fullWidth
          variant="outlined"
          sx={styles.button.outlined}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TournamentCard;
