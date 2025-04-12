import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Tournament } from "../../types/event";
import { useStyles } from "../../styles/hooks/useStyles";
import { getColorBasedOnStatus } from "../util";

interface TournamentHeaderProps {
  tournament: Tournament;
  isCreator: boolean;
  onDeleteTournament: () => void;
  onEditTournament: () => void;
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  tournament,
  isCreator,
  onDeleteTournament,
  onEditTournament,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={styles.headers.event.container}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
        }}
      >
        <Typography variant="h4" component="h1" sx={styles.headers.event.title}>
          {tournament.name}
        </Typography>

        <Chip
          label={
            tournament.status.charAt(0).toUpperCase() +
            tournament.status.slice(1)
          }
          color={getColorBasedOnStatus(tournament.status)}
          size={isMobile ? "small" : "medium"}
        />
      </Box>

      {isCreator && (
        <Box
          sx={{
            display: "flex",
            mt: { xs: 1, sm: 0 },
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" },
            gap: 1,
          }}
        >
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDeleteTournament}
            fullWidth={isSmall}
            size={isMobile ? "small" : "medium"}
            variant="outlined"
            sx={styles.button.danger}
          >
            Delete
          </Button>
          <Button
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEditTournament}
            fullWidth={isSmall}
            size={isMobile ? "small" : "medium"}
            sx={styles.button.primary}
          >
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TournamentHeader;
