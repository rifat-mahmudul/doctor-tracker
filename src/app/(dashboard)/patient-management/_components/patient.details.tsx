"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit3,
  Stethoscope,
  User,
  Activity,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const PatientDetails = () => {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id;

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/patients/${patientId}`);
      return data.data;
    },
    enabled: !!patientId,
  });

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-muted-foreground animate-pulse">
          Loading patient records...
        </p>
      </div>
    );
  }

  if (!patient)
    return <div className="text-center p-10">Patient not found!</div>;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-sm border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Patient Profile
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 rounded-sm"
              >
                ID: {patient._id.slice(-6).toUpperCase()}
              </Badge>
            </h2>
          </div>
        </div>
        <Link href={`/patient-management/edit-patient/${patient._id}`}>
          <Button className="gap-2 rounded-sm h-[40px]">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info Card */}
        <Card className="rounded-xl border shadow-sm lg:col-span-1 overflow-hidden pt-0">
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <CardContent className="pt-0 -mt-12 text-center">
            <div className="relative inline-block">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center mx-auto shadow-sm">
                <User className="h-12 w-12 text-slate-400" />
              </div>
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 border-4 border-white rounded-full" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              {patient.name}
            </h3>
            <p className="text-sm text-muted-foreground">General Patient</p>

            <div className="mt-6 space-y-4 text-left border-t pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  Admitted: {new Date(patient.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  Last Update:{" "}
                  {new Date(patient.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Medical Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Condition */}
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <Activity className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg font-bold">
                Medical Condition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-lg">
                <p className="text-slate-700 leading-relaxed font-medium">
                  {patient.condition}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Doctor */}
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <Stethoscope className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg font-bold">
                Attending Specialist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.doctorId ? (
                <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {patient.doctorId.name}
                      </p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                        {patient.doctorId.specialization}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No doctor assigned yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
