import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Calendar } from "@/app/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export interface Appointment {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  phone: string;
  notes: string;
  status: "confirmado" | "pendiente" | "cancelado";
}

interface AgendaTabProps {
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, "id">) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateAppointment: (id: string, appointment: Partial<Appointment>) => void;
}

export function AgendaTab({ appointments, onAddAppointment, onDeleteAppointment, onUpdateAppointment }: AgendaTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    time: "",
    phone: "",
    notes: "",
    status: "pendiente" as const
  });

  const handleAddAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.time) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    onAddAppointment({
      ...newAppointment,
      date: selectedDate
    });

    setNewAppointment({
      patientName: "",
      time: "",
      phone: "",
      notes: "",
      status: "pendiente"
    });
    setIsDialogOpen(false);
    toast.success("Turno agregado exitosamente");
  };

  const appointmentsForSelectedDate = appointments.filter(
    apt => format(apt.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  ).sort((a, b) => a.time.localeCompare(b.time));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800";
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={es}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Turnos - {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: es })}
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Turno
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Turno</DialogTitle>
                  <DialogDescription>
                    Complete los datos del turno para {format(selectedDate, "dd/MM/yyyy")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Nombre del Paciente *</Label>
                    <Input
                      id="patient"
                      value={newAppointment.patientName}
                      onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Horario *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={newAppointment.phone}
                      onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
                      placeholder="Ej: +54 9 11 1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={newAppointment.status}
                      onValueChange={(value: any) => setNewAppointment({ ...newAppointment, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Input
                      id="notes"
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddAppointment}>
                    Guardar Turno
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointmentsForSelectedDate.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay turnos programados para esta fecha
              </p>
            ) : (
              appointmentsForSelectedDate.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{apt.patientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {apt.time}
                        </div>
                        {apt.phone && (
                          <p className="text-sm text-gray-600">Tel: {apt.phone}</p>
                        )}
                        {apt.notes && (
                          <p className="text-sm text-gray-500 italic">{apt.notes}</p>
                        )}
                        <div className="pt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(apt.status)}`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Select
                          value={apt.status}
                          onValueChange={(value: any) => {
                            onUpdateAppointment(apt.id, { status: value });
                            toast.success("Estado actualizado");
                          }}
                        >
                          <SelectTrigger className="h-8 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="confirmado">Confirmado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            onDeleteAppointment(apt.id);
                            toast.success("Turno eliminado");
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
