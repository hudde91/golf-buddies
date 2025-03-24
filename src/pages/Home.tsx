// pages/Home.tsx
import React from "react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";

// Import common components
import { PageContainer, PageHeader } from "../components/common";
import {
  GlassCard,
  CardContent,
  FlexBox,
  SectionDivider,
} from "../components/ui";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <PageContainer>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              pr: { md: 4 },
              mb: { xs: 6, md: 0 },
            }}
          >
            <PageHeader
              title="Golf Tournaments Made Simple"
              subtitle="Create custom golf events and invite your friends to join. Track scores across multiple rounds, organize team play, and enjoy real-time leaderboards—all in one place."
            />

            <FlexBox
              direction="row"
              wrap="wrap"
              gap={2}
              sx={{
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
            </FlexBox>
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
    </PageContainer>
  );
};

// Feature component for the feature highlights
const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  const theme = useTheme();

  return (
    <GlassCard
      sx={{
        maxWidth: { xs: "100%", sm: "48%", md: "48%" },
        flex: "0 0 auto",
      }}
    >
      <CardContent>
        <FlexBox align="flex-start" gap={2}>
          <Box
            sx={{
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
              sx={{ color: theme.palette.common.white }}
            >
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {description}
            </Typography>
          </Box>
        </FlexBox>
      </CardContent>
    </GlassCard>
  );
};

export default Home;
