// pages/Home.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import tournamentService from "../services/tournamentService";

const Home: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [recentTournaments, setRecentTournaments] = useState<number>(0);

  useEffect(() => {
    if (user && isLoaded) {
      const userTournaments = tournamentService.getUserTournaments(user.id);
      setRecentTournaments(userTournaments.length);
    }
  }, [user, isLoaded]);

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
        minHeight: "calc(100vh - 64px)",
        pt: { xs: 6, md: 10 },
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                pr: { md: 4 },
                mb: { xs: 6, md: 0 },
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "white",
                }}
              >
                Golf Tournaments
                <br />
                Made Simple
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  mb: 4,
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                  maxWidth: { md: "90%" },
                }}
              >
                Create custom golf tournaments and invite your friends to join.
                Track scores across multiple rounds, organize team play, and
                enjoy real-time leaderboards—all in one place.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 5,
                }}
              >
                <Feature
                  icon={<GolfCourseIcon fontSize="large" />}
                  title="Multiple Formats"
                  description="Stroke play, match play, or team events like Ryder Cup"
                />

                <Feature
                  icon={<PeopleIcon fontSize="large" />}
                  title="Team Play"
                  description="Create teams, assign players, and track team scores"
                />

                <Feature
                  icon={<AnalyticsIcon fontSize="large" />}
                  title="Live Scoring"
                  description="Real-time leaderboards and detailed scorecards"
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: { xs: 300, md: 500 },
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
                  zIndex: 1,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Feature component for the feature highlights
const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        p: 2,
        maxWidth: { xs: "100%", sm: "48%", md: "48%" },
      }}
    >
      <Box
        sx={{
          mr: 2,
          color: theme.palette.primary.light,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "white" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
