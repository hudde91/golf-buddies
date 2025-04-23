import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useStyles } from "../../styles";
import { Player, Event } from "../../types/event";
import InvitationCard from "./InvitationCard";
import PlayerCard from "./PlayerCard";
import PlayerProfileDialog from "./PlayerProfileDialog";

interface PlayersTabProps {
  event: Event;
  isCreator: boolean;
  onInvitePlayers?: () => void;
  renderPlayerExtra?: (player: Player) => React.ReactNode;
}

const PlayersTab: React.FC<PlayersTabProps> = ({
  event,
  isCreator,
  onInvitePlayers,
  renderPlayerExtra,
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setProfileDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setProfileDialogOpen(false);
  };

  // Get players based on event type
  const players = event.players || [];
  // Get invitations based on event type
  const invitations = event.invitations || [];

  return (
    <Box>
      <Box sx={styles.tournamentPlayers.layouts.tabHeader}>
        <Typography
          variant="h6"
          sx={styles.tournamentPlayers.playerTypography.playerName}
        >
          Players ({players.length})
        </Typography>

        {isCreator && onInvitePlayers && (
          <Button
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={onInvitePlayers}
            variant="outlined"
            fullWidth={isSmall}
            sx={styles.tournamentPlayers.buttons.invite}
          >
            Invite Players
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <PlayerCard
              player={player}
              event={event}
              onClick={handlePlayerClick}
              renderPlayerExtra={renderPlayerExtra}
            />
          </Grid>
        ))}
      </Grid>

      {invitations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={styles.tournamentPlayers.playerTypography.playerName}
          >
            Pending Invitations ({invitations.length})
          </Typography>

          <Grid container spacing={2}>
            {invitations.map((email) => (
              <Grid item xs={12} sm={6} md={4} key={email}>
                <InvitationCard email={email} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <PlayerProfileDialog
        open={profileDialogOpen}
        player={selectedPlayer}
        event={event}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default PlayersTab;
