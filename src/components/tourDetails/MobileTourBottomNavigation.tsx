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
  roundCount: number;
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
  // Define the indices to match the desktop tab order
  const ROUNDS_TAB = 0;
  const TOURNAMENTS_TAB = 1;
  const LEADERBOARD_TAB = 2;
  const PLAYERS_TAB = 3;
  const TEAMS_TAB = 4;

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
          value={ROUNDS_TAB}
          icon={
            <Badge badgeContent={roundCount} color="primary">
              <RoundIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Tournaments"
          value={TOURNAMENTS_TAB}
          icon={
            <Badge badgeContent={tournamentCount} color="primary">
              <TournamentIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Leaderboard"
          value={LEADERBOARD_TAB}
          icon={<LeaderboardIcon />}
        />
        <BottomNavigationAction
          label="Players"
          value={PLAYERS_TAB}
          icon={
            <Badge badgeContent={playerCount} color="primary">
              <PeopleIcon />
            </Badge>
          }
        />
        {hasTeams && (
          <BottomNavigationAction
            label="Teams"
            value={TEAMS_TAB}
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
