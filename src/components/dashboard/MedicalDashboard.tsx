import { useState, useMemo } from "react";
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { subDays, isAfter, isBefore } from "date-fns";
import { MetricCard } from "./MetricCard";
import { FilterBar } from "./FilterBar";
import { Charts } from "./Charts";
import { AppointmentsTable } from "./AppointmentsTable";
import { mockAppointments, doctors, cities, procedures, insurances, statuses, Appointment } from "@/data/mockData";

interface DashboardFilters {
  period: string;
  doctor: string;
  patient: string;
  status: string;
  city: string;
  procedure: string;
  insurance: string;
}

export function MedicalDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filters, setFilters] = useState<DashboardFilters>({
    period: "30",
    doctor: "all",
    patient: "all", 
    status: "all",
    city: "all",
    procedure: "all",
    insurance: "all"
  });

  // Filter appointments based on current filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Period filter
      if (filters.period !== "all") {
        const periodDays = parseInt(filters.period);
        const cutoffDate = subDays(new Date(), periodDays);
        const appointmentDate = new Date(appointment.created_at);
        if (isBefore(appointmentDate, cutoffDate)) return false;
      }

      // Other filters
      if (filters.doctor !== "all" && appointment.doctor !== filters.doctor) return false;
      if (filters.patient !== "all" && appointment.patient_name !== filters.patient) return false;
      if (filters.status !== "all" && appointment.appointment_status !== filters.status) return false;
      if (filters.city !== "all" && appointment.city !== filters.city) return false;
      if (filters.procedure !== "all" && appointment.procedure !== filters.procedure) return false;
      if (filters.insurance !== "all" && appointment.insurance !== filters.insurance) return false;

      return true;
    });
  }, [appointments, filters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredAppointments.length;
    const confirmed = filteredAppointments.filter(a => a.appointment_status === "Confirmada").length;
    const completed = filteredAppointments.filter(a => a.appointment_status === "Concluída - Compareceu").length;
    const canceled = filteredAppointments.filter(a => a.appointment_status === "Cancelada").length;
    const noShow = filteredAppointments.filter(a => a.appointment_status === "Não Compareceu").length;
    const postSurgery = filteredAppointments.filter(a => a.appointment_status === "Pós Cirurgia").length;
    
    const realizationRate = total > 0 ? ((completed + postSurgery) / total) * 100 : 0;
    const noShowRate = total > 0 ? (noShow / total) * 100 : 0;

    return {
      total,
      confirmed,
      completed: completed + postSurgery,
      canceled,
      realizationRate,
      noShowRate
    };
  }, [filteredAppointments]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRefresh = () => {
    // In a real application, this would fetch new data from the API
    console.log("Refreshing dashboard data...");
  };

  // Generate filter options from current data
  const filterOptions = useMemo(() => ({
    doctors: Array.from(new Set(appointments.map(a => a.doctor))).sort(),
    patients: Array.from(new Set(appointments.map(a => a.patient_name))).sort(),
    cities: Array.from(new Set(cities)).sort(),
    procedures: Array.from(new Set(procedures)).sort(),
    insurances: Array.from(new Set(insurances)).sort(),
    statuses: statuses
  }), [appointments]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="medical-card rounded-none border-x-0 border-t-0 mb-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent mb-3">
              Relatório Exclusivo HJGP
            </h1>
            <p className="text-xl text-muted-foreground">
              Agendamentos e Performance
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pb-8">
        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
          options={filterOptions}
        />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total de Agendamentos"
            value={metrics.total}
            icon={Calendar}
            color="primary"
            trend={{ value: 12.5, isPositive: true }}
          />
          
          <MetricCard
            title="Agendamentos Confirmados"
            value={metrics.confirmed}
            icon={Clock}
            color="secondary"
            trend={{ value: 8.3, isPositive: true }}
          />
          
          <MetricCard
            title="Cirurgias Realizadas"
            value={metrics.completed}
            icon={CheckCircle}
            color="success"
            trend={{ value: 15.7, isPositive: true }}
          />
          
          <MetricCard
            title="Cirurgias Canceladas"
            value={metrics.canceled}
            icon={XCircle}
            color="destructive"
            trend={{ value: 5.2, isPositive: false }}
          />
          
          <MetricCard
            title="Taxa de Realização"
            value={metrics.realizationRate}
            icon={TrendingUp}
            color="success"
            format="percentage"
            trend={{ value: 3.1, isPositive: true }}
          />
          
          <MetricCard
            title="Taxa de No-Show"
            value={metrics.noShowRate}
            icon={AlertTriangle}
            color="warning"
            format="percentage"
            trend={{ value: 2.4, isPositive: false }}
          />
        </div>

        {/* Charts */}
        <Charts appointments={filteredAppointments} />

        {/* Appointments Table */}
        <AppointmentsTable appointments={filteredAppointments} />
      </div>
    </div>
  );
}
