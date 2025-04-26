import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ChevronRight as ChevronRightIcon,
  GolfCourse as GolfCourseIcon,
} from "@mui/icons-material";
import { useStyles } from "../../styles/hooks/useStyles";
import { Player, PlayerGroup, Round } from "../../types/event";
import PlayerGroupManager from "./PlayerGroupManager";

interface RoundGroupsProps {
  round: Round;
  players: Player[];
  isCreator?: boolean;
  onUpdatePlayerGroups: (playerGroups: PlayerGroup[]) => void;
  onNavigateToGroup: (roundId: string, groupId: string) => void;
}

const RoundGroups: React.FC<RoundGroupsProps> = ({
  round,
  players,
  isCreator = false,
  onUpdatePlayerGroups,
  onNavigateToGroup,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const [groupManagementOpen, setGroupManagementOpen] = useState(false);

  // Get all player groups for the round
  const playerGroups = round.playerGroups || [];

  // Get players that are not in any group
  const ungroupedPlayers = players.filter(
    (player) =>
      !playerGroups.some((group) => group.playerIds.includes(player.id))
  );

  const handleSavePlayerGroups = (updatedGroups: PlayerGroup[]) => {
    onUpdatePlayerGroups(updatedGroups);
    setGroupManagementOpen(false);
  };

  return (
    <Box sx={{ mb: 3, mt: 2 }}>
      {isCreator && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GroupsIcon />}
            onClick={() => setGroupManagementOpen(true)}
            sx={styles.button.outlined}
          >
            Manage Groups
          </Button>
        </Box>
      )}

      {playerGroups.length === 0 ? (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: (theme) => alpha(theme.palette.common.black, 0.2),
            border: (theme) =>
              `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
            borderRadius: 2,
          }}
        >
          <GroupsIcon
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
              startIcon={<GroupsIcon />}
              onClick={() => setGroupManagementOpen(true)}
              sx={styles.button.outlined}
            >
              Create First Group
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {playerGroups.map((group) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={group.id}>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: alpha(theme.palette.common.black, 0.3),
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: { sm: "translateY(-4px)" },
                    boxShadow: (theme) =>
                      `0 8px 16px ${alpha(theme.palette.common.black, 0.3)}`,
                    bgcolor: alpha(theme.palette.common.black, 0.4),
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
                          color: alpha(theme.palette.common.white, 0.7),
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
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.light,
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
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.light,
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
                      borderColor: alpha(theme.palette.common.white, 0.1),
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
                              {player.name ? player.name[0].toUpperCase() : "P"}
                            </Avatar>
                          }
                          label={player.name}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.common.white, 0.1),
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

      {/* Ungrouped players section */}
      {ungroupedPlayers.length > 0 && (
        <Box sx={{ mt: 3 }}>
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

          <Grid
            container
            spacing={0}
            sx={{
              borderRadius: 2,
              bgcolor: alpha(theme.palette.common.black, 0.2),
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              overflow: "hidden",
            }}
          >
            {ungroupedPlayers.map((player) => (
              <Grid item xs={12} sm={6} md={4} key={player.id}>
                <Box
                  sx={{
                    p: 1.5,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.common.white,
                      0.05
                    )}`,
                    borderRight: `1px solid ${alpha(
                      theme.palette.common.white,
                      0.05
                    )}`,
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
                      border: `1px solid ${alpha(
                        theme.palette.common.white,
                        0.2
                      )}`,
                    }}
                  >
                    {player.name ? player.name[0].toUpperCase() : "P"}
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
                          color: alpha(theme.palette.common.white, 0.7),
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <GolfCourseIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        Handicap: {player.handicap}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Player Group Management Dialog */}
      <PlayerGroupManager
        round={round}
        players={players}
        open={groupManagementOpen}
        onClose={() => setGroupManagementOpen(false)}
        onSave={handleSavePlayerGroups}
      />
    </Box>
  );
};

export default RoundGroups;
