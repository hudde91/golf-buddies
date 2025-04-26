import { useState, useEffect } from "react";
import { Round, Player } from "../../../types/event";
import { findFirstIncompleteHole } from "../scoringUtils";

interface UseGroupScoringProps {
  round: Round;
  groupPlayers: Player[];
}

/**
 * Hook for managing group scoring state and logic
 * Reusable across all contexts (standalone rounds, tours, and tournaments)
 */
export const useGroupScoring = ({
  round,
  groupPlayers,
}: UseGroupScoringProps) => {
  const holeCount = round.courseDetails?.holes || 18;

  // Find the first incomplete hole to start with
  const initialHole = findFirstIncompleteHole(
    groupPlayers,
    round.scores,
    holeCount
  );

  const [currentHole, setCurrentHole] = useState<number>(initialHole);
  const [dialogHole, setDialogHole] = useState<number>(initialHole);
  const [expandedPlayerIds, setExpandedPlayerIds] = useState<string[]>([]);
  const [scoreDialogOpen, setScoreDialogOpen] = useState<boolean>(false);
  const [holePickerOpen, setHolePickerOpen] = useState<boolean>(false);

  // Update initial hole when round or players change
  useEffect(() => {
    const firstIncompleteHole = findFirstIncompleteHole(
      groupPlayers,
      round.scores,
      holeCount
    );
    setCurrentHole(firstIncompleteHole);
  }, [round.id, groupPlayers, round.scores, holeCount]);

  const togglePlayerExpanded = (playerId: string) => {
    setExpandedPlayerIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const openScoreDialog = (holeNumber?: number) => {
    if (holeNumber) {
      setDialogHole(holeNumber);
      setCurrentHole(holeNumber);
    }
    setScoreDialogOpen(true);
    setHolePickerOpen(false);
  };

  const handleCloseScoreDialog = () => {
    setScoreDialogOpen(false);
  };

  return {
    currentHole,
    setCurrentHole,
    dialogHole,
    setDialogHole,
    expandedPlayerIds,
    scoreDialogOpen,
    holePickerOpen,
    togglePlayerExpanded,
    openScoreDialog,
    handleCloseScoreDialog,
    setHolePickerOpen,
  };
};
