import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from "@mui/material";
import {
  EmojiEvents as TournamentIcon,
  Leaderboard as LeaderboardIcon,
  People as PeopleIcon,
  Groups as TeamsIcon,
  SportsGolf as RoundIcon,
} from "@mui/icons-material";

interface MobileTourBottomNavigationProps {
  activeTab: number;
  hasTeams: boolean;
  tournamentCount: number;
  roundCount: number; // Add roundCount
  playerCount: number;
  teamCount: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const MobileTourBottomNavigation: React.FC<MobileTourBottomNavigationProps> = ({
  activeTab,
  hasTeams,
  tournamentCount,
  roundCount,
  playerCount,
  teamCount,
  onTabChange,
}) => {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={activeTab}
        onChange={onTabChange}
        showLabels
        sx={{
          backgroundColor: "transparent",
          color: "white",
          "& .MuiBottomNavigationAction-root": {
            color: "rgba(255,255,255,0.5)",
            "&.Mui-selected": {
              color: "white",
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Rounds"
          icon={
            <Badge badgeContent={roundCount} color="primary">
              <RoundIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Tournaments"
          icon={
            <Badge badgeContent={tournamentCount} color="primary">
              <TournamentIcon />
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
            <Badge badgeContent={playerCount} color="primary">
              <PeopleIcon />
            </Badge>
          }
        />
        {hasTeams && (
          <BottomNavigationAction
            label="Teams"
            icon={
              <Badge badgeContent={teamCount} color="primary">
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
