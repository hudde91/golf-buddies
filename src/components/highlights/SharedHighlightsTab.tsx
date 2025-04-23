import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import SharedHighlightForm from "./SharedHighlightForm";
import SharedHighlightsFeed from "./SharedHighlightsFeed";
import { useStyles } from "../../styles";
import eventService from "../../services/eventService";
import {
  ShoutOut,
  Highlight,
  FeedItem,
  HighlightFormData,
  Event,
} from "../../types/event";
import { useUser } from "@clerk/clerk-react";

interface SharedHighlightsTabProps {
  event: Event;
  eventType: "tournament" | "tour";
}

const SharedHighlightsTab: React.FC<SharedHighlightsTabProps> = ({
  event,
  eventType,
}) => {
  const styles = useStyles();
  const [shoutOuts, setShoutOuts] = useState<ShoutOut[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (event.id) {
      // Load both shoutOuts and highlights based on the event type
      if (eventType === "tournament") {
        const tournamentShoutOuts = eventService.getTournamentShoutOuts(
          event.id
        );
        setShoutOuts(tournamentShoutOuts);

        const tournamentHighlights = eventService.getTournamentHighlights(
          event.id
        );
        setHighlights(tournamentHighlights);
      } else if (eventType === "tour") {
        const tourShoutOuts = eventService.getTourShoutOuts(event.id);
        setShoutOuts(tourShoutOuts);

        const tourHighlights = eventService.getTourHighlights(event.id);
        setHighlights(tourHighlights);
      }
    }
  }, [event.id, eventType, event.shoutOuts, event.highlights]);

  // Combine shoutOuts and highlights into a single feed
  useEffect(() => {
    const combinedFeed: FeedItem[] = [
      ...shoutOuts.map((item) => ({
        id: item.id,
        type: "shoutOut" as const,
        timestamp: item.timestamp,
        data: item,
      })),
      ...highlights.map((item) => ({
        id: item.id,
        type: "highlight" as const,
        timestamp: item.timestamp,
        data: item,
      })),
    ];

    // Sort by timestamp (newest first)
    combinedFeed.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setFeedItems(combinedFeed);
  }, [shoutOuts, highlights]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitHighlight = async (formData: HighlightFormData) => {
    if (!user) return;
    let mediaUrl: string | undefined = undefined;

    if (formData.mediaFile) {
      try {
        // In a real application, you would upload the file to a server/cloud storage
        // and receive a URL back. For this example, we'll simulate this process.
        mediaUrl = await uploadMediaFile(formData.mediaFile);
      } catch (error) {
        console.error("Error uploading file:", error);
        // Handle upload error (could show an alert to the user)
        return;
      }
    }

    let updatedEvent;

    if (eventType === "tournament") {
      updatedEvent = eventService.createHighlight(
        event.id,
        user.id,
        formData.title,
        formData.mediaType,
        formData.description,
        formData.roundId,
        mediaUrl
      );
    } else if (eventType === "tour") {
      updatedEvent = eventService.createTourHighlight(
        event.id,
        user.id,
        formData.title,
        formData.mediaType,
        formData.description,
        formData.roundId,
        mediaUrl
      );
    }

    if (updatedEvent) {
      setHighlights(updatedEvent.highlights || []);
      handleCloseDialog();
    }
  };

  // Simulated file upload function
  // In a real application, this would upload to a server and return a URL
  const uploadMediaFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // For demonstration purposes, create a fake URL that represents where
        // the file would be stored in a real application
        const fakeUrl = `https://example.com/uploads/${file.name}`;
        resolve(fakeUrl);
      }, 1000);
    });
  };

  const eventTypeCapitalized =
    eventType.charAt(0).toUpperCase() + eventType.slice(1);

  return (
    <Box sx={styles.tournamentHighlights.container}>
      <Box sx={styles.tournamentHighlights.header}>
        <Typography variant="h5" sx={styles.tournamentHighlights.headerTitle}>
          {eventTypeCapitalized} Highlights & Shout-outs
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={styles.button.primary}
          >
            Upload a highlight
          </Button>
          <Typography
            variant="subtitle2"
            sx={styles.tournamentHighlights.headerSubtitle}
          >
            Share your best moments from the {eventType}
          </Typography>
        </Box>
      </Box>

      <SharedHighlightsFeed
        feedItems={feedItems}
        event={event}
        eventType={eventType}
      />

      <SharedHighlightForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitHighlight}
        event={event}
        eventType={eventType}
      />
    </Box>
  );
};

export default SharedHighlightsTab;
