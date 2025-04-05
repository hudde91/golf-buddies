import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useStyles } from "../../styles/hooks/useStyles";

interface ProfileQuestionProps {
  question: string;
  answer: string | number | null;
  isLast?: boolean;
}

const ProfileQuestion: React.FC<ProfileQuestionProps> = ({
  question,
  answer,
  isLast = false,
}) => {
  const styles = useStyles();

  return (
    <Box sx={{ mb: isLast ? 3 : 4 }}>
      <Typography
        variant="subtitle1"
        sx={styles.profileCard.typography.subtitle}
      >
        {question}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          ...styles.profileCard.typography.body,
          ml: 2,
        }}
      >
        {answer}
      </Typography>
      {!isLast && <Divider sx={styles.divider.standard} />}
    </Box>
  );
};

export default ProfileQuestion;
