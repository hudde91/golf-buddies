import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from "@mui/material";
import {
  Leaderboard as LeaderboardIcon,
  Event as RoundsIcon,
  Group as PlayersIcon,
  People as TeamsIcon,
  EmojiEvents as HighlightsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../../styles";

interface MobileBottomNavigationProps {
  tournamentId: string;
  activeTab: number;
  teamCount: number;
  roundCount: number;
  isTeamEvent: boolean;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  tournamentId,
  activeTab,
  teamCount,
  roundCount,
  isTeamEvent,
}) => {
  const navigate = useNavigate();
  const styles = useStyles();

  const handleNavigationChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    let tabName = "";

    switch (newValue) {
      case 0:
        tabName = "leaderboard";
        break;
      case 1:
        tabName = "rounds";
        break;
      case 2:
        tabName = "players";
        break;
      case 3:
        tabName = isTeamEvent ? "teams" : "highlights";
        break;
      case 4:
        tabName = "highlights";
        break;
      default:
        tabName = "leaderboard";
    }

    navigate(`/tournaments/${tournamentId}?tab=${tabName}`);
  };

  return (
    <Paper sx={styles.bottomNavigation.container}>
      <BottomNavigation
        value={activeTab}
        onChange={handleNavigationChange}
        showLabels
      >
        <BottomNavigationAction
          label="Leaderboard"
          icon={<LeaderboardIcon sx={styles.bottomNavigation.action} />}
        />
        <BottomNavigationAction
          label="Rounds"
          icon={
            <Badge badgeContent={roundCount} color="primary" max={99}>
              <RoundsIcon />
            </Badge>
          }
          sx={styles.bottomNavigation.action}
        />
        <BottomNavigationAction label="Players" icon={<PlayersIcon />} />
        {isTeamEvent && (
          <BottomNavigationAction
            label="Teams"
            icon={
              <Badge badgeContent={teamCount} color="primary" max={99}>
                <TeamsIcon />
              </Badge>
            }
            sx={styles.bottomNavigation.action}
          />
        )}
        <BottomNavigationAction
          label="Highlights"
          icon={<HighlightsIcon />}
          sx={styles.bottomNavigation.action}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNavigation;
