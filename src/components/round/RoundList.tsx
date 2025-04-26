import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import { Event as EventIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Round } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";

interface RoundListProps {
  rounds: Round[];
  selectedRoundId: string | null;
  onSelectRound: (roundId: string) => void;
  onDeleteRound?: (roundId: string) => void;
  isCreator?: boolean;
}

const RoundList: React.FC<RoundListProps> = ({
  rounds,
  selectedRoundId,
  onSelectRound,
  onDeleteRound,
  isCreator = false,
}) => {
  const styles = useStyles();

  return (
    <List
      component={Paper}
      variant="outlined"
      sx={{
        ...styles.tournamentRounds.roundsTab.roundsList,
        ...styles.mobile.list.horizontal,
      }}
    >
      {[...rounds]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((round) => (
          <ListItem
            key={round.id}
            button
            selected={selectedRoundId === round.id}
            onClick={() => onSelectRound(round.id)}
            sx={styles.tournamentRounds.roundsTab.roundItem}
          >
            <ListItemAvatar
              sx={styles.tournamentRounds.roundsTab.roundItemAvatar}
            >
              <Avatar sx={styles.tournamentRounds.roundsTab.avatar}>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography sx={styles.tournamentRounds.roundsTab.roundName}>
                  {round.name}
                </Typography>
              }
              secondary={
                <Typography
                  variant="body2"
                  sx={styles.tournamentRounds.roundsTab.roundDate}
                >
                  {new Date(round.date).toLocaleDateString()}
                </Typography>
              }
            />
            {isCreator && onDeleteRound && (
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRound(round.id);
                  }}
                  sx={styles.tournamentRounds.roundsTab.deleteButton}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
    </List>
  );
};

export default RoundList;
