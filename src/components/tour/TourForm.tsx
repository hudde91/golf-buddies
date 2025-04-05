import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TourFormData } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";

interface TourFormProps {
  onSubmit: (data: TourFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TourFormData>;
}

const TourForm: React.FC<TourFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const styles = useStyles();
  const today = new Date();

  const [formData, setFormData] = useState<TourFormData>({
    name: initialData?.name || "",
    startDate: initialData?.startDate || today.toISOString().split("T")[0],
    endDate:
      initialData?.endDate ||
      new Date(today.setMonth(today.getMonth() + 3))
        .toISOString()
        .split("T")[0],
    description: initialData?.description || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [name]: date.toISOString().split("T")[0],
      }));

      // Clear error when user changes date
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tour name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.endDate < formData.startDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Paper sx={styles.tour.form.container} elevation={0}>
      <Typography variant="h5" sx={styles.tour.form.title}>
        {initialData ? "Edit Tour Series" : "Create New Tour Series"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Tour Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              sx={styles.tour.form.formField}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={new Date(formData.startDate)}
                onChange={(date) => handleDateChange("startDate", date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                    sx: styles.tour.form.formField,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={new Date(formData.endDate)}
                onChange={(date) => handleDateChange("endDate", date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                    sx: styles.tour.form.formField,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description (optional)"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              sx={styles.tour.form.formField}
            />
          </Grid>
        </Grid>

        <Box sx={styles.tour.form.actionButtons}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={styles.tour.form.cancelButton}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={styles.tour.form.submitButton}
          >
            {initialData ? "Update Tour" : "Create Tour"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TourForm;
