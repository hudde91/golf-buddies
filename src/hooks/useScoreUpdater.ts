import { useState, useEffect, useRef } from "react";
import { Round, Player } from "../types/event";
import { findFirstIncompleteHole } from "../components/round/scoringUtils";

interface UseGroupScoringProps {
  round: Round;
  groupPlayers: Player[];
}

export function useGroupScoring({ round, groupPlayers }: UseGroupScoringProps) {
  // State for tracking the current hole being viewed/edited
  const [currentHole, setCurrentHole] = useState<number>(1);

  // State for dialog hole (which might be different from current hole)
  const [dialogHole, setDialogHole] = useState<number>(1);

  // Update dialogHole whenever currentHole changes to keep them in sync
  useEffect(() => {
    setDialogHole(currentHole);
  }, [currentHole]);

  // State for expanded player cards
  const [expandedPlayerIds, setExpandedPlayerIds] = useState<string[]>([]);

  // Dialog states
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [holePickerOpen, setHolePickerOpen] = useState(false);

  // Initialize with the first incomplete hole only on initial load
  // We use a ref to track if this is the initial load
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Only set the hole on initial load or when players change
    // Not when scores update (which changes round)
    if ((initialLoadRef.current || groupPlayers.length === 0) && round) {
      const firstIncompleteHole = findFirstIncompleteHole(
        groupPlayers,
        round.scores,
        round.courseDetails?.holes || 18
      );
      setCurrentHole(firstIncompleteHole);
      setDialogHole(firstIncompleteHole);

      // Mark initial load as complete
      initialLoadRef.current = false;
    }
  }, [groupPlayers, round?.id]); // Only depend on players and round ID, not the entire round object

  // Toggle player expanded state
  const togglePlayerExpanded = (playerId: string) => {
    setExpandedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Open score dialog for a specific hole or the current hole
  const openScoreDialog = (holeNumber?: number) => {
    console.log(`Opening score dialog for hole: ${holeNumber || currentHole}`);

    // If a specific hole is provided, use it and update current hole
    if (holeNumber !== undefined) {
      setCurrentHole(holeNumber);
      setDialogHole(holeNumber);
    } else {
      // Otherwise use the current hole
      setDialogHole(currentHole);
    }

    // Open the dialog
    setScoreDialogOpen(true);

    // Force any expanded player cards to use the current hole
    if (expandedPlayerIds.length > 0) {
      // Create a new array to force a re-render of any components using expandedPlayerIds
      setExpandedPlayerIds([...expandedPlayerIds]);
    }
  };

  // Close score dialog
  const handleCloseScoreDialog = () => {
    console.log(`Closing score dialog, setting currentHole to: ${dialogHole}`);
    setScoreDialogOpen(false);

    // Important: Ensure current hole and dialog hole are in sync after closing
    // This helps prevent the issue with multiple "current holes"
    setCurrentHole(dialogHole);

    // Reset any other state that might cause confusion
    setExpandedPlayerIds([]);
  };

  // Navigate to next or previous hole
  const navigateHole = (direction: "next" | "prev") => {
    const totalHoles = round.courseDetails?.holes || 18;

    let newHole: number;
    if (direction === "next") {
      newHole = Math.min(currentHole + 1, totalHoles);
    } else {
      newHole = Math.max(currentHole - 1, 1);
    }

    setCurrentHole(newHole);
    setDialogHole(newHole);
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
    setScoreDialogOpen,
    navigateHole,
  };
}
