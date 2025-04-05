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
import { Tournament, Player } from "../../../types/event";
import PlayerCard from "./PlayerCard";
import InvitationCard from "./InvitationCard";
import PlayerProfileDialog from "./PlayerProfileDialog";
import { useStyles } from "../../../styles/hooks/useStyles";

interface PlayersTabProps {
  tournament: Tournament;
  isCreator: boolean;
  onInvitePlayers: () => void;
  renderPlayerExtra?: (player: Player) => React.ReactNode;
}

const PlayersTab: React.FC<PlayersTabProps> = ({
  tournament,
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

  return (
    <Box>
      <Box sx={styles.tournamentPlayers.layouts.tabHeader}>
        <Typography
          variant="h6"
          sx={styles.tournamentPlayers.playerTypography.playerName}
        >
          Players ({tournament.players.length})
        </Typography>

        {isCreator && (
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
        {tournament.players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <PlayerCard
              player={player}
              tournament={tournament}
              onClick={handlePlayerClick}
              renderPlayerExtra={renderPlayerExtra}
            />
          </Grid>
        ))}
      </Grid>

      {tournament.invitations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={styles.tournamentPlayers.playerTypography.playerName}
          >
            Pending Invitations ({tournament.invitations.length})
          </Typography>

          <Grid container spacing={2}>
            {tournament.invitations.map((email) => (
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
        tournament={tournament}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default PlayersTab;
