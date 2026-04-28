"use client";

import Link from "next/link";
import { Eye, Trash2, Edit } from "lucide-react";
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

interface PatientTableProps {
  patients: IPatient[];
  isLoading: boolean;
  onDeleteClick: (id: string) => void;
}

export const PatientTable = ({
  patients,
  isLoading,
  onDeleteClick,
}: PatientTableProps) => {
  const columns = [
    "Patient Name",
    "Condition",
    "Assigned Doctor",
    "Admitted Date",
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
          {Array.from({ length: 15 }).map((_, index) => (
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
        {patients.map((patient) => (
          <TableRow
            key={patient._id}
            className="hover:bg-slate-50/50 transition-colors group"
          >
            <TableCell className="font-medium text-slate-900 text-center">
              {patient.name}
            </TableCell>
            <TableCell className="text-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-tighter">
                {patient.condition || "General"}
              </span>
            </TableCell>
            <TableCell className="text-slate-600 text-center">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800">
                  {patient.doctorId?.name}
                </span>
                <span className="text-[10px] uppercase text-muted-foreground">
                  {patient.doctorId?.specialization}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-slate-600 text-center">
              {new Date(patient.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="py-3 text-center">
              <div className="flex justify-center items-center gap-2">
                <Link href={`/patient-management/${patient._id}`}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-sm border-slate-200 hover:bg-slate-100 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/patient-management/edit-patient/${patient._id}`}>
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
                  onClick={() => onDeleteClick(patient._id)}
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
