import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  // 1. Estados para los datos reales
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("clinic_appointments");
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem("clinic_payments");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Guardado automático (LocalStorage)
  useEffect(() => {
    localStorage.setItem("clinic_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("clinic_payments", JSON.stringify(payments));
  }, [payments]);

  // 3. Funciones para modificar datos
  const addAppointment = (newApp: any) => {
    setAppointments([...appointments, { ...newApp, id: Date.now().toString() }]);
  };

  const addPayment = (newPay: any) => {
    setPayments([...payments, { ...newPay, id: Date.now().toString() }]);
  };

  return (
    <div className="min-h-screen w-full bg-slate-200">
      {isAuthenticated ? (
        <Dashboard 
          username={username} 
          onLogout={() => setIsAuthenticated(false)}
          appointments={appointments}
          addAppointment={addAppointment}
          payments={payments}
          addPayment={addPayment}
          stats={{
            appointmentsToday: appointments.length,
            totalPatients: 145, 
            monthlyRevenue: payments.reduce((acc: number, p: any) => acc + p.amount, 0),
            pendingNotifications: 3
          }}
        /> 
      ) : (
        <LoginPage onLogin={(user) => { setIsAuthenticated(true); setUsername(user); }} />
      )}
      <Toaster />
    </div>
  );
}