import React from "react";
import { List, Divider, Paper, alpha, useTheme } from "@mui/material";
import HighlightItem from "./HighlightItem";
import EmptyHighlightsState from "./EmptyHighlightsState";
import { FeedItem, Tournament } from "../../../types/event";

interface HighlightsFeedProps {
  feedItems: FeedItem[];
  tournament: Tournament;
}

const HighlightsFeed: React.FC<HighlightsFeedProps> = ({
  feedItems,
  tournament,
}) => {
  const theme = useTheme();

  if (feedItems.length === 0) {
    return <EmptyHighlightsState />;
  }

  return (
    <Paper
      sx={{
        bgcolor: alpha(theme.palette.common.black, 0.2),
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        borderRadius: 2,
      }}
    >
      <List sx={{ width: "100%" }}>
        {feedItems.map((item, index) => (
          <React.Fragment key={`${item.type}-${item.id}`}>
            {index > 0 && (
              <Divider
                variant="inset"
                component="li"
                sx={{ bgcolor: alpha(theme.palette.common.white, 0.1) }}
              />
            )}
            <HighlightItem item={item} tournament={tournament} />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default HighlightsFeed;
