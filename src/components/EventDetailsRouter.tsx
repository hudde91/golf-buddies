import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../pages/NotFound";
import RoundDetails from "../pages/RoundDetails";
import TourDetails from "../pages/TourDetails";
import TournamentDetails from "../pages/TournamentDetails";
import eventService, { useGetEventById } from "../services/eventService";
import Loading from "./Loading";

// Component to route to either TournamentDetails, TourDetails, or RoundDetails based on event type
const EventDetailsRouter: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventType, setEventType] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  // Try to use the new API hook first
  const {
    data: apiEvent,
    isLoading: apiIsLoading,
    error: apiError,
  } = useGetEventById(id || "");

  useEffect(() => {
    // Only run this effect if we don't have API data and the API call is not loading
    if (!id || apiEvent || apiIsLoading) return;

    const fetchEventType = async () => {
      setIsLoading(true);
      try {
        // Fallback to the synchronous method if API fails
        const event = await eventService.getEventByIdSync(id);
        if (event) {
          setEventType(event.type);
        } else {
          console.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event type:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventType();
  }, [id, apiEvent, apiIsLoading]);

  // If API data is available, use that
  if (apiEvent) {
    if (apiEvent.type === "tour") {
      return <TourDetails />;
    } else if (apiEvent.type === "round") {
      return <RoundDetails />;
    } else if (apiEvent.type === "tournament") {
      return <TournamentDetails />;
    } else {
      return <NotFound />;
    }
  }

  // Otherwise use the fallback data
  if (apiIsLoading || isLoading) {
    return <Loading />;
  }

  if (apiError) {
    console.error("Error fetching event:", apiError);
  }

  // Route based on the event type from the synchronous call
  if (eventType === "tour") {
    return <TourDetails />;
  } else if (eventType === "round") {
    return <RoundDetails />;
  } else if (eventType === "tournament") {
    return <TournamentDetails />;
  } else {
    return <NotFound />;
  }
};

export default EventDetailsRouter;
