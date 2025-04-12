import React from "react";
import { Box } from "@mui/material";
import { Tour } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import TeamManagement from "../tournamentDetails/teamsTab/TeamManagement";

interface TeamsTabProps {
  tour: Tour;
  isCreator: boolean;
  onAddTeam: (teamData: any) => void;
  onUpdateTeam: (teamId: string, teamData: any) => void;
  onDeleteTeam: (teamId: string) => void;
  onAssignPlayer: (playerId: string, teamId?: string) => void;
}

const TeamsTab: React.FC<TeamsTabProps> = ({
  tour,
  isCreator,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
  onAssignPlayer,
}) => {
  const styles = useStyles();

  return (
    <Box sx={styles.tabs.panel}>
      <TeamManagement
        teams={tour.teams || []}
        players={tour.players || []}
        isCreator={isCreator}
        onAddTeam={onAddTeam}
        onUpdateTeam={onUpdateTeam}
        onDeleteTeam={onDeleteTeam}
        onAssignPlayer={onAssignPlayer}
      />
    </Box>
  );
};

export default TeamsTab;
