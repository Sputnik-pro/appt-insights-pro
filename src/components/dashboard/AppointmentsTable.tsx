import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ChevronUp, ChevronDown } from "lucide-react";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AppointmentsTableProps {
  appointments: Appointment[];
}

type SortColumn = keyof Appointment;
type SortDirection = "asc" | "desc";

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
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
      className="flex items-center space-x-1 hover:text-primary transition-colors"
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agendamentos Recentes</CardTitle>
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
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">
                  <SortButton column="patient_name">Paciente</SortButton>
                </th>
                <th className="text-left p-2 font-medium">
                  <SortButton column="city">Cidade</SortButton>
                </th>
                <th className="text-left p-2 font-medium">
                  <SortButton column="procedure">Procedimento</SortButton>
                </th>
                <th className="text-left p-2 font-medium">
                  <SortButton column="doctor">Médico</SortButton>
                </th>
                <th className="text-left p-2 font-medium">
                  <SortButton column="insurance">Convênio</SortButton>
                </th>
                <th className="text-left p-2 font-medium">
                  <SortButton column="appointment_status">Status</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.slice(0, 10).map((appointment, index) => (
                <tr key={appointment.id || index} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{appointment.patient_name}</div>
                      <div className="text-sm text-gray-500">{appointment.opportunity_id}</div>
                    </div>
                  </td>
                  <td className="p-2">{appointment.city}</td>
                  <td className="p-2">{appointment.procedure}</td>
                  <td className="p-2">{appointment.doctor}</td>
                  <td className="p-2">{appointment.insurance}</td>
                  <td className="p-2">
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
        
        <div className="mt-4 text-sm text-gray-600">
          Mostrando 10 de {appointments.length} agendamentos
        </div>
      </CardContent>
    </Card>
  );
}
