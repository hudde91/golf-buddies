import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  FormGroup,
  FormControlLabel,
  useTheme,
  alpha,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Friend } from "../services/friendsService";
import { useStyles } from "../styles";

interface FriendInviteListProps {
  friends: Friend[];
  loading?: boolean;
  selectedFriends: string[];
  onSelectedFriendsChange: (emails: string[]) => void;
}

const FriendInviteList: React.FC<FriendInviteListProps> = ({
  friends,
  loading = false,
  selectedFriends,
  onSelectedFriendsChange,
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>(friends);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredFriends(
        friends.filter(
          (friend) =>
            friend.name.toLowerCase().includes(query) ||
            friend.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, friends]);

  const handleToggleFriend = (email: string) => {
    const newSelectedFriends = selectedFriends.includes(email)
      ? selectedFriends.filter((e) => e !== email)
      : [...selectedFriends, email];

    onSelectedFriendsChange(newSelectedFriends);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all displayed (filtered) friends
      const allEmails = filteredFriends.map((friend) => friend.email);
      onSelectedFriendsChange(allEmails);
    } else {
      // Deselect all
      onSelectedFriendsChange([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1">
          Invite Friends ({selectedFriends.length} selected)
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  filteredFriends.length > 0 &&
                  filteredFriends.every((friend) =>
                    selectedFriends.includes(friend.email)
                  )
                }
                indeterminate={
                  selectedFriends.length > 0 &&
                  filteredFriends.some((friend) =>
                    selectedFriends.includes(friend.email)
                  ) &&
                  !filteredFriends.every((friend) =>
                    selectedFriends.includes(friend.email)
                  )
                }
                onChange={handleSelectAll}
                size="small"
              />
            }
            label="Select All"
          />
        </FormGroup>
      </Box>

      <TextField
        fullWidth
        placeholder="Search friends..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={styles.inputs.formField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClearSearch}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      <Paper
        sx={{
          mt: 2,
          maxHeight: 300,
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : filteredFriends.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="textSecondary">
              {friends.length === 0
                ? "You don't have any friends yet. Add friends from the Friends page."
                : "No friends match your search."}
            </Typography>
          </Box>
        ) : (
          <List sx={{ pt: 0, pb: 0 }}>
            {filteredFriends.map((friend) => (
              <React.Fragment key={friend.id}>
                <ListItem
                  button
                  onClick={() => handleToggleFriend(friend.email)}
                  sx={{
                    backgroundColor: selectedFriends.includes(friend.email)
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent",
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedFriends.includes(friend.email)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemAvatar>
                    <Avatar sx={styles.avatars.standard()}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.name || friend.email}
                    secondary={friend.name ? friend.email : ""}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                  {friend.status === "pending" && (
                    <Chip
                      label="Pending"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                        fontWeight: 500,
                        fontSize: "0.75rem",
                      }}
                    />
                  )}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {selectedFriends.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {selectedFriends.length}{" "}
            {selectedFriends.length === 1 ? "friend" : "friends"} will be
            invited
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FriendInviteList;
