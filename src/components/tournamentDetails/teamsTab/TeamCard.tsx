import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  GroupAdd as GroupAddIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Team, Player } from "../../../types/tournament";

interface TeamCardProps {
  team: Team;
  players: Player[];
  captain: Player | null;
  isCreator: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onManagePlayers: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  players,
  captain,
  isCreator,
  onEdit,
  onDelete,
  onManagePlayers,
}) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: `5px solid ${team.color}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: alpha(theme.palette.common.black, 0.3),
        backdropFilter: "blur(8px)",
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        borderRadius: 2,
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.3)}`,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: team.color, mr: 2 }}>
            {team.name[0].toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ color: "white" }}>
            {team.name}
          </Typography>
        </Box>

        <Divider
          sx={{
            my: 1,
            bgcolor: alpha(theme.palette.common.white, 0.1),
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
            }}
          >
            Players: {players.length}
          </Typography>

          {captain && (
            <Chip
              icon={<StarIcon sx={{ fontSize: "0.9rem" }} />}
              label={`Captain: ${captain.name}`}
              size="small"
              sx={{
                bgcolor: alpha(team.color, 0.2),
                color: "white",
                border: `1px solid ${alpha(team.color, 0.5)}`,
                "& .MuiChip-icon": {
                  color: team.color,
                },
              }}
            />
          )}
        </Box>

        {players.length > 0 ? (
          <List
            dense
            sx={{
              maxHeight: 200,
              overflow: "auto",
              bgcolor: alpha(theme.palette.common.black, 0.2),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            }}
          >
            {players.map((player) => (
              <ListItem key={player.id}>
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    badgeContent={
                      player.id === team.captain ? (
                        <StarIcon
                          sx={{
                            color: team.color,
                            bgcolor: alpha(theme.palette.common.black, 0.7),
                            borderRadius: "50%",
                            padding: "2px",
                            width: 16,
                            height: 16,
                          }}
                        />
                      ) : null
                    }
                  >
                    <Avatar src={player.avatarUrl} alt={player.name}>
                      {player.name[0].toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha(theme.palette.common.white, 0.9),
                        fontWeight: player.id === team.captain ? 700 : 400,
                      }}
                    >
                      {player.name}
                      {player.id === team.captain && (
                        <Typography
                          component="span"
                          sx={{
                            ml: 1,
                            fontSize: "0.75rem",
                            color: team.color,
                          }}
                        >
                          (Captain)
                        </Typography>
                      )}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            color={alpha(theme.palette.common.white, 0.7)}
          >
            No players assigned yet
          </Typography>
        )}
      </CardContent>
      {isCreator && (
        <CardActions
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            px: 2,
            py: 1.5,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button
            size="small"
            startIcon={<GroupAddIcon />}
            onClick={onManagePlayers}
            sx={{
              color: "white",
              borderColor: alpha(theme.palette.common.white, 0.3),
              "&:hover": {
                borderColor: "white",
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
            variant="outlined"
          >
            Manage Players
          </Button>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={onEdit}
            sx={{
              color: theme.palette.primary.light,
              borderColor: alpha(theme.palette.primary.light, 0.5),
              "&:hover": {
                borderColor: theme.palette.primary.light,
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
              },
            }}
            variant="outlined"
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            sx={{
              borderColor: alpha(theme.palette.error.light, 0.5),
              "&:hover": {
                borderColor: theme.palette.error.light,
                backgroundColor: alpha(theme.palette.error.light, 0.1),
              },
            }}
            variant="outlined"
          >
            Delete
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default TeamCard;
