import React from "react";
import {
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { Tournament } from "../../types/event";
import { useTournamentStyles } from "../../theme/hooks";

interface TournamentInfoProps {
  tournament: Tournament;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({ tournament }) => {
  const styles = useTournamentStyles();
  const theme = useTheme(); // Need theme for some dynamic chip colors

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
          <Box sx={{ ...styles.infoItem, mb: { xs: 1, md: 2 } }}>
            <CalendarIcon />
            <Typography
              variant="subtitle1"
              sx={styles.tournamentTypography.body}
            >
              Dates: {new Date(tournament.startDate).toLocaleDateString()}
              {tournament.startDate !== tournament.endDate &&
                ` to ${new Date(tournament.endDate).toLocaleDateString()}`}
            </Typography>
          </Box>
          <Box sx={styles.infoItem}>
            <LocationIcon />
            <Typography
              variant="subtitle1"
              sx={styles.tournamentTypography.body}
            >
              Location: {tournament.location}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ ...styles.infoItem, mb: { xs: 1, md: 2 } }}>
            <EventIcon />
            <Typography
              variant="subtitle1"
              sx={styles.tournamentTypography.body}
            >
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
            <Divider sx={styles.tournamentDivider} />
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ ...styles.tournamentTypography.body, mt: 1 }}
            >
              Description:
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={styles.tournamentTypography.body}
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
