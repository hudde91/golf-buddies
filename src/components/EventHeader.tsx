import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface EventHeaderProps {
  onCreateEvent: () => void;
}

const EventHeader: React.FC<EventHeaderProps> = ({ onCreateEvent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        mb: 4,
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <EmojiEventsIcon
          sx={{
            fontSize: { xs: 32, md: 40 },
            color: alpha(theme.palette.common.white, 0.9),
            mr: 2,
          }}
        />
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            sx={{
              fontWeight: "bold",
              color: alpha(theme.palette.common.white, 0.9),
            }}
          >
            My Events
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: alpha(theme.palette.common.white, 0.7),
              maxWidth: "600px",
            }}
          >
            Manage your tournaments and series
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateEvent}
        sx={{
          py: { xs: 1, md: 1.5 },
          px: { xs: 2, md: 3 },
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "bold",
          fontSize: { xs: "0.875rem", md: "1rem" },
          backgroundColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
          // boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
        }}
      >
        Create Event
      </Button>
    </Box>
  );
};

export default EventHeader;
