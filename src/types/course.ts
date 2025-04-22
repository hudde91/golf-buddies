export interface HoleInfo {
  number: number;
  par: number;
  index: number;
  rangeMeters: number;
  rangeYards: number;
}

export interface TeeBox {
  id: string;
  color: string;
  menSlope: number;
  womenSlope: number;
}

export interface GolfCourse {
  id?: string;
  name: string;
  city: string;
  country: string;
  par: number;
  holes: HoleInfo[];
  teeBoxes: TeeBox[];
}

export interface TeeColorOption {
  name: string;
  color: string;
  difficulty: number;
}

export const TEE_COLORS: TeeColorOption[] = [
  { name: "Red", color: "#e74c3c", difficulty: 1 },
  { name: "Yellow", color: "#f1c40f", difficulty: 2 },
  { name: "White", color: "#ecf0f1", difficulty: 3 },
];
