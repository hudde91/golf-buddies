// App.tsx
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { ThemeProvider, CssBaseline, Fade } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetails";
import SignInPage from "./pages/SignInPage";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";
import SplashScreen from "./components/splashScreen/SplashScreen";
import BackgroundService from "./services/backgroundService";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1976d2",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);
  const [splashImage, setSplashImage] = useState<string>(
    import.meta.env.VITE_SPLASH_BACKGROUND || "/splash-background.jpg"
  );
  const [splashText, setSplashText] = useState<string>(
    import.meta.env.VITE_SPLASH_LOGO_TEXT || ""
  );

  useEffect(() => {
    // Check localStorage for custom splash settings
    const savedImage = localStorage.getItem("splashImage");
    const savedText = localStorage.getItem("splashText");

    if (savedImage) {
      setSplashImage(savedImage);
    }

    if (savedText) {
      setSplashText(savedText);
    }

    // Apply background settings
    BackgroundService.applyBackgroundSettings();
  }, []);

  // Function to handle splash screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    setContentLoaded(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {showSplash && (
        <SplashScreen
          onFinish={handleSplashFinish}
          duration={3000}
          backgroundImage={splashImage}
          logoText={splashText}
        />
      )}

      <Fade in={contentLoaded} timeout={800}>
        <div style={{ visibility: contentLoaded ? "visible" : "hidden" }}>
          <BrowserRouter>
            <Header />
            <ClerkLoading>
              <Loading />
            </ClerkLoading>
            <ClerkLoaded>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/profile"
                  element={
                    <>
                      <SignedIn>
                        <Profile />
                      </SignedIn>
                      <SignedOut>
                        <Navigate to="/sign-in" replace />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <>
                      <SignedIn>
                        <Settings />
                      </SignedIn>
                      <SignedOut>
                        <Navigate to="/sign-in" replace />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/tournaments"
                  element={
                    <>
                      <SignedIn>
                        <Tournaments />
                      </SignedIn>
                      <SignedOut>
                        <Navigate to="/sign-in" replace />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/tournaments/:id"
                  element={
                    <>
                      <SignedIn>
                        <TournamentDetail />
                      </SignedIn>
                      <SignedOut>
                        <Navigate to="/sign-in" replace />
                      </SignedOut>
                    </>
                  }
                />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ClerkLoaded>
          </BrowserRouter>
        </div>
      </Fade>
    </ThemeProvider>
  );
};

export default App;
