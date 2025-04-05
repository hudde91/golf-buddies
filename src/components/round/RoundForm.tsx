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
  Tooltip,
  IconButton,
  useMediaQuery,
  Autocomplete,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { RoundFormData } from "../../types/event";
import { roundFormats } from "../../services/eventService";
import { useStyles } from "../../styles/hooks/useStyles";
import FriendInviteList from "../FriendInviteList";
import { Friend } from "../../services/friendsService";

interface RoundFormProps {
  onSubmit: (data: RoundFormData & { inviteFriends: string[] }) => void;
  onCancel: () => void;
  initialData?: Partial<RoundFormData>;
  friends: Friend[];
  loadingFriends: boolean;
}

// Format descriptions for tooltips
const formatDescriptions: Record<string, string> = {
  "Stroke Play":
    "Traditional golf scoring. Players count every stroke and the lowest total score wins.",
  "Match Play":
    "Players compete hole by hole. The player with the lower score on a hole wins that hole.",
  "Four-ball":
    "Team format where two players play as partners, each playing their own ball. The better score of the two partners counts as the team score for each hole.",
  Foursomes:
    "Team format where two players play as partners and alternate hitting the same ball. Also called 'alternate shot'.",
  "Singles Match Play": "One-on-one match play between individual players.",
  "Better Ball":
    "Similar to Four-ball. Each player plays their own ball, and the best score on each hole counts for the team.",
  Scramble:
    "Team format where each player tees off, the best shot is selected, and all players play their next shot from that location.",
  "Modified Stableford":
    "Scoring system that awards points based on performance relative to par on each hole.",
  "Skins Game":
    "Players compete for each hole. If a player wins a hole outright, they win the 'skin' for that hole.",
};

interface GolfClub {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  par?: number;
}

// Mock function to fetch golf clubs - replace with actual API call
const fetchGolfClubs = async (query: string): Promise<GolfClub[]> => {
  // Simulated delay to showcase loading state
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data for demonstration
  const mockClubs: GolfClub[] = [
    {
      id: "1",
      name: "Augusta National Golf Club",
      address: "2604 Washington Rd",
      city: "Augusta",
      country: "USA",
      par: 72,
    },
    {
      id: "2",
      name: "St Andrews Links (Old Course)",
      address: "W Sands Rd",
      city: "St Andrews",
      country: "Scotland",
      par: 72,
    },
    {
      id: "3",
      name: "Pebble Beach Golf Links",
      address: "17 Mile Dr",
      city: "Pebble Beach",
      country: "USA",
      par: 72,
    },
    {
      id: "4",
      name: "Royal Melbourne Golf Club",
      address: "Cheltenham Rd",
      city: "Black Rock",
      country: "Australia",
      par: 72,
    },
    {
      id: "5",
      name: "Muirfield",
      address: "Duncur Rd",
      city: "Gullane",
      country: "Scotland",
      par: 71,
    },
  ];

  if (!query) return mockClubs;

  // Filter based on query
  return mockClubs.filter(
    (club) =>
      club.name.toLowerCase().includes(query.toLowerCase()) ||
      club.city.toLowerCase().includes(query.toLowerCase()) ||
      club.country.toLowerCase().includes(query.toLowerCase())
  );
};

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
    location: initialData.location || "",
    description: initialData.description || "",
    holes: initialData.holes || 18,
    par: initialData.par || 72,
    format: initialData.format || roundFormats[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Golf club autocomplete states
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<GolfClub[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedClub, setSelectedClub] = useState<GolfClub | null>(null);

  // Load golf clubs when the input changes
  React.useEffect(() => {
    let active = true;

    setLoading(true);
    fetchGolfClubs(inputValue)
      .then((results) => {
        if (active) {
          setOptions(results);
          setLoading(false);
        }
      })
      .catch(() => {
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
  React.useEffect(() => {
    if (initialData.courseName) {
      setInputValue(initialData.courseName);
      fetchGolfClubs("").then((clubs) => {
        const matchedClub = clubs.find((club) => {
          const clubFullName = `${club.name}, ${club.city}, ${club.country}`;
          return (
            clubFullName === initialData.courseName ||
            club.name === initialData.courseName
          );
        });

        if (matchedClub) {
          setSelectedClub(matchedClub);

          // Set the par value if available from the club and not explicitly set in initialData
          if (matchedClub.par && !initialData.par) {
            setFormData((prev) => ({
              ...prev,
              par: matchedClub.par || prev.par,
            }));
          }
        }
      });
    }
  }, [initialData.courseName, initialData.par]);

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

    if (!formData.location) {
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
      [name]: name === "holes" || name === "par" ? Number(value) : value,
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
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location || "City, Country or Address"}
                required
                InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                  theme
                )}
                InputProps={styles.tournamentCard.formStyles.inputProps(theme)}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                id="golf-club-autocomplete"
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={selectedClub}
                onChange={(event, newValue) => {
                  setSelectedClub(newValue);
                  if (newValue) {
                    const clubFullName = `${newValue.name}, ${newValue.city}, ${newValue.country}`;
                    setFormData((prev) => ({
                      ...prev,
                      courseName: clubFullName,
                      // Optionally update par if available from the selected club
                      ...(newValue.par ? { par: newValue.par } : {}),
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      courseName: "",
                    }));
                  }
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
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
                    helperText="Select the golf course for this round"
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
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      color: "white",
                      backgroundColor: alpha(theme.palette.common.black, 0.7),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      p: 1.5,
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: "medium" }}>
                      {option.name}
                    </Box>
                    <Box component="span" sx={{ opacity: 0.7 }}>
                      {option.city}, {option.country}{" "}
                      {option.par ? `(Par ${option.par})` : ""}
                    </Box>
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
                    No golf courses found. Try a different search term.
                  </Box>
                }
              />
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

            <Grid item xs={12} sm={6}>
              <TextField
                name="par"
                label="Course Par"
                type="number"
                fullWidth
                value={formData.par}
                onChange={handleChange}
                inputProps={{ min: 30, max: 80 }}
                helperText="Standard par for the course"
                InputLabelProps={styles.tournamentCard.formStyles.labelProps(
                  theme
                )}
                InputProps={{
                  ...styles.tournamentCard.formStyles.inputProps,
                  inputProps: { min: 30, max: 80 },
                }}
              />
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
    </>
  );
};

export default RoundForm;
