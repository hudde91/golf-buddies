import React, { useState, useEffect, ErrorInfo } from "react";
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
import { Box, Fade, Typography, Button, Container, Paper } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AppThemeProvider } from "./theme/ThemeProvider";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import TournamentDetails from "./pages/TournamentDetails";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";
import SplashScreen from "./components/splashScreen/SplashScreen";
import BackgroundService from "./services/backgroundService";
import GroupDetailPageContainer from "./components/tournamentDetails/roundsTab/GroupPage/GroupDetailPageContainer";
import Friends from "./pages/Friends";
import RoundDetails from "./pages/RoundDetails";
import RoundGroupDetailPage from "./components/round/RoundGroupDetailPage";
import { QueryProvider } from "./QueryProvider";
import EventDetailsRouter from "./components/EventDetailsRouter";
import SignUpHandler from "./components/SignUpHandler";
import { EventsAPIProvider } from "./EventsAPIProvider";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" paragraph>
              We're sorry, but an error occurred in the application.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Refresh the page
            </Button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Box sx={{ mt: 4, textAlign: "left" }}>
                <Typography variant="h6" gutterBottom>
                  Error details (visible in development only):
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

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

const AppContent: React.FC = () => {
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

    try {
      BackgroundService.applyBackgroundSettings();
    } catch (error) {
      console.error("Error applying background settings:", error);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setContentLoaded(true);
  };

  return (
    <>
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
              {/* Add the SignUpHandler here to listen for auth state changes */}
              <SignUpHandler />
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
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={clerkPubKey}
        afterSignInUrl="/events"
        afterSignUpUrl="/events"
      >
        <QueryProvider>
          <AppThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <EventsAPIProvider>
                <AppContent />
              </EventsAPIProvider>
            </LocalizationProvider>
          </AppThemeProvider>
        </QueryProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default App;
