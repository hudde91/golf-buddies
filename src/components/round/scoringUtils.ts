import { Player } from "../../types/event";

/**
 * Calculates total score for a player
 * @param playerId The player's ID
 * @param scores The scores object from the round
 */
export const calculateTotalScore = (
  playerId: string,
  scores: Record<string, { score?: number; par?: number; hole: number }[]>
): number => {
  const playerScores = scores[playerId] || [];
  return playerScores.reduce(
    (total, hole) => total + (hole.score !== undefined ? hole.score : 0),
    0
  );
};

/**
 * Calculates score to par for a player
 * @param playerId The player's ID
 * @param scores The scores object from the round
 * @param courseDetails The course details containing par information
 */
export const calculateScoreToPar = (
  playerId: string,
  scores: Record<string, { score?: number; par?: number; hole: number }[]>,
  coursePar?: number | null,
  courseHoles?: number | null
): number | null => {
  const playerScores = scores[playerId] || [];

  if (!coursePar || playerScores.length === 0) {
    return null;
  }

  const validScores = playerScores.filter((hole) => hole.score !== undefined);

  if (validScores.length === 0) {
    return null;
  }

  const totalPar = validScores.reduce(
    (total, hole) =>
      total +
      (hole.par !== undefined
        ? hole.par
        : Math.floor(coursePar / (courseHoles || 18))),
    0
  );

  const totalScore = validScores.reduce(
    (total, hole) => total + (hole.score !== undefined ? hole.score : 0),
    0
  );

  return totalScore - totalPar;
};

/**
 * Format score to par as a string (e.g., "E", "+2", "-1")
 */
export const formatScoreToPar = (scoreToPar: number | null): string => {
  if (scoreToPar === null) return "E";
  if (scoreToPar === 0) return "E";
  return scoreToPar > 0 ? `+${scoreToPar}` : `${scoreToPar}`;
};

/**
 * Get the color for a score relative to par
 */
export const getScoreToParColor = (scoreToPar: number | null): string => {
  if (scoreToPar === null || scoreToPar === 0) return "#2e7d32"; // Green for even par
  if (scoreToPar < 0) return "#d32f2f"; // Red for under par
  return "#0288d1"; // Blue for over par
};

/**
 * Check if a hole has a score for all players in a group
 */
export const isHoleScored = (
  holeNumber: number,
  players: Player[],
  scores: Record<string, { score?: number; par?: number; hole: number }[]>
): boolean => {
  if (!players.length) return false;

  const holeIndex = holeNumber - 1;
  for (const player of players) {
    const playerScore = scores[player.id]?.[holeIndex]?.score;
    if (playerScore === undefined) {
      return false;
    }
  }
  return true;
};

/**
 * Get a list of all holes for hole picker
 */
export const getHolesList = (totalHoles: number): number[] => {
  return Array.from({ length: totalHoles }, (_, i) => i + 1);
};

/**
 * Find the first incomplete hole for initial focus
 */
export const findFirstIncompleteHole = (
  players: Player[],
  scores: Record<string, { score?: number; par?: number; hole: number }[]>,
  holeCount: number
): number => {
  if (players.length === 0) return 1;

  for (let hole = 1; hole <= holeCount; hole++) {
    const holeIndex = hole - 1;
    let allPlayersHaveScore = true;

    for (const player of players) {
      const playerScores = scores[player.id] || [];
      const holeScore = playerScores[holeIndex]?.score;

      if (holeScore === undefined) {
        allPlayersHaveScore = false;
        break;
      }
    }

    if (!allPlayersHaveScore) {
      return hole;
    }
  }

  return 1; // Default to first hole if all are complete
};

/**
 * Update score for a player and hole
 */
// export const updateScore = (
//   playerId: string,
//   holeNumber: number,
//   score: number,
//   currentScores: { score?: number; par?: number; hole: number }[],
//   holePar?: number
// ): { score?: number; par?: number; hole: number }[] => {
//   const newScores = [...currentScores];

//   // Ensure there are entries for all holes up to the target hole
//   while (newScores.length < holeNumber) {
//     newScores.push({
//       score: undefined,
//       hole: newScores.length + 1,
//       par: holePar,
//     });
//   }

//   // Update the specific hole
//   newScores[holeNumber - 1] = {
//     score,
//     par: holePar,
//     hole: holeNumber,
//   };

//   return newScores;
// };
