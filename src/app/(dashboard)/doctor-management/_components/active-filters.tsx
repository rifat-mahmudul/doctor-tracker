"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveFiltersProps {
  searchTerm: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  specialization: string;
  hospital: string;
  onRemoveSearch: () => void;
  onRemoveStartDate: () => void;
  onRemoveEndDate: () => void;
  onRemoveSpecialization: () => void;
  onRemoveHospital: () => void;
}

export const ActiveFilters = ({
  searchTerm,
  startDate,
  endDate,
  specialization,
  hospital,
  onRemoveSearch,
  onRemoveStartDate,
  onRemoveEndDate,
  onRemoveSpecialization,
  onRemoveHospital,
}: ActiveFiltersProps) => {
  const hasActiveFilters =
    searchTerm ||
    startDate ||
    endDate ||
    (specialization && specialization !== "all") ||
    (hospital && hospital !== "all");

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t">
      {searchTerm && (
        <Badge variant="secondary" className="gap-1 rounded-sm">
          Search: {searchTerm}
          <X className="h-3 w-3 cursor-pointer ml-1" onClick={onRemoveSearch} />
        </Badge>
      )}
      {startDate && (
        <Badge variant="secondary" className="gap-1 rounded-sm">
          From: {format(startDate, "PP")}
          <X
            className="h-3 w-3 cursor-pointer ml-1"
            onClick={onRemoveStartDate}
          />
        </Badge>
      )}
      {endDate && (
        <Badge variant="secondary" className="gap-1 rounded-sm">
          To: {format(endDate, "PP")}
          <X
            className="h-3 w-3 cursor-pointer ml-1"
            onClick={onRemoveEndDate}
          />
        </Badge>
      )}
      {specialization && specialization !== "all" && (
        <Badge variant="secondary" className="gap-1 rounded-sm">
          {specialization}
          <X
            className="h-3 w-3 cursor-pointer ml-1"
            onClick={onRemoveSpecialization}
          />
        </Badge>
      )}
      {hospital && hospital !== "all" && (
        <Badge variant="secondary" className="gap-1 rounded-sm">
          {hospital}
          <X
            className="h-3 w-3 cursor-pointer ml-1"
            onClick={onRemoveHospital}
          />
        </Badge>
      )}
    </div>
  );
};
