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
  useTheme,
  alpha,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { Tournament } from "../../types/tournament";

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
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "upcoming":
        return "primary";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: alpha(theme.palette.common.black, 0.4),
        backdropFilter: "blur(8px)",
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 20px -10px ${alpha("#000", 0.5)}`,
        },
      }}
      onClick={() => onViewDetails(tournament.id)}
    >
      <CardMedia
        sx={{
          height: 140,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800)",
          backgroundSize: "cover",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)",
          },
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
          <Chip
            size="small"
            label={
              tournament.status.charAt(0).toUpperCase() +
              tournament.status.slice(1)
            }
            color={getStatusColor(tournament.status)}
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
            sx={{
              color: "white",
              fontWeight: 500,
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
            noWrap
          >
            {tournament.name}
          </Typography>
        </Box>
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CalendarIcon
            fontSize="small"
            sx={{
              mr: 1,
              color: alpha(theme.palette.common.white, 0.7),
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: alpha(theme.palette.common.white, 0.9) }}
          >
            {new Date(tournament.startDate).toLocaleDateString()}
            {tournament.startDate !== tournament.endDate &&
              ` - ${new Date(tournament.endDate).toLocaleDateString()}`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationIcon
            fontSize="small"
            sx={{
              mr: 1,
              color: alpha(theme.palette.common.white, 0.7),
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: alpha(theme.palette.common.white, 0.9) }}
            noWrap
          >
            {tournament.location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <GroupIcon
            fontSize="small"
            sx={{
              mr: 1,
              color: alpha(theme.palette.common.white, 0.7),
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: alpha(theme.palette.common.white, 0.9) }}
          >
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
          sx={{
            color: "white",
            borderColor: alpha(theme.palette.common.white, 0.5),
            "&:hover": {
              borderColor: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TournamentCard;
