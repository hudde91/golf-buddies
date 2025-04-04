import React from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useEventStyles } from "../styles/modules/event";

interface EventHeaderProps {
  onCreateEvent: () => void;
}

const EventHeader: React.FC<EventHeaderProps> = ({ onCreateEvent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const styles = useEventStyles();

  return (
    <Box sx={styles.eventHeaderContainer}>
      <Box sx={styles.eventHeaderIconContainer}>
        <EmojiEventsIcon sx={styles.eventHeaderIcon} />
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            sx={styles.eventHeaderTitle}
          >
            My Events
          </Typography>
          <Typography variant="body1" sx={styles.eventHeaderSubtitle}>
            Manage your tournaments and series
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateEvent}
        sx={styles.createEventButton}
      >
        Create Event
      </Button>
    </Box>
  );
};

export default EventHeader;
