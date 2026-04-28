"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Users,
  Stethoscope,
  TrendingUp,
  Activity,
  Loader2,
} from "lucide-react";
import { StatsCard } from "./stats-card";
import { PatientTrendChart } from "./patient-trend-chart";
import { WorkloadChart } from "./workload-chart";
import { RecentActivities } from "./recent-activities";
import { IDashboardStats } from "./types";

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery<IDashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/stats");
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-slate-700 font-semibold text-lg">
            Loading Dashboard
          </p>
          <p className="text-slate-400 text-sm">
            Fetching real-time analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="h-16 w-16 text-slate-300 mx-auto" />
          <p className="text-slate-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={<Stethoscope className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
          bgColor="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatsCard
          title="Active Consultations"
          value={stats.activeConsultations}
          icon={<Activity className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
          bgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatsCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{
            value: stats.monthlyGrowth,
            isPositive: stats.monthlyGrowth > 0,
          }}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PatientTrendChart data={stats.patientTrends} />
        <WorkloadChart data={stats.patientsPerDoctor} />
      </div>

      {/* Recent Activities Section */}
      {stats.recentActivities && stats.recentActivities.length > 0 && (
        <RecentActivities activities={stats.recentActivities} />
      )}
    </div>
  );
};

export default Dashboard;
