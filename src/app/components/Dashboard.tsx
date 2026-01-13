import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Calendar, Users, DollarSign, Bell, Clock, 
  LayoutDashboard, LogOut, TrendingUp, ShieldCheck 
} from "lucide-react";
import { Button } from "./ui/button";

// Importaciones con rutas relativas (./) para evitar errores de módulos no encontrados
import { AgendaTab } from "./AgendaTab";
import { PatientsTab } from "./PatientsTab";
import { PaymentsTab } from "./PaymentsTab";
import { NotificationsTab } from "./NotificationsTab";

interface DashboardProps {
  stats: {
    appointmentsToday: number;
    totalPatients: number;
    monthlyRevenue: number;
    pendingNotifications: number;
  };
  username: string;
  onLogout: () => void;
}

export function Dashboard({ stats, username, onLogout }: DashboardProps) {
  // Estado para controlar la navegación entre pestañas
  const [activeTab, setActiveTab] = useState<'inicio' | 'agenda' | 'pacientes' | 'pagos' | 'notificaciones'>('inicio');

  // Lógica de renderizado de contenido
  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black tracking-tight text-slate-800">Bienvenido, {username}</h1>
              <p className="text-slate-500 font-medium text-lg">Resumen de actividad para hoy</p>
            </div>

            {/* Grid de Tarjetas de Estadísticas */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Turnos Hoy" 
                value={stats.appointmentsToday} 
                icon={<Calendar className="h-5 w-5 text-emerald-500"/>} 
                onClick={() => setActiveTab('agenda')}
              />
              <StatCard 
                title="Pacientes" 
                value={stats.totalPatients} 
                icon={<Users className="h-5 w-5 text-blue-500"/>} 
                onClick={() => setActiveTab('pacientes')}
              />
              <StatCard 
                title="Ingresos" 
                value={`$${stats.monthlyRevenue.toLocaleString()}`} 
                icon={<DollarSign className="h-5 w-5 text-slate-700"/>} 
                onClick={() => setActiveTab('pagos')}
              />
              <StatCard 
                title="Alertas" 
                value={stats.pendingNotifications} 
                icon={<Bell className="h-5 w-5 text-orange-500"/>} 
                onClick={() => setActiveTab('notificaciones')}
              />
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-sm text-center">
              <ShieldCheck className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium italic">Selecciona una opción del menú lateral para gestionar la clínica.</p>
            </div>
          </div>
        );
      
      case 'agenda': 
        // Línea 78: Se pasan los props requeridos por AgendaTab
        return <AgendaTab appointments={[]} onAddAppointment={() => {}} onStatusUpdate={() => {}} />;
      
      case 'pacientes': 
        return <PatientsTab />;
      
      case 'pagos': 
        return <PaymentsTab payments={[]} onAddPayment={() => {}} onDeletePayment={() => {}} onToggleRegistered={() => {}} />;
      
      case 'notificaciones': 
        // Línea 88: Se pasan los props requeridos por NotificationsTab
        return <NotificationsTab notifications={[]} onMarkAsRead={() => {}} onClearAll={() => {}} />;
      
      default: 
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* BARRA LATERAL (Sidebar) */}
      <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-slate-200/50 flex flex-col p-6">
        <div className="mb-10 px-2 text-2xl font-black text-slate-900 tracking-tighter">CLUB 22</div>
        
        <nav className="flex-1 space-y-2">
          <NavButton active={activeTab === 'inicio'} onClick={() => setActiveTab('inicio')} icon={<LayoutDashboard className="h-5 w-5"/>} label="Inicio" />
          <NavButton active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} icon={<Calendar className="h-5 w-5"/>} label="Agenda" />
          <NavButton active={activeTab === 'pacientes'} onClick={() => setActiveTab('pacientes')} icon={<Users className="h-5 w-5"/>} label="Pacientes" />
          <NavButton active={activeTab === 'pagos'} onClick={() => setActiveTab('pagos')} icon={<DollarSign className="h-5 w-5"/>} label="Pagos" />
          <NavButton active={activeTab === 'notificaciones'} onClick={() => setActiveTab('notificaciones')} icon={<Bell className="h-5 w-5"/>} label="Alertas" />
        </nav>

        <Button 
          variant="ghost" 
          className="mt-auto justify-start gap-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl font-bold transition-all p-4 h-14"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" /> Cerrar Sesión
        </Button>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Sub-componentes para mantener el código limpio
function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
        active 
        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
        : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, onClick }: any) {
  return (
    <Card 
      className="bg-white/80 backdrop-blur-sm border-none shadow-sm rounded-3xl p-2 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-slate-800">{value}</div>
      </CardContent>
    </Card>
  );
}