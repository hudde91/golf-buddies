import React from "react";
import {
  Box,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  alpha,
  useTheme,
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
  ShoutOut,
  Highlight,
  Tournament,
  FeedItem,
} from "../../../types/event";

export interface HighlightItemProps {
  item: FeedItem;
  tournament: Tournament;
}

const HighlightItem: React.FC<HighlightItemProps> = ({ item, tournament }) => {
  const theme = useTheme();

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
        return (
          <BirdieIcon sx={{ color: theme.palette.success.contrastText }} />
        );
      case "eagle":
        return <EagleIcon sx={{ color: theme.palette.primary.contrastText }} />;
      case "hole-in-one":
        return (
          <HoleInOneIcon sx={{ color: theme.palette.error.contrastText }} />
        );
      default:
        return <EagleIcon sx={{ color: theme.palette.primary.contrastText }} />;
    }
  };

  const getHighlightIcon = (mediaType: string) => {
    return mediaType === "image" ? (
      <ImageIcon sx={{ color: theme.palette.info.main }} />
    ) : (
      <VideoIcon sx={{ color: theme.palette.secondary.main }} />
    );
  };

  const getItemColor = () => {
    if (item.type === "highlight") {
      return (item.data as Highlight).mediaType === "image"
        ? theme.palette.info
        : theme.palette.secondary;
    } else {
      const shoutOutType = (item.data as ShoutOut).type;
      switch (shoutOutType) {
        case "birdie":
          return theme.palette.success;
        case "eagle":
          return theme.palette.warning;
        case "hole-in-one":
          return theme.palette.error;
        default:
          return theme.palette.primary;
      }
    }
  };

  const renderShoutOutContent = (shoutOutData: ShoutOut) => (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "white", fontWeight: 600, mr: 1 }}
        >
          {getPlayerName(shoutOutData.playerId)}
        </Typography>
        <Chip
          label={shoutOutData.type.toUpperCase().replace("-", " ")}
          size="small"
          sx={{
            bgcolor: alpha(getItemColor().main, 0.15),
            color: getItemColor().main,
            fontWeight: 600,
            mr: 1,
          }}
        />
      </Box>
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: alpha(theme.palette.common.white, 0.7),
            my: 0.5,
          }}
        >
          {shoutOutData.message ||
            `Shout-out on hole ${shoutOutData.holeNumber}`}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.5),
              mr: 2,
            }}
          >
            Round: {getRoundName(shoutOutData.roundId)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.5),
              mr: 2,
            }}
          >
            Hole: {shoutOutData.holeNumber}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.5),
            }}
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

  const renderHighlightContent = (highlightData: Highlight) => (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "white", fontWeight: 600, mr: 1 }}
        >
          {getPlayerName(highlightData.playerId)}
        </Typography>
        <Chip
          label={highlightData.mediaType === "image" ? "PHOTO" : "VIDEO"}
          size="small"
          sx={{
            bgcolor: alpha(getItemColor().main, 0.15),
            color: getItemColor().main,
            fontWeight: 600,
            mr: 1,
          }}
        />
      </Box>
      <Box>
        <Typography
          variant="body1"
          sx={{
            color: "white",
            fontWeight: 500,
            my: 0.5,
          }}
        >
          {highlightData.title}
        </Typography>
        {highlightData.description && (
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.common.white, 0.7),
              my: 0.5,
            }}
          >
            {highlightData.description}
          </Typography>
        )}
        {highlightData.mediaUrl && (
          <Box
            sx={{
              mt: 1,
              mb: 2,
              width: "100%",
              maxHeight: 240,
              overflow: "hidden",
              borderRadius: 1,
              bgcolor: alpha(theme.palette.common.black, 0.3),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {highlightData.mediaType === "image" ? (
              <img
                src={highlightData.mediaUrl}
                alt={highlightData.title}
                style={{ maxWidth: "100%", maxHeight: 240 }}
              />
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <VideoIcon
                  sx={{ fontSize: 48, color: theme.palette.secondary.main }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: alpha(theme.palette.common.white, 0.5),
                  }}
                >
                  Video Highlight
                </Typography>
              </Box>
            )}
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.5),
              mr: 2,
            }}
          >
            Round: {getRoundName(highlightData.roundId)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.5),
            }}
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

  return (
    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor:
              item.type === "highlight"
                ? alpha(getItemColor().main, 0.8)
                : getItemColor().main,
          }}
        >
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
