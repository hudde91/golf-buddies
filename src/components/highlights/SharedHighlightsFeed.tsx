import React from "react";
import { List, Divider, Paper } from "@mui/material";
import SharedHighlightItem from "./SharedHighlightItem";
import SharedEmptyHighlightsState from "./SharedEmptyHighlightsState";
import { FeedItem, Event } from "../../types/event";
import { useStyles } from "../../styles";

interface SharedHighlightsFeedProps {
  feedItems: FeedItem[];
  event: Event;
  eventType: "tournament" | "tour";
}

const SharedHighlightsFeed: React.FC<SharedHighlightsFeedProps> = ({
  feedItems,
  event,
  eventType,
}) => {
  const styles = useStyles();

  if (feedItems.length === 0) {
    return <SharedEmptyHighlightsState eventType={eventType} />;
  }

  return (
    <Paper sx={styles.tournamentHighlights.feedContainer}>
      <List sx={{ width: "100%" }}>
        {feedItems.map((item, index) => (
          <React.Fragment key={`${item.type}-${item.id}`}>
            {index > 0 && (
              <Divider
                variant="inset"
                component="li"
                sx={styles.tournamentHighlights.divider}
              />
            )}
            <SharedHighlightItem
              item={item}
              event={event}
              eventType={eventType}
            />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default SharedHighlightsFeed;
