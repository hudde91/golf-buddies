import { Tournament, Tour } from "../../types/event";
import eventService from "../eventService";

/**
 * Utility function to check if the current user is the creator of an event or tournament
 *
 * @param eventOrId - The event object or event/tournament ID to check
 * @param userId - The current user ID
 * @returns Boolean indicating if the user is the creator
 */
export const isCreator = (
  eventOrId: Event | Tournament | Tour | string,
  userId: string
): boolean => {
  // If eventOrId is a string (ID), fetch the corresponding event or tournament
  if (typeof eventOrId === "string") {
    // Try to get as tournament first (most common case)
    const tournament = eventService.getTournamentById(eventOrId);
    if (tournament) {
      return tournament.createdBy === userId;
    }

    // If not found as tournament, try to get as event
    const event = eventService.getEventById(eventOrId);
    if (!event) return false;

    // Check based on event type
    if (event.type === "tournament") {
      return (event.data as Tournament).createdBy === userId;
    } else if (event.type === "tour") {
      return (event.data as Tour).createdBy === userId;
    }

    return false;
  }

  // If eventOrId is an Event object
  if ("type" in eventOrId && "data" in eventOrId) {
    if (eventOrId.type === "tournament") {
      return (eventOrId.data as Tournament).createdBy === userId;
    } else if (eventOrId.type === "tour") {
      return (eventOrId.data as Tour).createdBy === userId;
    }
    return false;
  }

  // If eventOrId is a Tournament or Tour object
  if ("createdBy" in eventOrId) {
    return eventOrId.createdBy === userId;
  }

  return false;
};

/**
 * Async version of isCreator that gets the current user automatically
 *
 * @param eventOrId - The event object or event/tournament ID to check
 * @returns Promise<boolean> indicating if the current user is the creator
 */
export const isCurrentUserCreator = async (
  eventOrId: Event | Tournament | Tour | string
): Promise<boolean> => {
  const currentUser = await eventService.getCurrentUser();
  if (!currentUser) return false;

  return isCreator(eventOrId, currentUser.id);
};

export default { isCreator, isCurrentUserCreator };
