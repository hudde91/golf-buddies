import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Star as StarIcon } from "@mui/icons-material";
import tournamentService from "../services/eventService";
import { Tournament, RoundFormData, HoleScore, Player } from "../types/event";
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
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  // Dialog states
  const [openInviteDialog, setOpenInviteDialog] = useState<boolean>(false);
  const [openAddRoundDialog, setOpenAddRoundDialog] = useState<boolean>(false);
  const [openEditTournamentDialog, setOpenEditTournamentDialog] =
    useState<boolean>(false);
  const [emailsToInvite, setEmailsToInvite] = useState<string>("");
  const [inviteError, setInviteError] = useState<string>("");

  const isCreator =
    user && tournament ? tournament.createdBy === user.id : false;
  const isParticipant =
    user && tournament
      ? tournament.players.some((p) => p.id === user.id)
      : false;

  // Helper function to get a player's team
  const getPlayerTeam = (playerId: string) => {
    if (!tournament) return null;

    for (const team of tournament.teams) {
      const teamPlayers = tournament.players.filter(
        (p) => p.teamId === team.id
      );
      if (teamPlayers.some((p) => p.id === playerId)) {
        return team;
      }
    }
    return null;
  };

  // Helper function to check if a player is a captain
  const isPlayerCaptain = (playerId: string) => {
    if (!tournament) return false;
    return tournament.teams.some((team) => team.captain === playerId);
  };

  // Get captain player for a team
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Handler functions that modify the tournament data
  const handleAddRound = (data: RoundFormData) => {
    if (!id) return;

    const updatedTournament = tournamentService.addRound(id, data);
    if (updatedTournament) {
      setTournament(updatedTournament);

      // Select the newly added round
      const newRoundId =
        updatedTournament.rounds[updatedTournament.rounds.length - 1].id;
      setSelectedRoundId(newRoundId);
      setTabValue(1); // Switch to Rounds tab
    }

    setOpenAddRoundDialog(false);
  };

  const handleUpdateRoundScores = (
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ) => {
    if (!id) return;

    const updatedTournament = tournamentService.updateRoundScores(
      id,
      roundId,
      playerId,
      scores
    );
    if (updatedTournament) {
      setTournament(updatedTournament);
    }
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

    // Validate email format
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

  // Dialog handler functions
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
              onUpdateScores={handleUpdateRoundScores}
              onAddRound={dialogHandlers.addRound.open}
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
        </Box>
      </Container>

      {/* Centralize all dialogs in one component */}
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
