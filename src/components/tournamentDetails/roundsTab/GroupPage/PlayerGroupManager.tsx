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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  Grid,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { Round, Player, PlayerGroup } from "../../../../types/event";
import { useStyles } from "../../../../styles/hooks/useStyles";

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
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

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
          Manage Player Groups
        </Box>
      </DialogTitle>

      <DialogContent sx={styles.dialogs.content}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={isMedium ? 12 : 5}
            sx={{ mb: isMedium ? 3 : 0 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                mt: 1,
              }}
            >
              <Typography variant="subtitle1" sx={styles.text.body.primary}>
                Player Groups
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                size="small"
                onClick={handleAddGroup}
                sx={styles.button.outlined}
              >
                Add Group
              </Button>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                maxHeight: isMobile ? 250 : 400,
                overflow: "auto",
                bgcolor: "transparent",
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              }}
            >
              <List>
                {groups.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography sx={styles.text.body.primary}>
                          No groups created yet
                        </Typography>
                      }
                      secondary={
                        <Typography sx={styles.text.body.muted}>
                          Click 'Add Group' to create a new group
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : (
                  groups.map((group) => (
                    <ListItem
                      key={group.id}
                      button
                      selected={editingGroupId === group.id}
                      onClick={() => handleEditGroup(group)}
                      sx={{
                        borderBottom: (theme) =>
                          `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                        "&.Mui-selected": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.2),
                        },
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.common.white, 0.05),
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontWeight:
                                editingGroupId === group.id ? "bold" : "normal",
                              color: "white",
                            }}
                          >
                            {group.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Box
                              component="span"
                              sx={{
                                display: "block",
                                color: (theme) =>
                                  alpha(theme.palette.common.white, 0.7),
                              }}
                            >
                              {group.playerIds.length} player
                              {group.playerIds.length !== 1 ? "s" : ""}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: 0.5,
                              }}
                            >
                              {group.teeTime && (
                                <Chip
                                  icon={<ScheduleIcon fontSize="small" />}
                                  label={group.teeTime}
                                  size="small"
                                  sx={{
                                    bgcolor: (theme) =>
                                      alpha(theme.palette.info.main, 0.1),
                                    color: (theme) => theme.palette.info.light,
                                    borderRadius: "4px",
                                    height: "24px",
                                  }}
                                />
                              )}
                              {group.startingHole && (
                                <Chip
                                  icon={<FlagIcon fontSize="small" />}
                                  label={`Hole ${group.startingHole}`}
                                  size="small"
                                  sx={{
                                    bgcolor: (theme) =>
                                      alpha(theme.palette.success.main, 0.1),
                                    color: (theme) =>
                                      theme.palette.success.light,
                                    borderRadius: "4px",
                                    height: "24px",
                                  }}
                                />
                              )}
                            </Box>
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
                          sx={{
                            color: (theme) =>
                              alpha(theme.palette.error.light, 0.8),
                            "&:hover": {
                              color: (theme) => theme.palette.error.light,
                              bgcolor: (theme) =>
                                alpha(theme.palette.error.main, 0.1),
                            },
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
          <Grid item xs={12} md={isMedium ? 12 : 7}>
            {editingGroupId ? (
              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={styles.text.body.primary}
                >
                  Edit Group
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: "transparent",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  }}
                >
                  <TextField
                    label="Group Name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onBlur={handleUpdateGroupName}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                      theme
                    )}
                    InputProps={styles.tournamentCard.formStyles.inputProps(
                      theme
                    )}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 2,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <FormControl
                      variant="outlined"
                      size="small"
                      fullWidth={isMobile}
                      sx={{ minWidth: 120 }}
                    >
                      <InputLabel
                        id="starting-hole-label"
                        sx={{ color: "white" }}
                      >
                        Starting Hole
                      </InputLabel>
                      <Select
                        labelId="starting-hole-label"
                        value={selectedStartingHole}
                        onChange={handleStartingHoleChange}
                        label="Starting Hole"
                        sx={styles.inputs.select}
                        MenuProps={{
                          PaperProps: {
                            sx: styles.inputs.menuPaper,
                          },
                        }}
                      >
                        <MenuItem value="" sx={styles.inputs.menuItem}>
                          <em>None</em>
                        </MenuItem>
                        {generateStartingHoles().map((hole) => (
                          <MenuItem
                            key={hole}
                            value={hole}
                            sx={styles.inputs.menuItem}
                          >
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
                      fullWidth={isMobile}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          color: alpha(theme.palette.common.white, 0.7),
                        },
                      }}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                      variant="outlined"
                      size="small"
                      InputProps={styles.tournamentCard.formStyles.inputProps(
                        theme
                      )}
                    />
                  </Box>
                </Paper>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={styles.text.body.primary}>
                    Players in Group
                  </Typography>
                  <Chip
                    label={`${getGroupPlayers(editingGroupId).length} player${
                      getGroupPlayers(editingGroupId).length !== 1 ? "s" : ""
                    }`}
                    size="small"
                    sx={{
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                      color: (theme) => theme.palette.primary.light,
                    }}
                  />
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    mb: 3,
                    maxHeight: isMobile ? 170 : 200,
                    overflow: "auto",
                    bgcolor: "transparent",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  }}
                >
                  {getGroupPlayers(editingGroupId).length === 0 ? (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" sx={styles.text.body.muted}>
                        No players in this group. Add players from the list
                        below.
                      </Typography>
                    </Box>
                  ) : (
                    <List>
                      {getGroupPlayers(editingGroupId).map((player) => (
                        <ListItem
                          key={player.id}
                          sx={{
                            borderBottom: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.common.white,
                                0.05
                              )}`,
                            "&:last-child": {
                              borderBottom: "none",
                            },
                            py: 0.5,
                          }}
                        >
                          <Avatar
                            src={player.avatarUrl}
                            alt={player.name}
                            sx={{
                              width: 36,
                              height: 36,
                              mr: 2,
                              border: (theme) =>
                                `1px solid ${alpha(
                                  theme.palette.common.white,
                                  0.2
                                )}`,
                            }}
                          />
                          <ListItemText
                            primary={
                              <Typography sx={styles.text.body.primary}>
                                {player.name}
                              </Typography>
                            }
                          />
                          <IconButton
                            edge="end"
                            aria-label="remove player"
                            onClick={() =>
                              handleRemovePlayerFromGroup(
                                editingGroupId,
                                player.id
                              )
                            }
                            sx={{
                              color: (theme) =>
                                alpha(theme.palette.error.light, 0.8),
                              "&:hover": {
                                color: (theme) => theme.palette.error.light,
                                bgcolor: (theme) =>
                                  alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <PersonRemoveIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={styles.text.body.primary}>
                    Available Players
                  </Typography>
                  <Chip
                    label={`${getAvailablePlayers().length} player${
                      getAvailablePlayers().length !== 1 ? "s" : ""
                    }`}
                    size="small"
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                      color: (theme) => theme.palette.info.light,
                    }}
                  />
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    maxHeight: isMobile ? 170 : 200,
                    overflow: "auto",
                    bgcolor: "transparent",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  }}
                >
                  <List>
                    {getAvailablePlayers().length === 0 ? (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography sx={styles.text.body.muted}>
                              All players have been assigned to groups
                            </Typography>
                          }
                        />
                      </ListItem>
                    ) : (
                      getAvailablePlayers().map((player) => (
                        <ListItem
                          key={player.id}
                          button
                          onClick={() =>
                            handleAddPlayerToGroup(editingGroupId, player.id)
                          }
                          sx={{
                            borderBottom: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.common.white,
                                0.05
                              )}`,
                            "&:last-child": {
                              borderBottom: "none",
                            },
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.1),
                            },
                            py: 0.5,
                          }}
                        >
                          <Avatar
                            src={player.avatarUrl}
                            alt={player.name}
                            sx={{
                              width: 36,
                              height: 36,
                              mr: 2,
                              border: (theme) =>
                                `1px solid ${alpha(
                                  theme.palette.common.white,
                                  0.2
                                )}`,
                            }}
                          />
                          <ListItemText
                            primary={
                              <Typography sx={styles.text.body.primary}>
                                {player.name}
                              </Typography>
                            }
                          />
                          <IconButton
                            edge="end"
                            aria-label="add player"
                            sx={{
                              color: (theme) => theme.palette.primary.light,
                              "&:hover": {
                                bgcolor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <PersonAddIcon />
                          </IconButton>
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
                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.2),
                  borderRadius: 1,
                  border: (theme) =>
                    `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
                }}
              >
                <GroupIcon
                  sx={{
                    fontSize: 60,
                    color: (theme) => alpha(theme.palette.common.white, 0.3),
                    mb: 2,
                  }}
                />
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={styles.text.body.primary}
                >
                  Select a group to edit
                </Typography>
                <Typography variant="body2" sx={styles.text.body.muted}>
                  Or create a new group to organize players
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddGroup}
                  sx={{ mt: 2, ...styles.button.outlined }}
                >
                  Add Group
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={styles.dialogs.actions}>
        <Button onClick={onClose} sx={styles.button.cancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          sx={styles.button.primary}
        >
          Save Groups
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerGroupManager;
