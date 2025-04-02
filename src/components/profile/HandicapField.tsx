import React from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  FormHelperText,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useProfileStyles } from "../../theme/hooks";

interface HandicapFieldProps {
  question: string;
  value: number | null;
  error: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const HandicapField: React.FC<HandicapFieldProps> = ({
  question,
  value,
  error,
  onInputChange,
}) => {
  const styles = useProfileStyles();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle1" sx={styles.profileTypography.subtitle}>
          {question}
        </Typography>
        <Tooltip title="A golf handicap is a numerical measure of a golfer's potential ability. Lower numbers indicate better players (scratch golfers have 0). Beginners typically have handicaps between 20-30.">
          <IconButton
            size="small"
            sx={{ ml: 1, color: styles.profileTypography.muted.color }}
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          value={value !== null ? value : ""}
          onChange={onInputChange}
          variant="outlined"
          size="small"
          type="number"
          inputProps={{
            min: -10,
            max: 54,
            step: 0.1,
            style: { color: "white", fontSize: "1.1rem", textAlign: "center" },
          }}
          error={!!error}
          helperText={error}
          sx={{
            width: "100px",
            ...styles.formField,
          }}
        />
      </Box>
      <FormHelperText sx={styles.profileTypography.muted}>
        Pro golfers can have negative handicaps. Beginners usually start around
        20-30.
      </FormHelperText>
    </Box>
  );
};

export default HandicapField;
