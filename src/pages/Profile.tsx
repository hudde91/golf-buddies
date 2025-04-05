import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Box,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  Typography,
} from "@mui/material";
import profileService from "../services/profileService";
import { UserProfile, Achievement } from "../types";
import ProfileHeader from "../components/profile/ProfileHeader";
import BioSection from "../components/profile/BioSection";
import QuestionsSection from "../components/profile/QuestionsSection";
import AchievementsSection from "../components/profile/AchievementsSection";
import { colors } from "../styles";

const Profile: React.FC = () => {
  const { user } = useUser();
  const theme = useTheme();

  const [editing, setEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const [profileImage, setProfileImage] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [question1, setQuestion1] = useState<string>("");
  const [handicapValue, setHandicapValue] = useState<number | null>(null);
  const [handicapError, setHandicapError] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");
  const [question3, setQuestion3] = useState<string>("");

  const questions = {
    handicap: "What is your handicap?",
    q1: "Which is your favorite club?",
    q2: "How many beers do you drink a round?",
    q3: "What is your best golf memory?",
  };

  useEffect(() => {
    if (!user?.id) return;

    const userData = profileService.getProfile(user.id);
    setBio(userData.bio || "");

    // Use profile image from service or fall back to Clerk image
    setProfileImage(userData.profileImage || user.imageUrl || "");

    setHandicapValue(userData.handicap);

    setQuestion1(userData.question1 || "");
    setQuestion2(userData.question2 || "");
    setQuestion3(userData.question3 || "");

    setAchievements(userData.achievements || []);

    setIsLoading(false);
  }, [user?.id, user?.imageUrl]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handleHandicapInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    const numValue = parseFloat(value);

    if (!isNaN(numValue) && numValue >= -10 && numValue <= 54) {
      setHandicapValue(numValue);
    }
  };

  const handleQuestion1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion1(e.target.value);
  };

  const handleQuestion2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion2(e.target.value);
  };

  const handleQuestion3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion3(e.target.value);
  };

  const handleSave = () => {
    if (!user?.id) return;

    if (editing && handicapValue === null) {
      setHandicapError("Please enter your handicap");
      return;
    }

    const updatedProfile: Partial<UserProfile> = {
      bio,
      question1: handicapValue !== null ? handicapValue.toString() : "",
      question2,
      question3,
      achievements: achievements, // Make sure we preserve achievements when saving
    };

    if (uploadedImage) {
      updatedProfile.profileImage = uploadedImage;
      setProfileImage(uploadedImage);
    }

    profileService.saveProfile(user.id, updatedProfile);
    setEditing(false);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          background: colors.background.main,
          minHeight: "calc(100vh - 64px)",
          pt: 4,
          pb: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                background: alpha(theme.palette.common.black, 0.3),
                backdropFilter: "blur(10px)",
                padding: 3,
                borderRadius: 2,
              }}
            >
              <Typography sx={{ color: "white", fontSize: "1.2rem" }}>
                Loading profile...
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: colors.background.main,
        minHeight: "calc(100vh - 64px)",
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.common.black, 0.3),
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
        >
          <ProfileHeader
            fullName={user?.fullName || ""}
            email={user?.primaryEmailAddress?.emailAddress || ""}
            profileImage={profileImage}
            uploadedImage={uploadedImage}
            editing={editing}
            onEditToggle={handleEditToggle}
            onImageUpload={handleImageUpload}
          />

          <BioSection
            bio={bio}
            editing={editing}
            onBioChange={handleBioChange}
          />

          <QuestionsSection
            editing={editing}
            questions={questions}
            handicapValue={handicapValue}
            handicapError={handicapError}
            question1={question1}
            question2={question2}
            question3={question3}
            onHandicapInputChange={handleHandicapInputChange}
            onQuestion1Change={handleQuestion1Change}
            onQuestion2Change={handleQuestion2Change}
            onQuestion3Change={handleQuestion3Change}
            onSave={handleSave}
          />

          <AchievementsSection achievements={achievements} />
        </Box>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%", fontSize: "1.1rem" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
