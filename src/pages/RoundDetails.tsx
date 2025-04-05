import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Alert,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  GolfCourse as GolfCourseIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import eventService from "../services/eventService";
import friendsService from "../services/friendsService";
import { Round, RoundFormData } from "../types/event";
import RoundForm from "../components/round/RoundForm";
import PlayerScorecard from "../components/tournamentDetails/PlayerScorecard";
import { Friend } from "../services/friendsService";
import { useStyles } from "../styles/hooks/useStyles";

const RoundDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const styles = useStyles();

  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [emailsToInvite, setEmailsToInvite] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    if (!id || !isLoaded || !user) return;

    const fetchRound = () => {
      setLoading(true);
      const roundData = eventService.getRoundById(id);

      if (roundData) {
        setRound(roundData);
        setIsCreator(roundData.createdBy === user.id);
      } else {
        // Round not found - navigate back to rounds list
        navigate("/rounds");
      }

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

    fetchRound();
    fetchFriends();
  }, [id, isLoaded, user, navigate]);

  const handleEditRound = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateRound = (
    data: RoundFormData & { inviteFriends: string[] }
  ) => {
    if (!id) return;

    // Update the round
    const updatedRound = eventService.updateRoundEvent(id, data);

    // If there are new invitations, send them
    if (data.inviteFriends && data.inviteFriends.length > 0) {
      eventService.invitePlayersToRound(id, data.inviteFriends);
    }

    if (updatedRound) {
      setRound(updatedRound);
    }

    setOpenEditDialog(false);
  };

  const handleDeleteRound = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (!id) return;

    eventService.deleteRoundEvent(id);
    navigate("/rounds");
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleBackClick = () => {
    navigate("/rounds");
  };

  const handleInvitePlayers = () => {
    setOpenInviteDialog(true);
  };

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false);
    setEmailsToInvite("");
    setInviteError("");
  };

  const handleSubmitInvites = () => {
    if (!id || !round) return;

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

    // Send invitations
    eventService.invitePlayersToRound(id, emails);

    // Refresh round data to update invitations list
    const updatedRound = eventService.getRoundById(id);
    if (updatedRound) {
      setRound(updatedRound);
    }

    handleCloseInviteDialog();
  };

  if (loading || !isLoaded) {
    return (
      <Box sx={styles.feedback.loading.container}>
        <CircularProgress sx={styles.feedback.loading.icon} />
        <Typography sx={styles.feedback.loading.text}>
          Loading round details...
        </Typography>
      </Box>
    );
  }

  if (!round) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Round not found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ mt: 2, ...styles.button.primary }}
          >
            Back to Rounds
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={styles.layout.page.withBackground}>
      <Container maxWidth="lg">
        {/* Header with back button, title and actions */}
        <Box sx={styles.headers.event.container}>
          <IconButton
            onClick={handleBackClick}
            sx={styles.navigation.backButton}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 1,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={styles.headers.event.title}
            >
              {round.name}
            </Typography>

            {round.status && (
              <Chip
                label={
                  round.status.charAt(0).toUpperCase() + round.status.slice(1)
                }
                color={
                  round.status === "active"
                    ? "success"
                    : round.status === "completed"
                    ? "primary"
                    : "info"
                }
                size={isMobile ? "small" : "medium"}
              />
            )}
          </Box>

          {isCreator && (
            <Box
              sx={{
                display: "flex",
                mt: { xs: 1, sm: 0 },
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" },
                gap: 1,
              }}
            >
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteRound}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                variant="outlined"
                sx={styles.button.danger}
              >
                Delete
              </Button>
              <Button
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditRound}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={styles.button.primary}
              >
                Edit
              </Button>
            </Box>
          )}
        </Box>

        {/* Round Info Card */}
        <Paper sx={styles.card.glass}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ ...styles.tournamentCard.infoItem, mb: { xs: 1, md: 2 } }}
              >
                <CalendarIcon />
                <Typography variant="subtitle1" sx={styles.text.body.primary}>
                  Date: {new Date(round.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={styles.tournamentCard.infoItem}>
                <LocationIcon />
                <Typography variant="subtitle1" sx={styles.text.body.primary}>
                  Location: {round.location || "Not specified"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ ...styles.tournamentCard.infoItem, mb: { xs: 1, md: 2 } }}
              >
                <GolfCourseIcon />
                <Typography variant="subtitle1" sx={styles.text.body.primary}>
                  Course: {round.courseDetails?.name || "Not specified"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Chip
                  label={`Format: ${round.format}`}
                  size="small"
                  sx={styles.chips.eventType.tournament}
                />

                <Chip
                  label={`${round.courseDetails?.holes} holes`}
                  size="small"
                  sx={styles.chips.eventType.tour}
                />

                {round.courseDetails?.par && (
                  <Chip
                    label={`Par: ${round.courseDetails?.par}`}
                    size="small"
                    sx={styles.chips.eventType.custom(theme.palette.info.light)}
                  />
                )}
              </Box>
            </Grid>
            {round.description && (
              <Grid item xs={12}>
                <Divider sx={styles.divider.standard} />
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ ...styles.text.body.primary, mt: 1 }}
                >
                  Description:
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={styles.text.body.primary}
                >
                  {round.description}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Players Section */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">
              Players {round.players && `(${round.players.length})`}
            </Typography>
            {isCreator && (
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={handleInvitePlayers}
                sx={styles.button.outlined}
              >
                Invite Players
              </Button>
            )}
          </Box>

          {/* Player List */}
          {round.players && round.players.length > 0 ? (
            <Paper sx={styles.card.glass}>
              <List>
                {round.players.map((player) => (
                  <React.Fragment key={player.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={styles.avatars.standard()}>
                          {player.avatarUrl ? (
                            <img
                              src={player.avatarUrl}
                              alt={player.name}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            <PersonIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={player.name}
                        secondary={player.email}
                      />
                      {player.id === round.createdBy && (
                        <Chip
                          label="Creator"
                          size="small"
                          color="primary"
                          sx={{ height: 24 }}
                        />
                      )}
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <Alert severity="info">
              No players have joined this round yet. Invite some friends to
              join!
            </Alert>
          )}

          {/* Pending Invitations */}
          {round.invitations && round.invitations.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pending Invitations ({round.invitations.length})
              </Typography>
              <Paper sx={styles.card.glass}>
                <List>
                  {round.invitations.map((email) => (
                    <React.Fragment key={email}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={email} secondary="Pending" />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Scorecard Section - only show if there are players */}
        {round.players && round.players.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Scorecard
            </Typography>

            <Paper sx={styles.card.glass}>
              {round.players.map((player) => (
                <Box key={player.id} sx={{ mb: 4 }}>
                  <PlayerScorecard
                    player={player}
                    tournament={{
                      ...round,
                      id: round.id,
                      name: round.name,
                      startDate: round.date,
                      endDate: round.date,
                      rounds: [round],
                      location: round.location || "",
                      format: round.format,
                      createdBy: round.createdBy || "",
                      createdAt: round.createdAt || new Date().toISOString(),
                      players: round.players || [],
                      teams: [],
                      invitations: round.invitations || [],
                      isTeamEvent: false,
                      scoringType: "individual",
                      status: round.status || "upcoming",
                    }}
                    showAllRounds={false}
                  />
                </Box>
              ))}
            </Paper>
          </Box>
        )}
      </Container>

      {/* Edit Round Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <RoundForm
          initialData={{
            name: round.name,
            date: round.date,
            courseName: round.courseDetails?.name,
            location: round.location,
            description: round.description,
            holes: round.courseDetails?.holes || 18,
            par: round.courseDetails?.par || 72,
            format: round.format,
          }}
          onSubmit={handleUpdateRound}
          onCancel={handleCloseEditDialog}
          friends={friends}
          loadingFriends={loadingFriends}
        />
      </Dialog>

      {/* Invite Players Dialog */}
      <Dialog
        open={openInviteDialog}
        onClose={handleCloseInviteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <DialogTitle sx={styles.dialogs.title}>Invite Players</DialogTitle>
        <DialogContent sx={styles.dialogs.content}>
          <Typography
            variant="body2"
            sx={{ mb: 2, mt: 2, ...styles.text.body.primary }}
          >
            Enter email addresses of players you want to invite to this round.
            Separate multiple emails with commas.
          </Typography>

          <TextField
            label="Email Addresses"
            multiline
            rows={3}
            fullWidth
            value={emailsToInvite}
            onChange={(e) => setEmailsToInvite(e.target.value)}
            placeholder="example@email.com, another@email.com"
            error={!!inviteError}
            helperText={inviteError}
            InputLabelProps={styles.tournamentCard.formStyles.labelProps(theme)}
            InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
          />
        </DialogContent>
        <DialogActions sx={styles.dialogs.actions}>
          <Button onClick={handleCloseInviteDialog} sx={styles.button.cancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitInvites}
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            sx={styles.button.primary}
          >
            Send Invitations
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <DialogTitle sx={styles.dialogs.title}>Confirm Delete</DialogTitle>
        <DialogContent sx={styles.dialogs.content}>
          <Typography sx={styles.text.body.primary}>
            Are you sure you want to delete this round? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={styles.dialogs.actions}>
          <Button onClick={handleCancelDelete} sx={styles.button.outlined}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              ...styles.button.danger,
              bgcolor: "error.main",
              color: "white",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoundDetails;
