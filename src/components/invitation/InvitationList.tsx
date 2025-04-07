import React from "react";
import { Grid, Typography, Box, Divider } from "@mui/material";
import { Tournament, Round } from "../../types/event";
import InvitationCard from "./InvitationCard";
import RoundInvitationCard from "./RoundInvitationCard";
import InvitationEmptyState from "./InvitationEmptyState";
import { useStyles } from "../../styles/hooks/useStyles";

interface InvitationListProps {
  invitations: Tournament[];
  roundInvitations: Round[];
  onAcceptInvitation: (tournamentId: string) => void;
  onDeclineInvitation: (tournamentId: string) => void;
  onAcceptRound: (roundId: string) => void;
  onDeclineRound: (roundId: string) => void;
}

const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  roundInvitations,
  onAcceptInvitation,
  onDeclineInvitation,
  onAcceptRound,
  onDeclineRound,
}) => {
  const styles = useStyles();
  const hasInvitations = invitations.length > 0 || roundInvitations.length > 0;

  if (!hasInvitations) {
    return <InvitationEmptyState />;
  }

  return (
    <Box>
      {invitations.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Tournament Invitations
          </Typography>
          <Grid container spacing={3}>
            {invitations.map((tournament) => (
              <Grid item xs={12} key={tournament.id}>
                <InvitationCard
                  tournament={tournament}
                  onAccept={onAcceptInvitation}
                  onDecline={onDeclineInvitation}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {invitations.length > 0 && roundInvitations.length > 0 && (
        <Divider sx={{ my: 4 }} />
      )}

      {roundInvitations.length > 0 && (
        <>
          <Typography
            variant="h5"
            sx={{ mb: 2, mt: invitations.length > 0 ? 4 : 0 }}
          >
            Round Invitations
          </Typography>
          <Grid container spacing={3}>
            {roundInvitations.map((round) => (
              <Grid item xs={12} key={round.id}>
                <RoundInvitationCard
                  round={round}
                  onAccept={onAcceptRound}
                  onDecline={onDeclineRound}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default InvitationList;
