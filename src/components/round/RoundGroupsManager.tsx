import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Dialog,
} from "@mui/material";
import {
  GroupAdd as GroupAddIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ChevronRight as ChevronRightIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { Round, Player, PlayerGroup } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import PlayerGroupManager from "../tournamentDetails/roundsTab/GroupPage/PlayerGroupManager";

interface RoundGroupsManagerProps {
  round: Round;
  players: Player[];
  isCreator: boolean;
  onManagePlayerGroups: (playerGroups: PlayerGroup[]) => void;
  onNavigateToGroup: (roundId: string, groupId: string) => void;
  onInvitePlayers: () => void;
}

const RoundGroupsManager: React.FC<RoundGroupsManagerProps> = ({
  round,
  players,
  isCreator,
  onManagePlayerGroups,
  onNavigateToGroup,
  onInvitePlayers,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const [groupManagementOpen, setGroupManagementOpen] = useState(false);

  // Get all player groups for the round
  const playerGroups = round.playerGroups || [];

  console.log("Player Groups: ", playerGroups);

  // Get players that are not in any group
  const ungroupedPlayers = players.filter(
    (player) =>
      !playerGroups.some((group) => group.playerIds.includes(player.id))
  );
  console.log("Player ungroupedPlayers: ", ungroupedPlayers);

  const handleSavePlayerGroups = (updatedGroups: PlayerGroup[]) => {
    onManagePlayerGroups(updatedGroups);
    setGroupManagementOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={styles.headers.section.title}>
          Player Groups
        </Typography>

        {isCreator && (
          <Button
            variant="outlined"
            startIcon={<GroupAddIcon />}
            onClick={() => setGroupManagementOpen(true)}
            fullWidth={isMobile}
            sx={styles.button.outlined}
          >
            Manage Groups
          </Button>
        )}
      </Box>

      {playerGroups.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: (theme) => alpha(theme.palette.common.black, 0.2),
            border: (theme) =>
              `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
            borderRadius: 2,
          }}
        >
          <GroupAddIcon
            sx={{
              fontSize: 48,
              color: (theme) => alpha(theme.palette.common.white, 0.3),
              mb: 1,
            }}
          />
          <Typography variant="subtitle1" sx={{ mb: 1, color: "white" }}>
            No Groups Created Yet
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: (theme) => alpha(theme.palette.common.white, 0.7),
            }}
          >
            Create groups to organize players for this round.
          </Typography>
          {isCreator && (
            <Button
              variant="outlined"
              startIcon={<GroupAddIcon />}
              onClick={() => setGroupManagementOpen(true)}
              sx={styles.button.outlined}
            >
              Create First Group
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {playerGroups.map((group) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={group.id}>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.3),
                  backdropFilter: "blur(10px)",
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: { sm: "translateY(-4px)" },
                    boxShadow: {
                      sm: (theme) =>
                        `0 8px 16px ${alpha(theme.palette.common.black, 0.3)}`,
                    },
                    bgcolor: (theme) => alpha(theme.palette.common.black, 0.4),
                  },
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => onNavigateToGroup(round.id, group.id)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {group.name}
                        <ChevronRightIcon
                          sx={{
                            ml: 0.5,
                            opacity: 0.7,
                            fontSize: "1.2rem",
                          }}
                        />
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: (theme) =>
                            alpha(theme.palette.common.white, 0.7),
                        }}
                      >
                        {group.playerIds.length} player
                        {group.playerIds.length !== 1 ? "s" : ""}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      {group.teeTime && (
                        <Chip
                          icon={<ScheduleIcon fontSize="small" />}
                          label={group.teeTime}
                          size="small"
                          sx={{
                            bgcolor: (theme) =>
                              alpha(theme.palette.info.main, 0.1),
                            color: (theme) => theme.palette.info.light,
                            borderRadius: "4px",
                            height: "24px",
                          }}
                        />
                      )}
                      {group.startingHole && (
                        <Chip
                          icon={<FlagIcon fontSize="small" />}
                          label={`Hole ${group.startingHole}`}
                          size="small"
                          sx={{
                            bgcolor: (theme) =>
                              alpha(theme.palette.success.main, 0.1),
                            color: (theme) => theme.palette.success.light,
                            borderRadius: "4px",
                            height: "24px",
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Divider
                    sx={{
                      my: 1.5,
                      borderColor: (theme) =>
                        alpha(theme.palette.common.white, 0.1),
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    {group.playerIds.map((playerId) => {
                      const player = players.find((p) => p.id === playerId);
                      if (!player) return null;

                      return (
                        <Chip
                          key={player.id}
                          avatar={
                            <Avatar src={player.avatarUrl} alt={player.name}>
                              {player.name[0].toUpperCase()}
                            </Avatar>
                          }
                          label={player.name}
                          size="small"
                          sx={{
                            bgcolor: (theme) =>
                              alpha(theme.palette.common.white, 0.1),
                            color: "white",
                            "& .MuiChip-avatar": {
                              width: 24,
                              height: 24,
                            },
                          }}
                        />
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* 
      {ungroupedPlayers.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              color: "white",
            }}
          >
            Ungrouped Players ({ungroupedPlayers.length})
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.common.black, 0.2),
              border: (theme) =>
                `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              overflow: "hidden",
            }}
          >
            <Grid container spacing={0}>
              {ungroupedPlayers.map((player) => (
                <Grid item xs={12} sm={6} md={4} key={player.id}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderBottom: (theme) =>
                        `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
                      borderRight: (theme) =>
                        `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.name}
                      sx={{
                        width: 36,
                        height: 36,
                        mr: 1.5,
                        border: (theme) =>
                          `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                      }}
                    >
                      {player.name[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "medium",
                          color: "white",
                        }}
                      >
                        {player.name}
                      </Typography>

                      {player.handicap !== undefined && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: (theme) =>
                              alpha(theme.palette.common.white, 0.7),
                          }}
                        >
                          Handicap: {player.handicap}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )} */}

      {/* <Dialog
        open={groupManagementOpen}
        onClose={() => setGroupManagementOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: styles.dialogs.paper }}
      >
        <PlayerGroupManager
          round={round}
          players={players}
          open={groupManagementOpen}
          onClose={() => setGroupManagementOpen(false)}
          onSave={handleSavePlayerGroups}
        />
      </Dialog> */}
    </Box>
  );
};

export default RoundGroupsManager;
