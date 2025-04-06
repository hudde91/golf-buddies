import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  GolfCourse as GolfIcon,
} from "@mui/icons-material";
import { Round } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";

interface RoundInvitationCardProps {
  round: Round;
  onAccept: (roundId: string) => void;
  onDecline: (roundId: string) => void;
}

const RoundInvitationCard: React.FC<RoundInvitationCardProps> = ({
  round,
  onAccept,
  onDecline,
}) => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Card sx={styles.card.invitation}>
      <CardContent>
        <Box sx={styles.card.header.withIcon}>
          <Box sx={styles.icon.container.primary}>
            <EmailIcon />
          </Box>
          <Typography variant="h6" sx={styles.text.heading.card}>
            Round Invitation: {round.name}
          </Typography>
        </Box>

        <Divider sx={styles.divider.standard} />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={styles.infoItem.base}>
              <CalendarIcon fontSize="small" />
              <Typography variant="body2">
                {new Date(round.date).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={styles.infoItem.base}>
              <LocationIcon fontSize="small" />
              <Typography variant="body2">
                {round.location || "Location not specified"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={styles.layout.flex.column}>
              <Typography variant="body2" sx={styles.text.body.primary}>
                <strong>Format:</strong> {round.format}
              </Typography>
              <Typography variant="body2" sx={styles.text.body.primary}>
                <strong>Course:</strong>{" "}
                {round.courseDetails?.name || "Not specified"}
              </Typography>
              <Typography variant="body2" sx={styles.text.body.primary}>
                <strong>Created by:</strong>{" "}
                {round.players?.find((p) => p.id === round.createdBy)?.name ||
                  "Unknown"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {round.courseDetails?.holes && (
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Chip
              icon={<GolfIcon />}
              label={`${round.courseDetails?.holes} holes`}
              size="small"
              variant="outlined"
              sx={styles.chips.eventType.custom(theme.palette.secondary.light)}
            />
            {round.courseDetails?.par && (
              <Chip
                label={`Par ${round.courseDetails?.par}`}
                size="small"
                variant="outlined"
                sx={styles.chips.eventType.custom(theme.palette.info.light)}
              />
            )}
          </Box>
        )}
      </CardContent>
      <CardActions sx={styles.card.actions.base}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onAccept(round.id)}
          sx={{ ...styles.button.primary, ...styles.button.accept }}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          onClick={() => onDecline(round.id)}
          sx={styles.button.danger}
        >
          Decline
        </Button>
      </CardActions>
    </Card>
  );
};

export default RoundInvitationCard;
