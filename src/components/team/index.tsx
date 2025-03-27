import React, { ReactNode } from "react";
import { Box, Typography, Chip, Paper, alpha, useTheme } from "@mui/material";

export const TeamChip: React.FC<{
  teamName: string;
  teamColor?: string;
  size?: "small" | "medium";
  sx?: object;
}> = ({ teamName, teamColor, size = "small", sx = {} }) => {
  const theme = useTheme();
  const color = teamColor || theme.palette.primary.main;

  return (
    <Chip
      label={teamName}
      size={size}
      sx={{
        backgroundColor: alpha(color, 0.2),
        color: color,
        fontWeight: "medium",
        borderRadius: 1,
        ...sx,
      }}
    />
  );
};

export const CaptainBadge: React.FC<{
  teamColor?: string;
  size?: "small" | "medium";
  sx?: object;
}> = ({ teamColor, size = "small", sx = {} }) => {
  const theme = useTheme();
  const color = teamColor || theme.palette.primary.main;

  return (
    <Chip
      label="Captain"
      size={size}
      sx={{
        backgroundColor: alpha(color, 0.2),
        color: color,
        fontWeight: "medium",
        borderRadius: 1,
        height: size === "small" ? 20 : 24,
        fontSize: size === "small" ? "0.6rem" : "0.75rem",
        ...sx,
      }}
    />
  );
};

export const TeamCard: React.FC<{
  team: {
    id: string;
    name: string;
    color?: string;
  };
  children: ReactNode;
  headerAction?: ReactNode;
  headerIcon?: ReactNode;
  sx?: object;
}> = ({ team, children, headerAction, headerIcon, sx = {} }) => {
  const theme = useTheme();
  const teamColor = team.color || theme.palette.primary.main;

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: alpha(theme.palette.common.black, 0.4),
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${alpha(teamColor, 0.2)}`,
        height: "100%",
        ...sx,
      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: alpha(teamColor, 0.2),
          borderBottom: `1px solid ${alpha(teamColor, 0.3)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: theme.palette.common.white, fontWeight: "bold" }}
          >
            {team.name}
          </Typography>
          {headerIcon}
        </Box>
        {headerAction && <Box sx={{ mt: 1 }}>{headerAction}</Box>}
      </Box>

      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>{children}</Box>
    </Paper>
  );
};

export const TeamLeaderboard: React.FC<{
  teams: {
    id: string;
    name: string;
    color: string;
    points: number;
    position: number;
  }[];
  sx?: object;
}> = ({ teams, sx = {} }) => {
  const theme = useTheme();

  return (
    <Box sx={{ ...sx }}>
      {teams.map((team) => (
        <Box
          key={team.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,
            borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            "&:last-child": { borderBottom: "none" },
            bgcolor:
              team.position === 1 ? alpha(team.color, 0.1) : "transparent",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                fontWeight: "bold",
                color:
                  team.position <= 3
                    ? [
                        theme.palette.warning.main,
                        theme.palette.grey[400],
                        theme.palette.brown[300],
                      ][team.position - 1]
                    : theme.palette.common.white,
                minWidth: 24,
                mr: 1,
              }}
            >
              {team.position}
            </Typography>
            <TeamChip teamName={team.name} teamColor={team.color} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.common.white,
              fontWeight: "bold",
            }}
          >
            {team.points}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
