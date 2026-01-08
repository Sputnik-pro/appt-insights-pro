import { useQuery } from "@tanstack/react-query";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AppointmentsTable } from "@/components/dashboard/AppointmentsTable";
import { useFilters } from "@/hooks/useFilters";
import { fetchAppointments } from "@/lib/api";

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

  const hasActiveFilters =
    filters.doctor !== 'all' ||
    filters.city !== 'all' ||
    filters.status !== 'all' ||
    filters.procedure !== 'all' ||
    filters.insurance !== 'all';

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
          options={filterOptions}
        />

        {/* Tabela de Agendamentos */}
        <AppointmentsTable appointments={filteredAppointments} />
      </div>
    </div>
  );
}
