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
        onChange={handleNavigationChange}
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
          label="Leaderboard"
          icon={<LeaderboardIcon />}
        />
        <BottomNavigationAction
          label="Rounds"
          icon={
            <Badge badgeContent={roundCount} color="primary" max={99}>
              <RoundsIcon />
            </Badge>
          }
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
          />
        )}
        <BottomNavigationAction label="Highlights" icon={<HighlightsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNavigation;
