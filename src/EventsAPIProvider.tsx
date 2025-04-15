import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useGetUserEvents } from "./services/eventService";
import { updateEventStatuses } from "./services/utils/eventsUpdater";
import { Event } from "./types/event";

// Create a context to hold events data
interface EventsAPIContextType {
  events: Event[] | null;
  isLoading: boolean;
  error: Error | null;
  refetchEvents: () => void;
}

const EventsAPIContext = createContext<EventsAPIContextType>({
  events: null,
  isLoading: false,
  error: null,
  refetchEvents: () => {},
});

// Hook to use the events context
export const useEventsAPI = () => useContext(EventsAPIContext);

// Provider component to fetch and manage events
export const EventsAPIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // Store user ID in localStorage for background services
  useEffect(() => {
    if (isLoaded && userId) {
      localStorage.setItem("currentUserId", userId);
    }
  }, [isLoaded, userId]);

  // Use the React Query hook to fetch user events
  const {
    data: events,
    isLoading,
    error,
    refetch: refetchEvents,
  } = useGetUserEvents(userId || "");

  // Save events to localStorage for fallback and background services
  useEffect(() => {
    if (events && !isLoading) {
      const existingEvents = JSON.parse(localStorage.getItem("events") || "[]");

      // Merge with existing events, keeping unique events only
      const allEventIds = new Set(existingEvents.map((e: Event) => e.id));
      const newEvents = [...existingEvents];

      events.forEach((event: Event) => {
        if (!allEventIds.has(event.id)) {
          newEvents.push(event);
          allEventIds.add(event.id);
        }
      });

      localStorage.setItem("events", JSON.stringify(newEvents));
    }
  }, [events, isLoading]);

  // Initialize event status updater once authenticated
  useEffect(() => {
    if (isLoaded && userId && !initialized) {
      updateEventStatuses(userId);
      setInitialized(true);
    }
  }, [isLoaded, userId, initialized]);

  // Value to be provided by the context
  const contextValue: EventsAPIContextType = {
    events,
    isLoading,
    error: error as Error | null,
    refetchEvents,
  };

  return (
    <EventsAPIContext.Provider value={contextValue}>
      {children}
    </EventsAPIContext.Provider>
  );
};
