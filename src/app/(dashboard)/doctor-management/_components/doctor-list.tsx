"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Eye, Trash2, Loader2, UserRoundX, Edit } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone?: string;
  email?: string;
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

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["doctors", page],
    queryFn: async () => {
      const response = await axios.get(`/api/doctors?page=${page}&limit=10`);
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

  return (
    <div className="w-full space-y-6">
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

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              {[
                "Doctor Name",
                "Specialization",
                "Hospital",
                "Contact",
                "Actions",
              ].map((head) => (
                <TableHead
                  key={head}
                  className="py-4 font-bold text-slate-800 text-center uppercase text-xs tracking-wider"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-5 w-32 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((doctor) => (
                <TableRow
                  key={doctor._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <TableCell className="font-medium text-slate-900 text-center">
                    {doctor.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tighter">
                      {doctor.specialization}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-center">
                    {doctor.hospital}
                  </TableCell>
                  <TableCell className="text-slate-600 text-center">
                    {doctor.phone || "N/A"}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Link href={`/doctor-management/${doctor._id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-sm border-slate-200 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/doctor-management/create/edit/${doctor._id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-sm border-slate-200 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-sm border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                        onClick={() => setDeleteId(doctor._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-[400px] text-center bg-slate-50/30"
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-5 bg-white border rounded-full shadow-sm">
                      <UserRoundX className="h-10 w-10 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        No medical staff found
                      </h3>
                      <p className="text-sm text-slate-500 max-w-[250px] mx-auto">
                        Your database is currently empty. Start by registering a
                        new doctor.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/doctor-management/create")}
                      className="mt-2 rounded-sm h-[40px] px-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Register Now
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data && data.data.length > 0 && (
          <div className="p-4 border-t flex items-center justify-between bg-white">
            <div className="text-sm text-muted-foreground">
              Showing page {page} of {data.pagination.totalPages}
            </div>
            <Pagination className="justify-end w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`cursor-pointer rounded-sm ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink isActive className="rounded-sm h-9 w-9">
                    {page}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((p) =>
                        Math.min(data.pagination.totalPages, p + 1),
                      )
                    }
                    className={`cursor-pointer rounded-sm ${page >= data.pagination.totalPages ? "pointer-events-none opacity-50" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-[400px] rounded-sm">
          <DialogHeader>
            <DialogTitle>Permanent Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this doctor? All associated
              records will be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="h-[45px] rounded-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteDoctor(deleteId)}
              disabled={isDeleting}
              className="h-[45px] rounded-sm min-w-[100px]"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorList;
