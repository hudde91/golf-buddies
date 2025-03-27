import { Round } from "../../../types/event";

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
  if (diff < 0) return "#2e7d32";
  if (diff > 0) return "#d32f2f";
  return "#000";
};
