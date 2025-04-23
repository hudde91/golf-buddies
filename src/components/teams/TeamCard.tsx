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
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  GroupAdd as GroupAddIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useStyles } from "../../styles";
import { Team, Player } from "../../types/event";

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
  const styles = useStyles();

  return (
    <Card
      variant="outlined"
      sx={styles.tournamentTeams.getTeamCard(team.color)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={styles.tournamentTeams.teamHeader}>
          <Avatar sx={styles.tournamentTeams.getTeamAvatar(team.color)}>
            {team.name[0].toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={styles.tournamentTeams.teamName}>
            {team.name}
          </Typography>
        </Box>

        <Divider sx={styles.tournamentTeams.teamDivider} />

        <Box sx={styles.tournamentTeams.teamInfoHeader}>
          <Typography
            variant="subtitle2"
            sx={styles.tournamentTeams.teamInfoText}
          >
            Players: {players.length}
          </Typography>

          {captain && (
            <Chip
              icon={<StarIcon sx={{ fontSize: "0.9rem" }} />}
              label={`Captain: ${captain.name}`}
              size="small"
              sx={styles.tournamentTeams.getCaptainChip(team.color)}
            />
          )}
        </Box>

        {players.length > 0 ? (
          <List dense sx={styles.tournamentTeams.playersList}>
            {players.map((player) => (
              <ListItem key={player.id} sx={styles.tournamentTeams.playerItem}>
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
                          sx={styles.tournamentTeams.getCaptainBadge(
                            team.color
                          )}
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
                      sx={styles.tournamentTeams.getPlayerName(
                        player.id === team.captain
                      )}
                    >
                      {player.name}
                      {player.id === team.captain && (
                        <Typography
                          component="span"
                          sx={styles.tournamentTeams.getCaptainLabel(
                            team.color
                          )}
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
          <Typography variant="body2" sx={styles.tournamentTeams.noPlayersText}>
            No players assigned yet
          </Typography>
        )}
      </CardContent>
      {isCreator && (
        <CardActions sx={styles.tournamentTeams.cardActions}>
          <Button
            size="small"
            startIcon={<GroupAddIcon />}
            onClick={onManagePlayers}
            sx={styles.tournamentTeams.managePlayersButton}
            variant="outlined"
          >
            Manage Players
          </Button>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={onEdit}
            sx={styles.tournamentTeams.editButton}
            variant="outlined"
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            sx={styles.tournamentTeams.deleteButton}
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
