import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  alpha,
  Theme,
} from "@mui/material";
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
import { getStatusColor } from "../util";

interface TourHeaderProps {
  tour: Tour;
  isCreator: boolean;
  onEdit: () => void;
  onDelete: () => void;
  theme: Theme;
}

const TourHeader: React.FC<TourHeaderProps> = ({
  tour,
  isCreator,
  onEdit,
  onDelete,
  theme,
}) => {
  return (
    <Paper
      sx={{
        backgroundColor: alpha(theme.palette.common.black, 0.3),
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        p: { xs: 2, md: 4 },
        mb: 4,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Chip
              label={tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
              size="small"
              sx={{
                backgroundColor: alpha(getStatusColor(tour.status, theme), 0.2),
                color: getStatusColor(tour.status, theme),
                fontWeight: "medium",
                borderRadius: 1,
              }}
            />
            <Chip
              label="Tour Series"
              size="small"
              icon={<TrophyIcon />}
              sx={{
                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                color: theme.palette.secondary.main,
                fontWeight: "medium",
                borderRadius: 1,
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "white",
              mb: 2,
            }}
          >
            {tour.name}
          </Typography>

          {tour.description && (
            <Typography
              variant="body1"
              sx={{
                color: alpha(theme.palette.common.white, 0.8),
                mb: 3,
                maxWidth: "800px",
              }}
            >
              {tour.description}
            </Typography>
          )}

          <Grid container spacing={4} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={"auto"}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarIcon
                  sx={{
                    color: alpha(theme.palette.common.white, 0.6),
                    mr: 1,
                  }}
                />
                <Typography
                  sx={{
                    color: alpha(theme.palette.common.white, 0.8),
                    whiteSpace: "nowrap",
                  }}
                >
                  {format(new Date(tour.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(tour.endDate), "MMM d, yyyy")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={"auto"}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TournamentIcon
                  sx={{
                    color: alpha(theme.palette.common.white, 0.6),
                    mr: 1,
                  }}
                />
                <Typography
                  sx={{ color: alpha(theme.palette.common.white, 0.8) }}
                >
                  {tour.tournaments.length} Tournament
                  {tour.tournaments.length !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={"auto"}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PeopleIcon
                  sx={{
                    color: alpha(theme.palette.common.white, 0.6),
                    mr: 1,
                  }}
                />
                <Typography
                  sx={{ color: alpha(theme.palette.common.white, 0.8) }}
                >
                  {tour.players?.length || 0} Participant
                  {(tour.players?.length || 0) !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {isCreator && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "flex-start",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{
                color: "white",
                borderColor: alpha(theme.palette.common.white, 0.3),
                "&:hover": {
                  borderColor: alpha(theme.palette.common.white, 0.6),
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              Edit Tour
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
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
