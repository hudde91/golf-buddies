import React from "react";
import { Grid } from "@mui/material";
import { Tournament } from "../../types/tournament";
import InvitationCard from "./InvitationCard";
import InvitationEmptyState from "./InvitationEmptyState";

interface InvitationListProps {
  invitations: Tournament[];
  onAcceptInvitation: (tournamentId: string) => void;
  onDeclineInvitation: (tournamentId: string) => void;
}

const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  onAcceptInvitation,
  onDeclineInvitation,
}) => {
  if (invitations.length === 0) {
    return <InvitationEmptyState />;
  }

  return (
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
  );
};

export default InvitationList;
