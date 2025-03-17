import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
} from "@mui/material";
import { Team, Player } from "../../../types/tournament";

interface UnassignedPlayersListProps {
  players: Player[];
  teams: Team[];
  isCreator: boolean;
  onAssignPlayer: (playerId: string, teamId?: string) => void;
}

const UnassignedPlayersList: React.FC<UnassignedPlayersListProps> = ({
  players,
  teams,
  isCreator,
  onAssignPlayer,
}) => {
  const theme = useTheme();

  if (players.length === 0 && teams.length > 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
          Unassigned Players (0)
        </Typography>
        <Typography
          variant="body2"
          color={alpha(theme.palette.common.white, 0.7)}
        >
          All players have been assigned to teams.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        Unassigned Players ({players.length})
      </Typography>

      <Grid container spacing={2}>
        {players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: alpha(theme.palette.common.black, 0.3),
                backdropFilter: "blur(8px)",
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={player.avatarUrl} alt={player.name} sx={{ mr: 2 }}>
                  {player.name[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: "white" }}>
                    {player.name}
                  </Typography>
                </Box>

                {isCreator && teams.length > 0 && (
                  <FormControl size="small" sx={{ ml: "auto", minWidth: 120 }}>
                    <InputLabel
                      id={`assign-${player.id}-label`}
                      sx={{
                        color: alpha(theme.palette.common.white, 0.7),
                      }}
                    >
                      Assign
                    </InputLabel>
                    <Select
                      labelId={`assign-${player.id}-label`}
                      value=""
                      label="Assign"
                      onChange={(e) =>
                        onAssignPlayer(player.id, e.target.value)
                      }
                      sx={{
                        color: "white",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(theme.palette.common.white, 0.3),
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(theme.palette.common.white, 0.5),
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                        ".MuiSvgIcon-root": {
                          color: alpha(theme.palette.common.white, 0.7),
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: alpha(theme.palette.common.black, 0.9),
                            backgroundImage: "none",
                            borderRadius: 1,
                            boxShadow: 3,
                            border: `1px solid ${alpha(
                              theme.palette.common.white,
                              0.1
                            )}`,
                          },
                        },
                      }}
                    >
                      {teams.map((team) => (
                        <MenuItem
                          key={team.id}
                          value={team.id}
                          sx={{
                            color: "white",
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                            },
                            "&.Mui-selected": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.2
                              ),
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.3
                                ),
                              },
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: team.color,
                                mr: 1,
                              }}
                            />
                            {team.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UnassignedPlayersList;
