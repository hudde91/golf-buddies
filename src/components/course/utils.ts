import { HoleInfo, TeeBox } from "../../types/course";

// Create default holes for a new course
export const createDefaultHoles = (): HoleInfo[] => {
  return Array.from({ length: 18 }, (_, i) => ({
    number: i + 1,
    par: 4,
    index: i + 1,
    rangeMeters: 0,
    rangeYards: 0,
  }));
};

// Generate a random ID for new elements
export const generateId = (): string =>
  `id-${Math.random().toString(36).substring(2, 11)}`;

// Helper to create a default tee box
export const createDefaultTeeBox = (color: string): TeeBox => ({
  id: generateId(),
  color,
  menSlope: 113,
  womenSlope: 113,
});

// Calculate total par for a set of holes
export const calculateDefaultPar = (holes: HoleInfo[]): number => {
  return holes.reduce((total, hole) => total + hole.par, 0);
};

// Calculate front nine, back nine, and total par
export const calculateTotalPar = (
  holes: HoleInfo[]
): {
  front: number;
  back: number;
  total: number;
} => {
  const front = holes.slice(0, 9).reduce((sum, hole) => sum + hole.par, 0);
  const back = holes.slice(9, 18).reduce((sum, hole) => sum + hole.par, 0);
  return { front, back, total: front + back };
};
