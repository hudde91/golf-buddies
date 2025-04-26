import { Round, Player } from "../../types/event";

/**
 * Calculates total score for a player in a round
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
 * @param coursePar The overall course par
 * @param courseHoles Number of holes in the course
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
 * Calculate total score for a specific section of holes in a round
 */
export const calculateSectionTotal = (
  playerId: string,
  round: Round,
  holeNumbers: number[]
): number => {
  if (!round.scores[playerId]) return 0;

  return holeNumbers.reduce((total, holeNum) => {
    const holeIndex = holeNum - 1;
    const score = round.scores[playerId]?.[holeIndex]?.score;
    return total + (score !== undefined ? score : 0);
  }, 0);
};

/**
 * Calculate total score for all holes in a round
 */
export const calculateTotal = (playerId: string, round: Round): number => {
  if (!round.scores[playerId]) return 0;

  return round.scores[playerId].reduce(
    (total, holeScore) => total + (holeScore?.score || 0),
    0
  );
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
 * Get the CSS class for a score based on relation to par
 */
export const getScoreClass = (
  score?: number,
  par?: number
): string | undefined => {
  if (score === undefined || par === undefined) return undefined;

  const diff = score - par;

  if (diff <= -2) return "eagle"; // Double under par or better
  if (diff === -1) return "birdie"; // One under par
  if (diff === 1) return "bogey"; // One over par
  if (diff >= 2) return "double-bogey"; // Two or more over par

  return undefined; // Par (no special class)
};
