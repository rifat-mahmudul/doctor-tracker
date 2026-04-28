"use client";

import { UserRoundX, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EmptyDoctorStateProps {
  onClearFilters?: () => void;
}

export const EmptyDoctorState = ({ onClearFilters }: EmptyDoctorStateProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16">
      <div className="p-5 bg-white border rounded-full shadow-sm">
        <UserRoundX className="h-10 w-10 text-slate-400" />
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No medical staff found
        </h3>
        <p className="text-sm text-slate-500 max-w-[250px] mx-auto">
          {onClearFilters
            ? "Try adjusting your search or filters."
            : "Your database is currently empty. Start by registering a new doctor."}
        </p>
      </div>
      {onClearFilters ? (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="mt-2 rounded-sm h-[40px] px-6"
        >
          Clear Filters
        </Button>
      ) : (
        <Button
          onClick={() => router.push("/doctor-management/create")}
          className="mt-2 rounded-sm h-[40px] px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Register Now
        </Button>
      )}
    </div>
  );
};
