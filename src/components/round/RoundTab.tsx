import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { Round, PlayerGroup } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import RoundList from "./RoundList";
import RoundGroups from "./RoundGroups";
import RoundHeader from "./RoundHeader";
import {
  Weather,
  fetchWeather,
  getInitialWeatherState,
} from "../../services/weatherService";

interface RoundTabProps {
  rounds: Round[];
  players: any[]; // Could be from Tournament or Tour
  isCreator: boolean;
  selectedRoundId: string | null;
  onSelectRound: (roundId: string) => void;
  onDeleteRound: (roundId: string) => void;
  onUpdatePlayerGroups: (roundId: string, playerGroups: PlayerGroup[]) => void;
  onAddRound: () => void;
  onNavigateToGroup: (roundId: string, groupId: string) => void;
  parentType: "tournament" | "tour";
  parentId: string;
}

const RoundTab: React.FC<RoundTabProps> = ({
  rounds,
  players,
  isCreator,
  selectedRoundId,
  onSelectRound,
  onDeleteRound,
  onUpdatePlayerGroups,
  onAddRound,
  onNavigateToGroup,
  parentType,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [weather, setWeather] = useState<Weather>(getInitialWeatherState());

  const getSelectedRound = () => {
    if (!selectedRoundId) return null;
    return rounds.find((round) => round.id === selectedRoundId) || null;
  };

  const selectedRound = getSelectedRound();

  // Fetch weather data when component mounts or selected round changes
  useEffect(() => {
    const getWeather = async () => {
      if (selectedRound?.courseDetails?.name) {
        setWeather((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const result = await fetchWeather(selectedRound.courseDetails.name);
          setWeather(result);
        } catch (error) {
          setWeather((prev) => ({
            ...prev,
            loading: false,
            error: "Could not load weather data",
          }));
        }
      }
    };

    getWeather();
  }, [selectedRound?.courseDetails?.name]);

  // Handler for updating player groups
  const handleUpdatePlayerGroups = (updatedGroups: PlayerGroup[]) => {
    if (selectedRoundId) {
      onUpdatePlayerGroups(selectedRoundId, updatedGroups);
    }
  };

  if (rounds.length === 0) {
    return (
      <Box sx={styles.tournamentRounds.roundsTab.emptyState}>
        <EventIcon sx={styles.tournamentRounds.roundsTab.emptyStateIcon} />
        <Typography
          variant="h6"
          gutterBottom
          sx={styles.tournamentRounds.roundsTab.emptyStateTitle}
        >
          No Rounds Added Yet
        </Typography>
        <Typography
          variant="body2"
          paragraph
          sx={styles.tournamentRounds.roundsTab.emptyStateMessage}
        >
          Add rounds to track scores for this {parentType}.
        </Typography>
        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
            sx={styles.button.primary}
          >
            Add First Round
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {selectedRound && <RoundHeader round={selectedRound} weather={weather} />}

      <Box
        sx={{
          ...styles.tournamentRounds.roundsTab.header,
          ...styles.mobile.layout.stackedOnMobile,
        }}
      >
        <Typography variant="h6" sx={styles.headers.section.title}>
          {parentType === "tournament" ? "Tournament" : "Tour"} Rounds
        </Typography>

        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
            fullWidth={isSmall}
            sx={{
              ...styles.button.primary,
              ...styles.mobile.button.touchable,
            }}
          >
            Add Round
          </Button>
        )}
      </Box>
      <Grid container spacing={isSmall ? 2 : 3}>
        <Grid item xs={12} md={3}>
          <RoundList
            rounds={rounds}
            selectedRoundId={selectedRoundId}
            onSelectRound={onSelectRound}
            onDeleteRound={onDeleteRound}
            isCreator={isCreator}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          {selectedRound ? (
            <Box>
              {/* Round Groups Section */}
              <RoundGroups
                round={selectedRound}
                players={players}
                isCreator={isCreator}
                onUpdatePlayerGroups={handleUpdatePlayerGroups}
                onNavigateToGroup={onNavigateToGroup}
              />
            </Box>
          ) : (
            <Box sx={styles.tournamentRounds.roundsTab.noSelection}>
              <Typography
                variant="h6"
                sx={styles.tournamentRounds.roundsTab.noSelectionText}
              >
                Select a round to view its details
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoundTab;
