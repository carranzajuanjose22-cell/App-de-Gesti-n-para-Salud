// src/app/App.tsx
import { useState, useEffect } from "react";
import { LoginPage } from "@/app/components/LoginPage";
import { Dashboard } from "@/app/components/Dashboard";
import { Toaster } from "@/app/components/ui/sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  // --- AGREGA ESTA VARIABLE AQUÍ ---
  const [stats] = useState({
    appointmentsToday: 8,
    totalPatients: 145,
    monthlyRevenue: 52000,
    pendingNotifications: 3
  });

  // ... (tu useEffect de sesión se mantiene igual)

  return (
    // Agregamos h-full y un fondo sólido para asegurar que se vea
    <div className="min-h-screen w-full bg-slate-200"> 
      {isAuthenticated ? (
        // --- ASEGÚRATE DE PASAR 'stats' AQUÍ ---
        <Dashboard stats={stats} /> 
      ) : (
        <LoginPage onLogin={(user) => {
          setIsAuthenticated(true);
          setUsername(user);
          localStorage.setItem("session", JSON.stringify({ username: user }));
        }} />
      )}
      <Toaster />
    </div>
  );
}