"use client";

import { UserRoundX, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyPatientStateProps {
  hasActiveFilters: boolean;
  onClearFilters?: () => void;
}

export const EmptyPatientState = ({
  hasActiveFilters,
  onClearFilters,
}: EmptyPatientStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16">
      <div className="p-5 bg-white border rounded-full shadow-sm">
        <UserRoundX className="h-10 w-10 text-slate-400" />
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No patients found
        </h3>
        <p className="text-sm text-slate-500 max-w-[250px] mx-auto">
          {hasActiveFilters
            ? "Try adjusting your search or filters."
            : "Your patient database is empty. Add a new record to get started."}
        </p>
      </div>
      {hasActiveFilters ? (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="mt-2 rounded-sm h-[40px] px-6"
        >
          Clear Filters
        </Button>
      ) : (
        <Link href="/patient-management/create">
          <Button className="mt-2 rounded-sm h-[40px] px-6">
            <Plus className="w-4 h-4 mr-2" />
            Register Patient
          </Button>
        </Link>
      )}
    </div>
  );
};
