import React from "react";
import { Grid, Box, Typography, alpha, Theme } from "@mui/material";
import NineHolesTable from "./NineHolesTable";
import { calculateTotalPar } from "./utils";
import { HoleInfo } from "../../types/course";

interface HoleDetailsInfoProps {
  holes: HoleInfo[];
  onHolesChange: (updatedHoles: HoleInfo[]) => void;
  indexErrors: string[];
  styles: any;
  theme: Theme;
}

const HoleDetailsInfo: React.FC<HoleDetailsInfoProps> = ({
  holes,
  onHolesChange,
  indexErrors,
  styles,
  theme,
}) => {
  const frontNine = holes.slice(0, 9);
  const backNine = holes.slice(9, 18);
  const { front, back, total } = calculateTotalPar(holes);

  const handleHoleChange = (
    holeIndex: number,
    field: keyof HoleInfo,
    value: number
  ) => {
    const updatedHoles = [...holes];

    if (field === "rangeYards") {
      updatedHoles[holeIndex] = {
        ...updatedHoles[holeIndex],
        rangeYards: value,
        // Auto-convert to meters (1yd ≈ 0.9144 meters)
        rangeMeters: Math.round(value * 0.9144),
      };
    } else if (field === "rangeMeters") {
      updatedHoles[holeIndex] = {
        ...updatedHoles[holeIndex],
        rangeMeters: value,
        // Auto-convert to yards (1m ≈ 1.09361 yards)
        rangeYards: Math.round(value * 1.09361),
      };
    } else {
      updatedHoles[holeIndex] = {
        ...updatedHoles[holeIndex],
        [field]: value,
      };
    }

    onHolesChange(updatedHoles);
  };

  // Create modified handlers for front and back nine
  const handleFrontNineHoleChange = (
    localIndex: number,
    field: keyof HoleInfo,
    value: number
  ) => {
    handleHoleChange(localIndex, field, value);
  };

  const handleBackNineHoleChange = (
    localIndex: number,
    field: keyof HoleInfo,
    value: number
  ) => {
    handleHoleChange(localIndex + 9, field, value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={styles.course.form.sectionTitle}>
          Individual Hole Information
        </Typography>
        <Typography variant="body2" sx={styles.text.body.muted}>
          Set the par and handicap index for each hole. The index should be a
          value from 1-18, with 1 being the most difficult hole and 18 being the
          easiest. Each hole must have a unique index. You can enter distances
          in either yards or meters - both will be stored.
        </Typography>

        {indexErrors.length > 0 && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle2" color="error">
              Index Error{indexErrors.length > 1 ? "s" : ""}:
            </Typography>
            <ul style={{ margin: "8px 0", paddingLeft: "24px" }}>
              {indexErrors.map((error, i) => (
                <li key={i}>
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </li>
              ))}
            </ul>
            <Typography variant="body2" color="error">
              Each hole must have a unique index between 1-18.
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="subtitle2"
          sx={{ ...styles.course.form.sectionTitle, fontSize: "1rem" }}
        >
          Front Nine
        </Typography>

        <NineHolesTable
          holes={frontNine}
          sectionTitle="OUT"
          totalPar={front}
          onHoleChange={handleFrontNineHoleChange}
          theme={theme}
        />

        <Typography
          variant="subtitle2"
          sx={{ ...styles.course.form.sectionTitle, fontSize: "1rem" }}
        >
          Back Nine
        </Typography>

        <NineHolesTable
          holes={backNine}
          sectionTitle="IN"
          totalPar={back}
          onHoleChange={handleBackNineHoleChange}
          theme={theme}
        />
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            ...styles.course.rating.container,
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Box>
            <Typography variant="body2" sx={styles.course.rating.label}>
              Front Nine:
            </Typography>
            <Typography variant="body1" sx={styles.course.rating.value}>
              Par {front}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={styles.course.rating.label}>
              Back Nine:
            </Typography>
            <Typography variant="body1" sx={styles.course.rating.value}>
              Par {back}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={styles.course.rating.label}>
              Total:
            </Typography>
            <Typography variant="body1" sx={styles.course.rating.value}>
              Par {total}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={styles.course.rating.label}>
              Course Structure
            </Typography>
            <Typography variant="body2" sx={styles.text.body.muted}>
              Front 9: Par {front} | Back 9: Par {back}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HoleDetailsInfo;
