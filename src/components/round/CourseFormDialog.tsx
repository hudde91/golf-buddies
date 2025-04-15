import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  useMediaQuery,
  Box,
  SelectChangeEvent,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Chip,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStyles } from "../../styles/hooks/useStyles";
import { useTheme } from "@mui/material/styles";

// Define tee colors with properties
const TEE_COLORS = [
  { name: "Red", color: "#e74c3c", difficulty: 1 },
  { name: "Yellow", color: "#f1c40f", difficulty: 2 },
  { name: "White", color: "#ecf0f1", difficulty: 3 },
];

// Tee box interface
interface TeeBox {
  id: string;
  color: string;
  menSlope: number;
  womenSlope: number;
}

// Hole interface for par values
interface HoleInfo {
  number: number;
  par: number;
}

// Enhanced GolfCourse interface
interface GolfCourse {
  id?: string;
  name: string;
  city: string;
  country: string;
  par: number;
  holes: HoleInfo[];
  teeBoxes: TeeBox[];
}

interface CourseFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (course: GolfCourse) => void;
  initialData?: GolfCourse;
}

// Create an array of 18 default holes with par 4
const createDefaultHoles = (): HoleInfo[] => {
  return Array.from({ length: 18 }, (_, i) => ({
    number: i + 1,
    par: 4,
  }));
};

// Helper function to generate a unique ID
const generateId = (): string =>
  `id-${Math.random().toString(36).substring(2, 11)}`;

// Helper to create a default tee box
const createDefaultTeeBox = (color: string): TeeBox => ({
  id: generateId(),
  color,
  menSlope: 113,
  womenSlope: 113,
});

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Calculate default par from holes
  const calculateDefaultPar = (holes: HoleInfo[]): number => {
    return holes.reduce((total, hole) => total + hole.par, 0);
  };

  // Initialize form data with default values
  const [formData, setFormData] = useState<GolfCourse>(
    initialData || {
      name: "",
      city: "",
      country: "",
      par: 72,
      holes: createDefaultHoles(),
      teeBoxes: [createDefaultTeeBox("White")],
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<number>(0);

  // Update par automatically when hole pars change
  useEffect(() => {
    const newPar = calculateDefaultPar(formData.holes);
    setFormData((prev) => ({
      ...prev,
      par: newPar,
    }));
  }, [formData.holes]);

  // Handler for tab changes
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBasicInfoChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "par" ? Number(value) : value,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleHoleParChange = (index: number, newPar: number) => {
    setFormData((prev) => {
      const updatedHoles = [...prev.holes];
      updatedHoles[index] = { ...updatedHoles[index], par: newPar };
      return {
        ...prev,
        holes: updatedHoles,
      };
    });
  };

  const handleTeeBoxChange = (
    teeBoxId: string,
    field: keyof TeeBox,
    value: any
  ) => {
    setFormData((prev) => {
      const updatedTeeBoxes = prev.teeBoxes.map((tee) => {
        if (tee.id === teeBoxId) {
          return {
            ...tee,
            [field]: typeof value === "string" ? Number(value) || 0 : value,
          };
        }
        return tee;
      });
      return {
        ...prev,
        teeBoxes: updatedTeeBoxes,
      };
    });
  };

  const addTeeBox = () => {
    // Find tee colors not already used
    const usedColors = formData.teeBoxes.map((tee) => tee.color);
    const availableColors = TEE_COLORS.filter(
      (tee) => !usedColors.includes(tee.name)
    );

    if (availableColors.length === 0) return; // All colors are used

    // Sort by difficulty and pick the next appropriate one
    const sortedAvailable = [...availableColors].sort(
      (a, b) => a.difficulty - b.difficulty
    );
    const nextColor = sortedAvailable[0].name;

    setFormData((prev) => ({
      ...prev,
      teeBoxes: [...prev.teeBoxes, createDefaultTeeBox(nextColor)],
    }));
  };

  const removeTeeBox = (teeBoxId: string) => {
    if (formData.teeBoxes.length <= 1) return; // Keep at least one tee box

    setFormData((prev) => ({
      ...prev,
      teeBoxes: prev.teeBoxes.filter((tee) => tee.id !== teeBoxId),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Validate par range
    if (formData.par <= 0) {
      newErrors.par = "Par must be greater than 0";
    }

    // Validate at least one tee box
    if (formData.teeBoxes.length === 0) {
      newErrors.teeBoxes = "At least one tee box is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Generate a temporary ID if it's a new course
      const courseToSubmit = formData.id
        ? formData
        : { ...formData, id: `temp-${Date.now()}` };

      onSubmit(courseToSubmit);
    }
  };

  const calculateTotalPar = (): {
    front: number;
    back: number;
    total: number;
  } => {
    const front = formData.holes
      .slice(0, 9)
      .reduce((sum, hole) => sum + hole.par, 0);
    const back = formData.holes
      .slice(9, 18)
      .reduce((sum, hole) => sum + hole.par, 0);
    return { front, back, total: front + back };
  };

  const { front, back, total } = calculateTotalPar();

  // Group holes into front nine and back nine for UI
  const frontNine = formData.holes.slice(0, 9);
  const backNine = formData.holes.slice(9, 18);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={isMobile}
        PaperProps={{ sx: styles.dialogs.paper }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={styles.dialogs.title}>
          {initialData ? "Edit Golf Course" : "Add New Golf Course"}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={styles.dialogs.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={styles.dialogs.content}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                mb: 3,
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <Tab
                label="Course Info"
                sx={{
                  color: alpha(theme.palette.common.white, 0.7),
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <Tab
                label="Tee Boxes"
                sx={{
                  color: alpha(theme.palette.common.white, 0.7),
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <Tab
                label="Hole Details"
                sx={{
                  color: alpha(theme.palette.common.white, 0.7),
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Tabs>

            {/* Basic Course Info Tab */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={styles.course.form.sectionTitle}
                  >
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Course Name"
                    fullWidth
                    value={formData.name}
                    onChange={handleBasicInfoChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                    InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                      theme
                    )}
                    InputProps={styles.tournamentCard.formStyles.inputProps(
                      theme
                    )}
                    sx={styles.course.form.formField}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="city"
                    label="City"
                    fullWidth
                    value={formData.city}
                    onChange={handleBasicInfoChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    required
                    InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                      theme
                    )}
                    InputProps={styles.tournamentCard.formStyles.inputProps(
                      theme
                    )}
                    sx={styles.course.form.formField}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="country"
                    label="Country"
                    fullWidth
                    value={formData.country}
                    onChange={handleBasicInfoChange}
                    error={!!errors.country}
                    helperText={errors.country}
                    required
                    InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                      theme
                    )}
                    InputProps={styles.tournamentCard.formStyles.inputProps(
                      theme
                    )}
                    sx={styles.course.form.formField}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={styles.course.rating.container}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={styles.course.rating.label}
                      >
                        Total Par
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Tee Boxes Tab */}
          {activeTab === 1 && (
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
                <Typography
                  variant="subtitle1"
                  sx={styles.course.form.sectionTitle}
                >
                  Tee Box Information
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addTeeBox}
                  disabled={formData.teeBoxes.length >= TEE_COLORS.length}
                  sx={styles.course.selection.addButton}
                >
                  Add Tee Box
                </Button>
              </Grid>

              {formData.teeBoxes.map((teeBox) => (
                <Grid item xs={12} key={teeBox.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: alpha(theme.palette.common.black, 0.2),
                      borderRadius: 1,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          label={teeBox.color}
                          sx={{
                            backgroundColor:
                              TEE_COLORS.find((t) => t.name === teeBox.color)
                                ?.color || "#ccc",
                            color: ["White", "Yellow", "Gold"].includes(
                              teeBox.color
                            )
                              ? "#000"
                              : "#fff",
                            fontWeight: "bold",
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={styles.course.rating.label}
                        >
                          Tee Box
                        </Typography>
                      </Box>
                      {formData.teeBoxes.length > 1 && (
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
                            handleTeeBoxChange(
                              teeBox.id,
                              "color",
                              e.target.value
                            )
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
                                formData.teeBoxes.some(
                                  (t) => t.color === option.name
                                )
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
                        <Typography
                          variant="subtitle2"
                          sx={{
                            ...styles.course.form.sectionTitle,
                            fontSize: "0.9rem",
                          }}
                        >
                          Men's Ratings
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Men's Slope Rating"
                          type="number"
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
                            ...styles.tournamentCard.formStyles.inputProps(
                              theme
                            ),
                            inputProps: { min: 55, max: 155 },
                          }}
                          sx={styles.course.form.formField}
                          helperText="Standard is 113 (55-155)"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            ...styles.course.form.sectionTitle,
                            fontSize: "0.9rem",
                          }}
                        >
                          Women's Ratings
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Women's Slope Rating"
                          type="number"
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
                            ...styles.tournamentCard.formStyles.inputProps(
                              theme
                            ),
                            inputProps: { min: 55, max: 155 },
                          }}
                          sx={styles.course.form.formField}
                          helperText="Standard is 113 (55-155)"
                        />
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
                    A measure of course difficulty for non-scratch golfers (113
                    is average). Higher slopes indicate more difficult courses
                    for higher handicap players.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Hole Details Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={styles.course.form.sectionTitle}
                >
                  Individual Hole Information
                </Typography>
                <Typography variant="body2" sx={styles.text.body.muted}>
                  Set the par for each hole. Standard courses have approximately
                  four par-3s, four par-5s, and the rest par-4s.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ ...styles.course.form.sectionTitle, fontSize: "1rem" }}
                >
                  Front Nine
                </Typography>
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
                        {frontNine.map((hole) => (
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
                          OUT
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Par
                        </TableCell>
                        {frontNine.map((hole, index) => (
                          <TableCell key={hole.number} align="center">
                            <TextField
                              type="number"
                              value={hole.par}
                              onChange={(e) =>
                                handleHoleParChange(
                                  index,
                                  parseInt(e.target.value)
                                )
                              }
                              inputProps={{
                                min: 3,
                                max: 5,
                                style: {
                                  textAlign: "center",
                                  color: "white",
                                  padding: "4px",
                                  width: "40px",
                                  background: alpha(
                                    theme.palette.common.black,
                                    0.1
                                  ),
                                  border: `1px solid ${alpha(
                                    theme.palette.common.white,
                                    0.2
                                  )}`,
                                  borderRadius: "4px",
                                },
                              }}
                              variant="standard"
                              sx={{
                                "& .MuiInput-underline:before": {
                                  borderBottom: "none",
                                },
                                "& .MuiInput-underline:after": {
                                  borderBottom: "none",
                                },
                                "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                                  { borderBottom: "none" },
                              }}
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
                          {front}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography
                  variant="subtitle2"
                  sx={{ ...styles.course.form.sectionTitle, fontSize: "1rem" }}
                >
                  Back Nine
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    backgroundColor: alpha(theme.palette.common.black, 0.3),
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
                        {backNine.map((hole) => (
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
                          IN
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Par
                        </TableCell>
                        {backNine.map((hole, index) => (
                          <TableCell key={hole.number} align="center">
                            <TextField
                              type="number"
                              value={hole.par}
                              onChange={(e) =>
                                handleHoleParChange(
                                  index + 9,
                                  parseInt(e.target.value)
                                )
                              }
                              inputProps={{
                                min: 3,
                                max: 5,
                                style: {
                                  textAlign: "center",
                                  color: "white",
                                  padding: "4px",
                                  width: "40px",
                                  background: alpha(
                                    theme.palette.common.black,
                                    0.1
                                  ),
                                  border: `1px solid ${alpha(
                                    theme.palette.common.white,
                                    0.2
                                  )}`,
                                  borderRadius: "4px",
                                },
                              }}
                              variant="standard"
                              sx={{
                                "& .MuiInput-underline:before": {
                                  borderBottom: "none",
                                },
                                "& .MuiInput-underline:after": {
                                  borderBottom: "none",
                                },
                                "& .MuiInput-underline:hover:not(.Mui-disabled):before":
                                  { borderBottom: "none" },
                              }}
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
                          {back}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
                    <Typography variant="body2" sx={styles.course.rating.value}>
                      {formData.par}
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
              <Grid item xs={12}>
                <Typography variant="body2" sx={styles.text.body.muted}>
                  Note: You can set individual hole pars in the "Hole Details"
                  tab. The total par will be calculated automatically.
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={styles.dialogs.actions}>
          <Button onClick={onClose} sx={styles.button.cancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            sx={styles.button.primary}
          >
            {initialData ? "Update Course" : "Add Course"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CourseFormDialog;
