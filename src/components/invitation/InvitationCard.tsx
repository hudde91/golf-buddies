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
import { useStyles } from "../../styles/hooks";

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
  const styles = useStyles();

  return (
    <Card sx={styles.card.invitation}>
      <CardContent>
        <Box sx={styles.card.header.withIcon}>
          <Box sx={styles.icon.container.primary}>
            <EmailIcon />
          </Box>
          <Typography variant="h6" sx={styles.text.heading.card}>
            Invitation: {tournament.name}
          </Typography>
        </Box>

        <Divider sx={styles.divider.standard} />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={styles.infoItem.base}>
              <CalendarIcon fontSize="small" />
              <Typography variant="body2">
                {new Date(tournament.startDate).toLocaleDateString()}
                {tournament.startDate !== tournament.endDate &&
                  ` to ${new Date(tournament.endDate).toLocaleDateString()}`}
              </Typography>
            </Box>

            <Box sx={styles.infoItem.base}>
              <LocationIcon fontSize="small" />
              <Typography variant="body2">{tournament.location}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={styles.layout.flex.column}>
              <Typography variant="body2" sx={styles.text.body.primary}>
                <strong>Players:</strong> {tournament.players.length}
              </Typography>
              <Typography variant="body2" sx={styles.text.body.primary}>
                <strong>Created by:</strong>{" "}
                {tournament.players.find((p) => p.id === tournament.createdBy)
                  ?.name || "Unknown"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={styles.card.actions.base}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onAccept(tournament.id)}
          sx={{ ...styles.button.primary, ...styles.button.accept }}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          onClick={() => onDecline(tournament.id)}
          sx={styles.button.danger}
        >
          Decline
        </Button>
      </CardActions>
    </Card>
  );
};

export default InvitationCard;
