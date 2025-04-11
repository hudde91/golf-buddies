import { useParams } from "react-router-dom";
import eventService, { useGetEventById } from "./services/eventService";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Box, Fade } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AppThemeProvider } from "./theme/ThemeProvider";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import TournamentDetails from "./pages/TournamentDetails";
import TourDetails from "./pages/TourDetails";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";
import SplashScreen from "./components/splashScreen/SplashScreen";
import BackgroundService from "./services/backgroundService";
import { initializeEventUpdater } from "./services/utils/eventsUpdater";
import GroupDetailPageContainer from "./components/tournamentDetails/roundsTab/GroupPage/GroupDetailPageContainer";
import Friends from "./pages/Friends";
import RoundDetails from "./pages/RoundDetails";
import RoundGroupDetailPage from "./components/round/RoundGroupDetailPage";
import { QueryProvider } from "./QueryProvider";
import EventDetailsRouter from "./components/EventDetailsRouter";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

if (!clerkPubKey) {
  throw new Error(
    "Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file"
  );
}

// Layout component that wraps the app content with Header
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <Box
        sx={{
          width: "100%",
          pb: { xs: 6, sm: 4 },
        }}
      >
        {children}
      </Box>
    </>
  );
};

// Protected route component with option to allow public access
const ProtectedRoute = ({
  children,
  requireAuth = true,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) => {
  if (!requireAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

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
    const savedImage = localStorage.getItem("splashImage");
    const savedText = localStorage.getItem("splashText");

    if (savedImage) {
      setSplashImage(savedImage);
    }

    if (savedText) {
      setSplashText(savedText);
    }

    BackgroundService.applyBackgroundSettings();
  }, []);

  useEffect(() => {
    // Initialize the event updater to check for completed events
    initializeEventUpdater();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setContentLoaded(true);
  };

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryProvider>
        <AppThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <Router>
                  <ClerkLoading>
                    <Loading />
                  </ClerkLoading>
                  <ClerkLoaded>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />

                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <Settings />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/events"
                          element={
                            <ProtectedRoute requireAuth={false}>
                              <Events />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/events/:id"
                          element={
                            <ProtectedRoute requireAuth={false}>
                              <EventDetailsRouter />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/tournaments/:id/*"
                          element={
                            <ProtectedRoute requireAuth={false}>
                              <TournamentDetails />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/tournaments/:tournamentId/rounds/:roundId/groups/:groupId"
                          element={
                            <ProtectedRoute>
                              <GroupDetailPageContainer />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/rounds/:id"
                          element={
                            <ProtectedRoute requireAuth={false}>
                              <RoundDetails />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/rounds/:roundId/groups/:groupId"
                          element={
                            <ProtectedRoute>
                              <RoundGroupDetailPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/friends"
                          element={
                            <ProtectedRoute>
                              <Friends />
                            </ProtectedRoute>
                          }
                        />

                        <Route path="/sign-in" element={<SignInPage />} />
                        <Route path="/sign-up" element={<SignUpPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </ClerkLoaded>
                </Router>
              </div>
            </Fade>
          </LocalizationProvider>
        </AppThemeProvider>
      </QueryProvider>
    </ClerkProvider>
  );
};

export default App;
