import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useMediaQuery,
  Box,
  Tabs,
  Tab,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useStyles } from "../../styles/hooks/useStyles";
import { useTheme } from "@mui/material/styles";
import { TeeBox, HoleInfo, GolfCourse } from "../../types/course";
import BasicCourseInfo from "./BasicCourseInfo";
import HoleDetailsInfo from "./HoleDetailsInfo";
import TeeBoxesInfo from "./TeeBoxesInfo";
import {
  createDefaultHoles,
  createDefaultTeeBox,
  calculateDefaultPar,
} from "./utils";

interface CourseFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (course: GolfCourse) => void;
  initialData?: GolfCourse;
}

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
  const [indexErrors, setIndexErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Update par automatically when hole pars change
  useEffect(() => {
    const newPar = calculateDefaultPar(formData.holes);
    setFormData((prev) => ({
      ...prev,
      par: newPar,
    }));
  }, [formData.holes]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const validateIndexes = () => {
    const indexes = formData.holes.map((hole) => hole.index);

    const duplicates: string[] = [];
    indexes.forEach((index, i) => {
      const firstIndex = indexes.indexOf(index);
      if (firstIndex !== i) {
        duplicates.push(
          `Hole ${formData.holes[i].number} and Hole ${formData.holes[firstIndex].number} both have index ${index}`
        );
      }
    });

    setIndexErrors(duplicates);
    return duplicates.length === 0;
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

    if (formData.par <= 0) {
      newErrors.par = "Par must be greater than 0";
    }

    if (formData.teeBoxes.length === 0) {
      newErrors.teeBoxes = "At least one tee box is required";
    }

    const indexesValid = validateIndexes();
    if (!indexesValid) {
      newErrors.indexes = "All hole indexes must be unique";
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

  // Handler for updating the basic info
  const handleBasicInfoChange = (updatedInfo: Partial<GolfCourse>) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedInfo,
    }));

    // Clear errors for updated fields
    const fieldsToUpdate = Object.keys(updatedInfo);
    if (fieldsToUpdate.some((field) => errors[field])) {
      const updatedErrors = { ...errors };
      fieldsToUpdate.forEach((field) => {
        if (updatedErrors[field]) {
          delete updatedErrors[field];
        }
      });
      setErrors(updatedErrors);
    }
  };

  // Handler for updating tee boxes
  const handleTeeBoxesChange = (updatedTeeBoxes: TeeBox[]) => {
    setFormData((prev) => ({
      ...prev,
      teeBoxes: updatedTeeBoxes,
    }));
  };

  // Handler for updating hole details
  const handleHolesChange = (updatedHoles: HoleInfo[]) => {
    setFormData((prev) => ({
      ...prev,
      holes: updatedHoles,
    }));
  };

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
              <BasicCourseInfo
                formData={formData}
                onFormDataChange={handleBasicInfoChange}
                errors={errors}
                styles={styles}
                theme={theme}
              />
            )}

            {/* Tee Boxes Tab */}
            {activeTab === 1 && (
              <TeeBoxesInfo
                teeBoxes={formData.teeBoxes}
                onTeeBoxesChange={handleTeeBoxesChange}
                styles={styles}
                theme={theme}
              />
            )}

            {/* Hole Details Tab */}
            {activeTab === 2 && (
              <HoleDetailsInfo
                holes={formData.holes}
                onHolesChange={handleHolesChange}
                indexErrors={indexErrors}
                styles={styles}
                theme={theme}
              />
            )}
          </Box>
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
