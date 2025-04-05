import React from "react";
import {
  Card,
  CardContent,
  CardActions,
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
import { Round } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";

interface RoundCardProps {
  round: Round;
  userId: string;
  onViewDetails: (roundId: string) => void;
}

const RoundCard: React.FC<RoundCardProps> = ({
  round,
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
      default:
        return styles.chips.status.draft;
    }
  };

  return (
    <Card
      sx={styles.tournamentCard.container}
      onClick={() => onViewDetails(round.id)}
    >
      <Box
        sx={{
          position: "relative",
          height: 140,
          backgroundColor: (theme) => theme.palette.primary.dark,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
          }}
        >
          {round.status && (
            <Chip
              size="small"
              label={
                round.status.charAt(0).toUpperCase() + round.status.slice(1)
              }
              sx={getColorForStatus(round.status)}
            />
          )}
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
            {round.name}
          </Typography>
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, py: 2 }}>
        <Box sx={styles.tournamentCard.infoItem}>
          <CalendarIcon fontSize="small" />
          <Typography variant="body2">
            {new Date(round.date).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={styles.tournamentCard.infoItem}>
          <LocationIcon fontSize="small" />
          <Typography variant="body2" noWrap>
            {round.location || "Location not specified"}
          </Typography>
        </Box>

        {round.players && (
          <Box sx={styles.tournamentCard.infoItem}>
            <GroupIcon fontSize="small" />
            <Typography variant="body2">
              {round.players.length} players
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            size="small"
            label={`${round.courseDetails?.holes} holes`}
            variant="outlined"
            sx={styles.chips.eventType.custom("secondary.light")}
          />

          {round.format && (
            <Chip
              size="small"
              label={round.format}
              variant="outlined"
              sx={styles.button.outlined}
            />
          )}

          {round.createdBy === userId && (
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

export default RoundCard;
