import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { CircularProgress, Box, Typography } from "@mui/material";
import eventService from "../../services/eventService";
import GroupDetails from "./GroupDetails";
import { Round, PlayerGroup, Player } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";

interface GroupDetailsContainerProps {
  containerType?: "standalone" | "tournament" | "tour";
}

const GroupDetailsContainer: React.FC<GroupDetailsContainerProps> = ({
  containerType = "standalone",
}) => {
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState<Round | null>(null);
  const [group, setGroup] = useState<PlayerGroup | null>(null);
  const [groupPlayers, setGroupPlayers] = useState<Player[]>([]);

  // Extract all possible URL parameters
  const { tournamentId, tourId, roundId, groupId } = useParams<{
    tournamentId?: string;
    tourId?: string;
    roundId?: string;
    groupId?: string;
  }>();

  // Determine parent ID based on container type
  const parentId =
    containerType === "tournament"
      ? tournamentId
      : containerType === "tour"
      ? tourId
      : undefined;

  console.log("Container Type:", containerType);
  console.log("URL Params:", { tournamentId, tourId, roundId, groupId });
  console.log("Determined Parent ID:", parentId);

  const navigate = useNavigate();
  const { user } = useUser();
  const styles = useStyles();

  useEffect(() => {
    if (!roundId || !groupId || !user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data based on container type
        let roundData: Round | null = null;
        debugger;
        if (containerType === "tournament" && parentId) {
          console.log("Fetching tournament round data...");
          const tournamentData = await eventService.getTournamentById(parentId);
          if (tournamentData) {
            roundData =
              tournamentData.rounds.find((r) => r.id === roundId) || null;
          }
        } else if (containerType === "tour" && parentId) {
          console.log("Fetching tour round data...");
          const tourData = await eventService.getTourById(parentId);
          if (tourData) {
            roundData = tourData.rounds.find((r) => r.id === roundId) || null;
          }
        } else {
          // Standalone round
          console.log("Fetching standalone round data...");
          roundData = await eventService.getRoundById(roundId);
        }

        if (!roundData) {
          console.error("Round not found");
          handleBackNavigation();
          return;
        }

        console.log("Round data found:", roundData.name);
        setRound(roundData);

        // Find the specific group
        const groupData = roundData.playerGroups?.find((g) => g.id === groupId);
        if (!groupData) {
          console.error("Group not found");
          handleBackNavigation();
          return;
        }

        console.log("Group data found:", groupData.name);
        setGroup(groupData);

        // Get players in this group
        const playersInGroup = groupData.playerIds
          .map((playerId) => roundData.players?.find((p) => p.id === playerId))
          .filter(Boolean) as Player[];

        console.log("Players in group:", playersInGroup.length);
        setGroupPlayers(playersInGroup);
      } catch (error) {
        console.error("Error fetching data:", error);
        handleBackNavigation();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roundId, groupId, user, containerType, parentId]);

  const handleBackNavigation = () => {
    if (containerType === "tournament" && parentId) {
      navigate(`/tournaments/${parentId}?tab=rounds`);
    } else if (containerType === "tour" && parentId) {
      navigate(`/tours/${parentId}?tab=rounds`);
    } else {
      navigate(`/rounds/${roundId}`);
    }
  };

  const handleSaveScore = async (
    playerId: string,
    holeNumber: number,
    score: number
  ) => {
    if (!roundId || !round) {
      console.error("Cannot save score: round or roundId is missing");
      return;
    }

    // Get current scores for the player
    const currentScores = [...(round.scores[playerId] || [])];

    // Ensure we have score objects up to the current hole
    while (currentScores.length < holeNumber) {
      currentScores.push({
        score: undefined,
        hole: currentScores.length + 1,
      });
    }

    // Get the hole par
    const holePar = round.courseDetails?.holes
      ? round.courseDetails.par
        ? Math.floor(round.courseDetails.par / round.courseDetails.holes)
        : null
      : null;

    // Update the score for the specified hole
    currentScores[holeNumber - 1] = {
      score,
      par: holePar || undefined,
      hole: holeNumber,
    };

    // Create updated round object
    const updatedRound = {
      ...round,
      scores: {
        ...round.scores,
        [playerId]: currentScores,
      },
    };

    try {
      let result: Round | null = null;

      //   if (containerType === "tournament" && parentId) {
      //     result = await eventService.updatePlayerScores(
      //       parentId,
      //       roundId,
      //       playerId,
      //       currentScores
      //     );
      //   } else if (containerType === "tour" && parentId) {
      //     // Assuming the same API works for tours
      //     result = await eventService.updatePlayerScores(
      //       parentId,
      //       roundId,
      //       playerId,
      //       currentScores
      //     );
      //   } else {
      // Standalone round
      result = await eventService.updateRoundEvent(roundId, updatedRound);
      //   }

      if (result) {
        setRound(result);
      } else {
        console.error("Failed to update scores: no updated round returned");
      }
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={styles.feedback.loading.container}>
        <CircularProgress sx={styles.feedback.loading.icon} />
        <Typography sx={styles.feedback.loading.text}>
          Loading group details...
        </Typography>
      </Box>
    );
  }

  if (!round || !group || groupPlayers.length === 0) {
    return (
      <Box sx={styles.feedback.alert.error}>
        <Typography variant="h6" sx={styles.feedback.alert.error}>
          Could not load group details
        </Typography>
      </Box>
    );
  }

  return (
    <GroupDetails
      round={round}
      group={group}
      groupPlayers={groupPlayers}
      onBack={handleBackNavigation}
      onSaveScore={handleSaveScore}
      containerType={containerType}
    />
  );
};

export default GroupDetailsContainer;
