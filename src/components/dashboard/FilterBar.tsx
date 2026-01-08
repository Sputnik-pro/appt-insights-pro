import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface FilterOptions {
  doctors: string[];
  cities: string[];
  statuses: string[];
  procedures: string[];
  insurances: string[];
}

export interface Filters {
  startDate: string;
  endDate: string;
  doctor: string;
  city: string;
  status: string;
  procedure: string;
  insurance: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onRefresh: () => void;
  options: FilterOptions;
}

export function FilterBar({ 
  filters, 
  onFilterChange, 
  onRefresh, 
  options 
}: FilterBarProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    onFilterChange({
      startDate: oneYearAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      doctor: 'all',
      city: 'all',
      status: 'all',
      procedure: 'all',
      insurance: 'all'
    });
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filtros Avançados</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {/* Data Início */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Data Início
            </Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilter('startDate', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Data Fim */}
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium">
              Data Fim
            </Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilter('endDate', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Médico */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Médico</Label>
            <Select
              value={filters.doctor}
              onValueChange={(value) => updateFilter('doctor', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os médicos" />
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
          </div>

          {/* Cidade */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cidade</Label>
            <Select
              value={filters.city}
              onValueChange={(value) => updateFilter('city', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as cidades" />
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
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
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
          </div>

          {/* Procedimento */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Procedimento</Label>
            <Select
              value={filters.procedure}
              onValueChange={(value) => updateFilter('procedure', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os procedimentos" />
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
          </div>

          {/* Convênio */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Convênio</Label>
            <Select
              value={filters.insurance}
              onValueChange={(value) => updateFilter('insurance', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os convênios" />
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

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
