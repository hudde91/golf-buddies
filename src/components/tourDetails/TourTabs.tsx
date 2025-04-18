import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { PlayerGroup, Team, TeamFormData, Tour } from "../../types/event";
import TournamentsTab from "./TournamentsTab";
import RoundsTab from "./RoundsTab";
import LeaderboardTab from "./LeaderboardTab";
import PlayersTab from "./PlayersTab";
import TeamsTab from "./TeamsTab";
import { useStyles } from "../../styles/hooks/useStyles";

interface TourTabsProps {
  tour: Tour;
  tabValue: number;
  leaderboard: any[];
  isCreator: boolean;
  selectedRoundId: string | null;
  teamLeaderboard: any[];
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onAddTournament: () => void;
  onAddRound: () => void;
  navigateToTournament: (tournamentId: string) => void;
  navigateToRound: (roundId: string) => void;
  onDeleteRound: (roundId: string) => void;
  onSelectRound: (roundId: string) => void;
  onUpdatePlayerGroups: (roundId: string, playerGroups: PlayerGroup[]) => void;
  onAddTeam: (teamData: TeamFormData) => void;
  onUpdateTeam: (teamId: string, teamData: Partial<Team>) => void;
  onDeleteTeam: (teamId: string) => void;
  onAssignPlayer: (playerId: string, teamId?: string) => void;
}

const TourTabs: React.FC<TourTabsProps> = ({
  tour,
  tabValue,
  leaderboard,
  isCreator,
  selectedRoundId,
  teamLeaderboard,
  onTabChange,
  onAddTournament,
  onAddRound,
  navigateToTournament,
  navigateToRound,
  onDeleteRound,
  onUpdatePlayerGroups,
  onSelectRound,
  onDeleteTeam,
  onUpdateTeam,
  onAddTeam,
  onAssignPlayer,
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
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: { background: "white" },
          }}
        >
          <Tab label="Rounds" />
          <Tab label="Tournaments" />
          <Tab label="Leaderboard" />
          <Tab label="Players" />
          {tour.isTeamEvent && <Tab label="Teams" />}
          {/* {tour.teams && tour.teams.length > 0 && (
            <Tab label="Team Leaderboard" />
          )} */}
        </Tabs>
      </Box>

      {/* Rounds Tab Panel */}
      <div
        role="tabpanel"
        hidden={tabValue !== 0}
        id="tour-tabpanel-0"
        aria-labelledby="tour-tab-0"
      >
        {tabValue === 0 && (
          <RoundsTab
            tour={tour}
            isCreator={isCreator}
            selectedRoundId={selectedRoundId}
            onAddRound={onAddRound}
            navigateToRound={navigateToRound}
            onDeleteRound={onDeleteRound}
            onSelectRound={onSelectRound}
            onUpdatePlayerGroups={onUpdatePlayerGroups}
          />
        )}
      </div>

      {/* Tournaments Tab Panel */}
      <div
        role="tabpanel"
        hidden={tabValue !== 1}
        id="tour-tabpanel-1"
        aria-labelledby="tour-tab-1"
      >
        {tabValue === 1 && (
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
        hidden={tabValue !== 2}
        id="tour-tabpanel-2"
        aria-labelledby="tour-tab-2"
      >
        {tabValue === 2 && (
          <LeaderboardTab
            tour={tour}
            leaderboard={leaderboard}
            teamLeaderboard={teamLeaderboard}
          />
        )}
      </div>

      {/* Tab Panel for Players */}
      <div
        role="tabpanel"
        hidden={tabValue !== 3}
        id="tour-tabpanel-3"
        aria-labelledby="tour-tab-3"
      >
        {tabValue === 3 && <PlayersTab tour={tour} />}
      </div>

      {/* Tab Panel for Teams (if applicable) */}
      {tour.isTeamEvent && (
        <div
          role="tabpanel"
          hidden={tabValue !== 4}
          id="tour-tabpanel-4"
          aria-labelledby="tour-tab-4"
        >
          {tabValue === 4 && (
            <TeamsTab
              tour={tour}
              isCreator={isCreator}
              onAddTeam={onAddTeam}
              onUpdateTeam={onUpdateTeam}
              onDeleteTeam={onDeleteTeam}
              onAssignPlayer={onAssignPlayer}
            />
          )}
        </div>
      )}
      {/* {tour.isTeamEvent && (
        <div
          role="tabpanel"
          hidden={tabValue !== 5} // Assuming this is the next tab index
          id="tour-tabpanel-5"
          aria-labelledby="tour-tab-5"
        >
          {tabValue === 5 && (
            <TeamLeaderboardTab tour={tour} teamLeaderboard={teamLeaderboard} />
          )}
        </div>
      )} */}
    </Box>
  );
};

export default TourTabs;
