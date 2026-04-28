"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { PatientHeader } from "./patient-header";
import { PatientSearchBar } from "./patient-searchbar";
import { PatientFilters } from "./patient-filters";
import { ActivePatientFilters } from "./active-patient-filters";
import { PatientTable } from "./patient-table";
import { EmptyPatientState } from "./empty-patient-state";
import { PatientPagination } from "./patient-pagination";
import { DeletePatientDialog } from "./delete-patient-dialog";

interface IPatient {
  _id: string;
  name: string;
  condition: string;
  doctorId: {
    _id: string;
    name: string;
    specialization: string;
  };
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: IPatient[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const PatientList = () => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [condition, setCondition] = useState<string>("");

  // Debounce search input
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStartDate(undefined);
    setEndDate(undefined);
    setCondition("");
    setPage(1);
  };

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: [
      "patients",
      page,
      debouncedSearch,
      startDate,
      endDate,
      condition,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
      if (condition && condition !== "all")
        params.append("condition", condition);

      const response = await axios.get(`/api/patients?${params.toString()}`);
      return response.data;
    },
  });

  const { mutate: deletePatient, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/patients/${id}`);
    },
    onSuccess: () => {
      toast.success("Patient record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete patient");
    },
  });

  const activeFiltersCount = [
    debouncedSearch,
    startDate,
    endDate,
    condition && condition !== "all",
  ].filter(Boolean).length;

  const hasData = data?.data && data.data.length > 0;

  return (
    <div className="w-full space-y-6">
      <PatientHeader />

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <PatientSearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          <PatientFilters
            startDate={startDate}
            endDate={endDate}
            condition={condition}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onConditionChange={setCondition}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </div>
        <ActivePatientFilters
          searchTerm={debouncedSearch}
          startDate={startDate}
          endDate={endDate}
          condition={condition}
          onRemoveSearch={() => handleSearch("")}
          onRemoveStartDate={() => setStartDate(undefined)}
          onRemoveEndDate={() => setEndDate(undefined)}
          onRemoveCondition={() => setCondition("")}
        />
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <PatientTable
          patients={data?.data || []}
          isLoading={isLoading}
          onDeleteClick={setDeleteId}
        />

        {!isLoading && !hasData && (
          <EmptyPatientState
            hasActiveFilters={activeFiltersCount > 0}
            onClearFilters={clearFilters}
          />
        )}

        {hasData && (
          <PatientPagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Delete Dialog */}
      <DeletePatientDialog
        isOpen={!!deleteId}
        isDeleting={isDeleting}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deletePatient(deleteId)}
      />
    </div>
  );
};

export default PatientList;
