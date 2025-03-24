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
} from "@mui/material";
import { Team, Player } from "../../../types/event";
import { useTournamentTeamStyles } from "../../../theme/hooks";

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
  const styles = useTournamentTeamStyles();

  if (players.length === 0 && teams.length > 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={styles.teamName}>
          Unassigned Players (0)
        </Typography>
        <Typography variant="body2" sx={styles.noPlayersText}>
          All players have been assigned to teams.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={styles.teamName}>
        Unassigned Players ({players.length})
      </Typography>

      <Grid container spacing={2}>
        {players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Paper variant="outlined" sx={styles.playerCard}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={player.avatarUrl} alt={player.name} sx={{ mr: 2 }}>
                  {player.name[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={styles.teamName}>
                    {player.name}
                  </Typography>
                </Box>

                {isCreator && teams.length > 0 && (
                  <FormControl size="small" sx={{ ml: "auto", minWidth: 120 }}>
                    <InputLabel
                      id={`assign-${player.id}-label`}
                      sx={styles.formField.label}
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
                      sx={styles.assignTeamSelect}
                      MenuProps={{
                        PaperProps: {
                          sx: styles.menuPaper,
                        },
                      }}
                    >
                      {teams.map((team) => (
                        <MenuItem
                          key={team.id}
                          value={team.id}
                          sx={styles.menuItem}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                ...styles.teamColorDot,
                                bgcolor: team.color,
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
