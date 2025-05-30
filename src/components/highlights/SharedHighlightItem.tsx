import React from "react";
import {
  Box,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Whatshot as EagleIcon,
  LocalFireDepartment as BirdieIcon,
  AutoAwesome as HoleInOneIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

import { useStyles } from "../../styles";
import {
  FeedItem,
  Tournament,
  Tour,
  ShoutOut,
  Event,
  Highlight,
} from "../../types/event";

export interface SharedHighlightItemProps {
  item: FeedItem;
  event: Event;
  eventType: "tournament" | "tour";
}

const SharedHighlightItem: React.FC<SharedHighlightItemProps> = ({
  item,
  event,
}) => {
  const styles = useStyles();

  // Type guard function to check if the event is a Tournament
  const isTournament = (event: Event): event is Tournament => {
    return event.type === "tournament";
  };

  // Type guard function to check if the event is a Tour
  const isTour = (event: Event): event is Tour => {
    return event.type === "tour";
  };

  const getPlayerName = (playerId: string) => {
    let players: any[] = [];

    if (isTournament(event)) {
      players = event.players;
    } else if (isTour(event) && event.players) {
      players = event.players;
    }

    const player = players.find((p) => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  const getRoundName = (roundId?: string) => {
    if (!roundId) return "General";

    let rounds: any[] = [];

    if (isTournament(event)) {
      rounds = event.rounds;
    } else if (isTour(event)) {
      rounds = event.rounds || [];
    }

    const round = rounds.find((r) => r.id === roundId);
    return round ? round.name : "Unknown Round";
  };

  const getShoutOutIcon = (type: string) => {
    switch (type) {
      case "birdie":
        return <BirdieIcon />;
      case "eagle":
        return <EagleIcon />;
      case "hole-in-one":
        return <HoleInOneIcon />;
      default:
        return <EagleIcon />;
    }
  };

  const getHighlightIcon = (mediaType: string) => {
    return mediaType === "image" ? <ImageIcon /> : <VideoIcon />;
  };

  const renderShoutOutContent = (shoutOutData: ShoutOut) => {
    const itemColor = styles.tournamentHighlights.getItemTypeColor(
      shoutOutData.type
    ).main;

    return (
      <>
        <Box sx={styles.tournamentHighlights.itemHeader}>
          <Typography
            variant="subtitle1"
            sx={styles.tournamentHighlights.playerName}
          >
            {getPlayerName(shoutOutData.playerId)}
          </Typography>
          <Chip
            label={shoutOutData.type.toUpperCase().replace("-", " ")}
            size="small"
            sx={styles.tournamentHighlights.getTypeChip(itemColor)}
          />
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={styles.tournamentHighlights.contentText}
          >
            {shoutOutData.message ||
              `Shout-out on hole ${shoutOutData.holeNumber}`}
          </Typography>
          <Box sx={styles.tournamentHighlights.metadataContainer}>
            <Typography
              variant="caption"
              sx={styles.tournamentHighlights.metadataText}
            >
              Round: {getRoundName(shoutOutData.roundId)}
            </Typography>
            <Typography
              variant="caption"
              sx={styles.tournamentHighlights.metadataText}
            >
              Hole: {shoutOutData.holeNumber}
            </Typography>
            <Typography
              variant="caption"
              sx={styles.tournamentHighlights.metadataText}
            >
              {format(
                new Date(shoutOutData.timestamp),
                "MMM d, yyyy 'at' h:mm a"
              )}
            </Typography>
          </Box>
        </Box>
      </>
    );
  };

  const renderHighlightContent = (highlightData: Highlight) => {
    const itemColor = styles.tournamentHighlights.getItemTypeColor(
      "highlight",
      highlightData.mediaType
    ).main;

    return (
      <>
        <Box sx={styles.tournamentHighlights.itemHeader}>
          <Typography
            variant="subtitle1"
            sx={styles.tournamentHighlights.playerName}
          >
            {getPlayerName(highlightData.playerId)}
          </Typography>
          <Chip
            label={highlightData.mediaType === "image" ? "PHOTO" : "VIDEO"}
            size="small"
            sx={styles.tournamentHighlights.getTypeChip(itemColor)}
          />
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={styles.tournamentHighlights.highlightTitle}
          >
            {highlightData.title}
          </Typography>
          {highlightData.description && (
            <Typography
              variant="body2"
              sx={styles.tournamentHighlights.contentText}
            >
              {highlightData.description}
            </Typography>
          )}
          {highlightData.mediaUrl && (
            <Box sx={styles.tournamentHighlights.mediaContainer}>
              {highlightData.mediaType === "image" ? (
                <img
                  src={highlightData.mediaUrl}
                  alt={highlightData.title}
                  style={{ maxWidth: "100%", maxHeight: 240 }}
                />
              ) : (
                <Box sx={styles.tournamentHighlights.videoPlaceholder}>
                  <VideoIcon sx={styles.tournamentHighlights.videoIcon} />
                  <Typography
                    variant="caption"
                    sx={styles.tournamentHighlights.videoText}
                  >
                    Video Highlight
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          <Box sx={styles.tournamentHighlights.metadataContainer}>
            <Typography
              variant="caption"
              sx={styles.tournamentHighlights.metadataText}
            >
              Round: {getRoundName(highlightData.roundId)}
            </Typography>
            <Typography
              variant="caption"
              sx={styles.tournamentHighlights.metadataText}
            >
              {format(
                new Date(highlightData.timestamp),
                "MMM d, yyyy 'at' h:mm a"
              )}
            </Typography>
          </Box>
        </Box>
      </>
    );
  };

  const itemColor = styles.tournamentHighlights.getItemTypeColor(
    item.type === "highlight" ? "highlight" : (item.data as ShoutOut).type,
    item.type === "highlight" ? (item.data as Highlight).mediaType : undefined
  ).main;

  return (
    <ListItem alignItems="flex-start" sx={styles.tournamentHighlights.feedItem}>
      <ListItemAvatar>
        <Avatar sx={styles.tournamentHighlights.getAvatarStyle(itemColor)}>
          {item.type === "highlight"
            ? getHighlightIcon((item.data as Highlight).mediaType)
            : getShoutOutIcon((item.data as ShoutOut).type)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          item.type === "shoutOut"
            ? renderShoutOutContent(item.data as ShoutOut)
            : renderHighlightContent(item.data as Highlight)
        }
      />
    </ListItem>
  );
};

export default SharedHighlightItem;
