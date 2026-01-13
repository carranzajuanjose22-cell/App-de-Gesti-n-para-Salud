import { useState, useEffect } from "react";
import { LoginPage } from "@/app/components/LoginPage";
import { Dashboard } from "@/app/components/Dashboard";
import { Toaster } from "@/app/components/ui/sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  // Verificar si hay sesión guardada
  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setIsAuthenticated(true);
      setUsername(session.username);
    }
  }, []);

  const handleLogin = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
    localStorage.setItem("session", JSON.stringify({ username: user }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    localStorage.removeItem("session");
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard username={username} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
      <Toaster />
    </>
  );
}
