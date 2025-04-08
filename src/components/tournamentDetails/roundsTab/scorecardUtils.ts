import { Round } from "../../../types/event";

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
 * Format score relative to par (e.g., -2, +1, E)
 */
export const formatScoreToPar = (score: number, par: number): string => {
  const diff = score - par;
  if (diff === 0) return "E";
  return diff > 0 ? `+${diff}` : `${diff}`;
};

/**
 * Get the appropriate color for a score relative to par
 */
export const getScoreColor = (score: number, par: number): string => {
  const diff = score - par;

  if (diff < 0) return "#4caf50"; // Green for under par (good)
  if (diff > 0) return "#f44336"; // Red for over par (not as good)
  return "#ffffff"; // White for even par
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
