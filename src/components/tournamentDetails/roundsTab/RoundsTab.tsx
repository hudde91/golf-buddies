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
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Event as EventIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Tournament, HoleScore } from "../../../types/tournament";
import RoundScorecard from "./RoundScorecard";

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

  const getSelectedRound = () => {
    if (!selectedRoundId) return null;
    return (
      tournament.rounds.find((round) => round.id === selectedRoundId) || null
    );
  };

  if (tournament.rounds.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          backgroundColor: alpha(theme.palette.common.black, 0.2),
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
        }}
      >
        <EventIcon
          sx={{
            fontSize: 60,
            color: alpha(theme.palette.common.white, 0.3),
            mb: 2,
          }}
        />
        <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
          No Rounds Added Yet
        </Typography>
        <Typography
          variant="body2"
          color={alpha(theme.palette.common.white, 0.7)}
          paragraph
          sx={{ maxWidth: 500, mx: "auto" }}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
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
            sx={{
              mb: 2,
              bgcolor: alpha(theme.palette.common.black, 0.2),
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              borderRadius: 2,
              maxHeight: { xs: "auto", md: 500 },
              overflow: { xs: "auto", md: "auto" },
              display: { xs: "flex", md: "block" },
              flexDirection: { xs: "row", md: "column" },
              overflowX: { xs: "auto", md: "hidden" },
              whiteSpace: { xs: "nowrap", md: "normal" },
            }}
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
                  sx={{
                    borderBottom: `1px solid ${alpha(
                      theme.palette.common.white,
                      0.05
                    )}`,
                    minWidth: { xs: 200, md: "auto" },
                    px: { xs: 2, md: 3 },
                    py: { xs: 1, md: 2 },
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.3),
                      },
                    },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.common.white, 0.05),
                    },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: { xs: 36, md: 56 } }}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.dark",
                        width: { xs: 28, md: 40 },
                        height: { xs: 28, md: 40 },
                      }}
                    >
                      <EventIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: "white" }}>
                        {round.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ color: alpha(theme.palette.common.white, 0.6) }}
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
                        sx={{
                          color: theme.palette.error.light,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
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
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.common.black, 0.2),
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: alpha(theme.palette.common.white, 0.7) }}
              >
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
