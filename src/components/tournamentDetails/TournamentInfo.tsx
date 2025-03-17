import React from "react";
import {
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { Tournament } from "../../types/tournament";

interface TournamentInfoProps {
  tournament: Tournament;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({ tournament }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.common.black, 0.2),
        borderRadius: 1,
        p: 2,
        mb: 4,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: { xs: 1, md: 2 } }}
          >
            <CalendarIcon
              sx={{ mr: 1, color: alpha(theme.palette.common.white, 0.7) }}
            />
            <Typography variant="subtitle1" sx={{ color: "white" }}>
              Dates: {new Date(tournament.startDate).toLocaleDateString()}
              {tournament.startDate !== tournament.endDate &&
                ` to ${new Date(tournament.endDate).toLocaleDateString()}`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationIcon
              sx={{ mr: 1, color: alpha(theme.palette.common.white, 0.7) }}
            />
            <Typography variant="subtitle1" sx={{ color: "white" }}>
              Location: {tournament.location}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: { xs: 1, md: 2 } }}
          >
            <EventIcon
              sx={{ mr: 1, color: alpha(theme.palette.common.white, 0.7) }}
            />
            <Typography variant="subtitle1" sx={{ color: "white" }}>
              Creator:{" "}
              {tournament.players.find((p) => p.id === tournament.createdBy)
                ?.name || "Unknown"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Chip
              icon={<PersonAddIcon />}
              label={`${tournament.players.length} players`}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.light,
                border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
              }}
            />

            {tournament.format && (
              <Chip
                label={tournament.format}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.light,
                  border: `1px solid ${alpha(
                    theme.palette.secondary.light,
                    0.3
                  )}`,
                }}
              />
            )}

            {tournament.isTeamEvent && (
              <Chip
                label="Team Event"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.light,
                  border: `1px solid ${alpha(
                    theme.palette.success.light,
                    0.3
                  )}`,
                }}
              />
            )}
          </Box>
        </Grid>
        {tournament.description && (
          <Grid item xs={12}>
            <Divider
              sx={{ my: 1, bgcolor: alpha(theme.palette.common.white, 0.1) }}
            />
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "white", mt: 1 }}
            >
              Description:
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: alpha(theme.palette.common.white, 0.9) }}
            >
              {tournament.description}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TournamentInfo;
