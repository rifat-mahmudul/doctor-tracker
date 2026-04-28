"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Filter, ChevronDown, Calendar, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DoctorFiltersProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  specialization: string;
  hospital: string;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onSpecializationChange: (value: string) => void;
  onHospitalChange: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const DoctorFilters = ({
  startDate,
  endDate,
  specialization,
  hospital,
  onStartDateChange,
  onEndDateChange,
  onSpecializationChange,
  onHospitalChange,
  onClearFilters,
  activeFiltersCount,
}: DoctorFiltersProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: filterOptions } = useQuery({
    queryKey: ["doctorFilterOptions"],
    queryFn: async () => {
      const response = await axios.get("/api/doctors/filter-options");
      return response.data;
    },
  });

  return (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-[45px] rounded-sm gap-2 border-slate-200 relative"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 p-0 rounded-full"
            >
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 rounded-sm" align="end">
        <div className="space-y-4">
          <div className="font-semibold text-sm">Filter Doctors</div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Registration Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-[40px] rounded-sm border-slate-200"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={onStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-[40px] rounded-sm border-slate-200"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={onEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Specialization Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Specialization
            </label>
            <Select
              value={specialization}
              onValueChange={onSpecializationChange}
            >
              <SelectTrigger className="h-[40px] rounded-sm border-slate-200">
                <SelectValue placeholder="All Specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {filterOptions?.specializations?.map((spec: string) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hospital Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Hospital
            </label>
            <Select value={hospital} onValueChange={onHospitalChange}>
              <SelectTrigger className="h-[40px] rounded-sm border-slate-200">
                <SelectValue placeholder="All Hospitals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hospitals</SelectItem>
                {filterOptions?.hospitals?.map((hosp: string) => (
                  <SelectItem key={hosp} value={hosp}>
                    {hosp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex-1 h-[40px] rounded-sm border-slate-200"
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 h-[40px] rounded-sm"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
