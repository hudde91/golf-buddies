import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { Team, Player } from "../../../types/event";
import { useStyles } from "../../../styles/hooks/useStyles";

interface TeamPlayersDialogProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
  teamPlayers: Player[];
  unassignedPlayers: Player[];
  selectedCaptain: string | null;
  onSetCaptain: (playerId: string) => void;
  onAssignPlayer: (playerId: string, teamId?: string) => void;
}

const TeamPlayersDialog: React.FC<TeamPlayersDialogProps> = ({
  open,
  onClose,
  team,
  teamPlayers,
  unassignedPlayers,
  selectedCaptain,
  onSetCaptain,
  onAssignPlayer,
}) => {
  const styles = useStyles();

  if (!team) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: styles.dialogs.paper,
      }}
    >
      <DialogTitle sx={styles.tournamentTeams.dialogTitle}>
        <Box sx={styles.tournamentTeams.teamHeader}>
          <Avatar sx={styles.tournamentTeams.getTeamAvatar(team.color)}>
            {team.name[0].toUpperCase()}
          </Avatar>
          Manage Players for {team.name}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <Box sx={styles.tournamentTeams.teamInfoHeader}>
              <Typography
                variant="subtitle1"
                sx={styles.tournamentTeams.teamName}
              >
                Current Team Members ({teamPlayers.length})
              </Typography>

              <Tooltip title="Select a captain by clicking the star icon next to a player">
                <Chip
                  icon={<StarIcon sx={{ fontSize: "0.9rem" }} />}
                  label="Select Captain"
                  size="small"
                  variant="outlined"
                  sx={styles.tournamentTeams.getCaptainChip(team.color)}
                />
              </Tooltip>
            </Box>

            {teamPlayers.length > 0 ? (
              <List
                component={Paper}
                variant="outlined"
                sx={styles.tournamentTeams.playersListDialog}
              >
                {teamPlayers.map((player) => (
                  <ListItem
                    key={player.id}
                    sx={styles.tournamentTeams.getPlayerListItem(
                      selectedCaptain === player.id,
                      team.color
                    )}
                  >
                    <ListItemAvatar>
                      <Avatar src={player.avatarUrl} alt={player.name}>
                        {player.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={styles.tournamentTeams.teamName}>
                          {player.name}
                          {selectedCaptain === player.id && (
                            <Typography
                              component="span"
                              sx={styles.tournamentTeams.getCaptainLabel(
                                team.color
                              )}
                            >
                              (Captain)
                            </Typography>
                          )}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={styles.tournamentTeams.noPlayersText}
                        >
                          {player.email}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        edge="end"
                        onClick={() => onSetCaptain(player.id)}
                        sx={styles.tournamentTeams.getCaptainIcon(
                          selectedCaptain === player.id,
                          team.color
                        )}
                      >
                        {selectedCaptain === player.id ? (
                          <StarIcon />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>

                      <IconButton
                        edge="end"
                        onClick={() => onAssignPlayer(player.id, undefined)}
                        sx={styles.tournamentTeams.removePlayerIcon}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper
                variant="outlined"
                sx={styles.tournamentTeams.emptyListPaper}
              >
                <Typography sx={styles.tournamentTeams.noPlayersText}>
                  No players in this team
                </Typography>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={styles.tournamentTeams.teamName}
            >
              Available Players ({unassignedPlayers.length})
            </Typography>

            {unassignedPlayers.length > 0 ? (
              <List
                component={Paper}
                variant="outlined"
                sx={styles.tournamentTeams.playersList}
              >
                {unassignedPlayers.map((player) => (
                  <ListItem
                    key={player.id}
                    button
                    onClick={() => onAssignPlayer(player.id, team.id)}
                    sx={styles.tournamentTeams.getPlayerListItem(
                      false,
                      team.color
                    )}
                  >
                    <ListItemAvatar>
                      <Avatar src={player.avatarUrl} alt={player.name}>
                        {player.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={styles.tournamentTeams.teamName}>
                          {player.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={styles.tournamentTeams.noPlayersText}
                        >
                          {player.email}
                        </Typography>
                      }
                    />
                    <Chip
                      label="Add to team"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={styles.tournamentTeams.addPlayerChip}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper
                variant="outlined"
                sx={styles.tournamentTeams.emptyListPaper}
              >
                <Typography sx={styles.tournamentTeams.noPlayersText}>
                  No unassigned players available
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={styles.tournamentTeams.dialogActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={styles.tournamentTeams.managePlayersButton}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamPlayersDialog;
