import React from 'react';
// Rutas relativas corregidas para que no marquen rojo
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Bell, CheckCircle2, AlertCircle } from "lucide-react";

// Esto define lo que el Dashboard debe enviarle a este archivo
interface NotificationsTabProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationsTab({ notifications, onMarkAsRead, onClearAll }: NotificationsTabProps) {
  return (
    <div className="space-y-6 p-2 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Centro de Alertas</h2>
          <p className="text-slate-500 font-medium">Notificaciones del sistema</p>
        </div>
        <button 
          onClick={onClearAll} 
          className="text-xs font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
        >
          Limpiar todo
        </button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium italic">No hay alertas pendientes en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Aquí aparecerán las alertas cuando las conectemos */}
        </div>
      )}
    </div>
  );
}