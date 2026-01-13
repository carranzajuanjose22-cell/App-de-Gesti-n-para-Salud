import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Calendar, Users, DollarSign, Bell, LogOut, Stethoscope } from "lucide-react";
import { AgendaTab, type Appointment } from "./AgendaTab";
import { PatientsTab, type Patient } from "./PatientsTab";
import { PaymentsTab, type Payment } from "./PaymentsTab";
import { NotificationsTab } from "./NotificationsTab";
import { toast } from "sonner";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState("agenda");

  // Cargar datos desde localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedAppointments = localStorage.getItem("appointments");
        const savedPatients = localStorage.getItem("patients");
        const savedPayments = localStorage.getItem("payments");

        if (savedAppointments) {
          const parsed = JSON.parse(savedAppointments);
          setAppointments(parsed.map((apt: any) => ({ ...apt, date: new Date(apt.date) })));
        }
        if (savedPatients) {
          setPatients(JSON.parse(savedPatients));
        }
        if (savedPayments) {
          const parsed = JSON.parse(savedPayments);
          setPayments(parsed.map((pay: any) => ({ ...pay, date: new Date(pay.date) })));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  // Handlers para Agenda
  const handleAddAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments([...appointments, newAppointment]);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const handleUpdateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    ));
  };

  // Handlers para Pacientes
  const handleAddPatient = (patient: Omit<Patient, "id">) => {
    const newPatient = {
      ...patient,
      id: Date.now().toString()
    };
    setPatients([...patients, newPatient]);
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  // Handlers para Pagos
  const handleAddPayment = (payment: Omit<Payment, "id">) => {
    const newPayment = {
      ...payment,
      id: Date.now().toString()
    };
    setPayments([...payments, newPayment]);
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const handleToggleRegistered = (id: string) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, registered: !p.registered } : p
    ));
  };

  // Calcular estadísticas para el resumen
  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    return apt.date.toDateString() === today.toDateString() && apt.status !== "cancelado";
  }).length;

  const pendingPayments = payments.filter(p => !p.registered).length;
  
  // Calcular notificaciones (turnos mañana + cobros pendientes)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowAppointments = appointments.filter(apt => 
    apt.date.toDateString() === tomorrow.toDateString() && apt.status !== "cancelado"
  ).length;
  const totalNotifications = tomorrowAppointments + pendingPayments;

  // Mostrar notificación de bienvenida
  useEffect(() => {
    toast.success(`Bienvenido/a, ${username}!`, {
      description: "Sistema de gestión iniciado correctamente"
    });
  }, [username]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Gestor de Salud</h1>
                <p className="text-sm text-gray-600">Bienvenido/a, {username}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Resumen rápido */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("agenda")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turnos Hoy</p>
                  <p className="text-2xl font-bold mt-1">{todayAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("pacientes")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pacientes</p>
                  <p className="text-2xl font-bold mt-1">{patients.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("cobros")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cobros Pendientes</p>
                  <p className="text-2xl font-bold mt-1 text-orange-600">{pendingPayments}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("notificaciones")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Notificaciones</p>
                  <p className="text-2xl font-bold mt-1 text-red-600">{totalNotifications}</p>
                </div>
                <Bell className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agenda" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="pacientes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="cobros" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cobros
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
              {totalNotifications > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalNotifications}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agenda">
            <AgendaTab
              appointments={appointments}
              onAddAppointment={handleAddAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onUpdateAppointment={handleUpdateAppointment}
            />
          </TabsContent>

          <TabsContent value="pacientes">
            <PatientsTab
              patients={patients}
              onAddPatient={handleAddPatient}
              onDeletePatient={handleDeletePatient}
            />
          </TabsContent>

          <TabsContent value="cobros">
            <PaymentsTab
              payments={payments}
              onAddPayment={handleAddPayment}
              onDeletePayment={handleDeletePayment}
              onToggleRegistered={handleToggleRegistered}
            />
          </TabsContent>

          <TabsContent value="notificaciones">
            <NotificationsTab
              appointments={appointments}
              payments={payments}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
