import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  Badge,
  useTheme,
  alpha,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useUser } from "@clerk/clerk-react";
import friendsService, { Friend } from "../services/friendsService";
import { useStyles } from "../styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Friends: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id || "";
  const theme = useTheme();
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchError, setSearchError] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingFriends, setPendingFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  const loadFriends = () => {
    if (!userId) return;

    const acceptedFriends = friendsService.getAcceptedFriends(userId);
    const pendingList = friendsService.getPendingFriends(userId);

    setFriends(acceptedFriends);
    setPendingFriends(pendingList);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddFriend = () => {
    if (!searchEmail || !searchEmail.includes("@")) {
      setSearchError("Please enter a valid email address");
      return;
    }

    // Don't allow adding yourself
    if (user?.primaryEmailAddress?.emailAddress === searchEmail) {
      setSearchError("You cannot add yourself as a friend");
      return;
    }

    // Check if friend already exists
    const existingFriend = friendsService.searchFriendByEmail(
      userId,
      searchEmail
    );
    if (existingFriend) {
      setSearchError("This friend is already in your list");
      return;
    }

    friendsService.addFriend(userId, searchEmail);
    setSearchEmail("");
    setSearchError("");
    loadFriends();
  };

  const handleAcceptFriend = (friendId: string) => {
    friendsService.updateFriendStatus(userId, friendId, "accepted");
    loadFriends();
  };

  const handleRejectFriend = (friendId: string) => {
    friendsService.updateFriendStatus(userId, friendId, "rejected");
    loadFriends();
  };

  const handleRemoveFriend = (friendId: string) => {
    friendsService.removeFriend(userId, friendId);
    loadFriends();
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Box sx={styles.headers.page.container}>
        <Typography variant="h4" sx={styles.headers.page.title}>
          Friends
        </Typography>
        <Typography variant="body1" sx={styles.headers.page.subtitle}>
          Connect with other golfers and join events together
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          mt: 3,
          mb: 6,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="friends tabs"
          sx={styles.tabs.container}
          variant="fullWidth"
        >
          <Tab
            label={
              <Badge
                badgeContent={friends.length}
                color="primary"
                max={99}
                sx={{ "& .MuiBadge-badge": { right: -16 } }}
              >
                Friends
              </Badge>
            }
            id="friends-tab-0"
            aria-controls="friends-tabpanel-0"
          />
          <Tab
            label={
              <Badge
                badgeContent={pendingFriends.length}
                color="error"
                max={99}
                sx={{ "& .MuiBadge-badge": { right: -20 } }}
              >
                Pending
              </Badge>
            }
            id="friends-tab-1"
            aria-controls="friends-tabpanel-1"
          />
          <Tab
            label="Add Friend"
            id="friends-tab-2"
            aria-controls="friends-tabpanel-2"
            icon={<PersonAddIcon fontSize="small" sx={{ mr: 1 }} />}
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {friends.length > 0 ? (
            <List sx={{ width: "100%" }}>
              {friends.map((friend) => (
                <React.Fragment key={friend.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => handleRemoveFriend(friend.id)}
                        sx={styles.tournamentTeams.removePlayerIcon}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={styles.avatars.standard()}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={friend.name || friend.email}
                      secondary={!friend.name ? "" : friend.email}
                      primaryTypographyProps={{
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        color: alpha(theme.palette.text.primary, 0.7),
                      }}
                    />
                  </ListItem>
                  <Divider
                    variant="inset"
                    component="li"
                    sx={styles.divider.standard}
                  />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={styles.feedback.emptyState.container}>
              <PersonIcon sx={styles.feedback.emptyState.icon} />
              <Typography variant="h6" sx={styles.feedback.emptyState.title}>
                No Friends Yet
              </Typography>
              <Typography sx={styles.feedback.emptyState.description}>
                Add friends to connect and play golf together
              </Typography>
              <Button
                variant="contained"
                onClick={() => setTabValue(2)}
                startIcon={<PersonAddIcon />}
                sx={styles.button.primary}
              >
                Add Friend
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {pendingFriends.length > 0 ? (
            <List sx={{ width: "100%" }}>
              {pendingFriends.map((friend) => (
                <React.Fragment key={friend.id}>
                  {/* TODO: This does not look good in mobile view, the Icons gets positioned above the ListItemText below. 
                      Also the icons are not really visible  */}
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="accept"
                          onClick={() => handleAcceptFriend(friend.id)}
                          sx={{
                            color: theme.palette.success.main,
                            mr: 1,
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.success.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="reject"
                          onClick={() => handleRejectFriend(friend.id)}
                          sx={{
                            color: theme.palette.error.main,
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={styles.avatars.standard()}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={friend.name || friend.email}
                      secondary={!friend.name ? "" : friend.email}
                      primaryTypographyProps={{
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        color: alpha(theme.palette.text.primary, 0.7),
                      }}
                    />
                  </ListItem>
                  <Divider
                    variant="inset"
                    component="li"
                    sx={styles.divider.standard}
                  />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={styles.feedback.emptyState.container}>
              <PersonIcon sx={styles.feedback.emptyState.icon} />
              <Typography variant="h6" sx={styles.feedback.emptyState.title}>
                No Pending Requests
              </Typography>
              <Typography sx={styles.feedback.emptyState.description}>
                You don't have any pending friend requests
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Add a friend by email address
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Enter your friend's email address to send them a friend request.
              They'll need to accept your request to become friends.
            </Typography>

            <TextField
              fullWidth
              label="Friend's Email"
              variant="outlined"
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.target.value);
                setSearchError("");
              }}
              error={!!searchError}
              helperText={searchError}
              sx={styles.inputs.formField}
              placeholder="example@email.com"
            />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddFriend}
                startIcon={<PersonAddIcon />}
                sx={styles.button.primary}
                size="large"
              >
                Add Friend
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Friends;
