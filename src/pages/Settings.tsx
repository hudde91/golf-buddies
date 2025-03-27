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
  alpha,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";
import BackgroundService from "../services/backgroundService";
import SplashConfig from "../components/splashScreen/SplashConfig";

import {
  PageContainer,
  GlassPanel,
  PageHeader,
  SectionHeader,
  PrimaryButton,
  OutlinedButton,
} from "../components/common";
import { useAppStyles, useResponsiveStyles } from "../theme/hooks";
import { TabPanel } from "../components/common/index";

const Settings: React.FC = () => {
  const theme = useTheme();
  const { user } = useUser();
  const styles = useAppStyles();
  const responsive = useResponsiveStyles();

  const [splashImage, setSplashImage] = useState<string>(
    "/splash-background.jpg"
  );
  const [splashText, setSplashText] = useState<string>("GolfTracks");
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
    <PageContainer>
      <PageHeader
        title="Settings"
        subtitle="Customize your application appearance and view account information"
      />

      <Box sx={styles.tabs}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="settings tabs"
          textColor="inherit"
          TabIndicatorProps={{
            style: { background: theme.palette.common.white },
          }}
        >
          <Tab
            label="Appearance"
            icon={<ColorLensIcon />}
            iconPosition="start"
            sx={{ color: "white" }}
          />
          <Tab
            label="Account"
            icon={<PersonIcon />}
            iconPosition="start"
            sx={{ color: "white" }}
          />
        </Tabs>
      </Box>

      <TabPanel id="settings" value={tabValue} index={0}>
        <GlassPanel sx={{ mb: 4 }}>
          <SectionHeader title="Splash Screen" />
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}
          >
            Customize the splash screen that appears when the application
            starts.
          </Typography>
          <SplashConfig
            onSave={handleSplashConfigSave}
            currentImage={splashImage}
            currentText={splashText}
          />
        </GlassPanel>

        <GlassPanel>
          <SectionHeader title="App Background" />
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}
          >
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
            sx={{ color: theme.palette.common.white, mb: 2 }}
          />

          {customBackground && (
            <>
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: "white" }}
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
                    border: `1px solid ${alpha("#ffffff", 0.2)}`,
                  }}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: "white" }}
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
                              : `1px solid rgba(255, 255, 255, 0.1)`,
                          transition: "all 0.2s",
                          "&:hover": {
                            border: `1px solid rgba(255, 255, 255, 0.3)`,
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
                            sx={{ py: 1, bgcolor: "rgba(0, 0, 0, 0.5)" }}
                          >
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ color: "white" }}
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
                  sx={{ color: "white" }}
                >
                  Upload Custom Background
                </Typography>

                <OutlinedButton startIcon={<ImageIcon />}>
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                  />
                </OutlinedButton>

                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}
                >
                  For best results, use a high-resolution image in landscape
                  orientation.
                </Typography>
              </Box>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <PrimaryButton onClick={handleSaveBackground}>
                  Save Background Settings
                </PrimaryButton>
              </Box>
            </>
          )}
        </GlassPanel>
      </TabPanel>

      <TabPanel id="settings" value={tabValue} index={1}>
        <GlassPanel>
          <SectionHeader title="Account Information" />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
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
              <Divider
                sx={{ my: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
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
              <Divider
                sx={{ my: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
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
        </GlassPanel>
      </TabPanel>
    </PageContainer>
  );
};

export default Settings;
