import React, { useState, useEffect } from "react";
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
  useMediaQuery,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import { TournamentFormData } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import { useTheme } from "@mui/material";
import { useUser } from "@clerk/clerk-react";
import friendsService from "../../services/friendsService";
import FriendInviteList from "../FriendInviteList";

interface TournamentFormProps {
  onSubmit: (data: TournamentFormData & { inviteFriends: string[] }) => void;
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
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const today = new Date().toISOString().split("T")[0];
  const { user } = useUser();

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
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [expandFriends, setExpandFriends] = useState(false);

  useEffect(() => {
    if (user) {
      const userFriends = friendsService.getAcceptedFriends(user.id);
      setFriends(userFriends);
      setLoadingFriends(false);
    }
  }, [user]);

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

  const handleFriendsChange = (emails: string[]) => {
    setSelectedFriends(emails);
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

  return (
    <>
      <DialogTitle sx={styles.dialogs.title}>
        {initialData.name ? "Edit Tournament" : "Create New Tournament"}
      </DialogTitle>
      <DialogContent sx={styles.dialogs.content}>
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
                InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                  theme
                )}
                InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
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
                  ...styles.tournamentCard.formStyles.labelProps,
                  shrink: true,
                }}
                InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
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
                  ...styles.tournamentCard.formStyles.labelProps,
                  shrink: true,
                }}
                InputProps={{
                  ...styles.tournamentCard.formStyles.inputProps,
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
                InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                  theme
                )}
                InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  ...styles.card.glass,
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={styles.text.body.primary}
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
                        sx={{ color: "white" }}
                      >
                        Scoring Type
                      </InputLabel>
                      <Select
                        labelId="scoring-type-label"
                        name="scoringType"
                        value={formData.scoringType}
                        label="Scoring Type"
                        onChange={handleChange}
                        sx={styles.inputs.select}
                        MenuProps={{
                          PaperProps: {
                            sx: styles.inputs.menuPaper,
                          },
                        }}
                      >
                        {scoringTypes.map((type) => (
                          <MenuItem
                            key={type.value}
                            value={type.value}
                            sx={styles.inputs.menuItem}
                          >
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Alert severity="info" sx={styles.feedback.alert.info}>
                      Team events allow you to group players into teams and
                      track both individual and team scores.
                    </Alert>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Accordion
                expanded={expandFriends}
                onChange={() => setExpandFriends(!expandFriends)}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.8)
                      : theme.palette.background.paper,
                  borderRadius: 1,
                  "&:before": { display: "none" },
                  boxShadow: theme.shadows[2],
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="invite-friends-content"
                  id="invite-friends-header"
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <Typography>
                      Invite Friends ({selectedFriends.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <FriendInviteList
                    friends={friends}
                    loading={loadingFriends}
                    selectedFriends={selectedFriends}
                    onSelectedFriendsChange={handleFriendsChange}
                  />
                </AccordionDetails>
              </Accordion>
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
          {initialData.name ? "Update Tournament" : "Create Tournament"}
        </Button>
      </DialogActions>
    </>
  );
};

export default TournamentForm;
