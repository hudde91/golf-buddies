import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  useMediaQuery,
  Chip,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Star as StarIcon,
  MilitaryTech as AchievementIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  useGetTournamentById,
  useUpdateTournament,
  useDeleteTournament,
  useAddRoundToTournament,
  useInvitePlayersToEvent,
  useUpdatePlayerGroups,
} from "../services/eventService";
import {
  Tournament,
  RoundFormData,
  Player,
  PlayerGroup,
  Team,
  TeamFormData,
} from "../types/event";
import TournamentHeader from "../components/tournamentDetails/TournamentHeader";
import TournamentInfo from "../components/tournamentDetails/TournamentInfo";
import LeaderboardTab from "../components/tournamentDetails/leaderboardTab/LeaderboardTab";
import TournamentDialogs from "../components/tournamentDetails/TournamentDialogs";
import NotFoundView from "../components/tournamentDetails/NotFoundView";

import { useStyles } from "../styles/hooks/useStyles";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import MobileBottomNavigation from "../components/tournamentDetails/MobileBottomNavigation";
import PlayersTab from "../components/players/PlayersTab";
import SharedHighlightsTab from "../components/highlights/SharedHighlightsTab";
import TeamManagement from "../components/teams/TeamManagement";
import RoundTab from "../components/round/RoundTab";

const TAB_INDICES = {
  leaderboard: 0,
  rounds: 1,
  players: 2,
  teams: 3,
  highlights: 4,
};

const CaptainBadge: React.FC<{
  player: Player;
  tournament: Tournament;
  showLabel?: boolean;
}> = ({ player, tournament, showLabel = true }) => {
  // Find if player is a captain
  const team = tournament.teams.find((team) => team.captain === player.id);

  if (!team) return null;

  return (
    <Tooltip title={`Captain of ${team.name}`}>
      <Box
        component="span"
        sx={{ display: "inline-flex", alignItems: "center", ml: 1 }}
      >
        <StarIcon
          sx={{
            color: team.color,
            fontSize: "0.9rem",
            mr: showLabel ? 0.5 : 0,
          }}
        />
        {showLabel && (
          <Typography
            component="span"
            variant="caption"
            sx={{
              color: team.color,
              fontWeight: 600,
            }}
          >
            Captain
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

const TournamentDetail: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get tab from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");

  const {
    data: tournament,
    isLoading: isTournamentLoading,
    error: tournamentError,
  } = useGetTournamentById(id);

  const { mutate: updateTournament } = useUpdateTournament();
  const { mutate: deleteTournament } = useDeleteTournament();
  const { mutate: addRoundToTournament } = useAddRoundToTournament();
  const { mutate: invitePlayers } = useInvitePlayersToEvent();
  const { mutate: updatePlayerGroups } = useUpdatePlayerGroups();

  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  // Set initial tab value based on URL parameter
  const getInitialTabValue = () => {
    if (!tabParam) return 0; // Default to Leaderboard

    const tabName = tabParam.toLowerCase();
    if (tabName in TAB_INDICES) {
      return TAB_INDICES[tabName as keyof typeof TAB_INDICES];
    }
    return 0;
  };

  const [tabValue, setTabValue] = useState(getInitialTabValue());

  const [openInviteDialog, setOpenInviteDialog] = useState<boolean>(false);
  const [openAddRoundDialog, setOpenAddRoundDialog] = useState<boolean>(false);
  const [openEditTournamentDialog, setOpenEditTournamentDialog] =
    useState<boolean>(false);
  const [emailsToInvite, setEmailsToInvite] = useState<string>("");
  const [inviteError, setInviteError] = useState<string>("");

  const isCreator =
    user && tournament ? tournament.createdBy === user.id : false;

  const isPlayerCaptain = (playerId: string) => {
    if (!tournament) return false;
    return tournament.teams.some((team) => team.captain === playerId);
  };

  const getTeamCaptain = (teamId: string): Player | null => {
    if (!tournament) return null;

    const team = tournament.teams.find((t) => t.id === teamId);
    if (!team || !team.captain) return null;

    return tournament.players.find((p) => p.id === team.captain) || null;
  };

  // Set selected round when tournament data is loaded
  useEffect(() => {
    if ((tournament?.rounds?.length ?? 0) > 0 && !selectedRoundId) {
      if (tournament && tournament.rounds.length > 0) {
        setSelectedRoundId(tournament.rounds[0].id);
      }
    }
  }, [tournament, selectedRoundId]);

  // Update tab when URL changes
  useEffect(() => {
    setTabValue(getInitialTabValue());
  }, [location.search]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // Update URL with the tab parameter
    let tabName = "";
    Object.entries(TAB_INDICES).forEach(([key, value]) => {
      if (value === newValue) {
        tabName = key;
      }
    });

    // Only update URL if a valid tab name is found
    if (tabName) {
      navigate(`/tournaments/${id}?tab=${tabName}`, { replace: true });
    }
  };

  const handleBackClick = () => {
    navigate("/events");
  };

  const handleAddRound = (data: RoundFormData) => {
    if (!tournament || !user) return;

    const currentUser: Player = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim() || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
      teamId: "",
    };

    addRoundToTournament({
      tournamentId: id,
      roundData: data,
      currentUser: currentUser,
    });

    setOpenAddRoundDialog(false);
  };

  const handleDeleteRound = (roundId: string) => {
    if (
      !tournament ||
      !window.confirm("Are you sure you want to delete this round?")
    )
      return;

    // Update tournament by removing the round
    const updatedRounds = tournament.rounds.filter(
      (round) => round.id !== roundId
    );

    updateTournament({
      tournamentId: id,
      updates: {
        ...tournament,
        rounds: updatedRounds,
      },
    });

    // If the deleted round was selected, select another one
    if (selectedRoundId === roundId) {
      if (updatedRounds.length > 0) {
        setSelectedRoundId(updatedRounds[0].id);
      } else {
        setSelectedRoundId(null);
      }
    }
  };

  const handleSelectRound = (roundId: string) => {
    setSelectedRoundId(roundId);
  };

  const handleDeleteTournament = () => {
    if (!window.confirm("Are you sure you want to delete this tournament?"))
      return;

    deleteTournament(id);
    navigate("/events");
  };

  const handleUpdateTournament = (data: Partial<Tournament>) => {
    updateTournament({
      tournamentId: id,
      updates: data,
    });

    setOpenEditTournamentDialog(false);
  };

  const handleInvitePlayers = () => {
    if (!id) return;

    const emails = emailsToInvite
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    if (emails.length === 0) {
      setInviteError("Please enter at least one email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setInviteError(`Invalid email format: ${invalidEmails.join(", ")}`);
      return;
    }

    invitePlayers({
      eventId: id,
      emails: emails,
    });

    setOpenInviteDialog(false);
  };

  const handleAddTeam = (teamData: TeamFormData) => {
    if (!tournament) return;

    // Create a new team object with an ID
    const newTeam: Team = {
      id: `team-${Date.now()}`, // Temporary ID that will be replaced by the server
      name: teamData.name,
      color: teamData.color,
      captain: teamData.captain,
    };

    // Update the tournament with the new team
    updateTournament({
      tournamentId: id,
      updates: {
        ...tournament,
        teams: [...tournament.teams, newTeam],
      },
    });
  };

  const handleUpdateTeam = (teamId: string, teamData: Partial<Team>) => {
    if (!tournament) return;

    // Update the specific team
    const updatedTeams = tournament.teams.map((team) =>
      team.id === teamId ? { ...team, ...teamData } : team
    );

    updateTournament({
      tournamentId: id,
      updates: {
        ...tournament,
        teams: updatedTeams,
      },
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    if (!tournament) return;

    // Remove the team
    const updatedTeams = tournament.teams.filter((team) => team.id !== teamId);

    // Also update players who were on this team
    const updatedPlayers = tournament.players.map((player) =>
      player.teamId === teamId ? { ...player, teamId: undefined } : player
    );

    updateTournament({
      tournamentId: id,
      updates: {
        ...tournament,
        teams: updatedTeams,
        players: updatedPlayers,
      },
    });
  };

  const handleAssignPlayerToTeam = (playerId: string, teamId?: string) => {
    if (!tournament) return;

    // Update the player's team
    const updatedPlayers = tournament.players.map((player) =>
      player.id === playerId ? { ...player, teamId } : player
    );

    updateTournament({
      tournamentId: id,
      updates: {
        ...tournament,
        players: updatedPlayers,
      },
    });
  };

  const dialogHandlers = {
    invite: {
      open: () => setOpenInviteDialog(true),
      close: () => setOpenInviteDialog(false),
    },
    addRound: {
      open: () => setOpenAddRoundDialog(true),
      close: () => setOpenAddRoundDialog(false),
    },
    editTournament: {
      open: () => setOpenEditTournamentDialog(true),
      close: () => setOpenEditTournamentDialog(false),
    },
  };

  const handleUpdatePlayerGroups = (
    roundId: string,
    playerGroups: PlayerGroup[]
  ) => {
    updatePlayerGroups({
      eventId: id,
      roundId,
      playerGroups,
    });
  };

  if (isTournamentLoading || !isLoaded) {
    return (
      <Box sx={styles.feedback.loading.container}>
        <CircularProgress sx={styles.feedback.loading.icon} />
        <Typography sx={styles.feedback.loading.text}>
          Loading tournament details...
        </Typography>
      </Box>
    );
  }

  if (tournamentError || !tournament) {
    return <NotFoundView onBackClick={handleBackClick} />;
  }

  // Modify the existing components by adding captain information
  const EnhancedTournamentInfo = () => (
    <Box sx={{ position: "relative" }}>
      <TournamentInfo tournament={tournament} />

      {tournament.isTeamEvent && tournament.teams.length > 0 && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.common.black, 0.2),
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
        >
          <Typography variant="h6" sx={styles.text.heading.section}>
            Team Captains
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {tournament.teams.map((team) => {
              const captain = getTeamCaptain(team.id);
              return (
                <Chip
                  key={team.id}
                  icon={<StarIcon sx={{ color: team.color + " !important" }} />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="span"
                        sx={{ color: team.color, fontWeight: 600, mr: 0.5 }}
                      >
                        {team.name}:
                      </Box>
                      {captain ? captain.name : "No captain"}
                    </Box>
                  }
                  sx={{
                    bgcolor: alpha(team.color, 0.15),
                    border: `1px solid ${alpha(team.color, 0.3)}`,
                    color: "white",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );

  // Create enhanced players tab that shows captain status
  const EnhancedPlayersTab = () => (
    <Box>
      <PlayersTab
        event={tournament}
        isCreator={isCreator}
        onInvitePlayers={dialogHandlers.invite.open}
        renderPlayerExtra={(player) => (
          <>
            {isPlayerCaptain(player.id) && (
              <CaptainBadge player={player} tournament={tournament} />
            )}
          </>
        )}
      />
    </Box>
  );

  return (
    <Box sx={styles.layout.page.withBackground}>
      <Box
        sx={{ ...styles.mobile.container.fullWidth, pb: isMobile ? "56px" : 0 }}
      >
        <Box sx={styles.card.glass}>
          <Box sx={styles.navigation.backButtonContainer}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackClick}
              sx={styles.navigation.backButton}
            >
              Back to Events
            </Button>
          </Box>
          <TournamentHeader
            tournament={tournament}
            isCreator={isCreator}
            onDeleteTournament={handleDeleteTournament}
            onEditTournament={dialogHandlers.editTournament.open}
          />

          {(!isMobile || (isMobile && tabValue === 0)) && (
            <EnhancedTournamentInfo />
          )}

          {!isMobile && (
            <Box sx={styles.tabs.container}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="tournament detail tabs"
                variant="standard"
                textColor="inherit"
              >
                <Tab label="Leaderboard" />
                <Tab label={`Rounds (${tournament.rounds.length})`} />
                <Tab label="Players" />
                {tournament.isTeamEvent && (
                  <Tab label={`Teams (${tournament.teams.length})`} />
                )}
                <Tab
                  label="Highlights"
                  icon={<AchievementIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          )}

          <div
            role="tabpanel"
            hidden={tabValue !== 0}
            id="tournament-detail-tabpanel-0"
            aria-labelledby="tournament-detail-tab-0"
          >
            {tabValue === 0 && (
              <Box sx={styles.tabs.panel}>
                <LeaderboardTab
                  tournament={tournament}
                  isCreator={isCreator}
                  onAddRound={dialogHandlers.addRound.open}
                />
              </Box>
            )}
          </div>

          <div
            role="tabpanel"
            hidden={tabValue !== 1}
            id="tournament-detail-tabpanel-1"
            aria-labelledby="tournament-detail-tab-1"
          >
            {tabValue === 1 && (
              <Box sx={styles.tabs.panel}>
                <RoundTab
                  rounds={tournament.rounds}
                  players={tournament.players}
                  isCreator={isCreator}
                  selectedRoundId={selectedRoundId}
                  onSelectRound={handleSelectRound}
                  onDeleteRound={handleDeleteRound}
                  onUpdatePlayerGroups={handleUpdatePlayerGroups}
                  onNavigateToGroup={(roundId, groupId) =>
                    navigate(
                      `/tournaments/${tournament.id}/rounds/${roundId}/groups/${groupId}`
                    )
                  }
                  parentType="tournament"
                  parentId={tournament.id}
                  onAddRound={dialogHandlers.addRound.open}
                />
              </Box>
            )}
          </div>

          <div
            role="tabpanel"
            hidden={tabValue !== 2}
            id="tournament-detail-tabpanel-2"
            aria-labelledby="tournament-detail-tab-2"
          >
            {tabValue === 2 && (
              <Box sx={styles.tabs.panel}>
                <EnhancedPlayersTab />
              </Box>
            )}
          </div>

          {tournament.isTeamEvent && (
            <div
              role="tabpanel"
              hidden={tabValue !== 3}
              id="tournament-detail-tabpanel-3"
              aria-labelledby="tournament-detail-tab-3"
            >
              {tabValue === 3 && (
                <Box sx={styles.tabs.panel}>
                  <TeamManagement
                    event={tournament}
                    isCreator={isCreator}
                    onAddTeam={handleAddTeam}
                    onUpdateTeam={handleUpdateTeam}
                    onDeleteTeam={handleDeleteTeam}
                    onAssignPlayer={handleAssignPlayerToTeam}
                  />
                </Box>
              )}
            </div>
          )}

          <div
            role="tabpanel"
            hidden={tabValue !== (tournament.isTeamEvent ? 4 : 3)}
            id="tournament-detail-tabpanel-highlights"
            aria-labelledby="tournament-detail-tab-highlights"
          >
            {tabValue === (tournament.isTeamEvent ? 4 : 3) && (
              <Box sx={styles.tabs.panel}>
                <SharedHighlightsTab
                  event={tournament}
                  eventType="tournament"
                />
              </Box>
            )}
          </div>
        </Box>
      </Box>

      {isMobile && tournament && (
        <MobileBottomNavigation
          activeTab={tabValue}
          teamCount={tournament.teams.length}
          hasTeams={tournament.isTeamEvent}
          playerCount={tournament.players.length}
          onTabChange={handleTabChange}
        />
      )}

      <TournamentDialogs
        tournament={tournament}
        dialogState={{
          inviteOpen: openInviteDialog,
          addRoundOpen: openAddRoundDialog,
          editTournamentOpen: openEditTournamentDialog,
          emailsToInvite,
          inviteError,
        }}
        handlers={{
          closeInvite: dialogHandlers.invite.close,
          closeAddRound: dialogHandlers.addRound.close,
          closeEditTournament: dialogHandlers.editTournament.close,
          setEmailsToInvite: setEmailsToInvite,
          setInviteError: setInviteError,
          handleInvitePlayers,
          handleAddRound,
          handleUpdateTournament,
        }}
      />
    </Box>
  );
};

export default TournamentDetail;
