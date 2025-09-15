import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Charts } from "@/components/dashboard/Charts";
import { AppointmentsTable } from "@/components/dashboard/AppointmentsTable";
import { useFilters } from "@/hooks/useFilters";
import { fetchAppointments } from "@/lib/api";
import { calculateMetrics, exportToCSV } from "@/lib/metrics";

export function MedicalDashboard() {
  // Buscar dados dos agendamentos
  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    refetchInterval: 30000,
  });

  // Hook de filtros com dados filtrados
  const {
    filters,
    filterOptions,
    filteredAppointments,
    handleFilterChange,
    clearFilters
  } = useFilters(appointments);

  // Calcular métricas baseadas nos dados filtrados
  const metrics = calculateMetrics(filteredAppointments);

  // Função para exportar dados filtrados
  const handleExport = () => {
    exportToCSV(filteredAppointments);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-white text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = Object.values(filters).some(filter => 
    filter !== 'all' && filter !== filters.startDate && filter !== filters.endDate
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent mb-3">
              Relatório Exclusivo HJGP
            </h1>
            <p className="text-xl text-muted-foreground">
              Agendamentos e Performance
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              {filteredAppointments.length} de {appointments.length} agendamentos
              {hasActiveFilters ? ' (filtrados)' : ''}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pb-8">
        {/* Filtros Avançados */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={() => refetch()}
          onExport={handleExport}
          options={filterOptions}
        />

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total de Agendamentos"
            value={metrics.total}
            icon={Calendar}
            color="primary"
          />
          
          <MetricCard
            title="Agendamentos Confirmados"
            value={metrics.confirmed}
            icon={Clock}
            color="secondary"
          />
          
          <MetricCard
            title="Agendamentos Realizados"
            value={metrics.completed}
            icon={CheckCircle}
            color="success"
          />
          
          <MetricCard
            title="Agendamentos Cancelados"
            value={metrics.canceled}
            icon={XCircle}
            color="destructive"
          />
          
          <MetricCard
            title="Taxa de Realização"
            value={metrics.realizationRate}
            icon={TrendingUp}
            color="success"
            format="percentage"
          />
          
          <MetricCard
            title="Taxa de No-Show"
            value={metrics.noShowRate}
            icon={AlertTriangle}
            color="warning"
            format="percentage"
          />
        </div>

        {/* Gráficos */}
        <Charts appointments={filteredAppointments} />

        {/* Tabela de Agendamentos */}
        <AppointmentsTable appointments={filteredAppointments} />
      </div>
    </div>
  );
}
