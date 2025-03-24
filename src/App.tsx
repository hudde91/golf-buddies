import { useParams } from "react-router-dom";
import eventService from "./services/eventService";
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
import { Fade } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Import custom theme provider
import { AppThemeProvider } from "./theme/ThemeProvider";

// Components
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import TournamentDetails from "./pages/TournamentDetails";
import TourDetails from "./pages/TourDetails";
import SignInPage from "./pages/SignInPage";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";
import SplashScreen from "./components/splashScreen/SplashScreen";
import BackgroundService from "./services/backgroundService";
import { initializeEventUpdater } from "./services/utils/eventsUpdater";

// Clerk public key
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
      {children}
    </>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

  useEffect(() => {
    // Initialize the event updater to check for completed events
    initializeEventUpdater();
  }, []);

  // Function to handle splash screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    setContentLoaded(true);
  };

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {/* Use our custom theme provider instead of Material UI's ThemeProvider */}
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
                          <ProtectedRoute>
                            <Events />
                          </ProtectedRoute>
                        }
                      />

                      {/* Route that determines whether to show TournamentDetails or TourDetails */}
                      <Route
                        path="/events/:id"
                        element={
                          <ProtectedRoute>
                            <EventDetailsRouter />
                          </ProtectedRoute>
                        }
                      />

                      {/* Explicit route for Tournament Details */}
                      <Route
                        path="/tournaments/:id"
                        element={
                          <ProtectedRoute>
                            <TournamentDetails />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="/sign-in" element={<SignInPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ClerkLoaded>
              </Router>
            </div>
          </Fade>
        </LocalizationProvider>
      </AppThemeProvider>
    </ClerkProvider>
  );
};

// Component to route to either TournamentDetails or TourDetails based on event type
const EventDetailsRouter: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventType, setEventType] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchEventType = async () => {
      setIsLoading(true);
      try {
        const event = eventService.getEventById(id);
        if (event) {
          setEventType(event.type);
        }
      } catch (error) {
        console.error("Error fetching event type:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventType();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  // Route to the appropriate component based on event type
  if (eventType === "tour") {
    return <TourDetails />;
  } else {
    return <TournamentDetails />;
  }
};

export default App;
