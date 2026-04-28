"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const PatientHeader = () => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Patients Information
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and monitor patient admissions and conditions.
        </p>
      </div>
      <Link href="/patient-management/create">
        <Button className="h-[45px] rounded-sm gap-2 px-6 shadow-sm">
          <Plus className="w-4 h-4" />
          Add New Patient
        </Button>
      </Link>
    </div>
  );
};
