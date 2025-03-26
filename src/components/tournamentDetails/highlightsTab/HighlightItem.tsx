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
import {
  FeedItem,
  Tournament,
  ShoutOut,
  Highlight,
} from "../../../types/event";
import { useTournamentHighlightsStyles } from "../../../theme/hooks";

export interface HighlightItemProps {
  item: FeedItem;
  tournament: Tournament;
}

const HighlightItem: React.FC<HighlightItemProps> = ({ item, tournament }) => {
  const styles = useTournamentHighlightsStyles();

  const getPlayerName = (playerId: string) => {
    const player = tournament.players.find((p) => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  const getRoundName = (roundId?: string) => {
    if (!roundId) return "General";
    const round = tournament.rounds.find((r) => r.id === roundId);
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

  const getItemType = (): string => {
    if (item.type === "highlight") {
      return (item.data as Highlight).mediaType;
    } else {
      return (item.data as ShoutOut).type;
    }
  };

  const renderShoutOutContent = (shoutOutData: ShoutOut) => {
    const itemColor = styles.getItemTypeColor(shoutOutData.type).main;

    return (
      <>
        <Box sx={styles.itemHeader}>
          <Typography variant="subtitle1" sx={styles.playerName}>
            {getPlayerName(shoutOutData.playerId)}
          </Typography>
          <Chip
            label={shoutOutData.type.toUpperCase().replace("-", " ")}
            size="small"
            sx={styles.getTypeChip(itemColor)}
          />
        </Box>
        <Box>
          <Typography variant="body2" sx={styles.contentText}>
            {shoutOutData.message ||
              `Shout-out on hole ${shoutOutData.holeNumber}`}
          </Typography>
          <Box sx={styles.metadataContainer}>
            <Typography variant="caption" sx={styles.metadataText}>
              Round: {getRoundName(shoutOutData.roundId)}
            </Typography>
            <Typography variant="caption" sx={styles.metadataText}>
              Hole: {shoutOutData.holeNumber}
            </Typography>
            <Typography variant="caption" sx={styles.metadataText}>
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
    const itemColor = styles.getItemTypeColor(
      "highlight",
      highlightData.mediaType
    ).main;

    return (
      <>
        <Box sx={styles.itemHeader}>
          <Typography variant="subtitle1" sx={styles.playerName}>
            {getPlayerName(highlightData.playerId)}
          </Typography>
          <Chip
            label={highlightData.mediaType === "image" ? "PHOTO" : "VIDEO"}
            size="small"
            sx={styles.getTypeChip(itemColor)}
          />
        </Box>
        <Box>
          <Typography variant="body1" sx={styles.highlightTitle}>
            {highlightData.title}
          </Typography>
          {highlightData.description && (
            <Typography variant="body2" sx={styles.contentText}>
              {highlightData.description}
            </Typography>
          )}
          {highlightData.mediaUrl && (
            <Box sx={styles.mediaContainer}>
              {highlightData.mediaType === "image" ? (
                <img
                  src={highlightData.mediaUrl}
                  alt={highlightData.title}
                  style={{ maxWidth: "100%", maxHeight: 240 }}
                />
              ) : (
                <Box sx={styles.videoPlaceholder}>
                  <VideoIcon sx={styles.videoIcon} />
                  <Typography variant="caption" sx={styles.videoText}>
                    Video Highlight
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          <Box sx={styles.metadataContainer}>
            <Typography variant="caption" sx={styles.metadataText}>
              Round: {getRoundName(highlightData.roundId)}
            </Typography>
            <Typography variant="caption" sx={styles.metadataText}>
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

  // Get appropriate styling for item type
  const itemType = getItemType();
  const itemColor = styles.getItemTypeColor(
    item.type === "highlight" ? "highlight" : (item.data as ShoutOut).type,
    item.type === "highlight" ? (item.data as Highlight).mediaType : undefined
  ).main;

  return (
    <ListItem alignItems="flex-start" sx={styles.feedItem}>
      <ListItemAvatar>
        <Avatar sx={styles.getAvatarStyle(item.type, itemColor)}>
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

export default HighlightItem;
