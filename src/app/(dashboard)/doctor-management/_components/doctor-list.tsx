"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DoctorSearchBar } from "./doctor-searchbar";
import { DoctorFilters } from "./doctor-filters";
import { ActiveFilters } from "./active-filters";
import { DoctorTable } from "./doctor-table";
import { EmptyDoctorState } from "./exmpty-doctor-state";
import { DoctorPagination } from "./doctor-pagination";
import { DeleteDoctorDialog } from "./delete-doctor-dialog";

interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone?: string;
  email?: string;
  patientCount?: number;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: IDoctor[];
  pagination: {
    totalDocs: number;
    totalPages: number;
    currentPage: number;
  };
}

const DoctorList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [specialization, setSpecialization] = useState<string>("");
  const [hospital, setHospital] = useState<string>("");

  // Debounce search
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
    setSpecialization("");
    setHospital("");
    setPage(1);
  };

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: [
      "doctors",
      page,
      debouncedSearch,
      startDate,
      endDate,
      specialization,
      hospital,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
      if (specialization && specialization !== "all")
        params.append("specialization", specialization);
      if (hospital && hospital !== "all") params.append("hospital", hospital);

      const response = await axios.get(`/api/doctors?${params.toString()}`);
      return response.data;
    },
  });

  const { mutate: deleteDoctor, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/doctors/${id}`);
    },
    onSuccess: () => {
      toast.success("Doctor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete doctor");
    },
  });

  const activeFiltersCount = [
    debouncedSearch,
    startDate,
    endDate,
    specialization && specialization !== "all",
    hospital && hospital !== "all",
  ].filter(Boolean).length;

  const hasData = data?.data && data.data.length > 0;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Doctors Directory
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all registered medical professionals.
          </p>
        </div>
        <Button
          onClick={() => router.push("/doctor-management/create")}
          className="h-[45px] rounded-sm gap-2 px-6 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Doctor
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <DoctorSearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          <DoctorFilters
            startDate={startDate}
            endDate={endDate}
            specialization={specialization}
            hospital={hospital}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSpecializationChange={setSpecialization}
            onHospitalChange={setHospital}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </div>
        <ActiveFilters
          searchTerm={debouncedSearch}
          startDate={startDate}
          endDate={endDate}
          specialization={specialization}
          hospital={hospital}
          onRemoveSearch={() => handleSearch("")}
          onRemoveStartDate={() => setStartDate(undefined)}
          onRemoveEndDate={() => setEndDate(undefined)}
          onRemoveSpecialization={() => setSpecialization("")}
          onRemoveHospital={() => setHospital("")}
        />
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <DoctorTable
          doctors={data?.data || []}
          isLoading={isLoading}
          onDeleteClick={setDeleteId}
        />

        {!isLoading && !hasData && (
          <EmptyDoctorState
            onClearFilters={activeFiltersCount > 0 ? clearFilters : undefined}
          />
        )}

        {hasData && (
          <DoctorPagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteDoctorDialog
        isOpen={!!deleteId}
        isDeleting={isDeleting}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteDoctor(deleteId)}
      />
    </div>
  );
};

export default DoctorList;
