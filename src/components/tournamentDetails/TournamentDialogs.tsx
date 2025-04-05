import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Tournament, RoundFormData } from "../../types/event";
import TournamentForm from "../tournament/TournamentForm";
import RoundForm from "./RoundForm";
import { useStyles } from "../../styles/hooks/useStyles";

interface TournamentDialogsProps {
  tournament: Tournament;
  dialogState: {
    inviteOpen: boolean;
    addRoundOpen: boolean;
    editTournamentOpen: boolean;
    emailsToInvite: string;
    inviteError: string;
  };
  handlers: {
    closeInvite: () => void;
    closeAddRound: () => void;
    closeEditTournament: () => void;
    setEmailsToInvite: (value: string) => void;
    setInviteError: (value: string) => void;
    handleInvitePlayers: () => void;
    handleAddRound: (data: RoundFormData) => void;
    handleUpdateTournament: (data: any) => void;
  };
}

const TournamentDialogs: React.FC<TournamentDialogsProps> = ({
  tournament,
  dialogState,
  handlers,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* Invite Players Dialog */}
      <Dialog
        open={dialogState.inviteOpen}
        onClose={handlers.closeInvite}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            ...styles.dialogs.paper,
            ...styles.mobile.dialog.bottomSheet,
          },
        }}
      >
        <DialogTitle sx={styles.dialogs.title}>Invite Players</DialogTitle>
        <DialogContent sx={styles.dialogs.content}>
          <Typography
            variant="body2"
            sx={{ mb: 2, mt: 2, ...styles.text.body.primary }}
          >
            Enter email addresses of players you want to invite to this
            tournament. Separate multiple emails with commas.
          </Typography>

          <TextField
            label="Email Addresses"
            multiline
            rows={3}
            fullWidth
            value={dialogState.emailsToInvite}
            onChange={(e) => handlers.setEmailsToInvite(e.target.value)}
            placeholder="example@email.com, another@email.com"
            error={!!dialogState.inviteError}
            helperText={dialogState.inviteError}
            InputLabelProps={styles.tournamentCard.formStyles.labelProps(theme)}
            InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
          />
        </DialogContent>
        <DialogActions sx={styles.dialogs.actions}>
          <Button onClick={handlers.closeInvite} sx={styles.button.cancel}>
            Cancel
          </Button>
          <Button
            onClick={handlers.handleInvitePlayers}
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            sx={styles.button.primary}
          >
            Send Invitations
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Round Dialog */}
      <Dialog
        open={dialogState.addRoundOpen}
        onClose={handlers.closeAddRound}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <RoundForm
          onSubmit={handlers.handleAddRound}
          onCancel={handlers.closeAddRound}
          tournamentStartDate={tournament.startDate}
          tournamentEndDate={tournament.endDate}
          isTeamEvent={tournament.isTeamEvent}
        />
      </Dialog>

      {/* Edit Tournament Dialog */}
      <Dialog
        open={dialogState.editTournamentOpen}
        onClose={handlers.closeEditTournament}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <TournamentForm
          onSubmit={handlers.handleUpdateTournament}
          onCancel={handlers.closeEditTournament}
          initialData={{
            name: tournament.name,
            startDate: tournament.startDate,
            endDate: tournament.endDate,
            location: tournament.location,
            description: tournament.description || "",
            isTeamEvent: tournament.isTeamEvent,
            scoringType: tournament.scoringType || "individual",
          }}
        />
      </Dialog>
    </>
  );
};

export default TournamentDialogs;
