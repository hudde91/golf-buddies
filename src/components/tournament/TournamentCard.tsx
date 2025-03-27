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
  alpha,
  useTheme,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { Tournament } from "../../types/event";
import { useTournamentStyles } from "../../theme/hooks";

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
  const styles = useTournamentStyles();
  const theme = useTheme();

  const getColorBasedOnStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "info";
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card
      sx={styles.tournamentCard}
      onClick={() => onViewDetails(tournament.id)}
    >
      <CardMedia sx={styles.tournamentCardMedia}>
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
            color={getColorBasedOnStatus(tournament.status)}
            sx={{ fontWeight: "medium" }}
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
            sx={styles.tournamentTypography.cardTitle}
            noWrap
          >
            {tournament.name}
          </Typography>
        </Box>
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, py: 2 }}>
        <Box sx={styles.infoItem}>
          <CalendarIcon fontSize="small" />
          <Typography variant="body2">
            {new Date(tournament.startDate).toLocaleDateString()}
            {tournament.startDate !== tournament.endDate &&
              ` - ${new Date(tournament.endDate).toLocaleDateString()}`}
          </Typography>
        </Box>

        <Box sx={styles.infoItem}>
          <LocationIcon fontSize="small" />
          <Typography variant="body2" noWrap>
            {tournament.location}
          </Typography>
        </Box>

        <Box sx={styles.infoItem}>
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
            sx={{
              color: theme.palette.secondary.light,
              borderColor: alpha(theme.palette.secondary.light, 0.5),
            }}
          />

          {tournament.format && (
            <Chip
              size="small"
              label={tournament.format}
              variant="outlined"
              sx={{
                color: alpha(theme.palette.common.white, 0.9),
                borderColor: alpha(theme.palette.common.white, 0.3),
              }}
            />
          )}

          {tournament.createdBy === userId && (
            <Chip
              size="small"
              label="Creator"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.2),
                color: theme.palette.success.light,
                borderColor: theme.palette.success.light,
              }}
            />
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          fullWidth
          variant="outlined"
          sx={styles.outlinedButton}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TournamentCard;
