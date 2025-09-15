import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment, AppointmentStatus } from "@/data/mockData";

interface AppointmentsTableProps {
  appointments: Appointment[];
}

const ITEMS_PER_PAGE = 10;

const statusColors: Record<AppointmentStatus, string> = {
  "Confirmada": "bg-success/10 text-success border-success/20",
  "Concluída - Compareceu": "bg-success/10 text-success border-success/20",
  "Não Confirmada": "bg-warning/10 text-warning border-warning/20",
  "Cancelada": "bg-destructive/10 text-destructive border-destructive/20",
  "Não Compareceu": "bg-warning/10 text-warning border-warning/20",
  "Pós Cirurgia": "bg-primary/10 text-primary border-primary/20"
};

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Appointment>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedAppointments = [...appointments].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (sortColumn === "created_at" || sortColumn === "appointment_date") {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
    }
    
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortDirection === "asc") {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAppointments = sortedAppointments.slice(startIndex, endIndex);

  const handleSort = (column: keyof Appointment) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID Oportunidade",
      "Paciente", 
      "Cidade",
      "Data/Hora",
      "Procedimento",
      "Médico",
      "Convênio",
      "Status"
    ];
    
    const csvData = appointments.map(appointment => [
      appointment.opportunity_id,
      appointment.patient_name,
      appointment.city,
      appointment.appointment_date 
        ? format(new Date(appointment.appointment_date), "dd/MM/yyyy HH:mm", { locale: ptBR })
        : "N/A",
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
          {sortDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  return (
    <div className="medical-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          Agendamentos Recentes
        </h3>
        <Button
          onClick={exportToCSV}
          variant="outline"
          size="sm"
          className="medical-button"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 font-medium text-muted-foreground">
                <SortButton column="patient_name">Paciente</SortButton>
              </th>
              <th className="text-left p-3 font-medium text-muted-foreground">
                <SortButton column="city">Cidade</SortButton>
              </th>
              <th className="text-left p-3 font-medium text-muted-foreground">
                <SortButton column="appointment_date">Data/Hora</SortButton>
              </th>
              <th className="text-left p-3 font-medium text-muted-foreground">
                <SortButton column="procedure">Procedimento</SortButton>
              </th>
              <th className="text-left p-3 font-medium text-muted-foreground">
                <SortButton column="doctor">Médico</SortButton>
              </th>
              <th className="text-left p-3 font-medium text-muted-foreground">
                <SortButton column="insurance">Convênio</SortButton>
              </th>
              <th className="text-left p-3 font-medium text-muted-foreground">
                <SortButton column="appointment_status">Status</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appointment, index) => (
              <tr
                key={appointment.opportunity_id}
                className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                <td className="p-3">
                  <div>
                    <div className="font-medium text-foreground">
                      {appointment.patient_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.opportunity_id}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-foreground">
                  {appointment.city}
                </td>
                <td className="p-3 text-foreground">
                  {appointment.appointment_date 
                    ? format(new Date(appointment.appointment_date), "dd/MM/yyyy HH:mm", { locale: ptBR })
                    : "A definir"
                  }
                </td>
                <td className="p-3 text-foreground">
                  <div className="max-w-[200px] truncate">
                    {appointment.procedure}
                  </div>
                </td>
                <td className="p-3 text-foreground">
                  {appointment.doctor}
                </td>
                <td className="p-3 text-foreground">
                  {appointment.insurance}
                </td>
                <td className="p-3">
                  <Badge 
                    variant="outline" 
                    className={`${statusColors[appointment.appointment_status]} border`}
                  >
                    {appointment.appointment_status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1} a {Math.min(endIndex, appointments.length)} de {appointments.length} registros
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="medical-button"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="medical-button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium px-3">
            Página {currentPage} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="medical-button"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="medical-button"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}