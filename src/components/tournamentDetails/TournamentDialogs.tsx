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
  alpha,
  useTheme,
} from "@mui/material";
import { Tournament, RoundFormData } from "../../types/event";
import TournamentForm from "../tournament/TournamentForm";
import RoundForm from "./RoundForm";
import { useTournamentStyles } from "../../theme/hooks";

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
  const styles = useTournamentStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dialogPaperStyles = {
    backgroundColor: alpha(theme.palette.common.black, 0.8),
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: 2,
  };

  return (
    <>
      {/* Invite Players Dialog */}
      <Dialog
        open={dialogState.inviteOpen}
        onClose={handlers.closeInvite}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: dialogPaperStyles }}
      >
        <DialogTitle sx={styles.dialogStyles.title}>Invite Players</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{ mb: 2, mt: 2, ...styles.tournamentTypography.body }}
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
            InputLabelProps={styles.formStyles.labelProps}
            InputProps={styles.formStyles.inputProps}
          />
        </DialogContent>
        <DialogActions sx={styles.dialogStyles.actions}>
          <Button
            onClick={handlers.closeInvite}
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              order: { xs: 2, sm: 1 },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlers.handleInvitePlayers}
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            sx={{
              order: { xs: 1, sm: 2 },
            }}
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
        PaperProps={{ sx: dialogPaperStyles }}
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
        PaperProps={{ sx: dialogPaperStyles }}
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
