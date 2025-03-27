import achievementService from "../achievementService";
import eventService from "../eventService";

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

// Function to update event statuses and process achievements
export const updateEventStatuses = (): void => {
  if (shouldUpdateStatuses()) {
    // Update event statuses
    eventService.updateEventStatuses();

    // Process any achievements for completed events
    achievementService.checkAndProcessCompletedEvents();

    localStorage.setItem("lastEventStatusUpdate", new Date().toISOString());
  }
};

export const initializeEventUpdater = (): void => {
  updateEventStatuses();

  const checkInterval = 1000 * 60 * 60; // Check every hour
  setInterval(updateEventStatuses, checkInterval);
};
