import { useParams } from "react-router-dom";
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
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import { AppThemeProvider } from "./theme/ThemeProvider";
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
import { QUERY_KEYS } from "./hooks/useEventApi"; // We'll create this file

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Configure local storage persistence for offline support
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "GOLF_EVENTS_CACHE",
  throttleTime: 1000,
});

// Set up cache persistence
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  buster: import.meta.env.VITE_APP_VERSION || "1.0.0",
});

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
      <QueryClientProvider client={queryClient}>
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

                        <Route
                          path="/events/:id"
                          element={
                            <ProtectedRoute>
                              <EventDetailsRouter />
                            </ProtectedRoute>
                          }
                        />

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
        {/* Add React Query Devtools - only in development */}
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ClerkProvider>
  );
};

// Component to route to either TournamentDetails or TourDetails based on event type
const EventDetailsRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Replace direct service call with Tanstack Query
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.events.detail(id || ""),
    queryFn: async () => {
      if (!id) return null;
      // We'll replace this with API call in useEventApi.ts
      const event = await fetch(`/api/events/${id}`).then((res) => res.json());
      return event;
    },
    enabled: !!id, // Only run query if we have an ID
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error || !event) {
    return <NotFound />;
  }

  // Route to the appropriate component based on event type
  if (event.type === "tour") {
    return <TourDetails />;
  } else {
    return <TournamentDetails />;
  }
};

export default App;
