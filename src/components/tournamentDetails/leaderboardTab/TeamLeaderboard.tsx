import React from "react";
import { Tournament } from "../../../types/event";
import tournamentService from "../../../services/eventService";
import SharedTeamLeaderboard from "../../leaderboard/SharedTeamLeaderboard";

interface TeamLeaderboardProps {
  tournament: Tournament;
}

const TeamLeaderboard: React.FC<TeamLeaderboardProps> = ({ tournament }) => {
  // Sort rounds by date
  const sortedRounds = [...tournament.rounds].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get team leaderboard data using tournament-specific service
  const teamLeaderboard = tournamentService.getTeamLeaderboard(tournament.id);

  return (
    <SharedTeamLeaderboard
      event={tournament}
      teamLeaderboard={teamLeaderboard}
      sortedRounds={sortedRounds}
    />
  );
};

export default TeamLeaderboard;
