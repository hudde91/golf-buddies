import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import eventService from "../../../../services/eventService";
import Loading from "../../../Loading";
import NotFound from "../../../../pages/NotFound";
import GroupDetailPage from "./GroupDetailPage";

const GroupDetailPageContainer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState<any>(null);
  const { tournamentId, roundId, groupId } = useParams<{
    tournamentId: string;
    roundId: string;
    groupId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!tournamentId || !user) return;

    const fetchTournament = async () => {
      setLoading(true);
      try {
        // Fetch tournament data from your service
        const tournamentData = await eventService.getTournamentById(
          tournamentId
        );

        if (tournamentData) {
          setTournament(tournamentData);

          const round = tournamentData.rounds.find(
            (r: any) => r.id === roundId
          );
          if (!round) {
            console.error("Round not found");
            navigate(`/tournaments/${tournamentId}`);
            return;
          }

          const group = round.playerGroups?.find((g: any) => g.id === groupId);
          if (!group) {
            console.error("Group not found");
            navigate(`/tournaments/${tournamentId}`);
            return;
          }
        } else {
          // Tournament not found
          navigate("/events");
        }
      } catch (error) {
        console.error("Error fetching tournament data:", error);
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId, roundId, groupId, user, navigate]);

  // Handle score updates
  const handleUpdateScores = async (
    roundId: string,
    playerId: string,
    scores: any[]
  ) => {
    if (!tournamentId) return;

    try {
      await eventService.updatePlayerScores(
        tournamentId,
        roundId,
        playerId,
        scores
      );

      // Refresh tournament data to get updated scores
      const refreshedTournament = await eventService.getTournamentById(
        tournamentId
      );
      if (refreshedTournament) {
        setTournament(refreshedTournament);
      }
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!tournament) {
    return <NotFound />;
  }

  return (
    <GroupDetailPage
      tournament={tournament}
      onUpdateScores={handleUpdateScores}
    />
  );
};

export default GroupDetailPageContainer;
