import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  GolfCourse as GolfIcon,
  GolfCourseRounded as SportsGolf,
  SportsBar as BeerIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { Tournament, Player } from "../../../types/tournament";

interface PlayerProfileDialogProps {
  open: boolean;
  player: Player | null;
  tournament: Tournament;
  onClose: () => void;
}

const PlayerProfileDialog: React.FC<PlayerProfileDialogProps> = ({
  open,
  player,
  tournament,
  onClose,
}) => {
  const theme = useTheme();

  if (!player) return null;

  // Find player's team if they have one
  const playerTeam = tournament.teams.find(
    (team) => player.teamId && team.id === player.teamId
  );

  // Check if player is a captain
  const isCaptain = tournament.teams.some((team) => team.captain === player.id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.8),
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: "white", pr: 6 }}>
        Player Profile
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: alpha(theme.palette.common.white, 0.7),
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            pb: 3,
            borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
        >
          <Avatar
            src={player.avatarUrl}
            alt={player.name}
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              border: `3px solid ${
                playerTeam?.color || alpha(theme.palette.common.white, 0.2)
              }`,
            }}
          />
          <Box>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 500 }}>
              {player.name}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {player.id === tournament.createdBy && (
                <Chip label="Creator" size="small" color="primary" />
              )}

              {playerTeam && (
                <Chip
                  size="small"
                  label={playerTeam.name}
                  sx={{
                    bgcolor: alpha(playerTeam.color, 0.2),
                    color: playerTeam.color,
                    border: `1px solid ${playerTeam.color}`,
                  }}
                />
              )}

              {isCaptain && playerTeam && (
                <Chip
                  size="small"
                  icon={<GolfIcon style={{ color: playerTeam.color }} />}
                  label="Team Captain"
                  sx={{
                    bgcolor: alpha(playerTeam.color, 0.1),
                    color: "white",
                    border: `1px solid ${alpha(playerTeam.color, 0.5)}`,
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Bio Section */}
        {player.bio && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
              About
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: alpha(theme.palette.common.white, 0.9),
                lineHeight: 1.6,
              }}
            >
              {player.bio}
            </Typography>
          </Box>
        )}

        {/* Golf Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
            Golf Profile
          </Typography>

          {/* Handicap */}
          {player.question1 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 2.5,
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.light,
                  width: 40,
                  height: 40,
                }}
              >
                <GolfIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.primary.light }}
                >
                  Handicap
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: 500, fontSize: "1.2rem" }}
                >
                  {player.question1}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Favorite Club */}
          {player.question2 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 2.5,
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.light,
                  width: 40,
                  height: 40,
                }}
              >
                <SportsGolf />
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.secondary.light }}
                >
                  Favorite Club
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {player.question2}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Beers Per Round */}
          {player.question3 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 2.5,
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.light,
                  width: 40,
                  height: 40,
                }}
              >
                <BeerIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.warning.light }}
                >
                  Beers Per Round
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {player.question3}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Favorite Memory */}
          {player.question4 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.light,
                  width: 40,
                  height: 40,
                }}
              >
                <TrophyIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.success.light }}
                >
                  Favorite Golf Memory
                </Typography>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {player.question4}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "white",
            borderColor: alpha(theme.palette.common.white, 0.3),
            "&:hover": {
              borderColor: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface PlayersTabProps {
  tournament: Tournament;
  isCreator: boolean;
  onInvitePlayers: () => void;
  renderPlayerExtra?: (player: Player) => React.ReactNode;
}

const PlayersTab: React.FC<PlayersTabProps> = ({
  tournament,
  isCreator,
  onInvitePlayers,
  renderPlayerExtra,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setProfileDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setProfileDialogOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Players ({tournament.players.length})
        </Typography>

        {isCreator && (
          <Button
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={onInvitePlayers}
            variant="outlined"
            fullWidth={isSmall}
            sx={{
              color: "white",
              borderColor: alpha(theme.palette.common.white, 0.3),
              "&:hover": {
                borderColor: "white",
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            Invite Players
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {tournament.players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Paper
              variant="outlined"
              onClick={() => handlePlayerClick(player)}
              sx={{
                p: 2,
                backgroundColor: alpha(theme.palette.common.black, 0.3),
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 6px 12px ${alpha(
                    theme.palette.common.black,
                    0.3
                  )}`,
                  borderColor: alpha(theme.palette.common.white, 0.3),
                  backgroundColor: alpha(theme.palette.common.black, 0.4),
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={player.avatarUrl}
                  alt={player.name}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    border: `2px solid ${
                      player.teamId
                        ? tournament.teams.find((t) => t.id === player.teamId)
                            ?.color || alpha(theme.palette.common.white, 0.2)
                        : alpha(theme.palette.common.white, 0.2)
                    }`,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: "white" }}>
                    {player.name}
                    {renderPlayerExtra && renderPlayerExtra(player)}
                  </Typography>

                  {player.question1 && (
                    <Typography
                      variant="body2"
                      color={alpha(theme.palette.common.white, 0.7)}
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <GolfIcon fontSize="small" />
                      Handicap: {player.question1}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 1,
                  }}
                >
                  {player.id === tournament.createdBy && (
                    <Chip
                      label="Creator"
                      size="small"
                      color="primary"
                      sx={{ height: 24 }}
                    />
                  )}

                  {player.teamId && (
                    <Chip
                      size="small"
                      label={
                        tournament.teams.find((t) => t.id === player.teamId)
                          ?.name
                      }
                      sx={{
                        bgcolor: alpha(
                          tournament.teams.find((t) => t.id === player.teamId)
                            ?.color || "#808080",
                          0.2
                        ),
                        color:
                          tournament.teams.find((t) => t.id === player.teamId)
                            ?.color || "white",
                        border: `1px solid ${
                          tournament.teams.find((t) => t.id === player.teamId)
                            ?.color || alpha(theme.palette.common.white, 0.3)
                        }`,
                        height: 24,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {tournament.invitations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
            Pending Invitations ({tournament.invitations.length})
          </Typography>

          <Grid container spacing={2}>
            {tournament.invitations.map((email) => (
              <Grid item xs={12} sm={6} md={4} key={email}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.common.black, 0.3),
                    backdropFilter: "blur(10px)",
                    borderRadius: 2,
                    border: `1px solid ${alpha(
                      theme.palette.common.white,
                      0.1
                    )}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        bgcolor: alpha(theme.palette.primary.light, 0.5),
                      }}
                    >
                      {email[0].toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "white",
                        wordBreak: "break-all",
                      }}
                    >
                      {email}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <PlayerProfileDialog
        open={profileDialogOpen}
        player={selectedPlayer}
        tournament={tournament}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default PlayersTab;
