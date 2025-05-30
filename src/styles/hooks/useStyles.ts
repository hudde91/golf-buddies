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
  profileCard,
  tournamentCard,
  tournamentLeaderboard,
  scorecard,
  bottomNavigation,
} from "../patterns";
import { getStatusColor } from "../patterns/tournamentCard";
import { tournamentRounds } from "../patterns/tournamentRounds";
import { tournamentTeams } from "../patterns/tournamentTeams";
import { tournamentPlayers } from "../patterns/tournamentPlayers";
import { tournamentHighlights } from "../patterns/tournamentHighlights";
import { tour } from "../patterns/tour";
import { mobilePatterns } from "../patterns/mobile";
import { friends } from "../patterns/friends";
import { course } from "../patterns/course";

export const useStyles = () => {
  const theme = useTheme();

  return {
    // Card components
    card: {
      base: card.base(),
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

    // Mobile patterns
    mobile: {
      container: {
        fullWidth: mobilePatterns.container.fullWidth(),
        edgeToEdge: mobilePatterns.container.edgeToEdge,
      },
      card: {
        bottomAnchored: mobilePatterns.card.bottomAnchored(theme),
        touchFeedback: mobilePatterns.card.touchFeedback,
      },
      button: {
        touchable: mobilePatterns.button.touchable(),
        fullWidthMobile: mobilePatterns.button.fullWidthMobile,
        touchFeedback: mobilePatterns.button.touchFeedback,
      },
      tabs: {
        scrollable: mobilePatterns.tabs.scrollable,
      },
      list: {
        touchable: mobilePatterns.list.touchable(theme),
        horizontal: mobilePatterns.list.horizontal,
      },
      dialog: {
        bottomSheet: mobilePatterns.dialog.bottomSheet(theme),
      },
      grid: {
        responsive: mobilePatterns.grid.responsive,
      },
      typography: {
        responsive: mobilePatterns.typography.responsive,
        adaptive: mobilePatterns.typography.adaptive,
      },
      spacing: {
        touch: mobilePatterns.spacing.touch,
      },
      layout: {
        stackedOnMobile: mobilePatterns.layout.stackedOnMobile,
      },
    },

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

    text: {
      heading: {
        page: text.heading.page,
        section: text.heading.section,
        card: text.heading.card,
        profile: text.heading.profile(),
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

    icon: {
      base: icon.base(theme),
      size: icon.size,
      container: {
        base: icon.container.base(),
        primary: icon.container.primary(theme),
        secondary: icon.container.secondary(theme),
        feature: icon.container.feature(theme),
      },
      infoIcon: icon.infoIcon(theme),
      emptyState: icon.emptyState(theme),
      header: icon.header(theme),
    },

    infoItem: {
      base: infoItem.base(theme),
      event: infoItem.event,
      profile: infoItem.profile(),
      container: infoItem.container,
    },

    getStatusChip: (status: string) => {
      const color = getStatusColor(status, theme);
      return statusIndicator.chip(color);
    },

    divider: {
      standard: divider.standard(theme),
      section: divider.section(theme),
      vertical: divider.vertical(theme),
    },

    avatars: {
      standard: (teamColor?: string) => avatars.standard(theme, teamColor),
      leaderboard: (teamColor?: string) =>
        avatars.leaderboard(theme, teamColor),
    },

    chips: {
      status: {
        active: chips.status.active(theme),
        custom: (color: string) => chips.status.custom(color),
      },
      eventType: {
        tournament: chips.eventType.tournament(theme),
        tour: chips.eventType.tour(theme),
        custom: (color: string) => chips.eventType.custom(color),
      },
    },

    tabs: {
      container: tabs.container(theme),
      panel: tabs.panel,
      tourPanel: tabs.tourPanel,
    },

    tables: {
      leaderboard: {
        header: tables.leaderboard.header(theme),
        row: tables.leaderboard.row(theme),
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
      menuPaper: inputs.menuPaper(theme),
      menuItem: inputs.menuItem(theme),
    },

    navigation: {
      backButton: navigation.backButton(theme),
      backButtonContainer: navigation.backButtonContainer,
      link: navigation.link(theme),
      breadcrumbs: navigation.breadcrumbs(theme),
    },

    bottomNavigation: {
      container: bottomNavigation.navigation.container,
      action: bottomNavigation.navigation.action,
    },

    getPositionStyle: (position: number) => {
      if (position === 0) return tables.leaderboard.position.first(theme);
      if (position === 1) return tables.leaderboard.position.second(theme);
      if (position === 2) return tables.leaderboard.position.third(theme);
      return tables.leaderboard.position.default(theme);
    },

    profileCard: {
      container: profileCard.container(theme),
      sectionTitle: profileCard.sectionTitle(theme),
      formField: profileCard.formField(theme),
      avatar: profileCard.avatar(theme),
      typography: {
        heading: profileCard.typography.heading(),
        subtitle: profileCard.typography.subtitle(theme),
        body: profileCard.typography.body(theme),
        muted: profileCard.typography.muted(theme),
      },
      buttons: {
        edit: profileCard.buttons.edit(theme),
        save: profileCard.buttons.save(theme),
      },
    },

    tournamentCard: {
      infoItem: tournamentCard.infoItem(theme),
      formStyles: tournamentCard.formStyles,
    },

    scorecard: {
      scoreCell: scorecard.scoreCell,
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
      getCaptainChip: (color: string) => tournamentTeams.captainChip(color),
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
      getTypeChip: (color: string) => tournamentHighlights.typeChip(color),
      getAvatarStyle: (color: string) =>
        tournamentHighlights.avatarStyle(color),
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
        tournamentPlayers.getInfoIconContainer(color),
      getInfoItemTitle: (color: string) =>
        tournamentPlayers.playerTypography.getInfoItemTitle(color),

      chips: {
        getTeamChip: (color: string) =>
          tournamentPlayers.chips.getTeamChip(color),
        getCaptainChip: (color: string) =>
          tournamentPlayers.chips.getCaptainChip(color),
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
      getTableRowStyle: () => tournamentLeaderboard.getTableRowStyle()(theme),
      getPlayerAvatar: (teamColor?: string) =>
        tournamentLeaderboard.getPlayerAvatar(teamColor)(theme),
      getTeamAvatar: (color: string) =>
        tournamentLeaderboard.getTeamAvatar(color),
      getTeamChip: (color: string) => tournamentLeaderboard.getTeamChip(color),
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

      typography: {
        title: tour.typography.title,
      },

      // Functions that need parameters
      getStatusChip: (status: string) => tour.header.statusChip(status)(theme),
      getTourChip: tour.header.tourChip(theme),
    },

    friends: {
      tabs: friends.tabs,
      list: {
        ...friends.list,
        responsive: friends.list.responsive(),
        actionsContainer: friends.list.actionsContainer,
      },
      empty: friends.empty,
      buttons: {
        ...friends.buttons,
        actionButton: friends.buttons.actionButton,
      },
    },
    course: {
      infoContainer: course.courseInfoContainer,
      header: {
        container: course.courseHeader.container,
        title: course.courseHeader.title,
        subtitle: course.courseHeader.subtitle(theme),
      },
      card: course.courseCard(theme),
      infoItem: course.courseInfoItem,
      icon: course.courseIcon,
      selection: {
        container: course.courseSelection.container,
        addButton: course.courseSelection.addButton(theme),
      },
      form: {
        sectionTitle: course.courseForm.sectionTitle(theme),
        formField: course.courseForm.formField(theme),
      },
      rating: {
        container: course.courseRating.container(theme),
        label: course.courseRating.label,
        value: course.courseRating.value(theme),
      },
      list: {
        item: course.courseList.item(theme),
        name: course.courseList.name,
        details: course.courseList.details(theme),
        ratings: course.courseList.ratings(theme),
      },
      chip: course.courseChip(theme),
    },
  };
};
