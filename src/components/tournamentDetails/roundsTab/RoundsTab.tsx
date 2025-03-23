import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Event as EventIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Tournament, HoleScore } from "../../../types/event";
import RoundScorecard from "./RoundScorecard";
import { useTournamentScorecardStyles } from "../../../theme/hooks";

interface RoundsTabProps {
  tournament: Tournament;
  isCreator: boolean;
  selectedRoundId: string | null;
  onSelectRound: (roundId: string) => void;
  onDeleteRound: (roundId: string) => void;
  onUpdateScores: (
    roundId: string,
    playerId: string,
    scores: HoleScore[]
  ) => void;
  onAddRound: () => void;
}

const RoundsTab: React.FC<RoundsTabProps> = ({
  tournament,
  isCreator,
  selectedRoundId,
  onSelectRound,
  onDeleteRound,
  onUpdateScores,
  onAddRound,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const styles = useTournamentScorecardStyles();

  const getSelectedRound = () => {
    if (!selectedRoundId) return null;
    return (
      tournament.rounds.find((round) => round.id === selectedRoundId) || null
    );
  };

  if (tournament.rounds.length === 0) {
    return (
      <Box sx={styles.roundsTab.emptyState}>
        <EventIcon sx={styles.roundsTab.emptyStateIcon} />
        <Typography
          variant="h6"
          gutterBottom
          sx={styles.roundsTab.emptyStateTitle}
        >
          No Rounds Added Yet
        </Typography>
        <Typography
          variant="body2"
          paragraph
          sx={styles.roundsTab.emptyStateMessage}
        >
          Add rounds to track scores for this tournament.
        </Typography>
        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
          >
            Add First Round
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={styles.roundsTab.header}>
        <Typography variant="h6" sx={styles.header.title}>
          Tournament Rounds
        </Typography>

        {isCreator && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={onAddRound}
            fullWidth={isSmall}
          >
            Add Round
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <List
            component={Paper}
            variant="outlined"
            sx={styles.roundsTab.roundsList}
          >
            {[...tournament.rounds]
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((round) => (
                <ListItem
                  key={round.id}
                  button
                  selected={selectedRoundId === round.id}
                  onClick={() => onSelectRound(round.id)}
                  sx={styles.roundsTab.roundItem}
                >
                  <ListItemAvatar sx={styles.roundsTab.roundItemAvatar}>
                    <Avatar sx={styles.roundsTab.avatar}>
                      <EventIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={styles.roundsTab.roundName}>
                        {round.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={styles.roundsTab.roundDate}
                      >
                        {new Date(round.date).toLocaleDateString()}
                      </Typography>
                    }
                  />
                  {isCreator && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onDeleteRound(round.id)}
                        sx={styles.roundsTab.deleteButton}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
          </List>
        </Grid>

        <Grid item xs={12} md={9}>
          {getSelectedRound() ? (
            <RoundScorecard
              round={getSelectedRound()!}
              players={tournament.players}
              isCreator={isCreator}
              onUpdateScores={onUpdateScores}
            />
          ) : (
            <Box sx={styles.roundsTab.noSelection}>
              <Typography variant="h6" sx={styles.roundsTab.noSelectionText}>
                Select a round to view its scorecard
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoundsTab;
