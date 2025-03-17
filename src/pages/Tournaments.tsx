import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Badge,
  Typography,
  Dialog,
  useTheme,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import tournamentService from "../services/tournamentService";
import { Tournament, Player } from "../types/tournament";
import TournamentForm from "../components/tournamentDetails/TournamentForm";
import TournamentHeader from "../components/tournament/TournamentHeader";
import TournamentGrid from "../components/tournament/TournamentGrid";
import InvitationList from "../components/tournament/InvitationList";
import TabPanel from "../components/tournament/TabPanel";
import LoadingState from "../components/tournament/LoadingState";

const Tournaments: React.FC = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [invitations, setInvitations] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const [openNewTournament, setOpenNewTournament] = useState(false);

  // Effects
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = () => {
      setIsLoading(true);

      // Get user's tournaments and invitations
      const userTournaments = tournamentService.getUserTournaments(user.id);
      const userInvitations = tournamentService.getUserInvitations(
        user.primaryEmailAddress?.emailAddress || ""
      );

      setTournaments(userTournaments);
      setInvitations(userInvitations);
      setIsLoading(false);
    };

    fetchData();
  }, [user, isLoaded]);

  // Event handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateTournament = () => {
    setOpenNewTournament(true);
  };

  const handleTournamentFormClose = () => {
    setOpenNewTournament(false);
  };

  const handleTournamentSubmit = (tournamentData: any) => {
    if (!user) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || undefined,
    };

    const newTournament = tournamentService.createTournament(
      tournamentData,
      currentUser
    );
    setTournaments([...tournaments, newTournament]);
    setOpenNewTournament(false);
  };

  const handleViewTournament = (tournamentId: string) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  const handleAcceptInvitation = (tournamentId: string) => {
    if (!user) return;

    const currentUser: Player = {
      id: user.id,
      name: user.fullName || "Unknown User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || undefined,
    };

    tournamentService.acceptInvitation(tournamentId, currentUser);

    // Update state
    const updatedInvitations = invitations.filter((t) => t.id !== tournamentId);
    const acceptedTournament =
      tournamentService.getTournamentById(tournamentId);

    if (acceptedTournament) {
      setTournaments([...tournaments, acceptedTournament]);
    }

    setInvitations(updatedInvitations);
  };

  const handleDeclineInvitation = (tournamentId: string) => {
    if (!user) return;

    tournamentService.declineInvitation(
      tournamentId,
      user.primaryEmailAddress?.emailAddress || ""
    );

    // Update state
    const updatedInvitations = invitations.filter((t) => t.id !== tournamentId);
    setInvitations(updatedInvitations);
  };

  if (isLoading || !isLoaded) {
    return <LoadingState />;
  }

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
        minHeight: "calc(100vh - 64px)",
        py: { xs: 3, md: 4 },
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
          <TournamentHeader onCreateTournament={handleCreateTournament} />

          <Box
            sx={{
              borderBottom: 1,
              borderColor: alpha(theme.palette.common.white, 0.2),
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="tournament tabs"
              textColor="inherit"
              TabIndicatorProps={{
                style: { background: "white" },
              }}
            >
              <Tab label="My Tournaments" sx={{ color: "white" }} />
              <Tab
                label={
                  <Badge
                    badgeContent={invitations.length}
                    color="error"
                    max={99}
                  >
                    <Typography sx={{ color: "white" }}>Invitations</Typography>
                  </Badge>
                }
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <TournamentGrid
              tournaments={tournaments}
              userId={user?.id || ""}
              onViewDetails={handleViewTournament}
              onCreateTournament={handleCreateTournament}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <InvitationList
              invitations={invitations}
              onAcceptInvitation={handleAcceptInvitation}
              onDeclineInvitation={handleDeclineInvitation}
            />
          </TabPanel>
        </Box>
      </Container>

      <Dialog
        open={openNewTournament}
        onClose={handleTournamentFormClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            borderRadius: 2,
          },
        }}
      >
        <TournamentForm
          onSubmit={handleTournamentSubmit}
          onCancel={handleTournamentFormClose}
        />
      </Dialog>
    </Box>
  );
};

export default Tournaments;
