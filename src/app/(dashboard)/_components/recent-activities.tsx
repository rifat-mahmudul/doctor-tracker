"use client";

import { Clock, UserPlus, UserMinus, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IRecentActivity } from "./types";

interface RecentActivitiesProps {
  activities: IRecentActivity[];
}

const getActivityIcon = (type: IRecentActivity["type"]) => {
  switch (type) {
    case "admission":
      return <UserPlus className="h-4 w-4 text-emerald-600" />;
    case "discharge":
      return <UserMinus className="h-4 w-4 text-red-600" />;
    case "appointment":
      return <CalendarDays className="h-4 w-4 text-blue-600" />;
  }
};

const getActivityBadge = (type: IRecentActivity["type"]) => {
  switch (type) {
    case "admission":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-sm">
          Admitted
        </Badge>
      );
    case "discharge":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 rounded-sm">
          Discharged
        </Badge>
      );
    case "appointment":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-sm">
          Appointment
        </Badge>
      );
  }
};

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <Card className="rounded-xl border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50/50 to-white">
        <CardTitle className="text-lg font-bold text-slate-800">
          Recent Activities
        </CardTitle>
        <p className="text-xs text-slate-500">
          Latest patient management updates
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.patientName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Assigned to Dr. {activity.doctorName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getActivityBadge(activity.type)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  {new Date(activity.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
