import React from "react";
import { TextField, Box, alpha, Theme } from "@mui/material";
import { HoleInfo } from "../../types/course";

interface HoleInputProps {
  hole: HoleInfo;
  holeIndex: number;
  holes: HoleInfo[];
  onHoleChange: (
    holeIndex: number,
    field: keyof HoleInfo,
    value: number
  ) => void;
  theme: Theme;
  inputType: "par" | "index" | "range";
}

const HoleInput: React.FC<HoleInputProps> = ({
  hole,
  holeIndex,
  holes,
  onHoleChange,
  theme,
  inputType,
}) => {
  const handleParChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onHoleChange(holeIndex, "par", parseInt(e.target.value) || 4);
  };

  const handleIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onHoleChange(holeIndex, "index", parseInt(e.target.value) || 1);
  };

  const handleRangeMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    onHoleChange(holeIndex, "rangeMeters", newValue);
  };

  const handleRangeYardsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    onHoleChange(holeIndex, "rangeYards", newValue);
  };

  // Check if this hole's index is a duplicate
  const isDuplicate = holes.some(
    (h, i) => h.index === hole.index && i !== holeIndex
  );

  // Render par input
  if (inputType === "par") {
    return (
      <TextField
        value={hole.par}
        onChange={handleParChange}
        inputProps={{
          min: 3,
          max: 5,
          style: {
            textAlign: "center",
            color: "white",
            padding: "4px",
            width: "40px",
            background: alpha(theme.palette.common.black, 0.1),
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            borderRadius: "4px",
          },
        }}
        variant="standard"
        sx={{
          "& .MuiInput-underline:before": { borderBottom: "none" },
          "& .MuiInput-underline:after": { borderBottom: "none" },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
          },
        }}
      />
    );
  }

  if (inputType === "index") {
    return (
      <TextField
        value={hole.index}
        onChange={handleIndexChange}
        inputProps={{
          min: 1,
          max: 18,
          style: {
            textAlign: "center",
            color: isDuplicate ? theme.palette.error.main : "white",
            padding: "4px",
            width: "40px",
            background: alpha(theme.palette.common.black, 0.1),
            border: `1px solid ${
              isDuplicate
                ? theme.palette.error.main
                : alpha(theme.palette.common.white, 0.2)
            }`,
            borderRadius: "4px",
          },
        }}
        variant="standard"
        sx={{
          "& .MuiInput-underline:before": { borderBottom: "none" },
          "& .MuiInput-underline:after": { borderBottom: "none" },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
          },
        }}
      />
    );
  }

  // Render range inputs
  if (inputType === "range") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          value={hole.rangeYards || ""}
          onChange={handleRangeYardsChange}
          placeholder="Yards"
          inputProps={{
            min: 0,
            style: {
              textAlign: "center",
              color: "white",
              padding: "4px",
              width: "55px",
              background: alpha(theme.palette.common.black, 0.1),
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: "4px",
            },
          }}
          variant="standard"
          sx={{
            "& .MuiInput-underline:before": { borderBottom: "none" },
            "& .MuiInput-underline:after": { borderBottom: "none" },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottom: "none",
            },
          }}
        />
        <TextField
          value={hole.rangeMeters || ""}
          onChange={handleRangeMetersChange}
          placeholder="Meters"
          inputProps={{
            min: 0,
            style: {
              textAlign: "center",
              color: "white",
              padding: "4px",
              width: "55px",
              background: alpha(theme.palette.common.black, 0.1),
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: "4px",
            },
          }}
          variant="standard"
          sx={{
            "& .MuiInput-underline:before": { borderBottom: "none" },
            "& .MuiInput-underline:after": { borderBottom: "none" },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottom: "none",
            },
          }}
        />
      </Box>
    );
  }

  return null;
};

export default HoleInput;
