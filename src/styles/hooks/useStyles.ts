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
import { infoItem, statusIndicator } from "../patterns";
import { getStatusColor } from "../../components/util";

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
        title: feedback.emptyState.title,
        description: feedback.emptyState.description(theme),
      },
      loading: feedback.loading,
      // placeholder: feedback.placeholder,
      // error: feedback.error,
      // invitationEmpty: feedback.invitationEmpty(theme),
      // eventEmpty: feedback.eventEmpty(theme),
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
      },
      dialog: {
        title: text.dialog.title,
        description: text.dialog.description(theme),
      },
      truncated: text.truncated,
      eventTitle: text.eventTitle,
      eventDescription: text.eventDescription(theme),
      notFoundTitle: text.notFoundTitle,
    },

    // Icon components
    icon: {
      base: icon.base(theme),
      size: icon.size,
      container: {
        primary: icon.container.primary(theme),
        secondary: icon.container.secondary(theme),
        feature: icon.container.feature(theme),
      },
      info: icon.infoIcon(theme),
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

    // NEW ADDITIONS

    // Avatar styles
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

    // Chip styles
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

    // Tab styles
    tabs: {
      container: tabs.container(theme),
      panel: tabs.panel,
      tourPanel: tabs.tourPanel,
    },

    // Table styles
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

    // Header styles
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

    // Dialog components
    dialogs: {
      paper: dialogs.paper(theme),
      title: dialogs.title(theme),
      content: dialogs.content,
      actions: dialogs.actions(theme),
      closeButton: dialogs.closeButton(theme),
    },

    // Form input components
    inputs: {
      formField: inputs.formField(theme),
      select: inputs.select(theme),
      slider: inputs.slider,
      menuPaper: inputs.menuPaper(theme),
      menuItem: inputs.menuItem(theme),
    },

    // Navigation components
    navigation: {
      backButton: navigation.backButton(theme),
      backButtonContainer: navigation.backButtonContainer,
      link: navigation.link(theme),
      breadcrumbs: navigation.breadcrumbs(theme),
    },

    // Helper functions
    getPositionStyle: (position: number) => {
      if (position === 0) return tables.leaderboard.position.first(theme);
      if (position === 1) return tables.leaderboard.position.second(theme);
      if (position === 2) return tables.leaderboard.position.third(theme);
      return tables.leaderboard.position.default(theme);
    },
  };
};
