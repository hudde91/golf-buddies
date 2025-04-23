import React from "react";
import { Box } from "@mui/material";
import { Tournament, Player } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import SharedHighlightsTab from "../highlights/SharedHighlightsTab";

interface HighlightsTabProps {
  tournament: Tournament;
}

const HighlightsTab: React.FC<HighlightsTabProps> = ({ tournament, user }) => {
  const styles = useStyles();

  return (
    <Box sx={styles.tournamentHighlights.container}>
      <SharedHighlightsTab event={tournament} eventType="tournament" />
    </Box>
  );
};

export default HighlightsTab;
