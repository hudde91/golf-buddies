import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import HandicapField from "./HandicapField";
import ProfileTextField from "./ProfileTextField";
import ProfileQuestion from "./ProfileQuestion";
import { useProfileStyles } from "../../theme/hooks";

interface QuestionData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

interface QuestionsSectionProps {
  editing: boolean;
  questions: QuestionData;
  handicapValue: number | null;
  handicapError: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  onHandicapChange: (event: Event, newValue: number | number[]) => void;
  onHandicapInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onQuestion2Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuestion3Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuestion4Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  question4,
  onHandicapChange,
  onHandicapInputChange,
  onQuestion2Change,
  onQuestion3Change,
  onQuestion4Change,
  onSave,
}) => {
  const styles = useProfileStyles();

  const sectionTitle = (
    <Typography
      variant="h5"
      sx={{
        ...styles.profileSectionTitle,
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

        {/* Handicap Question with Slider */}
        <HandicapField
          question={questions.q1}
          value={handicapValue}
          error={handicapError}
          onChange={onHandicapChange}
          onInputChange={onHandicapInputChange}
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

        <ProfileTextField
          label={questions.q4}
          value={question4}
          onChange={onQuestion4Change}
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
            sx={styles.profileButtons.save}
          >
            Save Profile
          </Button>
        </Box>
      </>
    );
  }

  if (!(question1 || question2 || question3 || question4)) {
    return null;
  }

  return (
    <Box sx={{ mt: 5 }}>
      {sectionTitle}

      {question1 && (
        <ProfileQuestion
          question={questions.q1}
          answer={question1}
          isLast={!(question2 || question3 || question4)}
        />
      )}

      {question2 && (
        <ProfileQuestion
          question={questions.q2}
          answer={question2}
          isLast={!(question3 || question4)}
        />
      )}

      {question3 && (
        <ProfileQuestion
          question={questions.q3}
          answer={question3}
          isLast={!question4}
        />
      )}

      {question4 && (
        <ProfileQuestion
          question={questions.q4}
          answer={question4}
          isLast={true}
        />
      )}
    </Box>
  );
};

export default QuestionsSection;
