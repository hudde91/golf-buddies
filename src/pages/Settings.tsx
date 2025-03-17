// src/pages/Settings.tsx
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Container,
  Typography,
  Box,
  Divider,
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
  Paper,
} from "@mui/material";
import SplashConfig from "../components//splashScreen/SplashConfig";
import ImageIcon from "@mui/icons-material/Image";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import PersonIcon from "@mui/icons-material/Person";
import BackgroundService from "../services/backgroundService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const { user } = useUser();
  const theme = useTheme();
  const [splashImage, setSplashImage] = useState<string>(
    "/splash-background.jpg"
  );
  const [splashText, setSplashText] = useState<string>("GolfTracks");
  const [tabValue, setTabValue] = useState(0);

  // Background image settings
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [customBackground, setCustomBackground] = useState<boolean>(false);
  const [uploadedBackground, setUploadedBackground] = useState<string | null>(
    null
  );
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<string>("");

  const backgroundPresets = BackgroundService.getPresets();

  useEffect(() => {
    // Load splash screen settings from local storage
    const savedImage = localStorage.getItem("splashImage");
    const savedText = localStorage.getItem("splashText");

    if (savedImage) {
      setSplashImage(savedImage);
    }

    if (savedText) {
      setSplashText(savedText);
    }

    // Load background settings
    const bgSettings = BackgroundService.getBackgroundSettings();
    setCustomBackground(bgSettings.enabled);
    setBackgroundImage(bgSettings.image);
    setBackgroundPreviewUrl(bgSettings.image);
  }, []);

  const handleSplashConfigSave = (image: string, text: string) => {
    // Save splash screen settings to local storage
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

    // Save the setting
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
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
        minHeight: "calc(100vh - 64px)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            color: "white",
            mb: 4,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            Settings
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Customize your application appearance and view account information
          </Typography>
        </Box>

        <Box
          sx={{
            borderBottom: 1,
            borderColor: alpha(theme.palette.common.white, 0.2),
            mb: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            textColor="inherit"
            TabIndicatorProps={{
              style: { background: "white" },
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

        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.common.black, 0.3),
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              p: 3,
              mb: 4,
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Splash Screen
            </Typography>

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
          </Box>

          <Box
            sx={{
              backgroundColor: alpha(theme.palette.common.black, 0.3),
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              p: 3,
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              App Background
            </Typography>

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
              sx={{ color: "white", mb: 2 }}
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
                                ? `2px solid ${theme.palette.primary.main}`
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
                                bgcolor: alpha(theme.palette.common.black, 0.5),
                              }}
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

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    sx={{
                      color: "white",
                      borderColor: alpha(theme.palette.common.white, 0.5),
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
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
                    sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}
                  >
                    For best results, use a high-resolution image in landscape
                    orientation.
                  </Typography>
                </Box>

                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveBackground}
                  >
                    Save Background Settings
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.common.black, 0.3),
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              p: 3,
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "white", mb: 3 }}
            >
              Account Information
            </Typography>

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
                  sx={{
                    my: 1,
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }}
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
                  sx={{
                    my: 1,
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }}
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
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default Settings;
