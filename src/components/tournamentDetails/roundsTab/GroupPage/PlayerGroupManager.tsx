import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Avatar,
  Chip,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { Round, Player, PlayerGroup } from "../../../../types/event";

interface PlayerGroupManagerProps {
  round: Round;
  players: Player[];
  open: boolean;
  onClose: () => void;
  onSave: (updatedGroups: PlayerGroup[]) => void;
}

const PlayerGroupManager: React.FC<PlayerGroupManagerProps> = ({
  round,
  players,
  open,
  onClose,
  onSave,
}) => {
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedStartingHole, setSelectedStartingHole] = useState<number | "">(
    ""
  );
  const [selectedTeeTime, setSelectedTeeTime] = useState("");

  // Initialize groups from the round data
  useEffect(() => {
    if (open) {
      setGroups(round.playerGroups || []);
    }
  }, [open, round]);

  // Get available players (not already in a group)
  const getAvailablePlayers = () => {
    const assignedPlayerIds = new Set(
      groups.flatMap((group) => group.playerIds)
    );

    return players.filter((player) => !assignedPlayerIds.has(player.id));
  };

  // Get players in a specific group
  const getGroupPlayers = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return [];

    return players.filter((player) => group.playerIds.includes(player.id));
  };

  // Create a new group
  const handleAddGroup = () => {
    const newGroup: PlayerGroup = {
      id: uuidv4(),
      name: `Group ${groups.length + 1}`,
      playerIds: [],
    };

    setGroups([...groups, newGroup]);
    setEditingGroupId(newGroup.id);
    setNewGroupName(newGroup.name);
    setSelectedStartingHole("");
    setSelectedTeeTime("");
  };

  // Delete a group
  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter((group) => group.id !== groupId));
    if (editingGroupId === groupId) {
      setEditingGroupId(null);
    }
  };

  // Start editing a group
  const handleEditGroup = (group: PlayerGroup) => {
    setEditingGroupId(group.id);
    setNewGroupName(group.name);
    setSelectedStartingHole(group.startingHole || "");
    setSelectedTeeTime(group.teeTime || "");
  };

  // Update group name
  const handleUpdateGroupName = () => {
    if (!editingGroupId || !newGroupName.trim()) return;

    setGroups(
      groups.map((group) =>
        group.id === editingGroupId ? { ...group, name: newGroupName } : group
      )
    );
  };

  // Add player to a group
  const handleAddPlayerToGroup = (groupId: string, playerId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? { ...group, playerIds: [...group.playerIds, playerId] }
          : group
      )
    );
  };

  // Remove player from a group
  const handleRemovePlayerFromGroup = (groupId: string, playerId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              playerIds: group.playerIds.filter((id) => id !== playerId),
            }
          : group
      )
    );
  };

  // Handle starting hole change
  const handleStartingHoleChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedStartingHole(event.target.value as number | "");

    if (editingGroupId) {
      setGroups(
        groups.map((group) =>
          group.id === editingGroupId
            ? {
                ...group,
                startingHole:
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
              }
            : group
        )
      );
    }
  };

  // Handle tee time change
  const handleTeeTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTeeTime(event.target.value);

    if (editingGroupId) {
      setGroups(
        groups.map((group) =>
          group.id === editingGroupId
            ? {
                ...group,
                teeTime: event.target.value || undefined,
              }
            : group
        )
      );
    }
  };

  // Handle save
  const handleSave = () => {
    onSave(groups);
    onClose();
  };

  // Generate possible starting holes based on course
  const generateStartingHoles = () => {
    const totalHoles = round.courseDetails?.holes || 18;
    return Array.from({ length: totalHoles }, (_, i) => i + 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <GroupIcon sx={{ mr: 1 }} />
          Manage Player Groups for {round.name}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Left side - Group List */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1">Player Groups</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                size="small"
                onClick={handleAddGroup}
              >
                Add Group
              </Button>
            </Box>

            <Paper variant="outlined" sx={{ maxHeight: 400, overflow: "auto" }}>
              <List>
                {groups.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary="No groups created yet"
                      secondary="Click 'Add Group' to create a new group"
                    />
                  </ListItem>
                ) : (
                  groups.map((group) => (
                    <ListItem
                      key={group.id}
                      button
                      selected={editingGroupId === group.id}
                      onClick={() => handleEditGroup(group)}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              editingGroupId === group.id ? "bold" : "normal"
                            }
                          >
                            {group.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Box component="span" sx={{ display: "block" }}>
                              {group.playerIds.length} player
                              {group.playerIds.length !== 1 ? "s" : ""}
                            </Box>
                            {group.teeTime && (
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <ScheduleIcon
                                  fontSize="small"
                                  sx={{ mr: 0.5, fontSize: "0.875rem" }}
                                />
                                {group.teeTime}
                              </Box>
                            )}
                            {group.startingHole && (
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  ml: 1,
                                }}
                              >
                                <FlagIcon
                                  fontSize="small"
                                  sx={{ mr: 0.5, fontSize: "0.875rem" }}
                                />
                                Hole {group.startingHole}
                              </Box>
                            )}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>

          {/* Right side - Edit Group */}
          <Grid item xs={12} md={7}>
            {editingGroupId ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Edit Group
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <TextField
                    label="Group Name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onBlur={handleUpdateGroupName}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                  />

                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <InputLabel id="starting-hole-label">
                        Starting Hole
                      </InputLabel>
                      <Select
                        labelId="starting-hole-label"
                        value={selectedStartingHole}
                        onChange={handleStartingHoleChange}
                        label="Starting Hole"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {generateStartingHoles().map((hole) => (
                          <MenuItem key={hole} value={hole}>
                            Hole {hole}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Tee Time"
                      type="time"
                      value={selectedTeeTime}
                      onChange={handleTeeTimeChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Paper>

                <Typography variant="subtitle2" gutterBottom>
                  Players in Group
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{ p: 2, mb: 3, maxHeight: 200, overflow: "auto" }}
                >
                  {getGroupPlayers(editingGroupId).length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No players in this group. Add players from the list below.
                    </Typography>
                  ) : (
                    getGroupPlayers(editingGroupId).map((player) => (
                      <Chip
                        key={player.id}
                        avatar={
                          <Avatar src={player.avatarUrl} alt={player.name} />
                        }
                        label={player.name}
                        onDelete={() =>
                          handleRemovePlayerFromGroup(editingGroupId, player.id)
                        }
                        sx={{ m: 0.5 }}
                      />
                    ))
                  )}
                </Paper>

                <Typography variant="subtitle2" gutterBottom>
                  Available Players
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{ maxHeight: 200, overflow: "auto" }}
                >
                  <List dense>
                    {getAvailablePlayers().length === 0 ? (
                      <ListItem>
                        <ListItemText primary="All players have been assigned to groups" />
                      </ListItem>
                    ) : (
                      getAvailablePlayers().map((player) => (
                        <ListItem
                          key={player.id}
                          button
                          onClick={() =>
                            handleAddPlayerToGroup(editingGroupId, player.id)
                          }
                        >
                          <Avatar
                            src={player.avatarUrl}
                            alt={player.name}
                            sx={{ mr: 2, width: 32, height: 32 }}
                          />
                          <ListItemText primary={player.name} />
                          <Tooltip title="Add to group">
                            <IconButton edge="end" aria-label="add">
                              <PersonAddIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItem>
                      ))
                    )}
                  </List>
                </Paper>
              </Box>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                  borderRadius: 1,
                }}
              >
                <GroupIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="subtitle1" gutterBottom>
                  Select a group to edit
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Or create a new group to organize players
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddGroup}
                  sx={{ mt: 2 }}
                >
                  Add Group
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Groups
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerGroupManager;
