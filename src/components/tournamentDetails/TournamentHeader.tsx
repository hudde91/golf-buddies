import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Tournament } from "../../types/tournament";

interface TournamentHeaderProps {
  tournament: Tournament;
  isCreator: boolean;
  onBackClick: () => void;
  onDeleteTournament: () => void;
  onEditTournament: () => void;
}

const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  tournament,
  isCreator,
  onBackClick,
  onDeleteTournament,
  onEditTournament,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "upcoming":
        return "primary";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        mb: 3,
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 },
      }}
    >
      <IconButton
        onClick={onBackClick}
        sx={{
          mr: 2,
          color: "white",
          bgcolor: alpha(theme.palette.common.white, 0.1),
          "&:hover": {
            bgcolor: alpha(theme.palette.common.white, 0.2),
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: "white",
            mr: 2,
          }}
        >
          {tournament.name}
        </Typography>

        <Chip
          label={
            tournament.status.charAt(0).toUpperCase() +
            tournament.status.slice(1)
          }
          color={getStatusColor(tournament.status)}
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
            sx={{
              color: theme.palette.error.light,
              borderColor: alpha(theme.palette.error.light, 0.5),
              "&:hover": {
                borderColor: theme.palette.error.light,
                backgroundColor: alpha(theme.palette.error.light, 0.1),
              },
            }}
          >
            Delete
          </Button>
          <Button
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEditTournament}
            fullWidth={isSmall}
            size={isMobile ? "small" : "medium"}
          >
            Edit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TournamentHeader;
