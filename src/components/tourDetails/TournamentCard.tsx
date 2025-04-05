import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Place as PlaceIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Tournament } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import { getStatusColor } from "../../components/util";
import { useTheme } from "@mui/material";

interface TournamentCardProps {
  tournament: Tournament;
  onViewTournament: () => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onViewTournament,
}) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Card sx={styles.tour.tournamentCard} onClick={onViewTournament}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Chip
            label={
              tournament.status.charAt(0).toUpperCase() +
              tournament.status.slice(1)
            }
            size="small"
            sx={styles.chips.status.custom(
              getStatusColor(tournament.status, theme)
            )}
          />
        </Box>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            ...styles.tour.typography.title,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {tournament.name}
        </Typography>

        <Divider sx={styles.tour.divider} />

        <Box sx={{ mb: 1 }}>
          <Box sx={styles.tour.infoItem}>
            <CalendarIcon fontSize="small" />
            <Typography variant="body2">
              {format(new Date(tournament.startDate), "MMM d, yyyy")} -{" "}
              {format(new Date(tournament.endDate), "MMM d, yyyy")}
            </Typography>
          </Box>
          <Box sx={styles.tour.infoItem}>
            <PlaceIcon fontSize="small" />
            <Typography variant="body2">{tournament.location}</Typography>
          </Box>
          <Box sx={styles.tour.infoItem}>
            <PeopleIcon fontSize="small" />
            <Typography variant="body2">
              {tournament.players.length} player
              {tournament.players.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" sx={styles.button.primary}>
          View Tournament
        </Button>
      </CardActions>
    </Card>
  );
};

export default TournamentCard;
