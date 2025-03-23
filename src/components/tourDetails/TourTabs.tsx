// components/tour/TourTabs.tsx
import { Box, Tabs, Tab } from "@mui/material";
import { Tour } from "../../types/event";
import TournamentsTab from "./TournamentsTab";
import LeaderboardTab from "./LeaderboardTab";
import PlayersTab from "./PlayersTab";
import TeamsTab from "./TeamsTab";
import { TabPanel } from "../common/index";
import { useTourStyles } from "../../theme/hooks";

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
  const styles = useTourStyles();

  return (
    <Box sx={styles.tourContainer}>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        aria-label="tour tabs"
        textColor="inherit"
        TabIndicatorProps={{
          style: { background: "white" },
        }}
        sx={styles.tourTabs}
      >
        <Tab label="Tournaments" />
        <Tab label="Leaderboard" />
        <Tab label="Players" />
        {tour.teams && tour.teams.length > 0 && <Tab label="Teams" />}
      </Tabs>

      {/* Tournaments Tab */}
      <TabPanel id="tournament" value={tabValue} index={0}>
        <TournamentsTab
          tour={tour}
          isCreator={isCreator}
          onAddTournament={onAddTournament}
          navigateToTournament={navigateToTournament}
        />
      </TabPanel>

      {/* Leaderboard Tab */}
      <TabPanel id="tournament" value={tabValue} index={1}>
        <LeaderboardTab tour={tour} leaderboard={leaderboard} />
      </TabPanel>

      {/* Players Tab */}
      <TabPanel id="tournament" value={tabValue} index={2}>
        <PlayersTab tour={tour} />
      </TabPanel>

      {/* Teams Tab */}
      {tour.teams && tour.teams.length > 0 && (
        <TabPanel id="tournament" value={tabValue} index={3}>
          <TeamsTab tour={tour} />
        </TabPanel>
      )}
    </Box>
  );
};

export default TourTabs;
