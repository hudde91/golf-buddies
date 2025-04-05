import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Dialog,
  CircularProgress,
  Typography,
} from "@mui/material";
import RoundHeader from "../components/round/RoundHeader";
import RoundGrid from "../components/round/RoundGrid";
import RoundForm from "../components/round/RoundForm";
import eventService from "../services/eventService";
import friendsService from "../services/friendsService";
import { Round, RoundFormData, Event } from "../types/event";
import { Friend } from "../services/friendsService";
import { useStyles } from "../styles/hooks/useStyles";

const Rounds: React.FC = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const styles = useStyles();

  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchRounds = () => {
      setLoading(true);

      // Get all events and filter rounds
      const allEvents = eventService.getAllEvents();
      const roundEvents = allEvents.filter((event) => event.type === "round");

      // Filter rounds for this user (created by or invited to)
      const userRounds = roundEvents
        .filter((event: Event) => {
          const round = event.data as Round;
          return (
            round.createdBy === user.id ||
            (round.players && round.players.some((p) => p.id === user.id)) ||
            (round.invitations &&
              round.invitations.includes(
                user.primaryEmailAddress?.emailAddress || ""
              ))
          );
        })
        .map((event) => event.data as Round);

      setRounds(userRounds);
      setLoading(false);
    };

    const fetchFriends = async () => {
      setLoadingFriends(true);
      if (user) {
        const userFriends = friendsService.getAcceptedFriends(user.id);
        setFriends(userFriends);
        setLoadingFriends(false);
      }
    };

    fetchRounds();
    fetchFriends();

    // Update event statuses periodically (e.g., from upcoming to active)
    eventService.updateEventStatuses();
  }, [isLoaded, user]);

  const handleCreateRound = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleSubmitRound = (
    data: RoundFormData & { inviteFriends: string[] }
  ) => {
    if (!user) return;

    // Create a player object from the current user
    const currentUser = {
      id: user.id,
      name: user.fullName || "",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
    };

    // Create the round
    const newRoundEvent = eventService.createRound(data, currentUser);

    // Add to local state
    const newRound = newRoundEvent.data as Round;
    setRounds((prevRounds) => [...prevRounds, newRound]);

    setOpenCreateDialog(false);

    // Navigate to the new round's details page
    navigate(`/rounds/${newRound.id}`);
  };

  const handleViewRoundDetails = (roundId: string) => {
    navigate(`/rounds/${roundId}`);
  };

  if (!isLoaded) {
    return (
      <Box sx={styles.feedback.loading.container}>
        <CircularProgress sx={styles.feedback.loading.icon} />
        <Typography sx={styles.feedback.loading.text}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.layout.page.withBackground}>
      <Container maxWidth="lg">
        <RoundHeader onCreateRound={handleCreateRound} />

        {loading ? (
          <Box sx={styles.feedback.loading.container}>
            <CircularProgress sx={styles.feedback.loading.icon} />
            <Typography sx={styles.feedback.loading.text}>
              Loading rounds...
            </Typography>
          </Box>
        ) : (
          <RoundGrid
            rounds={rounds}
            userId={user?.id || ""}
            onViewDetails={handleViewRoundDetails}
            onCreateRound={handleCreateRound}
          />
        )}
      </Container>

      {/* Create Round Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <RoundForm
          onSubmit={handleSubmitRound}
          onCancel={handleCloseCreateDialog}
          friends={friends}
          loadingFriends={loadingFriends}
        />
      </Dialog>
    </Box>
  );
};

export default Rounds;
