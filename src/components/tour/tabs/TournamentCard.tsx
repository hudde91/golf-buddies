// components/tour/tabs/TournamentCard.tsx
import React from "react";
import { format } from "date-fns";
import {
  CalendarToday as CalendarIcon,
  Place as PlaceIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { Tournament } from "../../../types/event";
import { getStatusColor } from "../../util";

// Import our domain-specific components
import {
  TournamentCard as TournamentCardComponent,
  TournamentInfoItem,
} from "../../../components/tournament";

interface TournamentCardProps {
  tournament: Tournament;
  onViewTournament: () => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onViewTournament,
}) => {
  const infoItems = [
    <TournamentInfoItem
      key="date"
      icon={<CalendarIcon />}
      text={`${format(
        new Date(tournament.startDate),
        "MMM d, yyyy"
      )} - ${format(new Date(tournament.endDate), "MMM d, yyyy")}`}
    />,
    <TournamentInfoItem
      key="location"
      icon={<PlaceIcon />}
      text={tournament.location}
    />,
    <TournamentInfoItem
      key="players"
      icon={<PeopleIcon />}
      text={`${tournament.players.length} player${
        tournament.players.length !== 1 ? "s" : ""
      }`}
    />,
  ];

  return (
    <TournamentCardComponent
      name={tournament.name}
      status={tournament.status}
      statusColor={tournament.status}
      infoItems={infoItems}
      onView={onViewTournament}
    />
  );
};

export default TournamentCard;
