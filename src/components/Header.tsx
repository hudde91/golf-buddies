import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Divider,
  Badge,
  Tooltip,
  useScrollTrigger,
  Container,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import tournamentService from "../services/eventService";
import friendsService from "../services/friendsService";
import { useStyles } from "../styles";

interface ElevationScrollProps {
  children: React.ReactElement;
}

function ElevationScroll(props: ElevationScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const theme = useTheme();

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      transition: "all 0.3s ease",
      backdropFilter: trigger ? "blur(10px)" : "none",
      backgroundColor: trigger ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.4)",
      color: "white",
      borderBottom: trigger
        ? `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        : "none",
    },
  });
}

const Header: React.FC = () => {
  const { user, isLoaded } = useUser();
  const theme = useTheme();
  const styles = useStyles();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [pendingInvitations, setPendingInvitations] = useState<number>(0);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<number>(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user && isLoaded) {
      // Check for pending tournament invitations
      const userEmail = user.primaryEmailAddress?.emailAddress || "";
      const invitations = tournamentService.getUserInvitations(userEmail);
      setPendingInvitations(
        invitations.tours.length +
          invitations.tournaments.length +
          invitations.rounds.length
      );

      // Check for pending friend requests
      const pendingFriends = friendsService.getPendingFriends(user.id);
      setPendingFriendRequests(pendingFriends.length);
    }
  }, [user, isLoaded, location]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <ElevationScroll>
      <AppBar position="sticky">
        <Container maxWidth="lg" disableGutters={isXsScreen}>
          <Toolbar
            disableGutters
            sx={{
              py: styles.mobile.spacing.touch.py,
              px: styles.mobile.spacing.touch.px,
            }}
          >
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                mr: { md: 4 },
                fontWeight: 700,
                letterSpacing: 1,
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                // ...styles.mobile.typography.adaptive.h5,
              }}
            >
              <EmojiEventsIcon sx={{ mr: 1, fontSize: 28 }} />
              GolfBuddies
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/"
                startIcon={<HomeIcon />}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                  ...(isActive("/") && {
                    backgroundColor: alpha(theme.palette.common.white, 0.15),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.2),
                    },
                  }),
                }}
              >
                Home
              </Button>

              <Button
                color="inherit"
                component={RouterLink}
                to="/events"
                startIcon={
                  <Badge
                    badgeContent={pendingInvitations}
                    color="error"
                    max={99}
                  >
                    <EmojiEventsIcon />
                  </Badge>
                }
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                  ...((isActive("/events") ||
                    location.pathname.startsWith("/events/")) && {
                    backgroundColor: alpha(theme.palette.common.white, 0.15),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.2),
                    },
                  }),
                }}
              >
                Events
              </Button>

              <SignedIn>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                  startIcon={<PersonIcon />}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                    ...(isActive("/profile") && {
                      backgroundColor: alpha(theme.palette.common.white, 0.15),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.2),
                      },
                    }),
                  }}
                >
                  Profile
                </Button>

                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/friends"
                  startIcon={
                    <Badge
                      badgeContent={pendingFriendRequests}
                      color="error"
                      max={99}
                    >
                      <PeopleIcon />
                    </Badge>
                  }
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                    ...(isActive("/friends") && {
                      backgroundColor: alpha(theme.palette.common.white, 0.15),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.2),
                      },
                    }),
                  }}
                >
                  Friends
                </Button>
              </SignedIn>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SignedIn>
                <Tooltip title="Settings">
                  <IconButton
                    color="inherit"
                    component={RouterLink}
                    to="/settings"
                    size="large"
                    sx={{
                      ml: { xs: 1, md: 2 },
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                      ...(isActive("/settings") && {
                        backgroundColor: alpha(
                          theme.palette.common.white,
                          0.15
                        ),
                      }),
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>

                <Box
                  sx={{
                    ml: 2,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <UserButton afterSignOutUrl="/" />
                </Box>
              </SignedIn>

              <SignedOut>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/sign-in"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      borderColor: "white",
                    },
                  }}
                >
                  Login
                </Button>
              </SignedOut>

              {/* Mobile menu */}
              <Box sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(0, 0, 0, 0.9)",
                      color: "white",
                      border: `1px solid ${alpha(
                        theme.palette.common.white,
                        0.1
                      )}`,
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleClose}
                    component={RouterLink}
                    to="/"
                    selected={isActive("/")}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: alpha(
                          theme.palette.common.white,
                          0.15
                        ),
                      },
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    <HomeIcon fontSize="small" sx={{ mr: 2 }} />
                    Home
                  </MenuItem>

                  <MenuItem
                    onClick={handleClose}
                    component={RouterLink}
                    to="/events"
                    selected={
                      isActive("/events") ||
                      location.pathname.startsWith("/events/")
                    }
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: alpha(
                          theme.palette.common.white,
                          0.15
                        ),
                      },
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    <Badge
                      badgeContent={pendingInvitations}
                      color="error"
                      max={99}
                    >
                      <EmojiEventsIcon fontSize="small" sx={{ mr: 2 }} />
                    </Badge>
                    Events
                  </MenuItem>

                  <SignedIn>
                    <MenuItem
                      onClick={handleClose}
                      component={RouterLink}
                      to="/profile"
                      selected={isActive("/profile")}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.15
                          ),
                        },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                        },
                      }}
                    >
                      <PersonIcon fontSize="small" sx={{ mr: 2 }} />
                      My Profile
                    </MenuItem>

                    <MenuItem
                      onClick={handleClose}
                      component={RouterLink}
                      to="/friends"
                      selected={isActive("/friends")}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.15
                          ),
                        },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                        },
                      }}
                    >
                      <Badge
                        badgeContent={pendingFriendRequests}
                        color="error"
                        max={99}
                      >
                        <PeopleIcon fontSize="small" sx={{ mr: 2 }} />
                      </Badge>
                      Friends
                    </MenuItem>

                    <MenuItem
                      onClick={handleClose}
                      component={RouterLink}
                      to="/settings"
                      selected={isActive("/settings")}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.15
                          ),
                        },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                        },
                      }}
                    >
                      <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
                      Settings
                    </MenuItem>

                    <Divider
                      sx={{
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      }}
                    />

                    <Box
                      sx={{ p: 1, display: "flex", justifyContent: "center" }}
                    >
                      <UserButton afterSignOutUrl="/" />
                    </Box>
                  </SignedIn>

                  <SignedOut>
                    <MenuItem
                      onClick={handleClose}
                      component={RouterLink}
                      to="/sign-in"
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                        },
                      }}
                    >
                      Login
                    </MenuItem>
                  </SignedOut>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
