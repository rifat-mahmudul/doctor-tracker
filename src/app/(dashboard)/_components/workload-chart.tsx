"use client";

import { Activity, UserCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDoctorWorkload } from "./types";

interface WorkloadChartProps {
  data: IDoctorWorkload[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec489a",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 min-w-[200px]">
        <p className="text-sm font-semibold text-slate-900">
          {payload[0].payload.name}
        </p>
        <p className="text-xs text-slate-500">
          {payload[0].payload.specialization}
        </p>
        <div className="mt-2 pt-2 border-t border-slate-100">
          <p className="text-2xl font-bold text-slate-900">
            {payload[0].value}
          </p>
          <p className="text-xs text-slate-500">assigned patients</p>
        </div>
      </div>
    );
  }
  return null;
};

export const WorkloadChart = ({ data }: WorkloadChartProps) => {
  return (
    <Card className="rounded-xl border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-slate-50/50 to-white pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold text-slate-800">
            Doctor Workload Distribution
          </CardTitle>
          <p className="text-xs text-slate-500">
            Number of patients assigned per doctor
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
          <Activity className="h-4 w-4 text-emerald-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                width={100}
                tickFormatter={(val) =>
                  val.length > 15 ? `${val.substring(0, 12)}...` : val
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="totalPatients" radius={[0, 4, 4, 0]} barSize={30}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
