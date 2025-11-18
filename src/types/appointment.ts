// types/appointment.ts

export type AppointmentStatus = 
  | "Não Confirmada" 
  | "Confirmada" 
  | "Concluída - Compareceu" 
  | "Cancelada" 
  | "Não Compareceu" 
  | "Pós Cirurgia";

export interface Appointment {
  id: string;
  opportunity_id?: string;
  patient_name: string;
  doctor: string;
  city: string;
  procedure: string;
  insurance: string; // Convênio
  appointment_status: AppointmentStatus;
  appointment_date: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  phone?: string;
  email?: string;
}

export interface AppointmentMetrics {
  total: number;
  confirmed: number;
  completed: number;
  canceled: number;
  noShow: number;
  pending: number;
  realizationRate: number;
  noShowRate: number;
  confirmationRate: number;
  cancellationRate: number;
}

export interface ChartData {
  date: string;
  appointments: number;
  confirmed: number;
  completed: number;
  canceled: number;
}

export interface StatusDistribution {
  name: AppointmentStatus;
  value: number;
  percentage: number;
}

export interface DoctorPerformance {
  doctor: string;
  total: number;
  confirmed: number;
  completed: number;
  canceled: number;
  noShow: number;
  realizationRate: number;
}

export interface CityDistribution {
  city: string;
  total: number;
  percentage: number;
}

export interface ProcedureDistribution {
  procedure: string;
  total: number;
  percentage: number;
}

export interface InsuranceDistribution {
  insurance: string;
  total: number;
  percentage: number;
}

// Filtros para o dashboard
export interface DashboardFilters {
  startDate: string;
  endDate: string;
  doctor: string;
  city: string;
  status: string;
  procedure: string;
  insurance: string;
}

export interface FilterOptions {
  doctors: string[];
  cities: string[];
  statuses: AppointmentStatus[];
  procedures: string[];
  insurances: string[];
}

// Dados de resposta da API
export interface AppointmentsResponse {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Parâmetros para consulta da API
export interface AppointmentsQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  doctor?: string;
  city?: string;
  status?: AppointmentStatus;
  procedure?: string;
  insurance?: string;
  search?: string;
}
