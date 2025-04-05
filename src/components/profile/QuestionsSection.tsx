import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import HandicapField from "./HandicapField";
import ProfileTextField from "./ProfileTextField";
import ProfileQuestion from "./ProfileQuestion";
import { useStyles } from "../../styles/hooks/useStyles";

interface QuestionData {
  handicap: string;
  q1: string;
  q2: string;
  q3: string;
}

interface QuestionsSectionProps {
  editing: boolean;
  questions: QuestionData;
  handicapValue: number | null;
  handicapError: string;
  question1: string;
  question2: string;
  question3: string;
  onHandicapInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onQuestion1Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuestion2Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuestion3Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  editing,
  questions,
  handicapValue,
  handicapError,
  question1,
  question2,
  question3,
  onHandicapInputChange,
  onQuestion1Change,
  onQuestion2Change,
  onQuestion3Change,
  onSave,
}) => {
  const styles = useStyles();

  const sectionTitle = (
    <Typography
      variant="h5"
      sx={{
        ...styles.profileCard.sectionTitle,
        mt: 5,
        mb: 3,
      }}
    >
      Additional Information
    </Typography>
  );

  if (editing) {
    return (
      <>
        {sectionTitle}

        <HandicapField
          question={questions.handicap}
          value={handicapValue}
          error={handicapError}
          onInputChange={onHandicapInputChange}
        />

        <ProfileTextField
          label={questions.q1}
          value={question1}
          onChange={onQuestion1Change}
        />

        <ProfileTextField
          label={questions.q2}
          value={question2}
          onChange={onQuestion2Change}
        />

        <ProfileTextField
          label={questions.q3}
          value={question3}
          onChange={onQuestion3Change}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            startIcon={<SaveIcon />}
            size="large"
            sx={styles.profileCard.buttons.save}
          >
            Save Profile
          </Button>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ mt: 5 }}>
      {sectionTitle}
      <ProfileQuestion
        question={questions.handicap}
        answer={handicapValue}
        isLast={!(question2 || question3)}
      />

      <ProfileQuestion
        question={questions.q1}
        answer={question1}
        isLast={!(question2 || question3)}
      />

      <ProfileQuestion
        question={questions.q2}
        answer={question2}
        isLast={!question3}
      />
      <ProfileQuestion
        question={questions.q3}
        answer={question3}
        isLast={true}
      />
    </Box>
  );
};

export default QuestionsSection;
