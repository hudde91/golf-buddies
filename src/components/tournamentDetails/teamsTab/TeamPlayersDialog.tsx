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
  useTheme,
  alpha,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { Team, Player } from "../../../types/tournament";

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
  const theme = useTheme();

  if (!team) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.8),
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "white",
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: team.color, mr: 2 }}>
            {team.name[0].toUpperCase()}
          </Avatar>
          Manage Players for {team.name}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "white" }}>
                Current Team Members ({teamPlayers.length})
              </Typography>

              <Tooltip title="Select a captain by clicking the star icon next to a player">
                <Chip
                  icon={<StarIcon sx={{ fontSize: "0.9rem" }} />}
                  label="Select Captain"
                  size="small"
                  variant="outlined"
                  sx={{
                    color: alpha(theme.palette.common.white, 0.9),
                    borderColor: alpha(theme.palette.common.white, 0.3),
                  }}
                />
              </Tooltip>
            </Box>

            {teamPlayers.length > 0 ? (
              <List
                component={Paper}
                variant="outlined"
                sx={{
                  maxHeight: { xs: 200, md: 300 },
                  overflow: "auto",
                  backgroundColor: alpha(theme.palette.common.black, 0.3),
                  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  borderRadius: 1,
                }}
              >
                {teamPlayers.map((player) => (
                  <ListItem
                    key={player.id}
                    sx={{
                      borderBottom: `1px solid ${alpha(
                        theme.palette.common.white,
                        0.05
                      )}`,
                      "&:last-child": {
                        borderBottom: "none",
                      },
                      backgroundColor:
                        selectedCaptain === player.id
                          ? alpha(team.color, 0.2)
                          : "transparent",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={player.avatarUrl} alt={player.name}>
                        {player.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white" }}>
                          {player.name}
                          {selectedCaptain === player.id && (
                            <Typography
                              component="span"
                              sx={{
                                ml: 1,
                                fontSize: "0.75rem",
                                color: team.color,
                              }}
                            >
                              (Captain)
                            </Typography>
                          )}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: alpha(theme.palette.common.white, 0.6),
                          }}
                        >
                          {player.email}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        edge="end"
                        onClick={() => onSetCaptain(player.id)}
                        sx={{
                          color:
                            selectedCaptain === player.id
                              ? team.color
                              : alpha(theme.palette.common.white, 0.4),
                          mr: 1,
                          "&:hover": {
                            color: team.color,
                            bgcolor: alpha(team.color, 0.1),
                          },
                        }}
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
                        sx={{
                          color: theme.palette.error.light,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
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
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: alpha(theme.palette.common.black, 0.2),
                  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  borderRadius: 1,
                }}
              >
                <Typography color={alpha(theme.palette.common.white, 0.7)}>
                  No players in this team
                </Typography>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "white" }}
            >
              Available Players ({unassignedPlayers.length})
            </Typography>

            {unassignedPlayers.length > 0 ? (
              <List
                component={Paper}
                variant="outlined"
                sx={{
                  maxHeight: { xs: 200, md: 300 },
                  overflow: "auto",
                  backgroundColor: alpha(theme.palette.common.black, 0.3),
                  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  borderRadius: 1,
                }}
              >
                {unassignedPlayers.map((player) => (
                  <ListItem
                    key={player.id}
                    button
                    onClick={() => onAssignPlayer(player.id, team.id)}
                    sx={{
                      borderBottom: `1px solid ${alpha(
                        theme.palette.common.white,
                        0.05
                      )}`,
                      "&:last-child": {
                        borderBottom: "none",
                      },
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={player.avatarUrl} alt={player.name}>
                        {player.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white" }}>
                          {player.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: alpha(theme.palette.common.white, 0.6),
                          }}
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
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: alpha(theme.palette.common.black, 0.2),
                  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  borderRadius: 1,
                }}
              >
                <Typography color={alpha(theme.palette.common.white, 0.7)}>
                  No unassigned players available
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          p: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "white",
            borderColor: alpha(theme.palette.common.white, 0.3),
            "&:hover": {
              borderColor: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamPlayersDialog;
