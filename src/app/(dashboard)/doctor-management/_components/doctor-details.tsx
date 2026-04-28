"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  Building2,
  Stethoscope,
  Users,
  Loader2,
  User,
  Trash2,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";

interface IPatient {
  _id: string;
  name: string;
  condition: string;
  createdAt: string;
}

interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone?: string;
  email?: string;
}

interface IDoctorDetails {
  doctor: IDoctor;
  patients: IPatient[];
}

const DoctorDetails = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const doctorId = params.id as string;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading } = useQuery<IDoctorDetails>({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/doctors/${doctorId}`);
      return data.data;
    },
    enabled: !!doctorId,
  });

  const { mutate: deletePatient, isPending: isDeleting } = useMutation({
    mutationFn: async (patientId: string) => {
      return await axios.delete(`/api/patients/${patientId}`);
    },
    onSuccess: () => {
      toast.success("Patient record removed successfully");
      queryClient.invalidateQueries({ queryKey: ["doctor", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setDeleteDialogOpen(false);
      setSelectedPatient(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete patient");
    },
  });

  const handleDeleteClick = (patientId: string, name: string) => {
    setSelectedPatient({ id: patientId, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPatient) {
      deletePatient(selectedPatient.id);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-white rounded-xl border shadow-sm">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium animate-pulse">
          Retrieving doctor profile...
        </p>
      </div>
    );
  }

  if (!data?.doctor) {
    return (
      <div className="p-10 text-center bg-white rounded-xl border border-dashed">
        <p className="text-muted-foreground font-medium">
          Doctor record not found.
        </p>
        <Button variant="link" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const { doctor, patients } = data;

  return (
    <div className="w-full space-y-6">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-sm border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {doctor.name}
              </h2>
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-sm"
              >
                Active Professional
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              {doctor.specialization}
            </p>
          </div>
        </div>
        <Link href={`/doctor-management/create/edit/${doctor._id}`}>
          <Button className="gap-2 rounded-sm h-[40px]">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-xl border shadow-sm overflow-hidden pt-0">
            <div className="h-32 bg-gradient-to-r from-slate-500 to-slate-900" />
            <CardContent className="pt-0 -mt-12">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <User className="h-12 w-12 text-slate-400" />
              </div>
              {/* Profile Details (Hospital, Email, Phone) */}
              <div className="space-y-4 pt-4 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Building2 className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                      Hospital
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-none">
                      {doctor.hospital}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                      Email
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-none">
                      {doctor.email || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Phone className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                      Contact
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-none">
                      {doctor.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="rounded-xl border shadow-sm p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Patients Managed
                </p>
                <h3 className="text-4xl font-bold text-slate-900 mt-1">
                  {patients?.length || 0}
                </h3>
              </div>
              <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Patients Table */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-bold text-slate-800">
                  Recent Patients
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {patients && patients.length > 0 ? (
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="font-bold py-4 text-center">
                        Name
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Condition
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        Admitted On
                      </TableHead>
                      <TableHead className="text-right font-bold px-6 text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className=" text-center">
                    {patients.map((p: IPatient) => (
                      <TableRow
                        key={p._id}
                        className="hover:bg-slate-50/40 transition-colors group"
                      >
                        <TableCell className="font-semibold text-slate-900 py-4">
                          {p.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-normal border-slate-200 text-slate-600"
                          >
                            {p.condition}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {new Date(p.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-center px-6 space-x-3">
                          <Link href={`/patient-management/${p._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 rounded-sm border-slate-200 hover:bg-slate-100 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={isDeleting}
                            className="h-8 w-8 rounded-sm text-destructive hover:bg-destructive/10 hover:text-destructive border-slate-200"
                            onClick={() => handleDeleteClick(p._id, p.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-16 text-center space-y-3">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200">
                    <Users className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-800 font-bold">No active patients</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Simple Dialog for Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Patient Record?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedPatient?.name}
              </span>
              &apos;s record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-sm h-[45px] border-slate-200 flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="rounded-sm h-[45px] flex-1 sm:flex-none"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Patient"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDetails;
