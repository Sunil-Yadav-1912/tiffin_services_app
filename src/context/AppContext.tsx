import React, { createContext, useContext, useState, useEffect } from "react";
import { User, DailyLog, initialUsers, initialLogs, TiffinStatus } from "@/data/mockData";
import { toast } from "sonner";

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  signup: (data: Omit<User, "id" | "role">) => void;

  // Data
  users: User[];
  logs: DailyLog[];
  
  // Admin actions
  deleteUser: (id: string) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  updateLogStatus: (userId: string, date: string, status: TiffinStatus) => void;
  
  // Customer actions
  cancelTiffinForDateRange: (from: string, to: string) => void;
  addLeave: (from: string, to: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window === "undefined") return initialUsers;
    const saved = localStorage.getItem("matka_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [logs, setLogs] = useState<DailyLog[]>(() => {
    if (typeof window === "undefined") return initialLogs;
    const saved = localStorage.getItem("matka_logs");
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("matka_currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // Sync state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("matka_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("matka_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("matka_currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("matka_currentUser");
    }
  }, [currentUser]);
  
  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signup = (data: Omit<User, "id" | "role">) => {
    const newUser: User = {
      ...data,
      id: `cust-${Date.now()}`,
      role: "Customer",
    };
    setUsers(prev => [...prev, newUser]);
    // Optionally auto-login
    setCurrentUser(newUser);
  };

  const deleteUser = (id: string) => {
    if (currentUser?.role !== "Admin") return;
    setUsers(prev => prev.filter(u => u.id !== id));
    setLogs(prev => prev.filter(l => l.userId !== id));
    toast.success("Customer deleted");
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const updateLogStatus = (userId: string, date: string, status: TiffinStatus) => {
    setLogs(prev => {
      const existing = prev.find(l => l.userId === userId && l.date === date);
      if (existing) {
        return prev.map(l => l.id === existing.id ? { ...l, status } : l);
      }
      return [...prev, { id: `log-${Date.now()}`, userId, date, status }];
    });
  };

  const cancelTiffinForDateRange = (from: string, to: string) => {
    if (!currentUser) return;
    
    let currentDate = new Date(from);
    const endDate = new Date(to);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      updateLogStatus(currentUser.id, dateStr, "Cancelled");
      currentDate.setDate(currentDate.getDate() + 1);
    }
    toast.success(`Tiffins cancelled from ${from} to ${to}`);
  };

  const addLeave = (from: string, to: string) => {
    if (!currentUser) return;
    const leaveId = `leave-${Date.now()}`;
    const newLeave = { id: leaveId, from, to };
    
    // Add leave to user object
    setUsers(prev => prev.map(u => 
      u.id === currentUser.id 
        ? { ...u, leaves: [...(u.leaves || []), newLeave] }
        : u
    ));
    
    // Also cancel tiffins for these dates
    cancelTiffinForDateRange(from, to);
    
    // Update currentUser state if needed (often handled by the effect or we can force it)
    setCurrentUser(prev => prev ? { ...prev, leaves: [...(prev.leaves || []), newLeave] } : null);
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, signup,
      users, logs,
      deleteUser, updateUser, updateLogStatus, cancelTiffinForDateRange, addLeave
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
