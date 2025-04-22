import React from "react";
import {
  TextField,
  Grid,
  Box,
  Typography,
  SelectChangeEvent,
  Theme,
} from "@mui/material";
import { GolfCourse } from "../../types/course";

interface BasicCourseInfoProps {
  formData: GolfCourse;
  onFormDataChange: (updatedInfo: Partial<GolfCourse>) => void;
  errors: Record<string, string>;
  styles: any;
  theme: Theme;
}

const BasicCourseInfo: React.FC<BasicCourseInfoProps> = ({
  formData,
  onFormDataChange,
  errors,
  styles,
  theme,
}) => {
  const handleBasicInfoChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    onFormDataChange({
      [name]: name === "par" ? Number(value) : value,
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={styles.course.form.sectionTitle}>
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
          InputLabelProps={styles.tournamentCard.formStyles.labelProps(theme)}
          InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
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
          InputLabelProps={styles.tournamentCard.formStyles.labelProps(theme)}
          InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
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
          InputLabelProps={styles.tournamentCard.formStyles.labelProps(theme)}
          InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
          sx={styles.course.form.formField}
        />
      </Grid>

      <Grid item xs={12}>
        <Box sx={styles.course.rating.container}>
          <Box>
            <Typography variant="body2" sx={styles.course.rating.label}>
              Total Par
            </Typography>
            <Typography variant="body1" sx={styles.course.rating.value}>
              {formData.par}
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body2" sx={styles.text.body.muted}>
          Note: You can set individual hole pars and handicap indexes in the
          "Hole Details" tab. The total par will be calculated automatically.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default BasicCourseInfo;
