import React, { ReactNode } from "react";
import { Box, Typography, Avatar, Chip, alpha, useTheme } from "@mui/material";

export const PlayerAvatar: React.FC<{
  name: string;
  avatarUrl?: string;
  size?: "small" | "medium" | "large";
  sx?: object;
}> = ({ name, avatarUrl, size = "medium", sx = {} }) => {
  const sizeMap = {
    small: 28,
    medium: 40,
    large: 56,
  };

  const avatarSize = sizeMap[size];

  return (
    <Avatar
      src={avatarUrl}
      alt={name}
      sx={{
        width: avatarSize,
        height: avatarSize,
        ...sx,
      }}
    >
      {name?.charAt(0)}
    </Avatar>
  );
};

export const PlayerRow: React.FC<{
  player: {
    id: string;
    name: string;
    avatarUrl?: string;
    teamId?: string;
  };
  team?: {
    id: string;
    name: string;
    color: string;
  } | null;
  extraInfo?: ReactNode;
  actions?: ReactNode;
  isCaptain?: boolean;
  rank?: number;
  sx?: object;
}> = ({ player, team, extraInfo, actions, isCaptain, rank, sx = {} }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1.5,
        "&:hover": {
          bgcolor: alpha(theme.palette.common.white, 0.05),
        },
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        {rank !== undefined && (
          <Box sx={{ mr: 2, minWidth: 24, textAlign: "center" }}>
            <Typography
              sx={{
                fontWeight: "bold",
                color:
                  rank < 3
                    ? [
                        theme.palette.warning.main,
                        theme.palette.grey[400],
                        theme.palette.brown[300],
                      ][rank]
                    : theme.palette.common.white,
              }}
            >
              {rank + 1}
            </Typography>
          </Box>
        )}

        <PlayerAvatar
          name={player.name}
          avatarUrl={player.avatarUrl}
          size="medium"
          sx={{ mr: 2 }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: theme.palette.common.white,
            }}
          >
            {player.name}
          </Typography>

          {team && (
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={team.name}
                size="small"
                sx={{
                  backgroundColor: alpha(team.color, 0.2),
                  color: team.color,
                  fontWeight: "medium",
                  borderRadius: 1,
                }}
              />
              {isCaptain && (
                <Chip
                  label="Captain"
                  size="small"
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: "0.6rem",
                    bgcolor: alpha(team.color, 0.2),
                    color: team.color,
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {extraInfo && <Box sx={{ ml: 1 }}>{extraInfo}</Box>}
      </Box>

      {actions && <Box sx={{ ml: 1 }}>{actions}</Box>}
    </Box>
  );
};

export const PlayerStats: React.FC<{
  stats: {
    label: string;
    value: string | number;
  }[];
  sx?: object;
}> = ({ stats, sx = {} }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        ...sx,
      }}
    >
      {stats.map((stat, index) => (
        <Box key={index} sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ color: alpha(theme.palette.common.white, 0.6) }}
          >
            {stat.label}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.common.white,
              fontWeight: "bold",
            }}
          >
            {stat.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
