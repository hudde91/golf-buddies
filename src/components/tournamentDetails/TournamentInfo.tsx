import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Collapse,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { Tournament } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import { useTheme } from "@mui/material/styles";

interface TournamentInfoProps {
  tournament: Tournament;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({ tournament }) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(!isMobile);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const renderInfoContent = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ ...styles.tournamentCard.infoItem, mb: { xs: 1, md: 2 } }}>
            <CalendarIcon />
            <Typography variant="subtitle1" sx={styles.text.body.primary}>
              Dates: {new Date(tournament.startDate).toLocaleDateString()}
              {tournament.startDate !== tournament.endDate &&
                ` to ${new Date(tournament.endDate).toLocaleDateString()}`}
            </Typography>
          </Box>
          <Box sx={styles.tournamentCard.infoItem}>
            <LocationIcon />
            <Typography variant="subtitle1" sx={styles.text.body.primary}>
              Location: {tournament.location}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ ...styles.tournamentCard.infoItem, mb: { xs: 1, md: 2 } }}>
            <EventIcon />
            <Typography variant="subtitle1" sx={styles.text.body.primary}>
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
              sx={styles.chips.eventType.tournament}
            />

            {tournament.format && (
              <Chip
                label={tournament.format}
                size="small"
                sx={styles.chips.eventType.tour}
              />
            )}

            {tournament.isTeamEvent && (
              <Chip
                label="Team Event"
                size="small"
                sx={styles.chips.status.active}
              />
            )}
          </Box>
        </Grid>
        {tournament.description && (
          <Grid item xs={12}>
            <Divider sx={styles.divider.standard} />
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ ...styles.text.body.primary, mt: 1 }}
            >
              Description:
            </Typography>
            <Typography variant="body1" paragraph sx={styles.text.body.primary}>
              {tournament.description}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  return (
    <Box sx={styles.card.glass}>
      {/* Mobile toggle header */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            mb: expanded ? 2 : 0,
            py: 1,
          }}
          onClick={toggleExpanded}
        >
          <Typography variant="h6" sx={styles.text.body.primary}>
            Tournament Info
          </Typography>
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      )}

      {/* Content - wrapped in Collapse for mobile */}
      {isMobile ? (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {renderInfoContent()}
        </Collapse>
      ) : (
        renderInfoContent()
      )}
    </Box>
  );
};

export default TournamentInfo;
