// src/components/round/course-components/NineHolesTable.tsx
import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  alpha,
  Theme,
} from "@mui/material";
import HoleInput from "./HoleInput";
import { HoleInfo } from "../../types/course";

interface NineHolesTableProps {
  holes: HoleInfo[];
  sectionTitle: string;
  totalPar: number;
  onHoleChange: (
    holeIndex: number,
    field: keyof HoleInfo,
    value: number
  ) => void;
  theme: Theme;
}

const NineHolesTable: React.FC<NineHolesTableProps> = ({
  holes,
  sectionTitle,
  totalPar,
  onHoleChange,
  theme,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: alpha(theme.palette.common.black, 0.3),
        mb: 4,
        overflow: "auto",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                borderBottom: `1px solid ${alpha(
                  theme.palette.common.white,
                  0.1
                )}`,
              }}
            >
              Hole
            </TableCell>
            {holes.map((hole) => (
              <TableCell
                key={hole.number}
                align="center"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  borderBottom: `1px solid ${alpha(
                    theme.palette.common.white,
                    0.1
                  )}`,
                }}
              >
                {hole.number}
              </TableCell>
            ))}
            <TableCell
              align="center"
              sx={{
                color: "white",
                fontWeight: "bold",
                borderBottom: `1px solid ${alpha(
                  theme.palette.common.white,
                  0.1
                )}`,
              }}
            >
              {sectionTitle}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Index
            </TableCell>
            {holes.map((hole, index) => (
              <TableCell key={`index-${hole.number}`} align="center">
                <HoleInput
                  hole={hole}
                  holeIndex={index}
                  holes={holes}
                  onHoleChange={onHoleChange}
                  theme={theme}
                  inputType="index"
                />
              </TableCell>
            ))}
            <TableCell align="center">
              {/* Empty cell for the OUT/IN column */}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Range
            </TableCell>
            {holes.map((hole, index) => (
              <TableCell key={`range-${hole.number}`} align="center">
                <HoleInput
                  hole={hole}
                  holeIndex={index}
                  holes={holes}
                  onHoleChange={onHoleChange}
                  theme={theme}
                  inputType="range"
                />
              </TableCell>
            ))}
            <TableCell align="center">
              {/* Empty cell for the OUT/IN column */}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Par
            </TableCell>
            {holes.map((hole, index) => (
              <TableCell key={hole.number} align="center">
                <HoleInput
                  hole={hole}
                  holeIndex={index}
                  holes={holes}
                  onHoleChange={onHoleChange}
                  theme={theme}
                  inputType="par"
                />
              </TableCell>
            ))}
            <TableCell
              align="center"
              sx={{
                color: theme.palette.primary.light,
                fontWeight: "bold",
              }}
            >
              {totalPar}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NineHolesTable;
