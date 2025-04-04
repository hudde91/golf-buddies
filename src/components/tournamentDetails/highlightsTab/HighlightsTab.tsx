import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  ShoutOut,
  Highlight,
  FeedItem,
  HighlightFormData,
  Tournament,
  Player,
} from "../../../types/event";
import eventService from "../../../services/eventService";
import HighlightForm from "./HighlightForm";
import HighlightsFeed from "./HighlightsFeed";
import { useStyles } from "../../../styles/hooks/useStyles";

interface HighlightsTabProps {
  tournament: Tournament;
  user: Player | null;
}

const HighlightsTab: React.FC<HighlightsTabProps> = ({ tournament, user }) => {
  const styles = useStyles();
  const [shoutOuts, setShoutOuts] = useState<ShoutOut[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (tournament.id) {
      const tournamentShoutOuts = eventService.getTournamentShoutOuts(
        tournament.id
      );
      setShoutOuts(tournamentShoutOuts);

      const tournamentHighlights = eventService.getTournamentHighlights(
        tournament.id
      );
      setHighlights(tournamentHighlights);
    }
  }, [tournament.id, tournament.shoutOuts, tournament.highlights]);

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

    const updatedTournament = eventService.createHighlight(
      tournament.id,
      user.id,
      formData.title,
      formData.mediaType,
      formData.description,
      formData.roundId,
      mediaUrl
    );

    if (updatedTournament) {
      setHighlights(updatedTournament.highlights || []);
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

  return (
    <Box sx={styles.tournamentHighlights.container}>
      <Box sx={styles.tournamentHighlights.header}>
        <Typography variant="h5" sx={styles.tournamentHighlights.headerTitle}>
          Highlights & shout-outs!
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
            Share your best moments from the tournament
          </Typography>
        </Box>
      </Box>

      <HighlightsFeed feedItems={feedItems} tournament={tournament} />

      <HighlightForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitHighlight}
        tournament={tournament}
      />
    </Box>
  );
};

export default HighlightsTab;
