import React from "react";
import {
  Grid,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";

// Import the useStyles hook
import { useStyles } from "../styles/hooks/useStyles";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const styles = useStyles();

  return (
    <Box sx={styles.layout.page.withBackground}>
      <Container maxWidth="lg" sx={styles.layout.container.responsive}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                pr: { md: 4 },
                mb: { xs: 6, md: 0 },
              }}
            >
              {/* Page Header using design system */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={styles.text.heading.page}>
                  Golf Tournaments Made Simple
                </Typography>
                <Typography sx={styles.text.subtitle.page}>
                  Create custom golf events and invite your friends to join.
                  Track scores across multiple rounds, organize team play, and
                  enjoy real-time leaderboards—all in one place.
                </Typography>
              </Box>

              {/* Features section */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 5,
                  justifyContent: { xs: "center", md: "flex-start" },
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
const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  const styles = useStyles();

  return (
    <Card sx={styles.card.feature}>
      <CardContent>
        <Box sx={styles.card.featureContent}>
          <Box sx={styles.icon.container.feature}>{icon}</Box>
          <Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={styles.text.feature.title}
            >
              {title}
            </Typography>
            <Typography variant="body2" sx={styles.text.feature.description}>
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Home;
