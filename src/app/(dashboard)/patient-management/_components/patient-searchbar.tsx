"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientSearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const PatientSearchBar = ({
  searchTerm,
  onSearch,
}: PatientSearchBarProps) => {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9 h-[45px] rounded-sm border-slate-200"
      />
      {searchTerm && (
        <button
          onClick={() => onSearch("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
};
