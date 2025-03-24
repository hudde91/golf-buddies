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
} from "@mui/material";
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { Tournament } from "../../types/event";
import { useInvitationStyles } from "../../theme/hooks";

interface InvitationCardProps {
  tournament: Tournament;
  onAccept: (tournamentId: string) => void;
  onDecline: (tournamentId: string) => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  tournament,
  onAccept,
  onDecline,
}) => {
  const styles = useInvitationStyles();

  return (
    <Card sx={styles.invitationCard}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={styles.iconContainer}>
            <EmailIcon />
          </Box>
          <Typography variant="h6" sx={styles.invitationTypography.title}>
            Invitation: {tournament.name}
          </Typography>
        </Box>

        <Divider sx={styles.invitationDivider} />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={styles.infoItem}>
              <CalendarIcon fontSize="small" />
              <Typography variant="body2">
                {new Date(tournament.startDate).toLocaleDateString()}
                {tournament.startDate !== tournament.endDate &&
                  ` to ${new Date(tournament.endDate).toLocaleDateString()}`}
              </Typography>
            </Box>

            <Box sx={styles.infoItem}>
              <LocationIcon fontSize="small" />
              <Typography variant="body2">{tournament.location}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 1, ...styles.invitationTypography.body }}
              >
                <strong>Players:</strong> {tournament.players.length}
              </Typography>
              <Typography variant="body2" sx={styles.invitationTypography.body}>
                <strong>Created by:</strong>{" "}
                {tournament.players.find((p) => p.id === tournament.createdBy)
                  ?.name || "Unknown"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onAccept(tournament.id)}
          sx={styles.invitationButtons.accept}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          onClick={() => onDecline(tournament.id)}
          sx={styles.invitationButtons.decline}
        >
          Decline
        </Button>
      </CardActions>
    </Card>
  );
};

export default InvitationCard;
