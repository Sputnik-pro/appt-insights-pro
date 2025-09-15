import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";

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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
    setCurrentPage(1); // Reset para primeira página ao ordenar
  };

  const exportToCSV = () => {
    const headers = [
      "Paciente", 
      "Cidade",
      "Procedimento",
      "Médico",
      "Convênio",
      "Status"
    ];
    
    const csvData = appointments.map(appointment => [
      appointment.patient_name,
      appointment.city,
      appointment.procedure,
      appointment.doctor,
      appointment.insurance,
      appointment.appointment_status
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `agendamentos_${format(new Date(), "yyyyMMdd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          onClick={exportToCSV}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
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
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentAppointments.map((appointment, index) => (
                <tr key={appointment.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{appointment.patient_name}</div>
                      <div className="text-sm text-gray-500">{appointment.opportunity_id}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-900">{appointment.city}</td>
                  <td className="p-4 text-gray-900">{appointment.procedure}</td>
                  <td className="p-4 text-gray-900">{appointment.doctor}</td>
                  <td className="p-4 text-gray-900">{appointment.insurance}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.appointment_status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                      appointment.appointment_status === 'Não Confirmada' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.appointment_status === 'Cancelada' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.appointment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedAppointments.length)} de {sortedAppointments.length} agendamentos
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
