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
  useTheme,
  alpha,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import splashService, { SplashPreset } from "../../services/splashService";
import { TabPanel } from "../common/index";
import { colors } from "../../theme/theme";

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
        sx={{
          mt: 2,
          color: "white",
          borderColor: alpha(theme.palette.common.white, 0.5),
          "&:hover": {
            borderColor: "white",
            backgroundColor: alpha(theme.palette.common.white, 0.1),
          },
        }}
      >
        Configure Splash Screen
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            borderRadius: 2,
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ color: "white" }}>
          Configure Splash Screen
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "white" }}
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
                  backgroundColor: colors.backgrounds.dark,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
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
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: alpha(theme.palette.common.white, 0.3),
                },
                "&:hover fieldset": {
                  borderColor: alpha(theme.palette.common.white, 0.5),
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputLabel-root": {
                color: alpha(theme.palette.common.white, 0.7),
              },
              "& .MuiInputBase-input": {
                color: "white",
              },
            }}
          />

          <Box
            sx={{
              borderBottom: 1,
              borderColor: alpha(theme.palette.common.white, 0.2),
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="splash screen configuration tabs"
              textColor="inherit"
              TabIndicatorProps={{
                style: { background: "white" },
              }}
            >
              <Tab label="Choose From Presets" sx={{ color: "white" }} />
              <Tab label="Upload Custom Image" sx={{ color: "white" }} />
            </Tabs>
          </Box>

          <TabPanel id="splash" value={tabValue} index={0}>
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
                    <CardActionArea onClick={() => handlePresetSelect(preset)}>
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
                        <Typography variant="body2" sx={{ color: "white" }}>
                          {preset.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel id="splash" value={tabValue} index={1}>
            <Box sx={{ textAlign: "center", py: 2 }}>
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
                sx={{ color: alpha(theme.palette.common.white, 0.5), mt: 2 }}
              >
                For best results, use an image with a 16:9 aspect ratio and a
                minimum resolution of 1920x1080 pixels.
              </Typography>
            </Box>
          </TabPanel>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: alpha(theme.palette.common.white, 0.7),
              "&:hover": {
                color: "white",
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SplashConfig;
