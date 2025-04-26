import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  GolfCourse as GolfIcon,
  GolfCourseRounded as SportsGolf,
  SportsBar as BeerIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useStyles } from "../../styles";
import { Player, Event } from "../../types/event";
import ProfileInfoItem from "./ProfileInfoItem";

interface PlayerProfileDialogProps {
  open: boolean;
  player: Player | null;
  event: Event;
  onClose: () => void;
}

const PlayerProfileDialog: React.FC<PlayerProfileDialogProps> = ({
  open,
  player,
  event,
  onClose,
}) => {
  const styles = useStyles();

  if (!player) return null;

  const playerTeam = (event.teams || []).find(
    (team) => player.teamId && team.id === player.teamId
  );

  const isCaptain = (event.teams || []).some(
    (team) => team.captain === player.id
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: styles.dialogs.paper,
      }}
    >
      <DialogTitle sx={{ color: "white", pr: 6 }}>
        Player Profile
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={styles.tournamentPlayers.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ...styles.tournamentPlayers.profileDivider,
          }}
        >
          <Avatar
            src={player.avatarUrl}
            alt={player.name}
            sx={styles.tournamentPlayers.getProfileAvatar(playerTeam?.color)}
          />
          <Box>
            <Typography
              variant="h5"
              sx={styles.tournamentPlayers.playerTypography.profileTitle}
            >
              {player.name}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {player.id === event.createdBy && (
                <Chip label="Creator" size="small" color="primary" />
              )}

              {playerTeam && (
                <Chip
                  size="small"
                  label={playerTeam.name}
                  sx={styles.tournamentPlayers.chips.getTeamChip(
                    playerTeam.color
                  )}
                />
              )}

              {isCaptain && playerTeam && (
                <Chip
                  size="small"
                  icon={<GolfIcon style={{ color: playerTeam.color }} />}
                  label="Team Captain"
                  sx={styles.tournamentPlayers.chips.getCaptainChip(
                    playerTeam.color
                  )}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Bio Section */}
        {player.bio && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={styles.tournamentPlayers.playerTypography.sectionTitle}
            >
              About
            </Typography>
            <Typography
              variant="body1"
              sx={styles.tournamentPlayers.playerTypography.bio}
            >
              {player.bio}
            </Typography>
          </Box>
        )}

        {/* Golf Details */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={styles.tournamentPlayers.playerTypography.sectionTitle}
          >
            Golf Profile
          </Typography>

          {/* Handicap */}
          {player.question1 && (
            <ProfileInfoItem
              icon={<GolfIcon />}
              title="Handicap"
              value={player.question1}
              color="#90caf9"
            />
          )}

          {/* Favorite Club */}
          {player.question2 && (
            <ProfileInfoItem
              icon={<SportsGolf />}
              title="Favorite Club"
              value={player.question2}
              color="#ce93d8"
            />
          )}

          {/* Beers Per Round */}
          {player.question3 && (
            <ProfileInfoItem
              icon={<BeerIcon />}
              title="Beers Per Round"
              value={player.question3}
              color="#ffb74d"
            />
          )}

          {/* Favorite Memory */}
          {player.question4 && (
            <ProfileInfoItem
              icon={<TrophyIcon />}
              title="Favorite Golf Memory"
              value={player.question4}
              color="#81c784"
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={styles.tournamentPlayers.dialogActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={styles.tournamentPlayers.buttons.close}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerProfileDialog;
