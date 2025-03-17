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
  useTheme,
  alpha,
  SelectChangeEvent,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { Team, Player, TeamFormData } from "../../../types/tournament";
import { teamColors } from "../../../services/tournamentService";

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
  const theme = useTheme();

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
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.8),
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "white",
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
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
              style: { color: alpha(theme.palette.common.white, 0.7) },
            }}
            InputProps={{
              style: { color: "white" },
              sx: {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.common.white, 0.3),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.common.white, 0.5),
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />

          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "white" }}
            >
              Team Color
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {teamColors.map((color) => (
                <Box
                  key={color}
                  onClick={() => setTeamForm((prev) => ({ ...prev, color }))}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: color,
                    cursor: "pointer",
                    border:
                      teamForm.color === color
                        ? "3px solid white"
                        : "3px solid transparent",
                    "&:hover": {
                      opacity: 0.8,
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Captain Selection */}
          {team && teamPlayers.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "white" }}
              >
                Team Captain
              </Typography>
              <List
                sx={{
                  bgcolor: alpha(theme.palette.common.black, 0.2),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                }}
              >
                {teamPlayers.map((player) => (
                  <ListItem
                    key={player.id}
                    button
                    onClick={() =>
                      setSelectedCaptain(
                        selectedCaptain === player.id ? null : player.id
                      )
                    }
                    sx={{
                      borderBottom: `1px solid ${alpha(
                        theme.palette.common.white,
                        0.05
                      )}`,
                      "&:last-child": {
                        borderBottom: "none",
                      },
                      backgroundColor:
                        selectedCaptain === player.id
                          ? alpha(teamForm.color, 0.2)
                          : "transparent",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={player.avatarUrl} alt={player.name}>
                        {player.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white" }}>
                          {player.name}
                        </Typography>
                      }
                    />
                    <Radio
                      checked={selectedCaptain === player.id}
                      onChange={() => {}}
                      icon={<StarBorderIcon />}
                      checkedIcon={<StarIcon />}
                      sx={{
                        color: alpha(theme.palette.common.white, 0.5),
                        "&.Mui-checked": {
                          color: teamForm.color,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box
            sx={{
              mt: 3,
              p: 2,
              border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.common.black, 0.2),
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: teamForm.color, mr: 2 }}>
              {teamForm.name ? teamForm.name[0].toUpperCase() : "T"}
            </Avatar>
            <Typography variant="h6" sx={{ color: "white" }}>
              {teamForm.name || "Team Name"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          px: 3,
          py: 2,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "stretch",
          "& > button": {
            m: { xs: 0.5, sm: 0 },
          },
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: alpha(theme.palette.common.white, 0.9),
            order: { xs: 2, sm: 1 },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={!teamForm.name.trim()}
          fullWidth={isMobile}
          sx={{
            order: { xs: 1, sm: 2 },
          }}
        >
          {team ? "Update Team" : "Add Team"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamFormDialog;
