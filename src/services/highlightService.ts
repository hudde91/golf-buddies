import { v4 as uuidv4 } from "uuid";
import { ShoutOut, Highlight, Tournament, Tour, Event } from "../types/event";
import eventService from "./eventService";

class HighlightService {
  // Get shoutOuts for a specific event (tournament or tour)
  getShoutOuts(eventId: string, eventType: "tournament" | "tour"): ShoutOut[] {
    let event: Event | null = null;

    if (eventType === "tournament") {
      event = eventService.getTournamentById(eventId);
    } else if (eventType === "tour") {
      event = eventService.getTourById(eventId);
    }

    if (!event || !event.shoutOuts) {
      return [];
    }

    return event.shoutOuts;
  }

  // Get highlights for a specific event (tournament or tour)
  getHighlights(
    eventId: string,
    eventType: "tournament" | "tour"
  ): Highlight[] {
    let event: Event | null = null;

    if (eventType === "tournament") {
      event = eventService.getTournamentById(eventId);
    } else if (eventType === "tour") {
      event = eventService.getTourById(eventId);
    }

    if (!event || !event.highlights) {
      return [];
    }

    return event.highlights;
  }

  // Create a new highlight for an event (tournament or tour)
  createHighlight(
    eventId: string,
    eventType: "tournament" | "tour",
    playerId: string,
    title: string,
    mediaType: "image" | "video",
    description?: string,
    roundId?: string,
    mediaUrl?: string
  ): Event | null {
    const highlight: Highlight = {
      id: uuidv4(),
      eventId,
      eventType,
      playerId,
      title,
      description,
      roundId,
      mediaType,
      mediaUrl,
      timestamp: new Date().toISOString(),
    };

    let updatedEvent: Event | null = null;

    if (eventType === "tournament") {
      updatedEvent = eventService.addTournamentHighlight(eventId, highlight);
    } else if (eventType === "tour") {
      updatedEvent = eventService.addTourHighlight(eventId, highlight);
    }

    return updatedEvent;
  }

  // Create a new shoutOut for an event (tournament or tour)
  createShoutOut(
    eventId: string,
    eventType: "tournament" | "tour",
    playerId: string,
    roundId: string,
    holeNumber: number,
    type: "birdie" | "eagle" | "hole-in-one" | "custom",
    message?: string
  ): Event | null {
    const shoutOut: ShoutOut = {
      id: uuidv4(),
      eventId,
      eventType,
      playerId,
      roundId,
      holeNumber,
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    let updatedEvent: Event | null = null;

    if (eventType === "tournament") {
      updatedEvent = eventService.addTournamentShoutOut(eventId, shoutOut);
    } else if (eventType === "tour") {
      updatedEvent = eventService.addTourShoutOut(eventId, shoutOut);
    }

    return updatedEvent;
  }

  // Delete a highlight from an event
  deleteHighlight(
    eventId: string,
    eventType: "tournament" | "tour",
    highlightId: string
  ): Event | null {
    let updatedEvent: Event | null = null;

    if (eventType === "tournament") {
      updatedEvent = eventService.deleteTournamentHighlight(
        eventId,
        highlightId
      );
    } else if (eventType === "tour") {
      updatedEvent = eventService.deleteTourHighlight(eventId, highlightId);
    }

    return updatedEvent;
  }

  // Delete a shoutOut from an event
  deleteShoutOut(
    eventId: string,
    eventType: "tournament" | "tour",
    shoutOutId: string
  ): Event | null {
    let updatedEvent: Event | null = null;

    if (eventType === "tournament") {
      updatedEvent = eventService.deleteTournamentShoutOut(eventId, shoutOutId);
    } else if (eventType === "tour") {
      updatedEvent = eventService.deleteTourShoutOut(eventId, shoutOutId);
    }

    return updatedEvent;
  }
}

const highlightService = new HighlightService();
export default highlightService;
