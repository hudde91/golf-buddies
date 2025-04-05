import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { colors } from "../../styles";

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
  backgroundImage?: string;
  logoText?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 2000,
  backgroundImage,
  logoText,
}) => {
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery(
    "(orientation: landscape) and (max-height: 500px)"
  );

  useEffect(() => {
    // Start the fade out animation after the specified duration
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500); // Start fade out 500ms before the end

    // Call onFinish when the splash screen should disappear
    const finishTimer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <Fade in={!fadeOut} timeout={500}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: colors.background.main,
          },
        }}
      >
        <Box
          className="splash-content"
          sx={{
            position: "relative",
            textAlign: "center",
            px: { xs: 3, sm: 4 },
            maxWidth: "90vw",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
              },
              "50%": {
                transform: "scale(1.05)",
              },
              "100%": {
                transform: "scale(1)",
              },
            },
          }}
        >
          <Typography
            variant={isLandscape ? "h3" : isMobile ? "h2" : "h1"}
            sx={{
              fontWeight: 700,
              letterSpacing: { xs: 1, md: 2 },
              mb: { xs: 2, sm: 3 },
              fontSize: {
                xs: isLandscape ? "1.75rem" : "2.5rem",
                sm: "3.5rem",
                md: "4rem",
              },
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              wordBreak: "break-word",
              lineHeight: { xs: 1.2, sm: 1.3 },
            }}
          >
            {logoText}
          </Typography>

          <CircularProgress
            color="inherit"
            size={isMobile ? 40 : 60}
            thickness={4}
            sx={{
              mt: { xs: 1, sm: 2 },
              opacity: 0.9,
            }}
          />
        </Box>

        {/* Optional branding footer that appears at bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: isMobile ? "16px" : "24px" },
            width: "100%",
            textAlign: "center",
            px: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              letterSpacing: 1,
            }}
          >
            {/* You can add a tagline or version number here if desired */}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default SplashScreen;
