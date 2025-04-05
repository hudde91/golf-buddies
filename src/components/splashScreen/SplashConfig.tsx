import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Tab,
  Tabs,
  alpha,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import splashService, { SplashPreset } from "../../services/splashService";
import { useStyles } from "../../styles/hooks/useStyles";
import { useTheme } from "@mui/material/styles";
import { colors } from "../../styles";

interface SplashConfigProps {
  onSave: (image: string, text: string) => void;
  currentImage: string;
  currentText: string;
}

const SplashConfig: React.FC<SplashConfigProps> = ({
  onSave,
  currentImage,
  currentText,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(currentImage);
  const [text, setText] = useState(currentText);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const presets = splashService.getPresets();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset to current values
    setImage(currentImage);
    setText(currentText);
    setPreviewImage(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: SplashPreset) => {
    setImage(preset.preview);
    setPreviewImage(preset.preview);
  };

  const handleSave = () => {
    onSave(image, text);
    setOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ImageIcon />}
        onClick={handleOpen}
        sx={styles.button.outlined}
      >
        Configure Splash Screen
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: styles.dialogs.paper,
        }}
      >
        <DialogTitle sx={styles.dialogs.title}>
          Configure Splash Screen
        </DialogTitle>
        <DialogContent sx={styles.dialogs.content}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={styles.text.subtitle.section}
            >
              Splash Screen Preview
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 200,
                borderRadius: 1,
                overflow: "hidden",
                position: "relative",
                backgroundImage: `url(${previewImage || currentImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                mb: 2,
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: colors.background.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" sx={styles.text.heading.card}>
                  {text}
                </Typography>
              </Box>
            </Box>
          </Box>

          <TextField
            label="Logo Text"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            margin="normal"
            sx={styles.inputs.formField}
          />

          <Box sx={styles.tabs.container}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="splash screen configuration tabs"
              textColor="inherit"
            >
              <Tab label="Choose From Presets" />
              <Tab label="Upload Custom Image" />
            </Tabs>
          </Box>

          {/* Tab Panel - Presets */}
          <div
            role="tabpanel"
            hidden={tabValue !== 0}
            id="splash-tabpanel-0"
            aria-labelledby="splash-tab-0"
          >
            {tabValue === 0 && (
              <Box sx={styles.tabs.panel}>
                <Grid container spacing={2}>
                  {presets.map((preset) => (
                    <Grid item xs={12} sm={6} md={4} key={preset.id}>
                      <Card
                        sx={{
                          backgroundColor: "transparent",
                          border:
                            image === preset.preview
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
                          onClick={() => handlePresetSelect(preset)}
                        >
                          <CardMedia
                            component="img"
                            height="140"
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
                              sx={styles.text.body.primary}
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
            )}
          </div>

          {/* Tab Panel - Upload */}
          <div
            role="tabpanel"
            hidden={tabValue !== 1}
            id="splash-tabpanel-1"
            aria-labelledby="splash-tab-1"
          >
            {tabValue === 1 && (
              <Box sx={styles.tabs.panel}>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    sx={styles.button.outlined}
                  >
                    Upload Custom Background Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  <Typography
                    variant="body2"
                    sx={styles.text.body.muted}
                    style={{ marginTop: "1rem" }}
                  >
                    For best results, use an image with a 16:9 aspect ratio and
                    a minimum resolution of 1920x1080 pixels.
                  </Typography>
                </Box>
              </Box>
            )}
          </div>
        </DialogContent>
        <DialogActions sx={styles.dialogs.actions}>
          <Button onClick={handleClose} sx={styles.button.cancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={styles.button.primary}
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SplashConfig;
