import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import TeamCard from "./TeamCard";
import UnassignedPlayersList from "./UnassignedPlayersList";
import TeamFormDialog from "./TeamFormDialog";
import TeamPlayersDialog from "./TeamPlayersDialog";
import EmptyTeamsPlaceholder from "./EmptyTeamsPlaceholder";
import { useStyles } from "../../styles";
import { TeamFormData, Team, Event } from "../../types/event";

interface TeamManagementProps {
  event: Event;
  isCreator: boolean;
  onAddTeam: (team: TeamFormData) => void;
  onUpdateTeam: (teamId: string, team: Partial<Team>) => void;
  onDeleteTeam: (teamId: string) => void;
  onAssignPlayer: (playerId: string, teamId?: string) => void;
}

const TeamManagement: React.FC<TeamManagementProps> = ({
  event,
  isCreator,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
  onAssignPlayer,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const styles = useStyles();

  const teams = event.teams || [];
  const players = event.players || [];

  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openPlayersDialog, setOpenPlayersDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamForm, setTeamForm] = useState<TeamFormData>({
    name: "",
    color: "#1976d2", // Default team color
  });
  const [selectedCaptain, setSelectedCaptain] = useState<string | null>(null);

  const handleOpenTeamDialog = (team?: Team) => {
    if (team) {
      setSelectedTeam(team);
      setTeamForm({
        name: team.name,
        color: team.color,
        logo: team.logo,
      });
      setSelectedCaptain(team.captain || null);
    } else {
      setSelectedTeam(null);
      setTeamForm({
        name: "",
        color: "#1976d2",
      });
      setSelectedCaptain(null);
    }
    setOpenTeamDialog(true);
  };

  const handleCloseTeamDialog = () => {
    setOpenTeamDialog(false);
  };

  const handleOpenPlayersDialog = (team: Team) => {
    setSelectedTeam(team);
    setSelectedCaptain(team.captain || null);
    setOpenPlayersDialog(true);
  };

  const handleClosePlayersDialog = () => {
    setOpenPlayersDialog(false);
  };

  const handleSubmitTeam = () => {
    if (selectedTeam) {
      onUpdateTeam(selectedTeam.id, {
        ...teamForm,
        captain: selectedCaptain || undefined,
      });
    } else {
      onAddTeam({ ...teamForm, captain: selectedCaptain || undefined });
    }
    setOpenTeamDialog(false);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this team? All players will be unassigned."
      )
    ) {
      onDeleteTeam(teamId);
    }
  };

  const handleSetCaptain = (playerId: string) => {
    if (selectedTeam) {
      setSelectedCaptain(playerId === selectedCaptain ? null : playerId);

      // When in Players dialog, immediately update the team
      if (openPlayersDialog) {
        onUpdateTeam(selectedTeam.id, {
          captain: playerId === selectedCaptain ? undefined : playerId,
        });
      }
    }
  };

  const handleAssignPlayer = (playerId: string, teamId?: string) => {
    onAssignPlayer(playerId, teamId);

    // If the captain is removed from the team, remove them as captain
    if (!teamId && selectedTeam && selectedCaptain === playerId) {
      setSelectedCaptain(null);
      onUpdateTeam(selectedTeam.id, { captain: undefined });
    }
  };

  const getTeamPlayers = (teamId: string) => {
    return players.filter((player) => player.teamId === teamId);
  };

  const getUnassignedPlayers = () => {
    return players.filter((player) => !player.teamId);
  };

  const getTeamCaptain = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team || !team.captain) return null;
    return players.find((p) => p.id === team.captain) || null;
  };

  return (
    <Box>
      <Box sx={styles.tournamentTeams.header}>
        <Typography variant="h6" sx={styles.text.heading.section}>
          Teams ({teams.length})
        </Typography>

        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenTeamDialog()}
            fullWidth={isMobile}
            sx={styles.button.primary}
          >
            Add Team
          </Button>
        )}
      </Box>

      {teams.length > 0 ? (
        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} md={6} key={team.id}>
              <TeamCard
                team={team}
                players={getTeamPlayers(team.id)}
                captain={getTeamCaptain(team.id)}
                isCreator={isCreator}
                onEdit={() => handleOpenTeamDialog(team)}
                onDelete={() => handleDeleteTeam(team.id)}
                onManagePlayers={() => handleOpenPlayersDialog(team)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyTeamsPlaceholder
          isCreator={isCreator}
          onCreateTeam={() => handleOpenTeamDialog()}
        />
      )}

      {teams.length > 0 && (
        <UnassignedPlayersList
          players={getUnassignedPlayers()}
          teams={teams}
          isCreator={isCreator}
          onAssignPlayer={handleAssignPlayer}
        />
      )}

      <TeamFormDialog
        open={openTeamDialog}
        onClose={handleCloseTeamDialog}
        team={selectedTeam}
        teamForm={teamForm}
        setTeamForm={setTeamForm}
        selectedCaptain={selectedCaptain}
        setSelectedCaptain={setSelectedCaptain}
        teamPlayers={selectedTeam ? getTeamPlayers(selectedTeam.id) : []}
        onSubmit={handleSubmitTeam}
        isMobile={isMobile}
      />

      <TeamPlayersDialog
        open={openPlayersDialog}
        onClose={handleClosePlayersDialog}
        team={selectedTeam}
        teamPlayers={selectedTeam ? getTeamPlayers(selectedTeam.id) : []}
        unassignedPlayers={getUnassignedPlayers()}
        selectedCaptain={selectedCaptain}
        onSetCaptain={handleSetCaptain}
        onAssignPlayer={handleAssignPlayer}
      />
    </Box>
  );
};

export default TeamManagement;
