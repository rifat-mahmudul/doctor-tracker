"use client";

import Link from "next/link";
import { Eye, Trash2, Edit, Users } from "lucide-react";
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

interface DoctorTableProps {
  doctors: IDoctor[];
  isLoading: boolean;
  onDeleteClick: (id: string) => void;
}

export const DoctorTable = ({
  doctors,
  isLoading,
  onDeleteClick,
}: DoctorTableProps) => {
  const columns = [
    "Doctor Name",
    "Specialization",
    "Hospital",
    "Contact",
    "Patients",
    "Actions",
  ];

  if (isLoading) {
    return (
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow>
            {columns.map((head) => (
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
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              {columns.map((_, i) => (
                <TableCell key={i}>
                  <Skeleton className="h-5 w-32 mx-auto" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-slate-100">
        <TableRow>
          {columns.map((head) => (
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
        {doctors.map((doctor) => (
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
            <TableCell className="text-center">
              <Link href={`/doctor-management/${doctor._id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 h-8 rounded-sm hover:bg-blue-50 hover:text-blue-600"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="font-semibold">
                    {doctor.patientCount || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    patients
                  </span>
                </Button>
              </Link>
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
                  onClick={() => onDeleteClick(doctor._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
