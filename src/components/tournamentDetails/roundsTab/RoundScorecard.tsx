import React, { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Round, Player, HoleScore } from "../../../types/event";
import { getHoleSections } from "./scorecardUtils";
import ScorecardHeader from "./ScorecardHeader";
import WeatherDisplay from "./WeatherDisplay";
import ScorecardSection from "./ScorecardSection";
import {
  fetchWeather,
  getInitialWeatherState,
} from "../../../services/weatherService";

interface RoundScorecardProps {
  round: Round;
  players: Player[];
  isCreator: boolean;
  onUpdateScores: (
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ) => void;
}

const RoundScorecard: React.FC<RoundScorecardProps> = ({
  round,
  players,
  isCreator,
  onUpdateScores,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editScores, setEditScores] = useState<HoleScore[]>([]);
  const [weather, setWeather] = useState(getInitialWeatherState());

  // Fetch weather data when component mounts or round changes
  useEffect(() => {
    const getWeather = async () => {
      // Only fetch if we have both location and date
      if (round.courseDetails?.name && round.date) {
        setWeather((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const result = await fetchWeather(
            round.courseDetails.name,
            round.date
          );
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
  }, [round.courseDetails?.name, round.date]);

  const sections = getHoleSections(round, isXsScreen, isMobile);

  const handleStartEdit = (playerId: string) => {
    setEditingPlayerId(playerId);
    setEditScores([...round.scores[playerId]]);
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
    setEditScores([]);
  };

  const handleSaveScores = () => {
    if (!editingPlayerId) return;

    onUpdateScores(round.id, editingPlayerId, editScores);
    setEditingPlayerId(null);
    setEditScores([]);
  };

  const handleScoreChange = (holeIndex: number, value: string) => {
    const numValue = value === "" ? undefined : parseInt(value, 10);

    setEditScores((prev) => {
      const newScores = [...prev];
      newScores[holeIndex] = {
        ...newScores[holeIndex],
        score: numValue,
      };
      return newScores;
    });
  };

  return (
    <Box>
      <ScorecardHeader round={round} />

      <WeatherDisplay
        weather={weather}
        courseName={round.courseDetails?.name}
      />

      {sections.map((section, sectionIndex) => (
        <ScorecardSection
          key={`section-${sectionIndex}`}
          round={round}
          players={players}
          section={section}
          sectionIndex={sectionIndex}
          sectionsCount={sections.length}
          isCreator={isCreator}
          editingPlayerId={editingPlayerId}
          editScores={editScores}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onSaveScores={handleSaveScores}
          onScoreChange={handleScoreChange}
        />
      ))}
    </Box>
  );
};

export default RoundScorecard;
