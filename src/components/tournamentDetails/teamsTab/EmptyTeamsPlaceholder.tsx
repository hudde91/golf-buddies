import React from "react";
import { Box, Typography, Button, useTheme, alpha } from "@mui/material";
import { Add as AddIcon, GroupAdd as GroupAddIcon } from "@mui/icons-material";

interface EmptyTeamsPlaceholderProps {
  isCreator: boolean;
  onCreateTeam: () => void;
}

const EmptyTeamsPlaceholder: React.FC<EmptyTeamsPlaceholderProps> = ({
  isCreator,
  onCreateTeam,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        backgroundColor: alpha(theme.palette.common.black, 0.2),
        borderRadius: 2,
        border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
      }}
    >
      <GroupAddIcon
        sx={{
          fontSize: 60,
          color: alpha(theme.palette.common.white, 0.3),
          mb: 2,
        }}
      />
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        No Teams Created Yet
      </Typography>
      <Typography
        variant="body2"
        color={alpha(theme.palette.common.white, 0.7)}
        paragraph
        sx={{ maxWidth: 500, mx: "auto" }}
      >
        Create teams to track team scores in this tournament.
      </Typography>
      {isCreator && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateTeam}
        >
          Create First Team
        </Button>
      )}
    </Box>
  );
};

export default EmptyTeamsPlaceholder;
