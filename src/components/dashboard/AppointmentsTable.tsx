import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment } from "@/types/appointment";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as XLSX from 'xlsx';

interface AppointmentsTableProps {
  appointments: Appointment[];
}

type SortColumn = keyof Appointment;
type SortDirection = "asc" | "desc";

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedAppointments = React.useMemo(() => {
    return [...appointments].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [appointments, sortColumn, sortDirection]);

  // Cálculos de paginação
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = sortedAppointments.slice(startIndex, endIndex);

  // Se filtros/refetch mudarem a quantidade de páginas, mantém a página atual válida
  React.useEffect(() => {
    setCurrentPage((prev) => {
      const safeTotal = Math.max(1, totalPages);
      return Math.min(Math.max(1, prev), safeTotal);
    });
  }, [totalPages]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
    setCurrentPage(1); // Reset para primeira página ao ordenar
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return "-";
    }
  };

  const exportToXLSX = () => {
    const data = appointments.map(appointment => ({
      "ID Oportunidade": appointment.opportunity_id,
      "Paciente": appointment.patient_name,
      "Cidade": appointment.city,
      "Procedimento": appointment.procedure,
      "Médico": appointment.doctor,
      "Convênio": appointment.insurance,
      "Status": appointment.appointment_status,
      "Data Agendamento": formatDate(appointment.appointment_date)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agendamentos");
    
    XLSX.writeFile(workbook, `agendamentos_${format(new Date(), "yyyyMMdd")}.xlsx`);
  };

  const SortButton = ({ column, children }: { column: keyof Appointment; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
    >
      <span>{children}</span>
      {sortColumn === column && (
        <span className="text-xs">
          {sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </span>
      )}
    </button>
  );

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200">
        <CardTitle className="text-gray-900">Agendamentos Recentes</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToXLSX}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar XLSX
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-900">
                  <SortButton column="patient_name">Paciente</SortButton>
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  <SortButton column="city">Cidade</SortButton>
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  <SortButton column="procedure">Procedimento</SortButton>
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  <SortButton column="doctor">Médico</SortButton>
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  <SortButton column="insurance">Convênio</SortButton>
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  <SortButton column="appointment_status">Status</SortButton>
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  <SortButton column="appointment_date">Data</SortButton>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentAppointments.map((appointment, index) => (
                <tr key={appointment.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{appointment.patient_name || 'Não informado'}</div>
                      <div className="text-sm text-gray-500">{appointment.opportunity_id || '-'}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-900">{appointment.city || 'Não informada'}</td>
                  <td className="p-4 text-gray-900">{appointment.procedure || 'Não informado'}</td>
                  <td className="p-4 text-gray-900">{appointment.doctor || 'Não informado'}</td>
                  <td className="p-4 text-gray-900">{appointment.insurance || 'Não informado'}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.appointment_status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                      appointment.appointment_status === 'Não Confirmada' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.appointment_status === 'Cancelada' ? 'bg-red-100 text-red-800' :
                      appointment.appointment_status === 'Concluída - Compareceu' ? 'bg-blue-100 text-blue-800' :
                      appointment.appointment_status === 'Não Compareceu' ? 'bg-orange-100 text-orange-800' :
                      appointment.appointment_status === 'Pós Cirurgia' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.appointment_status || 'Não Confirmada'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900 text-sm">{formatDate(appointment.appointment_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedAppointments.length)} de {sortedAppointments.length} agendamentos
          </div>

          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>

              <div className="flex items-center gap-1 whitespace-nowrap px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[28px] h-7 px-2 flex-shrink-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
