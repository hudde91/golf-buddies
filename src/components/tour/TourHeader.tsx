import React from "react";
import { Box, Typography, Button, Paper, Grid, Chip } from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GolfCourse as TournamentIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Tour } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";

interface TourHeaderProps {
  tour: Tour;
  isCreator: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const TourHeader: React.FC<TourHeaderProps> = ({
  tour,
  isCreator,
  onEdit,
  onDelete,
}) => {
  const styles = useStyles();

  return (
    <Paper sx={styles.tour.header.container}>
      <Box sx={styles.tour.header.contentWrapper}>
        <Box>
          <Box sx={styles.tour.header.statusChipsContainer}>
            <Chip
              label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
              size="small"
              sx={styles.tour.getStatusChip(tour.status)}
            />
            <Chip
              label="Tour Series"
              size="small"
              icon={<TrophyIcon />}
              sx={styles.tour.getTourChip}
            />
          </Box>

          <Typography variant="h4" sx={styles.tour.header.title}>
            {tour.name}
          </Typography>

          {tour.description && (
            <Typography variant="body1" sx={styles.tour.header.description}>
              {tour.description}
            </Typography>
          )}

          <Grid container spacing={4} sx={styles.tour.header.infoContainer}>
            <Grid item xs={12} sm={"auto"}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarIcon sx={styles.tour.header.infoIcon} />
                <Typography sx={styles.tour.header.infoText}>
                  {format(new Date(tour.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(tour.endDate), "MMM d, yyyy")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={"auto"}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TournamentIcon sx={styles.tour.header.infoIcon} />
                <Typography sx={styles.tour.header.infoText}>
                  {tour.tournaments.length} Tournament
                  {tour.tournaments.length !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={"auto"}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PeopleIcon sx={styles.tour.header.infoIcon} />
                <Typography sx={styles.tour.header.infoText}>
                  {tour.players?.length || 0} Participant
                  {(tour.players?.length || 0) !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {isCreator && (
          <Box sx={styles.tour.header.actionButtons}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={styles.tour.header.editButton}
            >
              Edit Tour
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              sx={styles.button.danger}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TourHeader;
