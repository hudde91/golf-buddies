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
  useTheme,
  alpha,
} from "@mui/material";
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { Tournament } from "../../../types/tournament";

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
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundColor: alpha(theme.palette.common.black, 0.4),
        backdropFilter: "blur(8px)",
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              bgcolor: theme.palette.primary.dark,
              color: "white",
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <EmailIcon />
          </Box>
          <Typography variant="h6" sx={{ color: "white" }}>
            Invitation: {tournament.name}
          </Typography>
        </Box>

        <Divider
          sx={{
            my: 1,
            backgroundColor: alpha(theme.palette.common.white, 0.1),
          }}
        />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
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
                  ` to ${new Date(tournament.endDate).toLocaleDateString()}`}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
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
              >
                {tournament.location}
              </Typography>
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
                sx={{ mb: 1, color: alpha(theme.palette.common.white, 0.9) }}
              >
                <strong>Players:</strong> {tournament.players.length}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: alpha(theme.palette.common.white, 0.9) }}
              >
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
          sx={{ mr: 1, minWidth: 100 }}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          onClick={() => onDecline(tournament.id)}
          sx={{
            color: theme.palette.error.light,
            borderColor: alpha(theme.palette.error.light, 0.5),
            "&:hover": {
              borderColor: theme.palette.error.light,
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          Decline
        </Button>
      </CardActions>
    </Card>
  );
};

export default InvitationCard;
