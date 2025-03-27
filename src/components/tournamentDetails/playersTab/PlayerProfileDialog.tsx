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
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  GolfCourse as GolfIcon,
  GolfCourseRounded as SportsGolf,
  SportsBar as BeerIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { Tournament, Player } from "../../../types/event";
import ProfileInfoItem from "./ProfileInfoItem";
import { useTournamentPlayerStyles } from "../../../theme/hooks";

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
  const styles = useTournamentPlayerStyles();

  if (!player) return null;

  const playerTeam = tournament.teams.find(
    (team) => player.teamId && team.id === player.teamId
  );

  const isCaptain = tournament.teams.some((team) => team.captain === player.id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: styles.profileDialog,
      }}
    >
      <DialogTitle sx={{ color: "white", pr: 6 }}>
        Player Profile
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={styles.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ...styles.profileDivider,
          }}
        >
          <Avatar
            src={player.avatarUrl}
            alt={player.name}
            sx={styles.getProfileAvatar(playerTeam?.color)}
          />
          <Box>
            <Typography variant="h5" sx={styles.playerTypography.profileTitle}>
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
                  sx={styles.chips.getTeamChip(playerTeam.color)}
                />
              )}

              {isCaptain && playerTeam && (
                <Chip
                  size="small"
                  icon={<GolfIcon style={{ color: playerTeam.color }} />}
                  label="Team Captain"
                  sx={styles.chips.getCaptainChip(playerTeam.color)}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Bio Section */}
        {player.bio && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={styles.playerTypography.sectionTitle}>
              About
            </Typography>
            <Typography variant="body1" sx={styles.playerTypography.bio}>
              {player.bio}
            </Typography>
          </Box>
        )}

        {/* Golf Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={styles.playerTypography.sectionTitle}>
            Golf Profile
          </Typography>

          {/* Handicap */}
          {player.question1 && (
            <ProfileInfoItem
              icon={<GolfIcon />}
              title="Handicap"
              value={player.question1}
              color="#90caf9" // primary.light equivalent
            />
          )}

          {/* Favorite Club */}
          {player.question2 && (
            <ProfileInfoItem
              icon={<SportsGolf />}
              title="Favorite Club"
              value={player.question2}
              color="#ce93d8" // secondary.light equivalent
            />
          )}

          {/* Beers Per Round */}
          {player.question3 && (
            <ProfileInfoItem
              icon={<BeerIcon />}
              title="Beers Per Round"
              value={player.question3}
              color="#ffb74d" // warning.light equivalent
            />
          )}

          {/* Favorite Memory */}
          {player.question4 && (
            <ProfileInfoItem
              icon={<TrophyIcon />}
              title="Favorite Golf Memory"
              value={player.question4}
              color="#81c784" // success.light equivalent
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" sx={styles.buttons.close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerProfileDialog;
