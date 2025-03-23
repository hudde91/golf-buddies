// src/components/tournament/index.tsx
import React, { ReactNode } from "react";
import {
  Box,
  Typography,
  Card,
  CardActions,
  CardContent,
  Divider,
} from "@mui/material";
import { PrimaryButton } from "../../components/common/index";
import { useTournamentStyles } from "../../theme/hooks";

// Status chip component for tournaments
export const TournamentStatusChip: React.FC<{
  status: string;
  color?: string;
  sx?: object;
}> = ({ status, color, sx = {} }) => {
  const styles = useTournamentStyles();
  const chipColor = color || styles.getStatusColor(status);

  return (
    <Box
      sx={{
        ...styles.getStatusChip(status),
        ...(color && {
          color: chipColor,
          backgroundColor: `rgba(${chipColor}, 0.2)`,
        }),
        ...sx,
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Box>
  );
};

// Tournament card component
export const TournamentCard: React.FC<{
  name: string;
  status: string;
  statusColor: string;
  infoItems: ReactNode[];
  onView?: () => void;
  sx?: object;
}> = ({ name, status, statusColor, infoItems, onView, sx = {} }) => {
  const styles = useTournamentStyles();

  return (
    <Card
      sx={{
        ...styles.tournamentCard,
        ...sx,
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ mb: 1 }}>
          <TournamentStatusChip status={status} color={statusColor} />
        </Box>
        <Typography
          variant="h6"
          component="h3"
          sx={styles.tournamentTypography.title}
        >
          {name}
        </Typography>

        <Divider sx={styles.tournamentDivider} />

        <Box sx={{ mb: 1 }}>{infoItems}</Box>
      </CardContent>

      {onView && (
        <CardActions sx={{ p: 0, mt: "auto" }}>
          <PrimaryButton
            fullWidth
            onClick={onView}
            sx={{
              m: 1.5,
              textTransform: "none",
            }}
          >
            View Tournament
          </PrimaryButton>
        </CardActions>
      )}
    </Card>
  );
};

// Tournament info item with icon
export const TournamentInfoItem: React.FC<{
  icon: ReactNode;
  text: string;
  sx?: object;
}> = ({ icon, text, sx = {} }) => {
  const styles = useTournamentStyles();

  return (
    <Box sx={{ ...styles.infoItem, ...sx }}>
      {React.cloneElement(icon as React.ReactElement, {})}
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
};

// Leaderboard row component
export const LeaderboardRow: React.FC<{
  position: number;
  name: string;
  score: number | string;
  highlightWinner?: boolean;
  extraInfo?: ReactNode;
  sx?: object;
}> = ({
  position,
  name,
  score,
  highlightWinner = true,
  extraInfo,
  sx = {},
}) => {
  const styles = useTournamentStyles();
  const positionColor = styles.getPositionColor(position);

  return (
    <Box
      sx={{
        ...styles.getLeaderboardRowStyle(position, highlightWinner),
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontWeight: "bold",
            color: positionColor,
            width: 30,
            textAlign: "center",
          }}
        >
          {position}
        </Typography>
        <Typography
          sx={{
            color: "white",
            ml: 2,
          }}
        >
          {name}
        </Typography>
        {extraInfo}
      </Box>
      <Typography
        variant="body1"
        sx={{
          color: "white",
          fontWeight: "bold",
        }}
      >
        {score}
      </Typography>
    </Box>
  );
};
