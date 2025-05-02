import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetTournamentById,
  useUpdateRoundScores,
} from "../../../../services/eventService";
import Loading from "../../../Loading";
import NotFound from "../../../../pages/NotFound";
import GroupDetailPage from "./GroupDetailPage";
import { HoleScore } from "../../../../types/event";

const GroupDetailPageContainer: React.FC = () => {
  const { tournamentId, roundId, groupId } = useParams<{
    tournamentId: string;
    roundId: string;
    groupId: string;
  }>();
  const navigate = useNavigate();

  // Fetch tournament data using React Query
  const {
    data: tournament,
    isLoading,
    isError,
    error,
  } = useGetTournamentById(tournamentId || "");

  // Set up mutation for updating scores
  const updateScoresMutation = useUpdateRoundScores();

  // Check if round and group exist
  useEffect(() => {
    if (!isLoading && tournament && roundId) {
      const round = tournament.rounds.find((r) => r.id === roundId);
      if (!round) {
        console.error("Round not found");
        navigate(`/tournaments/${tournamentId}`);
        return;
      }

      const group = round.playerGroups?.find((g) => g.id === groupId);
      if (!group) {
        console.error("Group not found");
        navigate(`/tournaments/${tournamentId}`);
        return;
      }
    }
  }, [tournament, roundId, groupId, tournamentId, navigate, isLoading]);

  // Handle score updates
  const handleUpdateScores = async (
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ) => {
    if (!tournamentId) return;

    try {
      updateScoresMutation.mutate({
        tournamentId,
        roundId,
        playerId,
        scores,
      });
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.error("Error fetching tournament:", error);
    return <NotFound />;
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
