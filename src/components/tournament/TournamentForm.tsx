import React, { useState } from "react";
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
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { TournamentFormData } from "../../types/event";
import { useTournamentStyles } from "../../theme/hooks";
import { useTheme } from "@mui/material";

interface TournamentFormProps {
  onSubmit: (data: TournamentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TournamentFormData>;
}

const scoringTypes = [
  { value: "individual", label: "Individual" },
  { value: "team", label: "Team Only" },
  { value: "both", label: "Both Individual & Team" },
];

const TournamentForm: React.FC<TournamentFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
}) => {
  const styles = useTournamentStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<TournamentFormData>({
    name: initialData.name || "",
    startDate: initialData.startDate || today,
    endDate: initialData.endDate || today,
    location: initialData.location || "",
    description: initialData.description || "",
    isTeamEvent:
      initialData.isTeamEvent !== undefined ? initialData.isTeamEvent : false,
    scoringType: initialData.scoringType || "individual",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tournament name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.endDate < formData.startDate) {
      newErrors.endDate = "End date cannot be before start date";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
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
      [name]: value,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      // If team event is turned off, reset to individual scoring
      ...(name === "isTeamEvent" && !checked
        ? { scoringType: "individual" }
        : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <DialogTitle sx={styles.dialogStyles.title}>
        {initialData.name ? "Edit Tournament" : "Create New Tournament"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Tournament Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                InputLabelProps={styles.formStyles.labelProps}
                InputProps={styles.formStyles.inputProps}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
                InputLabelProps={{
                  ...styles.formStyles.labelProps,
                  shrink: true,
                }}
                InputProps={styles.formStyles.inputProps}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="endDate"
                label="End Date"
                type="date"
                fullWidth
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={
                  errors.endDate ||
                  "Can be the same as start date for one-day events"
                }
                required
                InputLabelProps={{
                  ...styles.formStyles.labelProps,
                  shrink: true,
                }}
                InputProps={{
                  ...styles.formStyles.inputProps,
                  inputProps: { min: formData.startDate },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                required
                InputLabelProps={styles.formStyles.labelProps}
                InputProps={styles.formStyles.inputProps}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  backgroundColor: alpha(theme.palette.common.black, 0.3),
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: "white" }}
                >
                  Team Settings
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isTeamEvent}
                      onChange={handleSwitchChange}
                      name="isTeamEvent"
                      color="primary"
                    />
                  }
                  label="Team Event (like Ryder Cup)"
                  sx={{ color: "white", mb: 1 }}
                />

                {formData.isTeamEvent && (
                  <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="scoring-type-label"
                        sx={{ color: alpha(theme.palette.common.white, 0.7) }}
                      >
                        Scoring Type
                      </InputLabel>
                      <Select
                        labelId="scoring-type-label"
                        name="scoringType"
                        value={formData.scoringType}
                        label="Scoring Type"
                        onChange={handleChange}
                        sx={{
                          color: "white",
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.common.white, 0.3),
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.common.white, 0.5),
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                          ".MuiSvgIcon-root": {
                            color: alpha(theme.palette.common.white, 0.7),
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: alpha(theme.palette.common.black, 0.9),
                              backgroundImage: "none",
                              borderRadius: 1,
                              boxShadow: 3,
                              border: `1px solid ${alpha(
                                theme.palette.common.white,
                                0.1
                              )}`,
                            },
                          },
                        }}
                      >
                        {scoringTypes.map((type) => (
                          <MenuItem
                            key={type.value}
                            value={type.value}
                            sx={{
                              color: "white",
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.1
                                ),
                              },
                              "&.Mui-selected": {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.2
                                ),
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.3
                                  ),
                                },
                              },
                            }}
                          >
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Alert
                      severity="info"
                      sx={{
                        mt: 2,
                        backgroundColor: alpha(theme.palette.info.dark, 0.2),
                        color: alpha(theme.palette.common.white, 0.9),
                        border: `1px solid ${alpha(
                          theme.palette.info.dark,
                          0.3
                        )}`,
                        "& .MuiAlert-icon": {
                          color: theme.palette.info.light,
                        },
                      }}
                    >
                      Team events allow you to group players into teams and
                      track both individual and team scores.
                    </Alert>
                  </Box>
                )}
              </Box>
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
                InputLabelProps={styles.formStyles.labelProps}
                InputProps={styles.formStyles.inputProps}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogStyles.actions}>
        <Button
          onClick={onCancel}
          sx={{
            color: alpha(theme.palette.common.white, 0.9),
            order: { xs: 2, sm: 1 },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth={isMobile}
          sx={{
            order: { xs: 1, sm: 2 },
          }}
        >
          {initialData.name ? "Update Tournament" : "Create Tournament"}
        </Button>
      </DialogActions>
    </>
  );
};

export default TournamentForm;
