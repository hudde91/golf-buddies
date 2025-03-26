import React from "react";
import { List, Divider, Paper } from "@mui/material";
import HighlightItem from "./HighlightItem";
import EmptyHighlightsState from "./EmptyHighlightsState";
import { FeedItem, Tournament } from "../../../types/event";
import { useTournamentHighlightsStyles } from "../../../theme/hooks";

interface HighlightsFeedProps {
  feedItems: FeedItem[];
  tournament: Tournament;
}

const HighlightsFeed: React.FC<HighlightsFeedProps> = ({
  feedItems,
  tournament,
}) => {
  const styles = useTournamentHighlightsStyles();

  if (feedItems.length === 0) {
    return <EmptyHighlightsState />;
  }

  return (
    <Paper sx={styles.feedContainer}>
      <List sx={{ width: "100%" }}>
        {feedItems.map((item, index) => (
          <React.Fragment key={`${item.type}-${item.id}`}>
            {index > 0 && (
              <Divider variant="inset" component="li" sx={styles.divider} />
            )}
            <HighlightItem item={item} tournament={tournament} />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default HighlightsFeed;
