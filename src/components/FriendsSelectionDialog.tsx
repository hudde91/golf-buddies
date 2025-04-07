import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
  alpha,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useStyles } from "../styles";
import { Friend } from "../services/friendsService";
import { Player, PlayerGroup } from "../types/event";

interface FriendsSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  friends: Friend[];
  loadingFriends: boolean;
  currentPlayers: Player[];
  playerGroups: PlayerGroup[];
  roundId: string;
  shouldNotShowGroups?: boolean;
  onAddFriendsToGroup: (
    friendIds: string[],
    groupId: string,
    roundId: string
  ) => void;
  onCreateNewGroup: (name: string, playerIds: string[]) => void;
}

const FriendsSelectionDialog: React.FC<FriendsSelectionDialogProps> = ({
  open,
  onClose,
  friends,
  loadingFriends,
  currentPlayers,
  playerGroups,
  roundId,
  onAddFriendsToGroup,
  onCreateNewGroup,
  shouldNotShowGroups = false,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNewGroup, setCreateNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("New Group");

  // Reset selections when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedFriends([]);
      setSelectedGroupId(playerGroups.length > 0 ? playerGroups[0].id : "");
      setIsSubmitting(false);
      setCreateNewGroup(playerGroups.length === 0);
      setNewGroupName(`Group ${playerGroups.length + 1}`);
    }
  }, [open, playerGroups]);

  // Filter out friends who are already in the round
  const availableFriends = friends.filter(
    (friend) => !currentPlayers.some((player) => player.id === friend.id)
  );

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFriends.length === availableFriends.length) {
      // If all are selected, deselect all
      setSelectedFriends([]);
    } else {
      // Otherwise select all available friends
      setSelectedFriends(availableFriends.map((friend) => friend.id));
    }
  };

  const handleGroupChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value === "new") {
      setCreateNewGroup(true);
      setSelectedGroupId("");
    } else {
      setCreateNewGroup(false);
      setSelectedGroupId(value);
    }
  };

  const handleAddFriends = async () => {
    if (selectedFriends.length === 0) return;

    setIsSubmitting(true);

    try {
      if (createNewGroup) {
        // Create a new group with the selected friends
        await onCreateNewGroup(newGroupName, selectedFriends);
      } else if (selectedGroupId) {
        // Add selected friends to the existing group
        await onAddFriendsToGroup(selectedFriends, selectedGroupId, roundId);
      }
      onClose();
    } catch (error) {
      console.error("Error adding friends to group:", error);
      // Handle error (could add error state and display)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: styles.dialogs.paper }}
    >
      <DialogTitle sx={styles.dialogs.title}>
        <Box display="flex" alignItems="center">
          <GroupIcon sx={{ mr: 1 }} />
          Add Friends to Group
        </Box>
      </DialogTitle>

      <DialogContent sx={styles.dialogs.content}>
        {loadingFriends ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : availableFriends.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: (theme) => alpha(theme.palette.common.black, 0.2),
              border: (theme) =>
                `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
              No Available Friends
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: (theme) => alpha(theme.palette.common.white, 0.7),
              }}
            >
              All your friends are already in this round or you haven't added
              any friends yet.
            </Typography>
          </Paper>
        ) : shouldNotShowGroups ? (
          <Box sx={{ mt: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={styles.text.body.primary}>
                Select friends to add
              </Typography>

              <Button
                size="small"
                onClick={handleSelectAll}
                variant="outlined"
                sx={styles.button.outlined}
              >
                {selectedFriends.length === availableFriends.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </Box>

            <Grid container spacing={2}>
              {availableFriends.map((friend) => (
                <Grid item xs={12} sm={6} md={4} key={friend.id}>
                  <Paper
                    variant="outlined"
                    onClick={() => handleToggleFriend(friend.id)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      bgcolor: selectedFriends.includes(friend.id)
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.common.black, 0.3),
                      borderColor: selectedFriends.includes(friend.id)
                        ? theme.palette.primary.main
                        : alpha(theme.palette.common.white, 0.1),
                      "&:hover": {
                        bgcolor: selectedFriends.includes(friend.id)
                          ? alpha(theme.palette.primary.main, 0.15)
                          : alpha(theme.palette.common.black, 0.4),
                      },
                      position: "relative",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={selectedFriends.includes(friend.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFriend(friend.id);
                      }}
                      sx={{
                        color: alpha(theme.palette.common.white, 0.7),
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                        position: "absolute",
                        right: 8,
                        top: 8,
                      }}
                    />

                    <Avatar
                      src={friend.avatarUrl}
                      alt={friend.name}
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        border: (theme) =>
                          `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                      }}
                    >
                      {friend.name[0].toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "white",
                          fontWeight: "medium",
                        }}
                      >
                        {friend.name}
                      </Typography>

                      {friend.handicap !== undefined && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: (theme) =>
                              alpha(theme.palette.common.white, 0.7),
                          }}
                        >
                          Handicap: {friend.handicap}
                        </Typography>
                      )}
                    </Box>

                    {selectedFriends.includes(friend.id) && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          right: 8,
                          bottom: 8,
                          color: theme.palette.primary.main,
                        }}
                      />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <>
            {/* Group Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: "white" }}>
                Select a group to add friends to:
              </Typography>

              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: "white" }}>Player Group</InputLabel>
                <Select
                  value={createNewGroup ? "new" : selectedGroupId}
                  onChange={handleGroupChange}
                  label="Player Group"
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.common.white, 0.3),
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.common.white, 0.5),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: alpha(theme.palette.common.black, 0.9),
                        color: "white",
                      },
                    },
                  }}
                >
                  {playerGroups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name} ({group.playerIds.length} players)
                    </MenuItem>
                  ))}
                  <MenuItem value="new">
                    <AddIcon sx={{ mr: 1, fontSize: 18 }} />
                    Create New Group
                  </MenuItem>
                </Select>
              </FormControl>

              {createNewGroup && (
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: "white" }}>
                    New Group Name
                  </InputLabel>
                  <Select
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    label="New Group Name"
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.common.white, 0.3),
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.common.white, 0.5),
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: alpha(theme.palette.common.black, 0.9),
                          color: "white",
                        },
                      },
                    }}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <MenuItem
                        key={i}
                        value={`Group ${playerGroups.length + i + 1}`}
                      >
                        Group {playerGroups.length + i + 1}
                      </MenuItem>
                    ))}
                    <MenuItem value="Morning Group">Morning Group</MenuItem>
                    <MenuItem value="Afternoon Group">Afternoon Group</MenuItem>
                    <MenuItem value="Evening Group">Evening Group</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={styles.text.body.primary}>
                Select friends to add
              </Typography>

              <Button
                size="small"
                onClick={handleSelectAll}
                variant="outlined"
                sx={styles.button.outlined}
              >
                {selectedFriends.length === availableFriends.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </Box>

            <Grid container spacing={2}>
              {availableFriends.map((friend) => (
                <Grid item xs={12} sm={6} md={4} key={friend.id}>
                  <Paper
                    variant="outlined"
                    onClick={() => handleToggleFriend(friend.id)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      bgcolor: selectedFriends.includes(friend.id)
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.common.black, 0.3),
                      borderColor: selectedFriends.includes(friend.id)
                        ? theme.palette.primary.main
                        : alpha(theme.palette.common.white, 0.1),
                      "&:hover": {
                        bgcolor: selectedFriends.includes(friend.id)
                          ? alpha(theme.palette.primary.main, 0.15)
                          : alpha(theme.palette.common.black, 0.4),
                      },
                      position: "relative",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={selectedFriends.includes(friend.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFriend(friend.id);
                      }}
                      sx={{
                        color: alpha(theme.palette.common.white, 0.7),
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                        position: "absolute",
                        right: 8,
                        top: 8,
                      }}
                    />

                    <Avatar
                      src={friend.avatarUrl}
                      alt={friend.name}
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        border: (theme) =>
                          `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                      }}
                    >
                      {friend.name[0].toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "white",
                          fontWeight: "medium",
                        }}
                      >
                        {friend.name}
                      </Typography>

                      {friend.handicap !== undefined && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: (theme) =>
                              alpha(theme.palette.common.white, 0.7),
                          }}
                        >
                          Handicap: {friend.handicap}
                        </Typography>
                      )}
                    </Box>

                    {selectedFriends.includes(friend.id) && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          right: 8,
                          bottom: 8,
                          color: theme.palette.primary.main,
                        }}
                      />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions sx={styles.dialogs.actions}>
        <Button onClick={onClose} sx={styles.button.cancel}>
          Cancel
        </Button>
        <Button
          onClick={handleAddFriends}
          variant="contained"
          color="primary"
          disabled={selectedFriends.length === 0 || isSubmitting}
          fullWidth={isMobile}
          startIcon={
            isSubmitting ? <CircularProgress size={20} /> : <PersonAddIcon />
          }
          sx={styles.button.primary}
        >
          {isSubmitting
            ? "Adding..."
            : `Add to ${
                createNewGroup
                  ? newGroupName
                  : playerGroups.find((g) => g.id === selectedGroupId)?.name ||
                    "Group"
              }`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FriendsSelectionDialog;
