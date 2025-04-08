import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from "@mui/material";
import {
  EmojiEvents as TournamentsIcon,
  Leaderboard as LeaderboardIcon,
  Group as PlayersIcon,
  People as TeamsIcon,
} from "@mui/icons-material";
import { useStyles } from "../../styles";

interface MobileTourBottomNavigationProps {
  activeTab: number;
  hasTeams: boolean;
  tournamentCount: number;
  playerCount: number;
  teamCount: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const MobileTourBottomNavigation: React.FC<MobileTourBottomNavigationProps> = ({
  activeTab,
  hasTeams,
  tournamentCount,
  playerCount,
  teamCount,
  onTabChange,
}) => {
  const styles = useStyles();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={activeTab}
        onChange={onTabChange}
        showLabels
        sx={{
          backgroundColor: "transparent",
          "& .MuiBottomNavigationAction-root": {
            color: "rgba(255, 255, 255, 0.5)",
            minWidth: 0,
            maxWidth: "none",
            "&.Mui-selected": {
              color: "white",
            },
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.625rem",
            "&.Mui-selected": {
              fontSize: "0.675rem",
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Tournaments"
          icon={
            <Badge badgeContent={tournamentCount} color="primary" max={99}>
              <TournamentsIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Leaderboard"
          icon={<LeaderboardIcon />}
        />
        <BottomNavigationAction
          label="Players"
          icon={
            <Badge badgeContent={playerCount} color="primary" max={99}>
              <PlayersIcon />
            </Badge>
          }
        />
        {hasTeams && (
          <BottomNavigationAction
            label="Teams"
            icon={
              <Badge badgeContent={teamCount} color="primary" max={99}>
                <TeamsIcon />
              </Badge>
            }
          />
        )}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileTourBottomNavigation;
