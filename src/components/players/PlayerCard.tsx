import React from "react";
import { Box, Typography, Paper, Avatar, Chip } from "@mui/material";
import { GolfCourse as GolfIcon } from "@mui/icons-material";
import { useStyles } from "../../styles";
import { Player, Event } from "../../types/event";

interface PlayerCardProps {
  player: Player;
  event: Event;
  onClick: (player: Player) => void;
  renderPlayerExtra?: (player: Player) => React.ReactNode;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  event,
  onClick,
  renderPlayerExtra,
}) => {
  const styles = useStyles();

  const playerTeam = (event.teams || []).find((t) => t.id === player.teamId);

  return (
    <Paper
      variant="outlined"
      onClick={() => onClick(player)}
      sx={styles.tournamentPlayers.playerCard}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={player.avatarUrl}
          alt={player.name}
          sx={styles.tournamentPlayers.getPlayerAvatar(playerTeam?.color)}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            sx={styles.tournamentPlayers.playerTypography.playerName}
          >
            {player.name}
            {renderPlayerExtra && renderPlayerExtra(player)}
          </Typography>

          {player.question1 && (
            <Typography
              variant="body2"
              sx={styles.tournamentPlayers.playerTypography.playerDetail}
            >
              <GolfIcon fontSize="small" />
              Handicap: {player.question1}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {player.id === event.createdBy && (
            <Chip
              label="Creator"
              size="small"
              color="primary"
              sx={{ height: 24 }}
            />
          )}

          {player.teamId && playerTeam && (
            <Chip
              size="small"
              label={playerTeam.name}
              sx={{
                ...styles.tournamentPlayers.chips.getTeamChip(playerTeam.color),
                height: 24,
              }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default PlayerCard;
