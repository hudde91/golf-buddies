import React from "react";
import { Box, Typography, Paper, Avatar, Chip, alpha } from "@mui/material";
import { GolfCourse as GolfIcon } from "@mui/icons-material";
import { useStyles } from "../styles";
import { Player, Tournament, Tour } from "../types/event";

interface SharedPlayerCardProps {
  player: Player;
  event: Tournament | Tour;
  onClick?: (player: Player) => void;
  renderPlayerExtra?: (player: Player) => React.ReactNode;
}

const SharedPlayerCard: React.FC<SharedPlayerCardProps> = ({
  player,
  event,
  onClick,
  renderPlayerExtra,
}) => {
  const styles = useStyles();

  // Determine if we're dealing with a tournament or tour
  const isTournament = "rounds" in event;

  // Get player's team if applicable
  const playerTeam =
    player.teamId && event.teams
      ? event.teams.find((t) => t.id === player.teamId)
      : null;

  const isCaptain = event.teams?.some((team) => team.captain === player.id);
  const isCreator = player.id === event.createdBy;

  const handleCardClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <Paper
      variant="outlined"
      onClick={handleCardClick}
      sx={{
        p: 2,
        cursor: onClick ? "pointer" : "default",
        bgcolor: "transparent",
        borderColor: (theme) => alpha(theme.palette.common.white, 0.1),
        transition: "all 0.2s",
        "&:hover": onClick
          ? {
              bgcolor: (theme) => alpha(theme.palette.common.white, 0.05),
              transform: "translateY(-2px)",
              boxShadow: (theme) =>
                `0 4px 8px ${alpha(theme.palette.common.black, 0.2)}`,
            }
          : {},
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={player.avatarUrl}
          alt={player.name}
          sx={{
            width: 48,
            height: 48,
            mr: 2,
            border: (theme) =>
              playerTeam
                ? `2px solid ${playerTeam.color}`
                : `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          }}
        >
          {player.name[0].toUpperCase()}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              fontWeight: "medium",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            {player.name}
            {renderPlayerExtra && renderPlayerExtra(player)}
          </Typography>

          {player.handicap !== undefined && (
            <Typography
              variant="body2"
              sx={{
                color: (theme) => alpha(theme.palette.common.white, 0.7),
                display: "flex",
                alignItems: "center",
              }}
            >
              <GolfIcon fontSize="small" sx={{ mr: 0.5, fontSize: "0.9rem" }} />
              Handicap: {player.handicap}
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
          {/* Show badges/chips for relevant player info */}
          {isCreator && (
            <Chip
              label="Creator"
              size="small"
              color="primary"
              sx={{ height: 24 }}
            />
          )}

          {isCaptain && playerTeam && (
            <Chip
              label="Captain"
              size="small"
              sx={{
                bgcolor: (theme) => alpha(playerTeam.color, 0.1),
                color: playerTeam.color,
                borderColor: (theme) => alpha(playerTeam.color, 0.3),
                height: 24,
                border: "1px solid",
              }}
            />
          )}

          {player.teamId && playerTeam && (
            <Chip
              size="small"
              label={playerTeam.name}
              sx={{
                bgcolor: (theme) => alpha(playerTeam.color, 0.1),
                color: playerTeam.color,
                border: `1px solid ${alpha(playerTeam.color, 0.3)}`,
                height: 24,
              }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default SharedPlayerCard;
