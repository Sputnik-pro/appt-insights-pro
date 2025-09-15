import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  filters: {
    period: string;
    doctor: string;
    patient: string;
    status: string;
    city: string;
    procedure: string;
    insurance: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onRefresh: () => void;
  options: {
    doctors: string[];
    patients: string[];
    cities: string[];
    procedures: string[];
    insurances: string[];
    statuses: string[];
  };
}

const periodOptions = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "15", label: "Últimos 15 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "60", label: "Últimos 60 dias" },
  { value: "90", label: "Últimos 90 dias" },
  { value: "120", label: "Últimos 120 dias" },
  { value: "180", label: "Últimos 180 dias" },
  { value: "365", label: "Último ano" },
];

export function FilterBar({ filters, onFilterChange, onRefresh, options }: FilterBarProps) {
  return (
    <div className="medical-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-foreground">Filtros</h3>
        </div>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="medical-button"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar Dados
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <Select value={filters.period} onValueChange={(value) => onFilterChange("period", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.doctor} onValueChange={(value) => onFilterChange("doctor", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Médico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os médicos</SelectItem>
            {options.doctors.map((doctor) => (
              <SelectItem key={doctor} value={doctor}>
                {doctor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.patient} onValueChange={(value) => onFilterChange("patient", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Paciente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pacientes</SelectItem>
            {options.patients.slice(0, 50).map((patient) => (
              <SelectItem key={patient} value={patient}>
                {patient}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {options.statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.city} onValueChange={(value) => onFilterChange("city", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cidades</SelectItem>
            {options.cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.procedure} onValueChange={(value) => onFilterChange("procedure", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Procedimento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os procedimentos</SelectItem>
            {options.procedures.map((procedure) => (
              <SelectItem key={procedure} value={procedure}>
                {procedure}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.insurance} onValueChange={(value) => onFilterChange("insurance", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Convênio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os convênios</SelectItem>
            {options.insurances.map((insurance) => (
              <SelectItem key={insurance} value={insurance}>
                {insurance}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}