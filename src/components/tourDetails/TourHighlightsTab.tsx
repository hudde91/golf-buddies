import React from "react";
import { Box } from "@mui/material";
import { Tour } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import SharedHighlightsTab from "../highlights/SharedHighlightsTab";

interface TourHighlightsTabProps {
  tour: Tour;
}

const TourHighlightsTab: React.FC<TourHighlightsTabProps> = ({ tour }) => {
  const styles = useStyles();

  return (
    <Box sx={styles.tabs.panel}>
      <SharedHighlightsTab event={tour} eventType="tour" />
    </Box>
  );
};

export default TourHighlightsTab;
