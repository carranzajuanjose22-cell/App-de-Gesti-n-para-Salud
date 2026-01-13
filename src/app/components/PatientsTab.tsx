import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { 
  Search, 
  Plus, 
  User, 
  FileText, 
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Badge } from "./ui/badge";

interface Patient {
  id: string;
  name: string;
  lastVisit: string;
  status: 'Al día' | 'Pendiente' | 'Deuda';
  history: string;
}

export function PatientsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [patients] = useState<Patient[]>([
    { id: '1', name: 'Ana García', lastVisit: '2024-03-10', status: 'Al día', history: 'Control anual ok.' },
    { id: '2', name: 'Roberto Gómez', lastVisit: '2024-03-12', status: 'Pendiente', history: 'Pendiente de análisis de sangre.' },
    { id: '3', name: 'Lucía Fernández', lastVisit: '2024-02-28', status: 'Deuda', history: 'Tratamiento conducto.' },
  ]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-2">
      {/* Encabezado y Acciones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Pacientes</h1>
          <p className="text-slate-500 font-medium">Gestiona las historias clínicas y estados</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl h-12 px-6 transition-all active:scale-95">
          <Plus className="mr-2 h-5 w-5" /> Nuevo Paciente
        </Button>
      </div>

      {/* Barra de Búsqueda Estilizada */}
      <div className="relative max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        <Input 
          placeholder="Buscar por nombre..." 
          className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de Pacientes */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[300px] font-bold text-slate-700">Paciente</TableHead>
              <TableHead className="font-bold text-slate-700">Última Visita</TableHead>
              <TableHead className="font-bold text-slate-700">Estado</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow 
                key={patient.id} 
                className="group hover:bg-slate-50/80 transition-colors border-slate-100"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-slate-900 font-semibold">{patient.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 font-medium">
                  {new Date(patient.lastVisit).toLocaleDateString('es-AR')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`rounded-lg px-2.5 py-0.5 border-none font-bold ${
                      patient.status === 'Al día' ? 'bg-emerald-100 text-emerald-700' :
                      patient.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-100 rounded-lg">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}