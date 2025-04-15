import achievementService from "../achievementService";
import eventService from "../eventService";

const API_BASE_URL =
  "https://golf-buddies-epfddeddfqdhbtgy.westeurope-01.azurewebsites.net/api";

const shouldUpdateStatuses = (): boolean => {
  const lastUpdate = localStorage.getItem("lastEventStatusUpdate");

  if (!lastUpdate) {
    return true;
  }

  // Only update once per day
  const lastUpdateDate = new Date(lastUpdate);
  const now = new Date();

  // Check if the last update was on a different date
  return (
    lastUpdateDate.getDate() !== now.getDate() ||
    lastUpdateDate.getMonth() !== now.getMonth() ||
    lastUpdateDate.getFullYear() !== now.getFullYear()
  );
};

// Function to fetch events directly using fetch API instead of React Query
const fetchUserEvents = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${userId}/events`);
    if (!response.ok) {
      throw new Error(`API error with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(
      "API fetch failed in events updater, falling back to local storage"
    );
    return eventService.getUserEvents(userId);
  }
};

// Function to update event statuses and process achievements
export const updateEventStatuses = async (userId?: string): Promise<void> => {
  if (shouldUpdateStatuses()) {
    try {
      let events;

      // If userId is provided, try to get events from API first
      if (userId) {
        events = await fetchUserEvents(userId);
      } else {
        // Otherwise, use local events
        events = eventService.getAllEvents();
      }

      // Update event statuses
      eventService.updateEventStatuses();

      // Process any achievements for completed events
      achievementService.checkAndProcessCompletedEvents(events);

      localStorage.setItem("lastEventStatusUpdate", new Date().toISOString());
    } catch (error) {
      console.error("Error updating event statuses:", error);
    }
  }
};

export const initializeEventUpdater = (): void => {
  // Get the current user ID if available
  const userIdFromStorage = localStorage.getItem("currentUserId");

  // Initial update
  updateEventStatuses(userIdFromStorage || undefined);

  const checkInterval = 1000 * 60 * 60; // Check every hour

  // Set up recurring checks
  setInterval(() => {
    const currentUserId = localStorage.getItem("currentUserId");
    updateEventStatuses(currentUserId || undefined);
  }, checkInterval);
};
