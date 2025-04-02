import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  useTheme,
  alpha,
  useMediaQuery,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Star as StarIcon,
  MilitaryTech as AchievementIcon,
} from "@mui/icons-material";
import tournamentService from "../services/eventService";
import { Tournament, RoundFormData, Player, PlayerGroup } from "../types/event";
import TournamentHeader from "../components/tournamentDetails/TournamentHeader";
import TournamentInfo from "../components/tournamentDetails/TournamentInfo";
import LeaderboardTab from "../components/tournamentDetails/leaderboardTab/LeaderboardTab";
import RoundsTab from "../components/tournamentDetails/roundsTab/RoundsTab";
import PlayersTab from "../components/tournamentDetails/playersTab/PlayersTab";
import TournamentDialogs from "../components/tournamentDetails/TournamentDialogs";
import NotFoundView from "../components/tournamentDetails/NotFoundView";
import TeamManagement from "../components/tournamentDetails/teamsTab/TeamManagement";
import { TabPanel } from "../components/common/index";
import { colors } from "../theme/theme";
import HighlightsTab from "../components/tournamentDetails/highlightsTab/HighlightsTab";

// Map tab names to their respective indices
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
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // Get tab from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  useEffect(() => {
    if (!id || !isLoaded) return;

    const fetchTournament = () => {
      setIsLoading(true);
      const tournamentData = tournamentService.getTournamentById(id);

      if (tournamentData) {
        setTournament(tournamentData);

        // If there are rounds, set the first round as selected
        if (tournamentData.rounds.length > 0) {
          setSelectedRoundId(tournamentData.rounds[0].id);
        }
      }

      setIsLoading(false);
    };

    fetchTournament();
  }, [id, isLoaded]);

  // Update tab when URL changes
  useEffect(() => {
    setTabValue(getInitialTabValue());
  }, [location.search]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
    navigate(-1);
  };

  const handleAddRound = (data: RoundFormData) => {
    if (!id) return;

    const updatedTournament = tournamentService.addRound(id, data);
    if (updatedTournament) {
      setTournament(updatedTournament);

      const newRoundId =
        updatedTournament.rounds[updatedTournament.rounds.length - 1].id;
      setSelectedRoundId(newRoundId);
      setTabValue(1); // Switch to Rounds tab
      navigate(`/tournaments/${id}?tab=rounds`, { replace: true });
    }

    setOpenAddRoundDialog(false);
  };

  const handleDeleteRound = (roundId: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this round?"))
      return;

    const updatedTournament = tournamentService.deleteRound(id, roundId);
    if (updatedTournament) {
      setTournament(updatedTournament);

      // If the deleted round was selected, select another one
      if (selectedRoundId === roundId) {
        if (updatedTournament.rounds.length > 0) {
          setSelectedRoundId(updatedTournament.rounds[0].id);
        } else {
          setSelectedRoundId(null);
        }
      }
    }
  };

  const handleSelectRound = (roundId: string) => {
    setSelectedRoundId(roundId);
  };

  const handleDeleteTournament = () => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this tournament?")
    )
      return;

    tournamentService.deleteTournament(id);
    navigate("/events");
  };

  const handleUpdateTournament = (data: any) => {
    if (!id) return;

    tournamentService.updateTournament(id, data);

    // Refresh tournament data
    const updatedTournament = tournamentService.getTournamentById(id);
    if (updatedTournament) {
      setTournament(updatedTournament);
    }

    setOpenEditTournamentDialog(false);
  };

  const handleInvitePlayers = () => {
    if (!tournament || !id) return;

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

    tournamentService.invitePlayersToTournament(id, emails);

    // Refresh tournament data
    const updatedTournament = tournamentService.getTournamentById(id);
    if (updatedTournament) {
      setTournament(updatedTournament);
    }

    setOpenInviteDialog(false);
  };

  const handleAddTeam = (teamData: any) => {
    if (!id) return;

    const updatedTournament = tournamentService.addTeam(id, teamData);
    if (updatedTournament) {
      setTournament(updatedTournament);
    }
  };

  const handleUpdateTeam = (teamId: string, teamData: any) => {
    if (!id) return;

    const updatedTournament = tournamentService.updateTeam(
      id,
      teamId,
      teamData
    );
    if (updatedTournament) {
      setTournament(updatedTournament);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (!id) return;

    const updatedTournament = tournamentService.deleteTeam(id, teamId);
    if (updatedTournament) {
      setTournament(updatedTournament);
    }
  };

  const handleAssignPlayerToTeam = (playerId: string, teamId?: string) => {
    if (!id) return;

    const updatedTournament = tournamentService.assignPlayerToTeam(
      id,
      playerId,
      teamId
    );
    if (updatedTournament) {
      setTournament(updatedTournament);
    }
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
    const updatedTournament = tournamentService.updateTournamentPlayerGroups(
      tournament?.id!,
      roundId,
      playerGroups
    );

    if (updatedTournament) {
      setTournament(updatedTournament);
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <Box
        sx={{
          background: colors.backgrounds.dark,
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          p: 3,
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
        <Typography sx={{ mt: 2, color: "white" }}>
          Loading tournament details...
        </Typography>
      </Box>
    );
  }

  if (!tournament) {
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
          <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
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
        tournament={tournament}
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
    <Box
      sx={{
        background: colors.backgrounds.dark,
        minHeight: "calc(100vh - 64px)",
        pt: { xs: 2, md: 4 },
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.common.black, 0.3),
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
        >
          <TournamentHeader
            tournament={tournament}
            isCreator={isCreator}
            onBackClick={handleBackClick}
            onDeleteTournament={handleDeleteTournament}
            onEditTournament={dialogHandlers.editTournament.open}
          />

          <EnhancedTournamentInfo />

          <Box
            sx={{
              borderBottom: 1,
              borderColor: alpha(theme.palette.common.white, 0.2),
              mb: 2,
              overflowX: "auto",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="tournament detail tabs"
              variant={isSmall ? "scrollable" : "standard"}
              scrollButtons={isSmall ? "auto" : false}
              allowScrollButtonsMobile
              textColor="inherit"
              TabIndicatorProps={{
                style: { background: "white" },
              }}
            >
              <Tab
                label="Leaderboard"
                sx={{ color: "white", minWidth: isSmall ? "auto" : "initial" }}
              />
              <Tab
                label={`Rounds (${tournament.rounds.length})`}
                sx={{ color: "white", minWidth: isSmall ? "auto" : "initial" }}
              />
              <Tab
                label="Players"
                sx={{ color: "white", minWidth: isSmall ? "auto" : "initial" }}
              />
              {tournament.isTeamEvent && (
                <Tab
                  label={`Teams (${tournament.teams.length})`}
                  sx={{
                    color: "white",
                    minWidth: isSmall ? "auto" : "initial",
                  }}
                />
              )}
              <Tab
                label="Highlights"
                icon={<AchievementIcon />}
                iconPosition="start"
                sx={{
                  color: "white",
                  minWidth: isSmall ? "auto" : "initial",
                }}
              />
            </Tabs>
          </Box>

          <TabPanel id="tournament-detail" value={tabValue} index={0}>
            <LeaderboardTab
              tournament={tournament}
              isCreator={isCreator}
              onAddRound={dialogHandlers.addRound.open}
              // isCaptain={isPlayerCaptain(player.id)}
              // renderPlayerExtra={(player) => (
              //   <>
              //     {isPlayerCaptain(player.id) && (
              //       <CaptainBadge
              //         player={player}
              //         tournament={tournament}
              //         showLabel={false}
              //       />
              //     )}
              //   </>
              // )}
            />
          </TabPanel>

          <TabPanel id="tournament-detail" value={tabValue} index={1}>
            <RoundsTab
              tournament={tournament}
              isCreator={isCreator}
              selectedRoundId={selectedRoundId}
              onSelectRound={handleSelectRound}
              onDeleteRound={handleDeleteRound}
              onAddRound={dialogHandlers.addRound.open}
              onUpdatePlayerGroups={handleUpdatePlayerGroups}
              // renderPlayerExtra={(player) => (
              //   <>
              //     {isPlayerCaptain(player.id) && (
              //       <CaptainBadge
              //         player={player}
              //         tournament={tournament}
              //         showLabel={false}
              //       />
              //     )}
              //   </>
              // )}
            />
          </TabPanel>

          <TabPanel id="tournament-detail" value={tabValue} index={2}>
            <EnhancedPlayersTab />
          </TabPanel>

          {tournament.isTeamEvent && (
            <TabPanel id="tournament-detail" value={tabValue} index={3}>
              <Box>
                <TeamManagement
                  teams={tournament.teams}
                  players={tournament.players}
                  isCreator={isCreator}
                  onAddTeam={handleAddTeam}
                  onUpdateTeam={handleUpdateTeam}
                  onDeleteTeam={handleDeleteTeam}
                  onAssignPlayer={handleAssignPlayerToTeam}
                />
              </Box>
            </TabPanel>
          )}
          <TabPanel
            id="tournament-detail"
            value={tabValue}
            index={tournament.isTeamEvent ? 4 : 3}
          >
            <HighlightsTab
              tournament={tournament}
              user={
                user
                  ? {
                      id: user.id,
                      name: user.fullName || "",
                      email: user.primaryEmailAddress?.emailAddress || "",
                      avatarUrl: user.imageUrl,
                    }
                  : null
              }
            />
          </TabPanel>
        </Box>
      </Container>

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
