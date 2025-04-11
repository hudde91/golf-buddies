import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Tour } from "../../types/event";
import TournamentsTab from "./TournamentsTab";
import LeaderboardTab from "./LeaderboardTab";
import PlayersTab from "./PlayersTab";
import TeamsTab from "./TeamsTab";
import { useStyles } from "../../styles/hooks/useStyles";

interface TourTabsProps {
  tour: Tour;
  tabValue: number;
  leaderboard: any[];
  isCreator: boolean;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onAddTournament: () => void;
  navigateToTournament: (tournamentId: string) => void;
}

const TourTabs: React.FC<TourTabsProps> = ({
  tour,
  tabValue,
  leaderboard,
  isCreator,
  onTabChange,
  onAddTournament,
  navigateToTournament,
}) => {
  const styles = useStyles();

  return (
    <Box sx={styles.card.glass}>
      <Box sx={styles.tabs.container}>
        <Tabs
          value={tabValue}
          onChange={onTabChange}
          aria-label="tour tabs"
          textColor="inherit"
          TabIndicatorProps={{
            style: { background: "white" },
          }}
        >
          <Tab label="Tournaments" />
          <Tab label="Leaderboard" />
          <Tab label="Players" />
          {tour.teams && tour.teams.length > 0 && <Tab label="Teams" />}
        </Tabs>
      </Box>

      {/* TODO Replace with adding Round instead of Tournament. Should display RoundsTab   */}
      <div
        role="tabpanel"
        hidden={tabValue !== 0}
        id="tournament-tabpanel-0"
        aria-labelledby="tournament-tab-0"
      >
        {tabValue === 0 && (
          <TournamentsTab
            tour={tour}
            isCreator={isCreator}
            onAddTournament={onAddTournament}
            navigateToTournament={navigateToTournament}
          />
        )}
      </div>

      {/* Tab Panel for Leaderboard */}
      <div
        role="tabpanel"
        hidden={tabValue !== 1}
        id="tournament-tabpanel-1"
        aria-labelledby="tournament-tab-1"
      >
        {tabValue === 1 && (
          <LeaderboardTab tour={tour} leaderboard={leaderboard} />
        )}
      </div>

      {/* Tab Panel for Players */}
      <div
        role="tabpanel"
        hidden={tabValue !== 2}
        id="tournament-tabpanel-2"
        aria-labelledby="tournament-tab-2"
      >
        {tabValue === 2 && <PlayersTab tour={tour} />}
      </div>

      {/* Tab Panel for Teams (if applicable) */}
      {tour.teams && tour.teams.length > 0 && (
        <div
          role="tabpanel"
          hidden={tabValue !== 3}
          id="tournament-tabpanel-3"
          aria-labelledby="tournament-tab-3"
        >
          {tabValue === 3 && <TeamsTab tour={tour} />}
        </div>
      )}
    </Box>
  );
};

export default TourTabs;
