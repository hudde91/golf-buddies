import { useTheme, alpha } from "@mui/material/styles";
import { colors, styleHelpers } from "../theme";
import { profileStyles } from "../profileStyles";
import { tourStyles } from "../tourStyles";
import { getStatusColor } from "../../components/util";
import { invitationStyles } from "../invitationStyles";
import {
  tournamentLeaderboardStyles,
  tournamentStyles,
  tournamentPlayerStyles,
  tournamentScorecardStyles,
  tournamentTeamStyles,
} from "../tournamentStyles";

// Hook to provide common style objects
export const useAppStyles = () => {
  const theme = useTheme();

  return {
    // Page-level styles
    pageContainer: {
      background: colors.backgrounds.dark,
      ...styleHelpers.pageContainer,
    },

    // Glass panel styles
    glassPanel: {
      ...styleHelpers.glassBox(theme),
      p: { xs: 2, md: 4 },
    },

    // Common text styles
    pageTitle: {
      color: colors.text.primary,
      fontWeight: 500,
      mb: 1,
    },
    pageSubtitle: {
      color: colors.text.subtle,
      mb: 4,
    },

    // Section styles
    section: {
      mb: 4,
    },
    sectionTitle: {
      color: colors.text.primary,
      fontWeight: 500,
      mb: 2,
    },

    // Form field styles
    formField: {
      mb: 3,
      "& .MuiInputLabel-root": {
        color: colors.text.subtle,
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: alpha(theme.palette.common.white, 0.2),
        },
        "&:hover fieldset": {
          borderColor: alpha(theme.palette.common.white, 0.3),
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
        },
      },
      "& .MuiInputBase-input": {
        color: colors.text.primary,
      },
    },

    // Responsive containers
    responsiveContainer: {
      width: "100%",
      px: { xs: 2, sm: 3, md: 4 },
    },

    // Common card styles
    card: {
      backgroundColor: alpha(theme.palette.common.black, 0.3),
      backdropFilter: "blur(10px)",
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      borderRadius: 2,
      p: 2,
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.black, 0.4),
      },
    },

    // Tab styles
    tabs: {
      "& .MuiTab-root": {
        color: colors.text.subtle,
        "&.Mui-selected": {
          color: colors.text.primary,
        },
      },
      "& .MuiTabs-indicator": {
        backgroundColor: colors.text.primary,
      },
    },

    // Common button styles
    primaryButton: {
      color: "white",
      bgcolor: theme.palette.primary.main,
      "&:hover": {
        bgcolor: theme.palette.primary.dark,
      },
    },

    outlinedButton: {
      color: "white",
      borderColor: alpha(theme.palette.common.white, 0.5),
      "&:hover": {
        borderColor: "white",
        backgroundColor: alpha(theme.palette.common.white, 0.1),
      },
    },

    // Loading state styles
    loadingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      height: "100%",
      minHeight: 200,
    },
  };
};

// Hook for responsive design helpers
export const useResponsiveStyles = () => {
  const theme = useTheme();
  const isMobile = theme.breakpoints.down("sm");
  const isTablet = theme.breakpoints.between("sm", "md");
  const isDesktop = theme.breakpoints.up("md");

  return {
    isMobile,
    isTablet,
    isDesktop,

    // Helper styles for responsive layouts
    responsiveGrid: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      },
      gap: 2,
    },

    responsiveFlex: {
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: 2,
    },

    responsiveSpacing: {
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, md: 3 },
    },

    responsiveText: {
      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
    },
  };
};

// Specialized hook for profile components
export const useProfileStyles = () => {
  const theme = useTheme();
  const appStyles = useAppStyles(); // Leverage existing app styles

  return {
    // Inherit common app styles
    ...appStyles,

    // Profile-specific styles
    profileCard: profileStyles.profileCard(theme),

    // Section title with profile styling
    profileSectionTitle: profileStyles.sectionTitle(theme),

    // Get text field props with profile styling
    getProfileTextFieldProps: (rows = 1) => ({
      variant: "outlined" as const,
      margin: "normal" as const,
      fullWidth: true,
      multiline: rows > 1,
      rows,
      InputLabelProps: {
        style: profileStyles.formField(theme).label,
      },
      InputProps: {
        style: profileStyles.formField(theme).input,
        sx: profileStyles.formField(theme).border,
      },
    }),

    // Avatar styling for profile
    profileAvatar: {
      ...profileStyles.avatar(theme),
      width: { xs: 180, md: 220 },
      height: { xs: 180, md: 220 },
    },

    // Typography variants for profile
    profileTypography: {
      heading: {
        ...profileStyles.typography.profileHeading(theme),
        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
      },
      subtitle: profileStyles.typography.profileSubtitle(theme),
      body: profileStyles.typography.profileBody(theme),
      muted: profileStyles.typography.profileMuted(theme),
    },

    // Profile-specific buttons
    profileButtons: {
      edit: profileStyles.buttons.editButton(theme),
      save: profileStyles.buttons.saveButton(theme),
    },

    // Helper for slider components in profile
    profileSlider: {
      height: 8,
      borderRadius: 4,
      "& .MuiSlider-track": {
        border: "none",
      },
      "& .MuiSlider-thumb": {
        height: 16,
        width: 16,
        backgroundColor: theme.palette.primary.main,
        border: `2px solid ${theme.palette.primary.main}`,
      },
    },
  };
};

// Specialized hook for tour components
export const useTourStyles = () => {
  const theme = useTheme();
  const appStyles = useAppStyles();

  return {
    // Inherit common app styles
    ...appStyles,

    // Core tour container styling
    tourContainer: tourStyles.tourContainer(theme),

    // Section title with tour styling
    tourSectionTitle: tourStyles.tourSectionTitle(theme),

    // Tab styling
    tourTabs: tourStyles.tourTabs(theme),
    tourTabPanel: tourStyles.tourTabPanel,

    // Card styles
    tourCard: tourStyles.tourCard(theme),
    tourTeamCard: tourStyles.tourTeamCard(theme),

    // Tournament card helper
    getStatusChip: (status: string) => {
      const color = getStatusColor(status, theme);
      return tourStyles.statusChip(color, theme);
    },

    leaderboardTable: tourStyles.leaderboardTable(theme),
    leaderboardHeader: tourStyles.leaderboardHeader(theme),

    tourPlayerItem: tourStyles.tourPlayerItem(theme),

    getMedalStyle: (position: number) =>
      tourStyles.getMedalStyle(position, theme),

    infoItem: tourStyles.infoItem(theme),

    tourDivider: tourStyles.tourDivider(theme),

    getTeamHeaderStyle: (color: string) => ({
      p: 2,
      bgcolor: alpha(color, 0.2),
      borderBottom: `1px solid ${alpha(color, 0.3)}`,
    }),

    tourTypography: {
      title: {
        color: "white",
        fontWeight: "bold",
      },
      subtitle: {
        color: alpha(theme.palette.common.white, 0.7),
        mb: 1,
      },
      body: {
        color: "white",
      },
      muted: {
        color: alpha(theme.palette.common.white, 0.5),
        fontStyle: "italic",
      },
    },

    tourAvatar: {
      width: { xs: 32, sm: 36 },
      height: { xs: 32, sm: 36 },
      mr: 1,
    },

    emptyStateContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      py: 6,
      px: 2,
    },
  };
};

// Specialized hook for invitation components
export const useInvitationStyles = () => {
  const theme = useTheme();
  const appStyles = useAppStyles(); // Leverage existing app styles

  return {
    // Inherit common app styles
    ...appStyles,

    invitationCard: invitationStyles.invitationCard(theme),

    iconContainer: invitationStyles.iconContainer(theme),

    invitationDivider: invitationStyles.invitationDivider(theme),

    infoItem: invitationStyles.infoItem(theme),

    invitationButtons: {
      accept: invitationStyles.invitationButtons.accept(),
      decline: invitationStyles.invitationButtons.decline(theme),
    },

    emptyStateContainer: invitationStyles.emptyStateContainer(theme),
    emptyStateIcon: invitationStyles.emptyStateIcon(theme),

    invitationTypography: {
      title: invitationStyles.typography.title,
      body: invitationStyles.typography.body(theme),
      muted: invitationStyles.typography.muted(theme),
    },
  };
};

// Specialized hook for player components
export const useTournamentPlayerStyles = () => {
  const theme = useTheme();
  const appStyles = useAppStyles(); // Leverage existing app styles

  return {
    // Inherit common app styles
    ...appStyles,

    // Player card styling
    playerCard: tournamentPlayerStyles.playerCard(theme),

    // Get player avatar styling with optional team color
    getPlayerAvatar: (teamColor?: string) =>
      tournamentPlayerStyles.playerAvatar(theme, teamColor),

    // Get profile avatar styling (larger size for dialogs)
    getProfileAvatar: (teamColor?: string) =>
      tournamentPlayerStyles.profileAvatar(theme, teamColor),

    // Chip styles for player indicators
    chips: {
      creator: tournamentPlayerStyles.chips.creator,
      getTeamChip: (teamColor: string) =>
        tournamentPlayerStyles.chips.team(teamColor),
      getCaptainChip: (teamColor: string) =>
        tournamentPlayerStyles.chips.captain(teamColor, theme),
    },

    // Info item with icon (for profile details)
    profileInfoItem: tournamentPlayerStyles.profileInfoItem(theme),

    // Info icon container
    getInfoIconContainer: (color: string) =>
      tournamentPlayerStyles.infoIconContainer(color, theme),

    // Dialog styling
    profileDialog: tournamentPlayerStyles.profileDialog(theme),
    profileDivider: tournamentPlayerStyles.profileDivider(theme),
    closeButton: tournamentPlayerStyles.closeButton(theme),
    dialogActions: tournamentPlayerStyles.dialogActions(theme),

    // Typography variants
    playerTypography: {
      playerName: tournamentPlayerStyles.typography.playerName,
      playerDetail: tournamentPlayerStyles.typography.playerDetail(theme),
      profileTitle: tournamentPlayerStyles.typography.profileTitle,
      sectionTitle: tournamentPlayerStyles.typography.sectionTitle,
      bio: tournamentPlayerStyles.typography.bio(theme),
      getInfoItemTitle: (color: string) =>
        tournamentPlayerStyles.typography.infoItemTitle(color),
      infoItemValue: tournamentPlayerStyles.typography.infoItemValue,
    },

    // Button styles
    buttons: {
      close: tournamentPlayerStyles.buttons.close(theme),
      invite: tournamentPlayerStyles.buttons.invite(theme),
    },

    // Layouts
    layouts: {
      tabHeader: tournamentPlayerStyles.layouts.tabHeader,
    },
  };
};

// Specialized hook for tournament components
export const useTournamentStyles = () => {
  const theme = useTheme();
  const appStyles = useAppStyles(); // Leverage existing app styles

  return {
    // Inherit common app styles
    ...appStyles,

    // Tournament card styling
    tournamentCard: tournamentStyles.tournamentCard(theme),
    tournamentCardMedia: tournamentStyles.tournamentCardMedia,

    // Status chip
    getStatusChip: (status: string) => {
      const color = getStatusColor(status, theme);
      return tournamentStyles.statusChip(color, theme);
    },

    // Color helper
    getStatusColor: (status: string) => getStatusColor(status, theme),

    // Divider
    tournamentDivider: tournamentStyles.tournamentDivider(theme),

    // Info item with icon
    infoItem: tournamentStyles.infoItem(theme),

    // Leaderboard
    getLeaderboardRowStyle: (
      position: number,
      highlightWinner: boolean = true
    ) => tournamentStyles.leaderboardRow(theme, position, highlightWinner),

    getPositionColor: (position: number) =>
      tournamentStyles.getPositionColor(position, theme),

    // Loading and empty states
    loadingState: tournamentStyles.loadingState,
    emptyState: tournamentStyles.emptyState(theme),
    emptyStateIcon: tournamentStyles.emptyStateIcon(theme),

    // Form styles
    formStyles: {
      inputProps: tournamentStyles.formStyles.inputProps(theme),
      labelProps: tournamentStyles.formStyles.labelProps(theme),
    },

    // Dialog styles
    dialogStyles: {
      title: tournamentStyles.dialogStyles.title(theme),
      actions: tournamentStyles.dialogStyles.actions(theme),
    },

    // Typography variants
    tournamentTypography: {
      title: tournamentStyles.typography.title(theme),
      cardTitle: tournamentStyles.typography.cardTitle,
      header: tournamentStyles.typography.header,
      body: tournamentStyles.typography.body(theme),
      muted: tournamentStyles.typography.muted(theme),
    },
  };
};

// Specialized hook for leaderboard components
export const useTournamentLeaderboardStyles = () => {
  const theme = useTheme();
  const tournamentStyles = useTournamentStyles(); // Leverage existing tournament styles

  return {
    // Inherit tournament styles
    ...tournamentStyles,

    // Empty state styling
    leaderboardEmptyState: tournamentLeaderboardStyles.emptyState(theme),
    leaderboardEmptyStateIcon:
      tournamentLeaderboardStyles.emptyStateIcon(theme),

    // Table styling
    tableContainer: tournamentLeaderboardStyles.tableContainer(theme),
    headerCell: tournamentLeaderboardStyles.headerCell(theme),
    positionHeaderCell: tournamentLeaderboardStyles.positionHeaderCell(theme),
    dataCell: tournamentLeaderboardStyles.dataCell(theme),
    centeredDataCell: tournamentLeaderboardStyles.centeredDataCell(theme),

    // Row styling
    getTableRowStyle: (index: number) =>
      tournamentLeaderboardStyles.tableRow(theme, index),

    // Chip styling
    winnerChip: tournamentLeaderboardStyles.winnerChip,
    captainChip: tournamentLeaderboardStyles.captainChip(theme),
    getTeamChip: (teamColor: string) =>
      tournamentLeaderboardStyles.teamChip(teamColor, theme),

    // Avatar styling
    getPlayerAvatar: (teamColor?: string) =>
      tournamentLeaderboardStyles.playerAvatar(theme, teamColor),
    getTeamAvatar: (teamColor: string) =>
      tournamentLeaderboardStyles.teamAvatar(teamColor),

    // Mobile info text
    mobileInfoText: tournamentLeaderboardStyles.mobileInfoText(theme),

    // Divider
    leaderboardDivider: tournamentLeaderboardStyles.leaderboardDivider(theme),

    // Helper for score vs par coloring
    getScoreVsParColor: (vsPar: string) =>
      tournamentLeaderboardStyles.scoreVsParColor(vsPar, theme),

    // Typography
    leaderboardTypography: {
      title: tournamentLeaderboardStyles.typography.title,
      noDataText: tournamentLeaderboardStyles.typography.noDataText(theme),
      noTeamText: tournamentLeaderboardStyles.typography.noTeamText(theme),
    },

    // Helper functions
    formatScoreToPar: (score: number, par: number): string => {
      const diff = score - par;
      if (diff === 0) return "E";
      return diff > 0 ? `+${diff}` : `${diff}`;
    },

    getScoreDisplay: (
      score: number,
      index: number,
      leaderboard: any[]
    ): string => {
      // For the first place player
      if (index === 0) {
        return score.toString();
      }

      // For other players, show the difference from the leader
      const leaderScore = leaderboard[0].total;
      const diff = score - leaderScore;

      if (diff === 0) return score.toString();
      return `${score} (+${diff})`;
    },
  };
};

// Specialized hook for scorecard components
export const useTournamentScorecardStyles = () => {
  const theme = useTheme();
  const appStyles = useAppStyles(); // Leverage existing app styles

  return {
    // Inherit common app styles
    ...appStyles,

    // Scorecard header styling
    header: {
      container: tournamentScorecardStyles.scorecardHeader.container,
      title: tournamentScorecardStyles.scorecardHeader.title,
      courseChip: tournamentScorecardStyles.scorecardHeader.courseChip(theme),
      formatChip: tournamentScorecardStyles.scorecardHeader.formatChip(theme),
      holesChip: tournamentScorecardStyles.scorecardHeader.holesChip(theme),
      chipsContainer: tournamentScorecardStyles.scorecardHeader.chipsContainer,
    },

    // Weather display styling
    weather: {
      container: tournamentScorecardStyles.weatherDisplay.container(theme),
      title: tournamentScorecardStyles.weatherDisplay.title,
      loading: tournamentScorecardStyles.weatherDisplay.loading(theme),
      error: tournamentScorecardStyles.weatherDisplay.error(theme),
      chipsContainer: tournamentScorecardStyles.weatherDisplay.chipsContainer,
    },

    // Scorecard section styling
    section: {
      container: tournamentScorecardStyles.scorecardSection.container,
      title: tournamentScorecardStyles.scorecardSection.title(theme),
      tableContainer:
        tournamentScorecardStyles.scorecardSection.tableContainer(theme),
    },

    // Table header styling
    tableHeaderCell: tournamentScorecardStyles.tableHeaderCell(theme),

    // Par row styling
    parRow: {
      cell: tournamentScorecardStyles.parRow.cell(theme),
      text: tournamentScorecardStyles.parRow.text(theme),
    },

    // Player score row styling
    playerScoreRow: {
      getContainer: (playerIndex: number) =>
        tournamentScorecardStyles.playerScoreRow.container(theme, playerIndex),
      cell: tournamentScorecardStyles.playerScoreRow.cell(theme),
      nameCell: tournamentScorecardStyles.playerScoreRow.nameCell,
      avatar: tournamentScorecardStyles.playerScoreRow.avatar,
      playerName: tournamentScorecardStyles.playerScoreRow.playerName(theme),
      scoreCell: tournamentScorecardStyles.playerScoreRow.scoreCell,
      totalCell: tournamentScorecardStyles.playerScoreRow.totalCell,
    },

    // Score cell styling
    scoreCell: {
      getContainer: (scoreClass?: string) =>
        tournamentScorecardStyles.scoreCell.container(theme, scoreClass),
      editField: tournamentScorecardStyles.scoreCell.editField(theme),
      editFieldInput: tournamentScorecardStyles.scoreCell.editFieldInput,
    },

    // Rounds tab styling
    roundsTab: {
      header: tournamentScorecardStyles.roundsTab.header,
      emptyState: tournamentScorecardStyles.roundsTab.emptyState(theme),
      emptyStateIcon: tournamentScorecardStyles.roundsTab.emptyStateIcon(theme),
      emptyStateTitle: tournamentScorecardStyles.roundsTab.emptyStateTitle,
      emptyStateMessage:
        tournamentScorecardStyles.roundsTab.emptyStateMessage(theme),
      roundsList: tournamentScorecardStyles.roundsTab.roundsList(theme),
      roundItem: tournamentScorecardStyles.roundsTab.roundItem(theme),
      roundItemAvatar: tournamentScorecardStyles.roundsTab.roundItemAvatar,
      avatar: tournamentScorecardStyles.roundsTab.avatar,
      roundName: tournamentScorecardStyles.roundsTab.roundName,
      roundDate: tournamentScorecardStyles.roundsTab.roundDate(theme),
      deleteButton: tournamentScorecardStyles.roundsTab.deleteButton(theme),
      noSelection: tournamentScorecardStyles.roundsTab.noSelection(theme),
      noSelectionText:
        tournamentScorecardStyles.roundsTab.noSelectionText(theme),
    },

    // Action buttons styling
    actionButtons: {
      container: tournamentScorecardStyles.actionButtons.container,
      save: tournamentScorecardStyles.actionButtons.save(theme),
      cancel: tournamentScorecardStyles.actionButtons.cancel(theme),
      edit: tournamentScorecardStyles.actionButtons.edit(theme),
    },
  };
};

// Specialized hook for tournament team components
export const useTournamentTeamStyles = () => {
  const theme = useTheme();
  const appStyles = useAppStyles(); // Leverage existing app styles

  return {
    // Inherit common app styles
    ...appStyles,

    // Empty state placeholder
    emptyState: tournamentTeamStyles.emptyState(theme),
    emptyStateIcon: tournamentTeamStyles.emptyStateIcon(theme),
    emptyStateTitle: tournamentTeamStyles.emptyStateTitle,
    emptyStateMessage: tournamentTeamStyles.emptyStateMessage(theme),

    // Team card styling
    getTeamCard: (color: string) => tournamentTeamStyles.teamCard(theme, color),
    teamHeader: tournamentTeamStyles.teamHeader,
    getTeamAvatar: (color: string) => tournamentTeamStyles.teamAvatar(color),
    teamName: tournamentTeamStyles.teamName,
    teamDivider: tournamentTeamStyles.teamDivider(theme),
    teamInfoHeader: tournamentTeamStyles.teamInfoHeader,
    teamInfoText: tournamentTeamStyles.teamInfoText(theme),
    getCaptainChip: (color: string) =>
      tournamentTeamStyles.captainChip(theme, color),
    playersList: tournamentTeamStyles.playersList(theme),
    noPlayersText: tournamentTeamStyles.noPlayersText(theme),
    cardActions: tournamentTeamStyles.cardActions(theme),

    // Player badge for captain
    getCaptainBadge: (color: string) =>
      tournamentTeamStyles.captainBadge(theme, color),
    playerItem: tournamentTeamStyles.playerItem(theme),
    getPlayerName: (isCaptain: boolean) =>
      tournamentTeamStyles.playerName(theme, isCaptain),
    getCaptainLabel: (color: string) =>
      tournamentTeamStyles.captainLabel(color),

    // Buttons
    managePlayersButton: tournamentTeamStyles.managePLayersButton(theme),
    editButton: tournamentTeamStyles.editButton(theme),
    deleteButton: tournamentTeamStyles.deleteButton(theme),

    // Team form dialog styling
    dialogPaper: tournamentTeamStyles.dialogPaper(theme),
    dialogTitle: tournamentTeamStyles.dialogTitle(theme),
    formField: {
      input: tournamentTeamStyles.formField(theme).input,
      label: tournamentTeamStyles.formField(theme).label,
      outline: tournamentTeamStyles.formField(theme).outline,
    },
    getColorSwatch: (color: string, isSelected: boolean) =>
      tournamentTeamStyles.colorSwatch(theme, color, isSelected),
    previewBox: tournamentTeamStyles.previewBox(theme),
    dialogActions: tournamentTeamStyles.dialogActions(theme),
    cancelButton: tournamentTeamStyles.cancelButton(theme),
    submitButton: tournamentTeamStyles.submitButton,

    // Team management layout
    tabHeader: tournamentTeamStyles.tabHeader,

    // Team players dialog
    playersListDialog: tournamentTeamStyles.playersList(theme),
    getPlayerListItem: (isSelected: boolean, color: string) =>
      tournamentTeamStyles.playerListItem(theme, isSelected, color),
    getCaptainIcon: (isSelected: boolean, color: string) =>
      tournamentTeamStyles.captainIcon(theme, isSelected, color),
    removePlayerIcon: tournamentTeamStyles.removePlayerIcon(theme),
    emptyListPaper: tournamentTeamStyles.emptyListPaper(theme),
    addPlayerChip: tournamentTeamStyles.addPlayerChip,

    // Unassigned players list
    playerCard: tournamentTeamStyles.playerCard(theme),
    assignTeamSelect: tournamentTeamStyles.assignTeamSelect(theme),
    menuPaper: tournamentTeamStyles.menuPaper(theme),
    menuItem: tournamentTeamStyles.menuItem(theme),
    teamColorDot: tournamentTeamStyles.teamColorDot,
  };
};
