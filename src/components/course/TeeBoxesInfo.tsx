// src/components/round/course-components/TeeBoxesInfo.tsx
import React from "react";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  Box,
  Typography,
  Paper,
  MenuItem,
  Chip,
  alpha,
  Theme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { createDefaultTeeBox } from "./utils";
import { TEE_COLORS, TeeBox } from "../../types/course";

interface TeeBoxesInfoProps {
  teeBoxes: TeeBox[];
  onTeeBoxesChange: (updatedTeeBoxes: TeeBox[]) => void;
  styles: any;
  theme: Theme;
}

const TeeBoxesInfo: React.FC<TeeBoxesInfoProps> = ({
  teeBoxes,
  onTeeBoxesChange,
  styles,
  theme,
}) => {
  const handleTeeBoxChange = (
    teeBoxId: string,
    field: keyof TeeBox,
    value: any
  ) => {
    const updatedTeeBoxes = teeBoxes.map((tee) => {
      if (tee.id === teeBoxId) {
        return {
          ...tee,
          [field]: typeof value === "string" ? Number(value) || 0 : value,
        };
      }
      return tee;
    });
    onTeeBoxesChange(updatedTeeBoxes);
  };

  const addTeeBox = () => {
    // Find tee colors not already used
    const usedColors = teeBoxes.map((tee) => tee.color);
    const availableColors = TEE_COLORS.filter(
      (tee) => !usedColors.includes(tee.name)
    );

    if (availableColors.length === 0) return;

    // Sort by difficulty and pick the next appropriate one
    const sortedAvailable = [...availableColors].sort(
      (a, b) => a.difficulty - b.difficulty
    );
    const nextColor = sortedAvailable[0].name;

    onTeeBoxesChange([...teeBoxes, createDefaultTeeBox(nextColor)]);
  };

  const removeTeeBox = (teeBoxId: string) => {
    if (teeBoxes.length <= 1) return; // Keep at least one tee box

    onTeeBoxesChange(teeBoxes.filter((tee) => tee.id !== teeBoxId));
  };

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={styles.course.form.sectionTitle}>
          Tee Box Information
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addTeeBox}
          disabled={teeBoxes.length >= TEE_COLORS.length}
          sx={styles.course.selection.addButton}
        >
          Add Tee Box
        </Button>
      </Grid>

      {teeBoxes.map((teeBox) => (
        <Grid item xs={12} key={teeBox.id}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: alpha(theme.palette.common.black, 0.2),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={teeBox.color}
                  sx={{
                    backgroundColor:
                      TEE_COLORS.find((t) => t.name === teeBox.color)?.color ||
                      "#ccc",
                    color: ["White", "Yellow", "Gold"].includes(teeBox.color)
                      ? "#000"
                      : "#fff",
                    fontWeight: "bold",
                  }}
                />
                <Typography variant="subtitle2" sx={styles.course.rating.label}>
                  Tee Box
                </Typography>
              </Box>
              {teeBoxes.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => removeTeeBox(teeBox.id)}
                  sx={{ color: theme.palette.error.light }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Tee Color"
                  value={teeBox.color}
                  onChange={(e) =>
                    handleTeeBoxChange(teeBox.id, "color", e.target.value)
                  }
                  fullWidth
                  InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                    theme
                  )}
                  InputProps={styles.tournamentCard.formStyles.inputProps(
                    theme
                  )}
                  sx={styles.course.form.formField}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: styles.inputs.menuPaper,
                      },
                    },
                  }}
                >
                  {TEE_COLORS.map((option) => (
                    <MenuItem
                      key={option.name}
                      value={option.name}
                      disabled={
                        option.name !== teeBox.color &&
                        teeBoxes.some((t) => t.color === option.name)
                      }
                      sx={{
                        ...styles.inputs.menuItem,
                        color: option.color,
                        fontWeight: "bold",
                      }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Men's Slope Rating"
                      value={teeBox.menSlope}
                      onChange={(e) =>
                        handleTeeBoxChange(
                          teeBox.id,
                          "menSlope",
                          e.target.value
                        )
                      }
                      fullWidth
                      InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                        theme
                      )}
                      InputProps={{
                        ...styles.tournamentCard.formStyles.inputProps(theme),
                        inputProps: { min: 55, max: 155 },
                      }}
                      sx={styles.course.form.formField}
                      helperText="Standard is 113 (55-155)"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Women's Slope Rating"
                      value={teeBox.womenSlope}
                      onChange={(e) =>
                        handleTeeBoxChange(
                          teeBox.id,
                          "womenSlope",
                          e.target.value
                        )
                      }
                      fullWidth
                      InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                        theme
                      )}
                      InputProps={{
                        ...styles.tournamentCard.formStyles.inputProps(theme),
                        inputProps: { min: 55, max: 155 },
                      }}
                      sx={styles.course.form.formField}
                      helperText="Standard is 113 (55-155)"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Box sx={styles.course.rating.container}>
          <Typography variant="body2" sx={styles.course.rating.label}>
            What is Slope Rating?
          </Typography>
          <Typography variant="body2" sx={styles.text.body.muted}>
            A measure of course difficulty for non-scratch golfers (113 is
            average). Higher slopes indicate more difficult courses for higher
            handicap players.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TeeBoxesInfo;
