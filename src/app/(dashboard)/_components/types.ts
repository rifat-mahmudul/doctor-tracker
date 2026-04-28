export interface IDoctorWorkload {
  _id: string;
  name: string;
  specialization: string;
  totalPatients: number;
}

export interface IPatientTrend {
  date: string;
  count: number;
  month?: string;
  year?: number;
}

export interface IDashboardStats {
  totalDoctors: number;
  totalPatients: number;
  monthlyGrowth: number;
  activeConsultations: number;
  patientsPerDoctor: IDoctorWorkload[];
  patientTrends: IPatientTrend[];
  recentActivities: IRecentActivity[];
}

export interface IRecentActivity {
  id: string;
  type: 'admission' | 'discharge' | 'appointment';
  patientName: string;
  doctorName: string;
  timestamp: string;
}

export interface IStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor: string;
  iconColor: string;
}