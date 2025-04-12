import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
} from "@mui/material";
import { useStyles } from "../../styles/hooks/useStyles";
import { useTheme } from "@mui/material";
import { Leaderboard as LeaderboardIcon } from "@mui/icons-material";

interface TeamLeaderboardTabProps {
  teamLeaderboard: any[];
}

const TeamLeaderboardTab: React.FC<TeamLeaderboardTabProps> = ({
  teamLeaderboard,
}) => {
  const styles = useStyles();
  const theme = useTheme();

  if (teamLeaderboard.length === 0) {
    return (
      <Box sx={styles.tabs.panel}>
        <Typography variant="h6" sx={styles.headers.tour.sectionTitle}>
          Team Leaderboard
        </Typography>
        <Box sx={styles.feedback.emptyState.container}>
          <LeaderboardIcon sx={styles.feedback.emptyState.icon} />
          <Typography variant="h6" sx={styles.feedback.emptyState.title}>
            No Team Leaderboard Data
          </Typography>
          <Typography sx={styles.feedback.emptyState.description}>
            Team leaderboard data will appear when tournaments have been
            completed with team participants.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.tabs.panel}>
      <Typography variant="h6" sx={styles.headers.tour.sectionTitle}>
        Team Leaderboard
      </Typography>

      <TableContainer component={Paper} sx={styles.card.glass}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="center">Players</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamLeaderboard.map((team, index) => (
              <TableRow key={team.teamId}>
                <TableCell>
                  {index + 1}
                  {index === 0 && (
                    <Chip
                      label="Leader"
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: theme.palette.success.main,
                        color: "white",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        mr: 1,
                        bgcolor: team.teamColor,
                        color: theme.palette.getContrastText(team.teamColor),
                      }}
                    >
                      {team.teamName.charAt(0)}
                    </Avatar>
                    <Typography>{team.teamName}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{team.playerCount}</TableCell>
                <TableCell align="right">
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {team.totalPoints}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeamLeaderboardTab;
