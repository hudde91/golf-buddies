import { Round } from "../../types/event";

/**
 * Calculates the total score for a specific section of holes for a player
 *
 * @param playerId The ID of the player
 * @param round The round data containing scores
 * @param holes Array of hole numbers to include in the calculation (e.g., [1,2,3,4,5,6,7,8,9])
 * @returns The total score for the specified section, or 0 if no scores exist
 */
export const calculateSectionTotal = (
  playerId: string,
  round: Round,
  holes: number[]
): number => {
  // If player has no scores for this round, return 0
  if (!round.scores[playerId]) {
    return 0;
  }

  // Calculate the sum of scores for the specified holes
  return holes.reduce((total, holeNum) => {
    const holeIndex = holeNum - 1; // Convert from 1-based hole numbers to 0-based array index
    const holeScore = round.scores[playerId][holeIndex];

    // Only add the score if it exists and is a valid number
    if (holeScore && typeof holeScore.score === "number") {
      return total + holeScore.score;
    }
    return total;
  }, 0);
};

/**
 * Calculates the total score for a player across all holes in a round
 *
 * @param playerId The ID of the player
 * @param round The round data containing scores
 * @returns The total score for the round, or 0 if no scores exist
 */
export const calculateTotal = (playerId: string, round: Round): number => {
  // If player has no scores for this round, return 0
  if (!round.scores[playerId]) {
    return 0;
  }

  // Calculate the sum of all scores in the round
  return round.scores[playerId].reduce((total, holeScore) => {
    if (holeScore && typeof holeScore.score === "number") {
      return total + holeScore.score;
    }
    return total;
  }, 0);
};

/**
 * Formats a score as relative to par (e.g., "E" for even par, "+2" for 2 over par, "-3" for 3 under par)
 *
 * @param score The player's score
 * @param par The par value to compare against
 * @returns A formatted string representing the score relative to par
 */
export const formatScoreToPar = (score: number, par: number): string => {
  const diff = score - par;
  if (diff === 0) return "E";
  return diff > 0 ? `+${diff}` : diff.toString();
};

/**
 * Gets the appropriate color for a score based on its relation to par
 *
 * @param score The player's score
 * @param par The par value to compare against
 * @returns A color string (CSS color)
 */
export const getScoreColor = (score: number, par: number): string => {
  if (!par) return "#000";

  const diff = score - par;
  if (diff < 0) return "#2e7d32"; // Green for under par
  if (diff > 0) return "#d32f2f"; // Red for over par
  return "#000"; // Black for even par
};

/**
 * Gets the CSS class for a score based on relation to par
 *
 * @param score The player's score (optional)
 * @param par The par value to compare against (optional)
 * @returns A CSS class name or undefined
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

/**
 * Function to determine if a hole has been scored by any player in the group
 *
 * @param holeNumber The hole number to check (1-based)
 * @param players Array of players to check for scores
 * @param scores The scores object from the round
 * @returns Boolean indicating if the hole has been scored
 */
export const isHoleScored = (
  holeNumber: number,
  players: any[],
  scores: Record<string, any[]>
): boolean => {
  const holeIndex = holeNumber - 1;

  // Check if any player has a score for this hole
  return players.some((player) => {
    const playerScores = scores[player.id];
    return (
      playerScores &&
      playerScores[holeIndex] &&
      playerScores[holeIndex].score !== undefined
    );
  });
};

/**
 * Returns an array of hole numbers for a given hole count
 *
 * @param holeCount The total number of holes (typically 9 or 18)
 * @returns An array of hole numbers (e.g., [1,2,3,...,18])
 */
export const getHolesList = (holeCount: number = 18): number[] => {
  return Array.from({ length: holeCount }, (_, i) => i + 1);
};
