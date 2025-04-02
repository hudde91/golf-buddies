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
import { useTournamentTeamStyles } from "../../../theme/hooks";

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
  const styles = useTournamentTeamStyles();

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
        sx: styles.dialogPaper,
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
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
              style: styles.formField.label,
            }}
            InputProps={{
              style: styles.formField.input,
              sx: styles.formField.outline,
            }}
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={styles.teamName}>
              Team Color
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {teamColors.map((color) => (
                <Box
                  key={color}
                  onClick={() => setTeamForm((prev) => ({ ...prev, color }))}
                  sx={styles.getColorSwatch(color, teamForm.color === color)}
                />
              ))}
            </Box>
          </Box>

          {team && teamPlayers.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={styles.teamName}>
                Team Captain
              </Typography>
              <List sx={styles.playersList}>
                {teamPlayers.map((player) => (
                  <ListItem
                    key={player.id}
                    button
                    onClick={() =>
                      setSelectedCaptain(
                        selectedCaptain === player.id ? null : player.id
                      )
                    }
                    sx={styles.getPlayerListItem(
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
                        <Typography sx={styles.teamName}>
                          {player.name}
                        </Typography>
                      }
                    />
                    <Radio
                      checked={selectedCaptain === player.id}
                      onChange={() => {}}
                      icon={<StarBorderIcon />}
                      checkedIcon={<StarIcon />}
                      sx={styles.getCaptainIcon(
                        selectedCaptain === player.id,
                        teamForm.color
                      )}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box sx={styles.previewBox}>
            <Avatar sx={styles.getTeamAvatar(teamForm.color)}>
              {teamForm.name ? teamForm.name[0].toUpperCase() : "T"}
            </Avatar>
            <Typography variant="h6" sx={styles.teamName}>
              {teamForm.name || "Team Name"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} sx={styles.cancelButton}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={!teamForm.name.trim()}
          fullWidth={isMobile}
          sx={styles.submitButton}
        >
          {team ? "Update Team" : "Add Team"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamFormDialog;
