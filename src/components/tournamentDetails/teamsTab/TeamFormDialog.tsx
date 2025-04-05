import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Radio,
  SelectChangeEvent,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { Team, Player, TeamFormData } from "../../../types/event";
import { teamColors } from "../../../services/eventService";
import { useStyles } from "../../../styles/hooks/useStyles";

interface TeamFormDialogProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
  teamForm: TeamFormData;
  setTeamForm: React.Dispatch<React.SetStateAction<TeamFormData>>;
  selectedCaptain: string | null;
  setSelectedCaptain: React.Dispatch<React.SetStateAction<string | null>>;
  teamPlayers: Player[];
  onSubmit: () => void;
  isMobile: boolean;
}

const TeamFormDialog: React.FC<TeamFormDialogProps> = ({
  open,
  onClose,
  team,
  teamForm,
  setTeamForm,
  selectedCaptain,
  setSelectedCaptain,
  teamPlayers,
  onSubmit,
  isMobile,
}) => {
  const styles = useStyles();

  const handleTeamFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: styles.tournamentTeams.dialogPaper,
      }}
    >
      <DialogTitle sx={styles.tournamentTeams.dialogTitle}>
        {team ? "Edit Team" : "Add New Team"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Team Name"
            name="name"
            value={teamForm.name}
            onChange={handleTeamFormChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{
              style: styles.tournamentTeams.formField.label,
            }}
            InputProps={{
              style: styles.tournamentTeams.formField.input,
              sx: styles.tournamentTeams.formField.outline,
            }}
          />

          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={styles.tournamentTeams.teamName}
            >
              Team Color
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {teamColors.map((color) => (
                <Box
                  key={color}
                  onClick={() => setTeamForm((prev) => ({ ...prev, color }))}
                  sx={styles.tournamentTeams.getColorSwatch(
                    color,
                    teamForm.color === color
                  )}
                />
              ))}
            </Box>
          </Box>

          {team && teamPlayers.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={styles.tournamentTeams.teamName}
              >
                Team Captain
              </Typography>
              <List sx={styles.tournamentTeams.playersList}>
                {teamPlayers.map((player) => (
                  <ListItem
                    key={player.id}
                    button
                    onClick={() =>
                      setSelectedCaptain(
                        selectedCaptain === player.id ? null : player.id
                      )
                    }
                    sx={styles.tournamentTeams.getPlayerListItem(
                      selectedCaptain === player.id,
                      teamForm.color
                    )}
                  >
                    <ListItemAvatar>
                      <Avatar src={player.avatarUrl} alt={player.name}>
                        {player.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={styles.tournamentTeams.teamName}>
                          {player.name}
                        </Typography>
                      }
                    />
                    <Radio
                      checked={selectedCaptain === player.id}
                      onChange={() => {}}
                      icon={<StarBorderIcon />}
                      checkedIcon={<StarIcon />}
                      sx={styles.tournamentTeams.getCaptainIcon(
                        selectedCaptain === player.id,
                        teamForm.color
                      )}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box sx={styles.tournamentTeams.previewBox}>
            <Avatar sx={styles.tournamentTeams.getTeamAvatar(teamForm.color)}>
              {teamForm.name ? teamForm.name[0].toUpperCase() : "T"}
            </Avatar>
            <Typography variant="h6" sx={styles.tournamentTeams.teamName}>
              {teamForm.name || "Team Name"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.tournamentTeams.dialogActions}>
        <Button onClick={onClose} sx={styles.tournamentTeams.cancelButton}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={!teamForm.name.trim()}
          fullWidth={isMobile}
          sx={styles.tournamentTeams.submitButton}
        >
          {team ? "Update Team" : "Add Team"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamFormDialog;
