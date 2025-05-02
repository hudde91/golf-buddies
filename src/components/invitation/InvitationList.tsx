import React from "react";
import { Grid, Typography, Box, Divider } from "@mui/material";
import { Tournament, Round, Tour } from "../../types/event";
import InvitationCard from "./InvitationCard";
import RoundInvitationCard from "./RoundInvitationCard";
import InvitationEmptyState from "./InvitationEmptyState";

interface InvitationListProps {
  tourInvitations: Tour[];
  tournamentInvitations: Tournament[];
  roundInvitations: Round[];
  onAcceptInvitation: (tournamentId: string) => void;
  onDeclineInvitation: (tournamentId: string) => void;
  onAcceptRound: (roundId: string) => void;
  onDeclineRound: (roundId: string) => void;
}

const InvitationList: React.FC<InvitationListProps> = ({
  tourInvitations,
  tournamentInvitations,
  roundInvitations,
  onAcceptInvitation,
  onDeclineInvitation,
  onAcceptRound,
  onDeclineRound,
}) => {
  const hasInvitations =
    tourInvitations.length > 0 ||
    tournamentInvitations.length > 0 ||
    roundInvitations.length > 0;

  if (!hasInvitations) {
    return <InvitationEmptyState />;
  }

  return (
    <Box>
      {tourInvitations.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Tour Invitations
          </Typography>
          <Grid container spacing={3}>
            {tourInvitations.map((tour) => (
              <Grid item xs={12} key={tour.id}>
                <InvitationCard
                  event={tour}
                  onAccept={onAcceptInvitation}
                  onDecline={onDeclineInvitation}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {tourInvitations.length > 0 && tournamentInvitations.length > 0 && (
        <Divider sx={{ my: 4 }} />
      )}

      {tournamentInvitations.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Tournament Invitations
          </Typography>
          <Grid container spacing={3}>
            {tournamentInvitations.map((tournament) => (
              <Grid item xs={12} key={tournament.id}>
                <InvitationCard
                  event={tournament}
                  onAccept={onAcceptInvitation}
                  onDecline={onDeclineInvitation}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {tournamentInvitations.length > 0 && roundInvitations.length > 0 && (
        <Divider sx={{ my: 4 }} />
      )}

      {roundInvitations.length > 0 && (
        <>
          <Typography
            variant="h5"
            sx={{ mb: 2, mt: tournamentInvitations.length > 0 ? 4 : 0 }}
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
