import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Typography,
  Box,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  Container,
  Button,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ImageIcon from "@mui/icons-material/Image";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import PersonIcon from "@mui/icons-material/Person";
import BackgroundService from "../services/backgroundService";
import SplashConfig from "../components/splashScreen/SplashConfig";

import { useStyles } from "../styles/hooks/useStyles";
import { tabs } from "../styles/components/tabs";

const Settings: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(); // Use the new styles hook
  const { user } = useUser();

  const [splashImage, setSplashImage] = useState<string>(
    "/splash-background.jpg"
  );
  const [splashText, setSplashText] = useState<string>("GolfBuddies");
  const [tabValue, setTabValue] = useState(0);

  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [customBackground, setCustomBackground] = useState<boolean>(false);
  const [uploadedBackground, setUploadedBackground] = useState<string | null>(
    null
  );
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<string>("");

  const backgroundPresets = BackgroundService.getPresets();

  useEffect(() => {
    const savedImage = localStorage.getItem("splashImage");
    const savedText = localStorage.getItem("splashText");

    if (savedImage) {
      setSplashImage(savedImage);
    }

    if (savedText) {
      setSplashText(savedText);
    }

    const bgSettings = BackgroundService.getBackgroundSettings();
    setCustomBackground(bgSettings.enabled);
    setBackgroundImage(bgSettings.image);
    setBackgroundPreviewUrl(bgSettings.image);
  }, []);

  const handleSplashConfigSave = (image: string, text: string) => {
    localStorage.setItem("splashImage", image);
    localStorage.setItem("splashText", text);

    setSplashImage(image);
    setSplashText(text);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackgroundUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedBackground(result);
        setBackgroundImage(result);
        setBackgroundPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundPresetSelect = (presetUrl: string) => {
    setBackgroundImage(presetUrl);
    setBackgroundPreviewUrl(presetUrl);
    setUploadedBackground(null);
  };

  const handleBackgroundToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomBackground(event.target.checked);

    BackgroundService.saveBackgroundSettings({
      enabled: event.target.checked,
      image: backgroundImage,
    });

    // Apply the background immediately
    if (event.target.checked) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#000";
    }
  };

  const handleSaveBackground = () => {
    BackgroundService.saveBackgroundSettings({
      enabled: customBackground,
      image: backgroundImage,
    });

    // Apply the background immediately
    if (customBackground) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
    }
  };

  return (
    <Box sx={styles.layout.page.withBackground}>
      <Container maxWidth="lg" sx={styles.layout.container.responsive}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={styles.text.heading.page}>
            Settings
          </Typography>
          <Typography sx={styles.text.subtitle.page}>
            Customize your application appearance and view account information
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={tabs.container(theme)}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            textColor="inherit"
          >
            <Tab
              label="Appearance"
              icon={<ColorLensIcon />}
              iconPosition="start"
            />
            <Tab label="Account" icon={<PersonIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Panel - Appearance */}
        <div
          role="tabpanel"
          hidden={tabValue !== 0}
          id="settings-tabpanel-0"
          aria-labelledby="settings-tab-0"
        >
          {tabValue === 0 && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {/* Splash Screen Section */}
              <Card sx={{ ...styles.card.glass, mb: 4 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={styles.text.heading.section}>
                      Splash Screen
                    </Typography>
                  </Box>
                  <Typography sx={styles.text.body.secondary}>
                    Customize the splash screen that appears when the
                    application starts.
                  </Typography>
                  <SplashConfig
                    onSave={handleSplashConfigSave}
                    currentImage={splashImage}
                    currentText={splashText}
                  />
                </CardContent>
              </Card>

              {/* App Background Section */}
              <Card sx={styles.card.glass}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={styles.text.heading.section}>
                      App Background
                    </Typography>
                  </Box>
                  <Typography sx={styles.text.body.secondary}>
                    Customize the background image of the application.
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={customBackground}
                        onChange={handleBackgroundToggle}
                        color="primary"
                      />
                    }
                    label="Enable custom background"
                    sx={{ color: "white", mb: 2 }}
                  />

                  {customBackground && (
                    <>
                      <Box sx={{ mt: 3, mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={styles.text.subtitle.section}
                        >
                          Background Preview
                        </Typography>
                        <Box
                          sx={{
                            width: "100%",
                            height: 150,
                            borderRadius: 1,
                            overflow: "hidden",
                            position: "relative",
                            backgroundImage: `url(${backgroundPreviewUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            mb: 2,
                            border: `1px solid ${alpha(
                              theme.palette.common.white,
                              0.2
                            )}`,
                          }}
                        />
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={styles.text.subtitle.section}
                        >
                          Choose a Background
                        </Typography>

                        <Grid container spacing={2}>
                          {backgroundPresets.map((preset) => (
                            <Grid item xs={6} sm={4} md={3} key={preset.id}>
                              <Card
                                sx={{
                                  backgroundColor: "transparent",
                                  border:
                                    backgroundImage === preset.preview
                                      ? `2px solid #30b3ff`
                                      : `1px solid ${alpha(
                                          theme.palette.common.white,
                                          0.1
                                        )}`,
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    border: `1px solid ${alpha(
                                      theme.palette.common.white,
                                      0.3
                                    )}`,
                                  },
                                }}
                              >
                                <CardActionArea
                                  onClick={() =>
                                    handleBackgroundPresetSelect(preset.preview)
                                  }
                                >
                                  <CardMedia
                                    component="img"
                                    height="80"
                                    image={preset.preview}
                                    alt={preset.name}
                                  />
                                  <CardContent
                                    sx={{
                                      py: 1,
                                      bgcolor: alpha(
                                        theme.palette.common.black,
                                        0.5
                                      ),
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      noWrap
                                      sx={styles.text.body.muted}
                                    >
                                      {preset.name}
                                    </Typography>
                                  </CardContent>
                                </CardActionArea>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={styles.text.subtitle.section}
                        >
                          Upload Custom Background
                        </Typography>

                        <Button
                          variant="outlined"
                          startIcon={<ImageIcon />}
                          sx={styles.button.outlined}
                        >
                          Upload Image
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleBackgroundUpload}
                          />
                        </Button>

                        <Typography
                          variant="body2"
                          sx={styles.text.body.muted}
                          style={{ marginTop: "0.5rem" }}
                        >
                          For best results, use a high-resolution image in
                          landscape orientation.
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          mt: 3,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={styles.button.primary}
                          onClick={handleSaveBackground}
                        >
                          Save Background Settings
                        </Button>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </div>

        {/* Tab Panel - Account */}
        <div
          role="tabpanel"
          hidden={tabValue !== 1}
          id="settings-tabpanel-1"
          aria-labelledby="settings-tab-1"
        >
          {tabValue === 1 && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Card sx={styles.card.glass}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={styles.text.heading.section}>
                      Account Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="subtitle2"
                        sx={styles.text.body.secondary}
                      >
                        Email Address
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1" sx={{ color: "white" }}>
                        {user?.primaryEmailAddress?.emailAddress}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={styles.divider.standard} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="subtitle2"
                        sx={styles.text.body.secondary}
                      >
                        User ID
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1" sx={{ color: "white" }}>
                        {user?.id}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={styles.divider.standard} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="subtitle2"
                        sx={styles.text.body.secondary}
                      >
                        Created
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1" sx={{ color: "white" }}>
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </div>
      </Container>
    </Box>
  );
};

export default Settings;
