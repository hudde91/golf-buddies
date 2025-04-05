// src/styles/hooks/useStyles.ts
import { useTheme } from "@mui/material/styles";
import {
  card,
  button,
  feedback,
  layout,
  text,
  icon,
  avatars,
  chips,
  tabs,
  tables,
  headers,
  divider,
  dialogs,
  inputs,
  navigation,
} from "../components";
import {
  infoItem,
  statusIndicator,
  playerCard,
  profileCard,
  tournamentCard,
  tournamentLeaderboard,
  tournamentScorecard,
  highlightsFeed,
} from "../patterns";
import { getStatusColor } from "../patterns/tournamentCard";
import { tournamentRounds } from "../patterns/tournamentRounds";
import { tournamentTeams } from "../patterns/tournamentTeams";
import { tournamentPlayers } from "../patterns/tournamentPlayers";
import { tournamentHighlights } from "../patterns/tournamentHighlights";
import { tour } from "../patterns/tour";

export const useStyles = () => {
  const theme = useTheme();

  return {
    // Card components
    card: {
      base: card.base(theme),
      glass: card.glass(theme),
      interactive: card.interactive(theme),
      event: card.event(theme),
      invitation: card.invitation(theme),
      profile: card.profile(theme),
      tournament: card.tournament(theme),
      feature: card.feature(theme),
      featureContent: card.featureContent,
      eventChipsContainer: card.eventChipsContainer,
      content: card.content,
      header: card.header,
      eventContent: card.eventContent,
      actions: {
        base: card.actions.base,
        centered: card.actions.centered,
        spaceBetween: card.actions.spaceBetween(theme),
      },
      media: card.media,
    },

    // Button styles
    button: {
      primary: button.primary(theme),
      secondary: button.secondary(theme),
      outlined: button.outlined(theme),
      danger: button.danger(theme),
      action: button.action(theme),
      cancel: button.cancel(theme),
      icon: button.icon(theme),
      accept: button.accept,
      create: button.create,
      viewDetails: button.viewDetails,
    },

    // Feedback components
    feedback: {
      emptyState: {
        container: feedback.emptyState.container(theme),
        icon: feedback.emptyState.icon(theme),
        title: feedback.emptyState.title(theme),
        description: feedback.emptyState.description(theme),
        action: feedback.emptyState.action,
      },
      loading: {
        container: feedback.loading.container,
        icon: feedback.loading.icon(theme),
        text: feedback.loading.text(theme),
      },
      dialog: {
        paper: feedback.dialog.paper(theme),
        content: feedback.dialog.content,
        title: feedback.dialog.title(theme),
        description: feedback.dialog.description(theme),
        actions: feedback.dialog.actions,
        centered: feedback.dialog.centered,
      },
      alert: {
        success: feedback.alert.success(theme),
        error: feedback.alert.error(theme),
        warning: feedback.alert.warning(theme),
        info: feedback.alert.info(theme),
      },
    },

    // Layout components
    layout: {
      page: layout.page,
      container: layout.container,
      section: {
        base: layout.section.base,
        withHeader: layout.section.withHeader,
        card: layout.section.card(theme),
      },
      grid: layout.grid,
      flex: layout.flex,
    },

    // Typography components
    text: {
      heading: {
        page: text.heading.page,
        section: text.heading.section,
        card: text.heading.card,
        profile: text.heading.profile(theme),
        dialog: text.heading.dialog,
      },
      body: {
        primary: text.body.primary(theme),
        secondary: text.body.secondary(theme),
        muted: text.body.muted(theme),
      },
      feature: {
        title: text.feature.title,
        description: text.feature.description(theme),
      },
      subtitle: {
        page: text.subtitle.page(theme),
        section: text.subtitle.section(theme),
        dialog: text.subtitle.dialog(theme),
      },
      dialog: {
        title: text.dialog.title,
        description: text.dialog.description(theme),
      },
      truncated: text.truncated,
      eventTitle: text.eventTitle,
      eventDescription: text.eventDescription(theme),
      notFoundTitle: text.notFoundTitle,
      emptyState: {
        title: text.emptyState.title,
        description: text.emptyState.description(theme),
      },
      eventHeader: {
        title: text.eventHeader.title,
        subtitle: text.eventHeader.subtitle(theme),
      },
      infoItem: text.infoItem(theme),
    },

    // Icon components
    icon: {
      base: icon.base(theme),
      size: icon.size,
      container: {
        base: icon.container.base(theme),
        primary: icon.container.primary(theme),
        secondary: icon.container.secondary(theme),
        feature: icon.container.feature(theme),
      },
      infoIcon: icon.infoIcon(theme),
      emptyState: icon.emptyState(theme),
      header: icon.header(theme),
    },

    // UI Patterns
    infoItem: {
      base: infoItem.base(theme),
      event: infoItem.event,
      profile: infoItem.profile(theme),
      container: infoItem.container,
    },

    // Helper functions for dynamic styling
    getStatusChip: (status: string) => {
      const color = getStatusColor(status, theme);
      return statusIndicator.chip(color, theme);
    },

    getTeamChip: (teamColor: string) => statusIndicator.team(teamColor, theme),

    divider: {
      standard: divider.standard(theme),
      section: divider.section(theme),
      vertical: divider.vertical(theme),
    },
    avatars: {
      standard: (teamColor?: string) => avatars.standard(theme, teamColor),
      profile: (teamColor?: string) => avatars.profile(theme, teamColor),
      player: (teamColor?: string) => avatars.player(theme, teamColor),
      leaderboard: (teamColor?: string) =>
        avatars.leaderboard(theme, teamColor),
      team: (color: string) => avatars.team(color),
      iconContainer: avatars.iconContainer(theme),
      badge: (color: string) => avatars.badge(theme, color),
    },
    chips: {
      status: {
        active: chips.status.active(theme),
        completed: chips.status.completed(theme),
        pending: chips.status.pending(theme),
        cancelled: chips.status.cancelled(theme),
        upcoming: chips.status.upcoming(theme),
        draft: chips.status.draft(theme),
        custom: (color: string) => chips.status.custom(theme, color),
      },
      eventType: {
        tournament: chips.eventType.tournament(theme),
        tour: chips.eventType.tour(theme),
        match: chips.eventType.match(theme),
        custom: (color: string) => chips.eventType.custom(theme, color),
      },
      badge: chips.badge(theme),
      team: (teamColor: string) => chips.team(theme, teamColor),
    },
    tabs: {
      container: tabs.container(theme),
      panel: tabs.panel,
      tourPanel: tabs.tourPanel,
    },
    tables: {
      container: tables.container(theme),
      headerCell: tables.headerCell(theme),
      dataCell: tables.dataCell(theme),
      getRowStyle: (index: number, highlight?: boolean) =>
        tables.getRowStyle(theme, index, highlight),
      leaderboard: {
        container: tables.leaderboard.container(theme),
        header: tables.leaderboard.header(theme),
        row: tables.leaderboard.row(theme),
        position: {
          first: tables.leaderboard.position.first(theme),
          second: tables.leaderboard.position.second(theme),
          third: tables.leaderboard.position.third(theme),
          default: tables.leaderboard.position.default(theme),
        },
      },
    },
    headers: {
      page: {
        container: headers.page.container,
        title: headers.page.title,
        subtitle: headers.page.subtitle(theme),
      },
      section: {
        container: headers.section.container,
        title: headers.section.title,
      },
      event: {
        container: headers.event.container,
        iconContainer: headers.event.iconContainer,
        icon: headers.event.icon,
        title: headers.event.title,
        subtitle: headers.event.subtitle(theme),
      },
      dashboard: {
        container: headers.dashboard.container,
        title: headers.dashboard.title,
        actions: headers.dashboard.actions,
      },
      tournament: {
        container: headers.tournament.container(theme),
        title: headers.tournament.title,
        subtitle: headers.tournament.subtitle(theme),
        background: headers.tournament.background,
      },
      tabs: {
        container: headers.tabs.container,
        title: headers.tabs.title,
        actions: headers.tabs.actions,
      },
      tour: {
        sectionTitle: headers.tour.sectionTitle,
        headerContainer: headers.tour.headerContainer,
      },
    },
    dialogs: {
      paper: dialogs.paper(theme),
      title: dialogs.title(theme),
      content: dialogs.content,
      actions: dialogs.actions(theme),
      closeButton: dialogs.closeButton(theme),
    },
    inputs: {
      formField: inputs.formField(theme),
      select: inputs.select(theme),
      slider: inputs.slider,
      menuPaper: inputs.menuPaper(theme),
      menuItem: inputs.menuItem(theme),
    },
    navigation: {
      backButton: navigation.backButton(theme),
      backButtonContainer: navigation.backButtonContainer,
      link: navigation.link(theme),
      breadcrumbs: navigation.breadcrumbs(theme),
    },
    getPositionStyle: (position: number) => {
      if (position === 0) return tables.leaderboard.position.first(theme);
      if (position === 1) return tables.leaderboard.position.second(theme);
      if (position === 2) return tables.leaderboard.position.third(theme);
      return tables.leaderboard.position.default(theme);
    },
    playerCard: {
      container: playerCard.container(theme),
      avatar: (teamColor?: string) => playerCard.avatar(theme, teamColor),
      content: playerCard.content,
      name: playerCard.name(theme),
      teamChip: (teamColor: string) => playerCard.teamChip(theme, teamColor),
    },
    profileCard: {
      container: profileCard.container(theme),
      sectionTitle: profileCard.sectionTitle(theme),
      formField: profileCard.formField(theme),
      avatar: profileCard.avatar(theme),
      typography: {
        heading: profileCard.typography.heading(theme),
        subtitle: profileCard.typography.subtitle(theme),
        body: profileCard.typography.body(theme),
        muted: profileCard.typography.muted(theme),
      },
      buttons: {
        edit: profileCard.buttons.edit(theme),
        save: profileCard.buttons.save(theme),
      },
      slider: profileCard.slider,
      achievements: profileCard.achievements,
    },
    tournamentCard: {
      container: tournamentCard.container(theme),
      media: tournamentCard.media,
      statusChip: (status: string) => {
        const color = getStatusColor(status, theme);
        return tournamentCard.statusChip(color, theme);
      },
      divider: tournamentCard.divider(theme),
      infoItem: tournamentCard.infoItem(theme),
      emptyState: tournamentCard.emptyState(theme),
      emptyStateIcon: tournamentCard.emptyStateIcon(theme),
      formStyles: tournamentCard.formStyles,
      dialogStyles: tournamentCard.dialogStyles,
      typography: tournamentCard.typography,
      loadingState: tournamentCard.loadingState,
    },
    tournamentScorecard: {
      scorecardHeader: tournamentScorecard.scorecardHeader,
      weatherDisplay: tournamentScorecard.weatherDisplay,
      scorecardSection: tournamentScorecard.scorecardSection,
      tableHeaderCell: tournamentScorecard.tableHeaderCell(theme),
      parRow: tournamentScorecard.parRow,
      playerScoreRow: tournamentScorecard.playerScoreRow,
      scoreCell: tournamentScorecard.scoreCell,
      roundsTab: tournamentScorecard.roundsTab,
      actionButtons: tournamentScorecard.actionButtons,
    },
    highlightsFeed: {
      container: highlightsFeed.container,
      header: highlightsFeed.header,
      headerTitle: highlightsFeed.headerTitle,
      headerSubtitle: highlightsFeed.headerSubtitle(theme),
      feedContainer: highlightsFeed.feedContainer(theme),
      feedItem: highlightsFeed.feedItem(theme),
      divider: highlightsFeed.divider(theme),
      itemHeader: highlightsFeed.itemHeader,
      playerName: highlightsFeed.playerName,
      getTypeChip: (color: string) => highlightsFeed.getTypeChip(color, theme),
      contentText: highlightsFeed.contentText(theme),
      highlightTitle: highlightsFeed.highlightTitle,
      mediaContainer: highlightsFeed.mediaContainer(theme),
      metadataContainer: highlightsFeed.metadataContainer,
      metadataText: highlightsFeed.metadataText(theme),
      getAvatarStyle: (type: string, color: string) =>
        highlightsFeed.getAvatarStyle(type, color, theme),
      emptyState: highlightsFeed.emptyState(theme),
      emptyStateIcon: highlightsFeed.emptyStateIcon(theme),
      emptyStateTitle: highlightsFeed.emptyStateTitle,
      emptyStateText: highlightsFeed.emptyStateText(theme),
      formDialog: highlightsFeed.formDialog,
      uploadBox: highlightsFeed.uploadBox(theme),
      uploadIcon: highlightsFeed.uploadIcon,
      uploadTitle: highlightsFeed.uploadTitle,
      uploadSubtext: highlightsFeed.uploadSubtext(theme),
      uploadError: highlightsFeed.uploadError,
      previewContainer: highlightsFeed.previewContainer(theme),
      removeButton: highlightsFeed.removeButton(theme),
      videoPlaceholder: highlightsFeed.videoPlaceholder,
      videoIcon: highlightsFeed.videoIcon(theme),
      videoText: highlightsFeed.videoText(theme),
      formField: highlightsFeed.formField(theme),
      getItemTypeColor: (type: string, mediaType?: string) =>
        highlightsFeed.getItemTypeColor(type, mediaType, theme),
    },
    tournamentRounds: {
      roundsTab: {
        header: tournamentRounds.roundsTab.header,
        emptyState: tournamentRounds.roundsTab.emptyState,
        emptyStateIcon: tournamentRounds.roundsTab.emptyStateIcon(theme),
        emptyStateTitle: tournamentRounds.roundsTab.emptyStateTitle,
        emptyStateMessage: tournamentRounds.roundsTab.emptyStateMessage(theme),
        roundsList: tournamentRounds.roundsTab.roundsList(theme),
        roundItem: tournamentRounds.roundsTab.roundItem(theme),
        roundItemAvatar: tournamentRounds.roundsTab.roundItemAvatar,
        avatar: tournamentRounds.roundsTab.avatar(theme),
        roundName: tournamentRounds.roundsTab.roundName,
        roundDate: tournamentRounds.roundsTab.roundDate(theme),
        deleteButton: tournamentRounds.roundsTab.deleteButton(theme),
        noSelection: tournamentRounds.roundsTab.noSelection,
        noSelectionText: tournamentRounds.roundsTab.noSelectionText(theme),
      },

      group: {
        container: tournamentRounds.group.container(theme),
        header: tournamentRounds.group.header(theme),
        headerContent: tournamentRounds.group.headerContent,
        title: tournamentRounds.group.title,
        playerCount: tournamentRounds.group.playerCount,
        chips: tournamentRounds.group.chips,
        timeChip: tournamentRounds.group.timeChip(theme),
        holeChip: tournamentRounds.group.holeChip(theme),
        playerChips: tournamentRounds.group.playerChips,
        playerChip: tournamentRounds.group.playerChip(theme),
      },

      ungrouped: {
        container: tournamentRounds.ungrouped.container,
        header: tournamentRounds.ungrouped.header(theme),
        playerList: tournamentRounds.ungrouped.playerList(theme),
        playerItem: tournamentRounds.ungrouped.playerItem(theme),
        playerName: tournamentRounds.ungrouped.playerName,
      },

      header: {
        container: tournamentRounds.header.container,
        title: tournamentRounds.header.title,
        courseChip: tournamentRounds.header.courseChip(theme),
        chipsContainer: tournamentRounds.header.chipsContainer,
        formatChip: tournamentRounds.header.formatChip(theme),
        holesChip: tournamentRounds.header.holesChip(theme),
      },

      weather: {
        container: tournamentRounds.weather.container(theme),
        title: tournamentRounds.weather.title,
        chipsContainer: tournamentRounds.weather.chipsContainer,
        loading: tournamentRounds.weather.loading,
        error: tournamentRounds.weather.error(theme),
        chips: {
          condition: tournamentRounds.weather.chips.condition(theme),
          temperature: tournamentRounds.weather.chips.temperature(theme),
          wind: tournamentRounds.weather.chips.wind(theme),
          humidity: tournamentRounds.weather.chips.humidity(theme),
        },
      },
    },
    tournamentTeams: {
      emptyState: tournamentTeams.emptyState,
      emptyStateIcon: tournamentTeams.emptyStateIcon(theme),
      emptyStateTitle: tournamentTeams.emptyStateTitle,
      emptyStateMessage: tournamentTeams.emptyStateMessage(theme),

      teamHeader: tournamentTeams.teamHeader,
      teamName: tournamentTeams.teamName,
      teamDivider: tournamentTeams.teamDivider(theme),
      teamInfoHeader: tournamentTeams.teamInfoHeader,
      teamInfoText: tournamentTeams.teamInfoText(theme),

      playersList: tournamentTeams.playersList(theme),
      playersListDialog: tournamentTeams.playersListDialog(theme),
      playerItem: tournamentTeams.playerItem(theme),
      noPlayersText: tournamentTeams.noPlayersText(theme),

      cardActions: tournamentTeams.cardActions,
      managePlayersButton: tournamentTeams.managePlayersButton(theme),
      editButton: tournamentTeams.editButton(theme),
      deleteButton: tournamentTeams.deleteButton(theme),

      dialogPaper: tournamentTeams.dialogPaper(theme),
      dialogTitle: tournamentTeams.dialogTitle(theme),
      dialogActions: tournamentTeams.dialogActions(theme),

      formField: {
        label: tournamentTeams.formField.label(theme),
        input: tournamentTeams.formField.input,
        outline: tournamentTeams.formField.outline(theme),
      },

      previewBox: tournamentTeams.previewBox,

      removePlayerIcon: tournamentTeams.removePlayerIcon(theme),
      addPlayerChip: tournamentTeams.addPlayerChip(theme),
      emptyListPaper: tournamentTeams.emptyListPaper(theme),

      playerCard: tournamentTeams.playerCard(theme),
      assignTeamSelect: tournamentTeams.assignTeamSelect(theme),
      menuPaper: tournamentTeams.menuPaper(theme),
      menuItem: tournamentTeams.menuItem(theme),
      teamColorDot: tournamentTeams.teamColorDot,

      header: tournamentTeams.header,
      cancelButton: tournamentTeams.cancelButton(theme),
      submitButton: tournamentTeams.submitButton(theme),

      // Functions that need parameters
      getTeamCard: (color: string) => tournamentTeams.teamCard(color)(theme),
      getTeamAvatar: (color: string) => tournamentTeams.teamAvatar(color),
      getCaptainChip: (color: string) =>
        tournamentTeams.captainChip(color)(theme),
      getCaptainBadge: (color: string) => tournamentTeams.captainBadge(color),
      getCaptainLabel: (color: string) => tournamentTeams.captainLabel(color),
      getPlayerName: (isCaptain: boolean) =>
        tournamentTeams.playerName(isCaptain),
      getColorSwatch: (color: string, isSelected: boolean) =>
        tournamentTeams.colorSwatch(color, isSelected),
      getPlayerListItem: (isSelected: boolean, color: string) =>
        tournamentTeams.playerListItem(isSelected, color)(theme),
      getCaptainIcon: (isSelected: boolean, color: string) =>
        tournamentTeams.captainIcon(isSelected, color),
    },
    tournamentHighlights: {
      container: tournamentHighlights.container,
      header: tournamentHighlights.header,
      headerTitle: tournamentHighlights.headerTitle,
      headerSubtitle: tournamentHighlights.headerSubtitle(theme),

      emptyState: tournamentHighlights.emptyState(theme),
      emptyStateIcon: tournamentHighlights.emptyStateIcon(theme),
      emptyStateTitle: tournamentHighlights.emptyStateTitle,
      emptyStateText: tournamentHighlights.emptyStateText(theme),

      feedContainer: tournamentHighlights.feedContainer(theme),
      feedItem: tournamentHighlights.feedItem(theme),
      divider: tournamentHighlights.divider(theme),

      itemHeader: tournamentHighlights.itemHeader,
      playerName: tournamentHighlights.playerName,
      contentText: tournamentHighlights.contentText(theme),
      highlightTitle: tournamentHighlights.highlightTitle,

      metadataContainer: tournamentHighlights.metadataContainer,
      metadataText: tournamentHighlights.metadataText(theme),

      mediaContainer: tournamentHighlights.mediaContainer,
      videoPlaceholder: tournamentHighlights.videoPlaceholder(theme),
      videoIcon: tournamentHighlights.videoIcon(theme),
      videoText: tournamentHighlights.videoText(theme),

      formDialog: {
        paper: tournamentHighlights.formDialog.paper(theme),
        title: tournamentHighlights.formDialog.title(theme),
        content: tournamentHighlights.formDialog.content,
        actions: tournamentHighlights.formDialog.actions(theme),
      },

      formField: tournamentHighlights.formField(theme),
      uploadBox: tournamentHighlights.uploadBox(theme),
      uploadIcon: tournamentHighlights.uploadIcon(theme),
      uploadTitle: tournamentHighlights.uploadTitle,
      uploadSubtext: tournamentHighlights.uploadSubtext(theme),
      uploadError: tournamentHighlights.uploadError,

      previewContainer: tournamentHighlights.previewContainer,
      removeButton: tournamentHighlights.removeButton,

      // Functions with params
      getItemTypeColor: (type: string, mediaType?: string) =>
        tournamentHighlights.getItemTypeColor(type, mediaType),
      getTypeChip: (color: string) =>
        tournamentHighlights.typeChip(color)(theme),
      getAvatarStyle: (type: string, color: string) =>
        tournamentHighlights.avatarStyle(type, color),
    },
    tournamentPlayers: {
      layouts: tournamentPlayers.layouts,

      playerTypography: {
        playerName: tournamentPlayers.playerTypography.playerName,
        playerDetail: tournamentPlayers.playerTypography.playerDetail(theme),
        profileTitle: tournamentPlayers.playerTypography.profileTitle,
        sectionTitle: tournamentPlayers.playerTypography.sectionTitle(theme),
        bio: tournamentPlayers.playerTypography.bio(theme),
        infoItemValue: tournamentPlayers.playerTypography.infoItemValue(theme),
      },

      buttons: {
        invite: tournamentPlayers.buttons.invite(theme),
        close: tournamentPlayers.buttons.close(theme),
      },

      playerCard: tournamentPlayers.playerCard(theme),
      profileDialog: tournamentPlayers.profileDialog(theme),
      closeButton: tournamentPlayers.closeButton(theme),
      dialogActions: tournamentPlayers.dialogActions(theme),
      profileDivider: tournamentPlayers.profileDivider(theme),
      profileInfoItem: tournamentPlayers.profileInfoItem,

      // Functions with params
      getPlayerAvatar: (teamColor?: string) =>
        tournamentPlayers.getPlayerAvatar(teamColor)(theme),
      getProfileAvatar: (teamColor?: string) =>
        tournamentPlayers.getProfileAvatar(teamColor)(theme),
      getInfoIconContainer: (color: string) =>
        tournamentPlayers.getInfoIconContainer(color)(theme),
      getInfoItemTitle: (color: string) =>
        tournamentPlayers.playerTypography.getInfoItemTitle(color),

      chips: {
        getTeamChip: (color: string) =>
          tournamentPlayers.chips.getTeamChip(color)(theme),
        getCaptainChip: (color: string) =>
          tournamentPlayers.chips.getCaptainChip(color)(theme),
      },
    },
    tournamentLeaderboard: {
      leaderboardEmptyState: tournamentLeaderboard.leaderboardEmptyState,
      leaderboardEmptyStateIcon:
        tournamentLeaderboard.leaderboardEmptyStateIcon(theme),
      tableContainer: tournamentLeaderboard.tableContainer(theme),
      headerCell: tournamentLeaderboard.headerCell(theme),
      positionHeaderCell: tournamentLeaderboard.positionHeaderCell(theme),
      dataCell: tournamentLeaderboard.dataCell(theme),
      centeredDataCell: tournamentLeaderboard.centeredDataCell(theme),
      leaderboardDivider: tournamentLeaderboard.leaderboardDivider(theme),

      leaderboardTypography: {
        title: tournamentLeaderboard.leaderboardTypography.title,
        body: tournamentLeaderboard.leaderboardTypography.body,
        noTeamText:
          tournamentLeaderboard.leaderboardTypography.noTeamText(theme),
        noDataText:
          tournamentLeaderboard.leaderboardTypography.noDataText(theme),
      },

      mobileInfoText: tournamentLeaderboard.mobileInfoText(theme),
      winnerChip: tournamentLeaderboard.winnerChip(theme),
      captainChip: tournamentLeaderboard.captainChip(theme),

      // Functions
      getTableRowStyle: (index: number) =>
        tournamentLeaderboard.getTableRowStyle(index)(theme),
      getPlayerAvatar: (teamColor?: string) =>
        tournamentLeaderboard.getPlayerAvatar(teamColor)(theme),
      getTeamAvatar: (color: string) =>
        tournamentLeaderboard.getTeamAvatar(color),
      getTeamChip: (color: string) =>
        tournamentLeaderboard.getTeamChip(color)(theme),
      formatScoreToPar: (score: number, par: number) =>
        tournamentLeaderboard.formatScoreToPar(score, par),
      getScoreVsParColor: (scoreToPar: string) =>
        tournamentLeaderboard.getScoreVsParColor(scoreToPar),
      getScoreDisplay: (
        score: number | null,
        position: number,
        leaderboard: any[]
      ) => tournamentLeaderboard.getScoreDisplay(score, position, leaderboard),
    },
    tour: {
      form: {
        container: tour.form.container,
        title: tour.form.title,
        formField: tour.form.formField(theme),
        actionButtons: tour.form.actionButtons,
        cancelButton: tour.form.cancelButton(theme),
        submitButton: tour.form.submitButton(theme),
      },

      header: {
        container: tour.header.container(theme),
        contentWrapper: tour.header.contentWrapper,
        statusChipsContainer: tour.header.statusChipsContainer,
        title: tour.header.title,
        description: tour.header.description(theme),
        infoContainer: tour.header.infoContainer,
        infoIcon: tour.header.infoIcon(theme),
        infoText: tour.header.infoText(theme),
        actionButtons: tour.header.actionButtons,
        editButton: tour.header.editButton(theme),
      },

      tournamentCard: tour.tournamentCard(theme),
      infoItem: tour.infoItem,
      divider: tour.divider(theme),

      teamCard: tour.teamCard(theme),
      teamContent: tour.teamContent,

      typography: {
        title: tour.typography.title,
        subtitle: tour.typography.subtitle(theme),
        muted: tour.typography.muted(theme),
      },

      // Functions that need parameters
      getStatusChip: (status: string) => tour.header.statusChip(status)(theme),
      getTourChip: tour.header.tourChip(theme),
      getTeamHeader: (color: string) => tour.teamHeader(color)(theme),
    },
  };
};
