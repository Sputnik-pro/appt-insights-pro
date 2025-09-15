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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = Object.values(filters).some(filter => 
    filter !== 'all' && filter !== filters.startDate && filter !== filters.endDate
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Relatório Exclusivo HJGP
            </h1>
            <p className="text-xl text-gray-600">
              Agendamentos e Performance
            </p>
            <div className="mt-4 text-sm text-gray-500">
              {filteredAppointments.length} de {appointments.length} agendamentos
              {hasActiveFilters ? ' (filtrados)' : ''}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
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
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Agendamentos</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos Confirmados</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.confirmed}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos Realizados</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos Cancelados</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.canceled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Realização</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.realizationRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de No-Show</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.noShowRate}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <Charts appointments={filteredAppointments} />

        {/* Tabela de Agendamentos */}
        <AppointmentsTable appointments={filteredAppointments} />
      </div>
    </div>
  );
}
