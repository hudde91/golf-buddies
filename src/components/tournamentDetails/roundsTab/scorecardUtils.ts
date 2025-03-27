import { Round, Player, HoleScore } from "../../../types/event";

export const calculateTotal = (playerId: string, round: Round): number => {
  if (!round.scores[playerId]) return 0;

  return round.scores[playerId].reduce((total, hole) => {
    return total + (hole.score || 0);
  }, 0);
};

export const calculateParTotal = (round: Round): number => {
  if (!round.courseDetails?.par) return 0;
  return round.courseDetails.par;
};

export const calculateSectionTotal = (
  playerId: string,
  round: Round,
  sectionHoles: number[]
): number => {
  const playerScores = round.scores[playerId] || [];
  return sectionHoles.reduce((total, holeNum) => {
    const holeIndex = holeNum - 1;
    return total + (playerScores[holeIndex]?.score || 0);
  }, 0);
};

// Split holes into front 9 and back 9 (or appropriate splits for other hole counts)
export const getHoleSections = (
  round: Round,
  isXsScreen: boolean,
  isMobile: boolean
) => {
  const totalHoles = round.courseDetails?.holes || 18;
  const holes = Array.from({ length: totalHoles }, (_, i) => i + 1);

  if (isXsScreen) {
    // For extra small screens, split into even smaller chunks
    if (totalHoles === 18) {
      return [
        { label: "Holes 1-6", holes: holes.slice(0, 6) },
        { label: "Holes 7-12", holes: holes.slice(6, 12) },
        { label: "Holes 13-18", holes: holes.slice(12, 18) },
      ];
    } else if (totalHoles === 9) {
      return [
        { label: "Holes 1-5", holes: holes.slice(0, 5) },
        { label: "Holes 6-9", holes: holes.slice(5, 9) },
      ];
    } else if (totalHoles > 18) {
      // Split into chunks of 6 for larger hole counts
      const sections = [];
      for (let i = 0; i < totalHoles; i += 6) {
        const end = Math.min(i + 6, totalHoles);
        sections.push({
          label: `Holes ${i + 1}-${end}`,
          holes: holes.slice(i, end),
        });
      }
      return sections;
    }
  } else if (isMobile) {
    // For regular mobile screens, use slightly larger chunks
    if (totalHoles === 18) {
      return [
        { label: "Front 9", holes: holes.slice(0, 9) },
        { label: "Back 9", holes: holes.slice(9, 18) },
      ];
    } else if (totalHoles === 9) {
      return [{ label: "Holes", holes: holes }];
    } else if (totalHoles === 27) {
      return [
        { label: "First 9", holes: holes.slice(0, 9) },
        { label: "Second 9", holes: holes.slice(9, 18) },
        { label: "Third 9", holes: holes.slice(18, 27) },
      ];
    } else if (totalHoles === 36) {
      return [
        { label: "First 9", holes: holes.slice(0, 9) },
        { label: "Second 9", holes: holes.slice(9, 18) },
        { label: "Third 9", holes: holes.slice(18, 27) },
        { label: "Fourth 9", holes: holes.slice(27, 36) },
      ];
    }
  } else {
    // Desktop view
    if (totalHoles <= 9) {
      return [{ label: "Holes", holes: holes }];
    } else if (totalHoles === 18) {
      return [
        { label: "Front 9", holes: holes.slice(0, 9) },
        { label: "Back 9", holes: holes.slice(9, 18) },
      ];
    } else if (totalHoles === 27) {
      return [
        { label: "First 9", holes: holes.slice(0, 9) },
        { label: "Second 9", holes: holes.slice(9, 18) },
        { label: "Third 9", holes: holes.slice(18, 27) },
      ];
    } else if (totalHoles === 36) {
      return [
        { label: "First 9", holes: holes.slice(0, 9) },
        { label: "Second 9", holes: holes.slice(9, 18) },
        { label: "Third 9", holes: holes.slice(18, 27) },
        { label: "Fourth 9", holes: holes.slice(27, 36) },
      ];
    }
  }

  // Default fallback - just show all holes
  return [{ label: "Holes", holes: holes }];
};

export const getScoreClass = (score?: number, par?: number): string => {
  if (score === undefined || par === undefined) return "";

  if (score < par - 1) return "eagle";
  if (score === par - 1) return "birdie";
  if (score === par) return "par";
  if (score === par + 1) return "bogey";
  return "double-bogey";
};
