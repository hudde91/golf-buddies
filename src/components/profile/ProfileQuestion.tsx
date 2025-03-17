// src/components/profile/ProfileQuestion.tsx
import React from "react";
import { Box, Typography, Divider, useTheme, alpha } from "@mui/material";

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
  const theme = useTheme();

  return (
    <Box sx={{ mb: isLast ? 3 : 4 }}>
      <Typography
        variant="subtitle1"
        sx={{
          color: theme.palette.primary.light,
          mb: 1,
          fontSize: "1.2rem",
          fontWeight: 600,
        }}
      >
        {question}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: alpha(theme.palette.common.white, 0.9),
          ml: 2,
          fontSize: "1.2rem",
          lineHeight: 1.6,
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
