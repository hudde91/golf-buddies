import React, { useEffect, useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
  IconButton,
  useMediaQuery,
  Autocomplete,
  CircularProgress,
  alpha,
  useTheme,
  Typography,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import { RoundFormData } from "../../types/event";
import { roundFormats } from "../../services/eventService";
import { useStyles } from "../../styles/hooks/useStyles";
import FriendInviteList from "../FriendInviteList";
import { Friend } from "../../services/friendsService";
import CourseFormDialog from "../course/CourseFormDialog";
import {
  GolfCourse,
  fetchGolfCourses,
  createGolfCourse,
} from "../../services/golfCourseService";
import { formatDescriptions } from "../util";

interface RoundFormProps {
  onSubmit: (data: RoundFormData & { inviteFriends: string[] }) => void;
  onCancel: () => void;
  initialData?: Partial<RoundFormData>;
  friends: Friend[];
  loadingFriends: boolean;
}

const RoundForm: React.FC<RoundFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  friends,
  loadingFriends,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<RoundFormData>({
    name: initialData.name || "",
    date: initialData.date || today,
    courseName: initialData.courseName || "",
    description: initialData.description || "",
    holes: initialData.holes || 18,
    par: initialData.par || 72,
    format: initialData.format || roundFormats[0],
    slope: initialData.slope || 113,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Golf club autocomplete states
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<GolfCourse[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedClub, setSelectedClub] = useState<GolfCourse | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);

  // Load golf clubs when the input changes
  useEffect(() => {
    let active = true;

    setLoading(true);
    fetchGolfCourses(inputValue)
      .then((results) => {
        if (active) {
          setOptions(results);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching golf courses:", error);
        if (active) {
          setOptions([]);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [inputValue]);

  // For initial data, try to match courseName string to a club option
  useEffect(() => {
    if (initialData.courseName) {
      setInputValue(initialData.courseName);
      fetchGolfCourses("").then((courses) => {
        const matchedCourse = courses.find((course) => {
          const courseFullName = `${course.name}, ${course.city}, ${course.country}`;
          return (
            courseFullName === initialData.courseName ||
            course.name === initialData.courseName
          );
        });

        if (matchedCourse) {
          setSelectedClub(matchedCourse);

          // Set the par and slope values if available from the course and not explicitly set in initialData
          setFormData((prev) => ({
            ...prev,
            par: initialData.par || matchedCourse.par || prev.par,
            slope: initialData.slope || matchedCourse.slope || prev.slope,
          }));
        }
      });
    }
  }, [initialData.courseName, initialData.par, initialData.slope]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Round name is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.format) {
      newErrors.format = "Format is required";
    }

    if (formData.holes <= 0) {
      newErrors.holes = "Number of holes must be greater than 0";
    }

    if (!formData.courseName) {
      newErrors.courseName = "Golf course is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "holes" || name === "par" || name === "slope"
          ? Number(value)
          : value,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        inviteFriends: selectedFriends,
      });
    }
  };

  const handleFriendsChange = (emails: string[]) => {
    setSelectedFriends(emails);
  };

  const handleAddCourse = () => {
    setCourseDialogOpen(true);
  };

  const handleCourseSubmit = async (courseData: Omit<GolfCourse, "id">) => {
    try {
      // Create the course via the service
      const newCourse = await createGolfCourse(courseData);

      // Add the new course to our options and select it
      setOptions([...options, newCourse]);
      setSelectedClub(newCourse);

      // Update form data with the course details
      setFormData((prev) => ({
        ...prev,
        courseName: `${newCourse.name}, ${newCourse.city}, ${newCourse.country}`,
        par: newCourse.par || prev.par,
        slope: newCourse.slope || prev.slope,
      }));

      setCourseDialogOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
      // In a real application, you would show an error message to the user
    }
  };

  return (
    <>
      <DialogTitle sx={styles.dialogs.title}>
        {initialData.name ? "Edit Round" : "Create New Round"}
      </DialogTitle>
      <DialogContent sx={styles.dialogs.content}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Round Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name || 'e.g., "Morning Round at Augusta"'}
                required
                InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                  theme
                )}
                InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="date"
                label="Round Date"
                type="date"
                fullWidth
                value={formData.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                required
                InputLabelProps={{
                  ...styles.tournamentCard.formStyles.labelProps,
                  shrink: true,
                }}
                InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={styles.course.selection.container}>
                <Box sx={{ flex: 1 }}>
                  <Autocomplete
                    id="golf-club-autocomplete"
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={selectedClub}
                    onChange={(_event, newValue) => {
                      setSelectedClub(newValue);
                      if (newValue) {
                        const clubFullName = `${newValue.name}, ${newValue.city}, ${newValue.country}`;
                        setFormData((prev) => ({
                          ...prev,
                          courseName: clubFullName,
                          par: newValue.par || prev.par,
                          slope: newValue.slope || prev.slope,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          courseName: "",
                        }));
                      }
                    }}
                    inputValue={inputValue}
                    onInputChange={(_event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    getOptionLabel={(option) =>
                      `${option.name}, ${option.city}, ${option.country}`
                    }
                    options={options}
                    loading={loading}
                    filterOptions={(x) => x} // We're handling filtering on the server side
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="courseName"
                        label="Golf Course"
                        helperText={
                          errors.courseName ||
                          "Select the golf course for this round"
                        }
                        error={!!errors.courseName}
                        InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                          theme
                        )}
                        InputProps={{
                          ...params.InputProps,
                          ...styles.tournamentCard.formStyles.inputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        sx={styles.course.form.formField}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={styles.course.list.item}
                      >
                        <Box component="span" sx={styles.course.list.name}>
                          {option.name}
                        </Box>
                        <Box component="span" sx={styles.course.list.details}>
                          {option.city}, {option.country}{" "}
                          {option.par ? `(Par ${option.par})` : ""}
                        </Box>
                        {option.slope && (
                          <Box component="span" sx={styles.course.list.ratings}>
                            <span>
                              <strong>Slope:</strong> {option.slope}
                            </span>
                          </Box>
                        )}
                      </Box>
                    )}
                    ListboxProps={{
                      style: {
                        backgroundColor: alpha(theme.palette.common.black, 0.9),
                        backgroundImage: "none",
                        borderRadius: 4,
                        boxShadow: theme.shadows[3],
                        border: `1px solid ${alpha(
                          theme.palette.common.white,
                          0.1
                        )}`,
                      },
                    }}
                    noOptionsText={
                      <Box component="span" sx={{ color: "white" }}>
                        No golf courses found. Try a different search term or
                        add a new course.
                      </Box>
                    }
                  />
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleAddCourse}
                  title="Add New Course"
                  sx={styles.course.selection.addButton}
                >
                  <AddIcon />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={styles.divider.standard} />
              <Typography
                variant="subtitle1"
                sx={styles.course.form.sectionTitle}
              >
                Course Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="par"
                label="Course Par"
                type="number"
                fullWidth
                value={formData.par}
                onChange={handleChange}
                inputProps={{ min: 60, max: 80 }}
                helperText="Standard par for the course"
                InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                  theme
                )}
                InputProps={{
                  ...styles.tournamentCard.formStyles.inputProps,
                  inputProps: { min: 60, max: 80 },
                }}
                sx={styles.course.form.formField}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="slope"
                label="Slope Rating"
                type="number"
                fullWidth
                value={formData.slope}
                onChange={handleChange}
                helperText="Standard is 113 (55-155)"
                InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                  theme
                )}
                InputProps={{
                  ...styles.tournamentCard.formStyles.inputProps,
                  inputProps: { min: 55, max: 155 },
                }}
                sx={styles.course.form.formField}
              />
            </Grid>

            {selectedClub && (
              <Grid item xs={12}>
                <Box sx={styles.course.rating.container}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={styles.course.rating.label}>
                      Selected Course:
                    </Typography>
                    <Box component="span" sx={styles.course.chip}>
                      {selectedClub.name}
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography variant="body2" sx={styles.text.body.muted}>
                      <strong>Par:</strong> {formData.par}
                    </Typography>
                    <Typography variant="body2" sx={styles.text.body.muted}>
                      <strong>Slope:</strong> {formData.slope}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={styles.divider.standard} />
              <Typography
                variant="subtitle1"
                sx={styles.course.form.sectionTitle}
              >
                Round Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <FormControl fullWidth error={!!errors.format}>
                  <InputLabel id="format-label" sx={{ color: "white" }}>
                    Round Format
                  </InputLabel>
                  <Select
                    labelId="format-label"
                    name="format"
                    value={formData.format}
                    label="Round Format"
                    onChange={handleChange}
                    required
                    sx={styles.inputs.select}
                    MenuProps={{
                      PaperProps: {
                        sx: styles.inputs.menuPaper,
                      },
                    }}
                  >
                    {roundFormats.map((format) => (
                      <MenuItem
                        key={format}
                        value={format}
                        sx={styles.inputs.menuItem}
                      >
                        {format}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.format && (
                    <Box
                      component="span"
                      sx={{
                        color: "error.main",
                        mt: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      {errors.format}
                    </Box>
                  )}
                </FormControl>

                <Tooltip
                  title={
                    formatDescriptions[formData.format] || "Select a format"
                  }
                  arrow
                  placement="top"
                >
                  <IconButton
                    size="small"
                    sx={{
                      ml: 1,
                      mt: 1,
                      color: "info.light",
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.holes}>
                <InputLabel id="holes-label" sx={{ color: "white" }}>
                  Number of Holes
                </InputLabel>
                <Select
                  labelId="holes-label"
                  name="holes"
                  value={formData.holes.toString()}
                  label="Number of Holes"
                  onChange={handleChange}
                  sx={styles.inputs.select}
                  MenuProps={{
                    PaperProps: {
                      sx: styles.inputs.menuPaper,
                    },
                  }}
                >
                  <MenuItem value="9" sx={styles.inputs.menuItem}>
                    9 Holes
                  </MenuItem>
                  <MenuItem value="18" sx={styles.inputs.menuItem}>
                    18 Holes
                  </MenuItem>
                </Select>
                {errors.holes && (
                  <Box sx={{ color: "error.main", mt: 1, fontSize: "0.75rem" }}>
                    {errors.holes}
                  </Box>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FriendInviteList
                friends={friends}
                loading={loadingFriends}
                selectedFriends={selectedFriends}
                onSelectedFriendsChange={handleFriendsChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={isMobile ? 3 : 4}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                  theme
                )}
                InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogs.actions}>
        <Button onClick={onCancel} sx={styles.button.cancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth={isMobile}
          sx={styles.button.primary}
        >
          {initialData.name ? "Update Round" : "Create Round"}
        </Button>
      </DialogActions>

      <CourseFormDialog
        open={courseDialogOpen}
        onClose={() => setCourseDialogOpen(false)}
        onSubmit={handleCourseSubmit}
      />
    </>
  );
};

export default RoundForm;
