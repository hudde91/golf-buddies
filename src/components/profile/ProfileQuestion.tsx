// src/components/profile/ProfileQuestion.tsx
import React from "react";
import { Box, Typography, Divider, alpha, useTheme } from "@mui/material";
import { useProfileStyles } from "../../theme/hooks";

interface ProfileQuestionProps {
  question: string;
  answer: string;
  isLast?: boolean;
}

const ProfileQuestion: React.FC<ProfileQuestionProps> = ({
  question,
  answer,
  isLast = false,
}) => {
  const styles = useProfileStyles();
  const theme = useTheme();

  return (
    <Box sx={{ mb: isLast ? 3 : 4 }}>
      <Typography variant="subtitle1" sx={styles.profileTypography.subtitle}>
        {question}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          ...styles.profileTypography.body,
          ml: 2,
        }}
      >
        {answer}
      </Typography>
      {!isLast && (
        <Divider
          sx={{
            mt: 2,
            backgroundColor: alpha(theme.palette.common.white, 0.1),
          }}
        />
      )}
    </Box>
  );
};

export default ProfileQuestion;
