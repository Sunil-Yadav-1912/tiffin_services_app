import React, { createContext, useContext, useState, useEffect } from "react";
import { User, DailyLog, TiffinStatus } from "@/data/mockData";
import { toast } from "sonner";
import { api } from "@/api/client";

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  signup: (data: Omit<User, "id" | "role">) => Promise<boolean>;

  // Data
  users: User[];
  logs: DailyLog[];

  // Admin actions
  deleteUser: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  updateLogStatus: (userId: string, tiffinId: string, date: string, status: TiffinStatus) => Promise<void>;
  fetchDailyLogs: (date: string) => Promise<void>;
  fetchCustomers: () => Promise<void>;

  // Customer actions
  cancelTiffinForDateRange: (from: string, to: string) => Promise<void>;
  addLeave: (from: string, to: string) => Promise<void>;
  deleteLeave: (id: string) => Promise<void>;
  fetchCustomerData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("crownora_currentUser") || localStorage.getItem("matka_currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("crownora_currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("crownora_currentUser");
      localStorage.removeItem("matka_currentUser");
      localStorage.removeItem("crownora_token");
      localStorage.removeItem("matka_token");
      setUsers([]);
      setLogs([]);
    }

    const handleUnauthorized = () => {
      if (localStorage.getItem("crownora_token") || localStorage.getItem("matka_token")) {
        toast.error("Session expired. Please login again.");
        logout();
      }
    };

    window.addEventListener("unauthorized_api", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized_api", handleUnauthorized);
    };
  }, [currentUser]);

  // Separate effect for fetching data so updating currentUser doesn't cause infinite loops
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "Admin") {
        fetchCustomers();
      } else {
        fetchCustomerData();
      }
    }
  }, [currentUser?.id, currentUser?.role]);

  const fetchCustomers = async () => {
    try {
      const data = await api.getCustomers();
      // Map API data to our User format if needed
      setUsers(data.map((u: any) => ({
        ...u,
        tiffinIds: u.tiffins ? u.tiffins.map((t: any) => String(t.id)) : (Array.isArray(u.tiffin_ids) ? u.tiffin_ids.map(String) : []),
        advancePayment: Number(u.advance_payment) || 0,
        leaves: u.leaves ? u.leaves.map((l: any) => ({ id: String(l.id), from: l.from_date, to: l.to_date })) : [],
        id: String(u.id)
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDailyLogs = async (date: string) => {
    try {
      const data = await api.getDailyLogs(date);
      // Replace logs for this date or just set them if admin dashboard only shows one day
      // Assuming API returns array of logs
      setLogs(data.map((l: any) => ({
        ...l,
        id: String(l.id),
        userId: String(l.user_id || l.userId), // Adjust based on exact backend field
        tiffinId: String(l.tiffin_id || l.tiffinId || "1"),
        updated_at: l.updated_at
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const [profileData, leavesData, logsData] = await Promise.all([
        api.getCustomerProfile(),
        api.getCustomerLeaves(),
        api.getCustomerLogs()
      ]);

      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...profileData,
          tiffinIds: profileData.tiffins ? profileData.tiffins.map((t: any) => String(t.id)) : (profileData.tiffin_ids ? profileData.tiffin_ids.map(String) : prev.tiffinIds),
          advancePayment: Number(profileData.advance_payment) || prev.advancePayment || 0,
          leaves: leavesData.map((l: any) => ({ id: String(l.id), from: l.from_date, to: l.to_date }))
        };
      });

      const logsArray = Array.isArray(logsData) ? logsData : (logsData.data || []);

      setLogs(logsArray.map((l: any) => ({
        id: String(l.id),
        userId: String(profileData.id),
        tiffinId: String(l.tiffin_id || "1"),
        date: l.date ? String(l.date).split(" ")[0].split("T")[0] : "",
        status: l.status,
        updated_at: l.updated_at
      })));

    } catch (e) {
      console.error(e);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.login({ email, password: pass });
      if (res.access_token) {
        localStorage.setItem("crownora_token", res.access_token);
        const u = res.user;
        setCurrentUser({
          id: String(u.id),
          name: u.name,
          email: u.email,
          role: u.role,
          tiffinIds: Array.isArray(u.tiffin_ids) ? u.tiffin_ids.map(String) : [],
          advancePayment: Number(u.advance_payment) || 0
        });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = async () => {
    const oldToken = localStorage.getItem("crownora_token") || localStorage.getItem("matka_token");
    // Clear state immediately to prevent infinite loops on 401
    localStorage.removeItem("crownora_token");
    localStorage.removeItem("matka_token");
    localStorage.removeItem("crownora_currentUser");
    localStorage.removeItem("matka_currentUser");
    setCurrentUser(null);
    setUsers([]);
    setLogs([]);

    try {
      if (oldToken) {
        // Call backend to revoke the token manually using the old token
        await fetch(`${BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${oldToken}`
          }
        });
      }
    } catch (e) {
      // Ignore errors during logout
    }

    // Force redirect to home page and full state reset
    window.location.href = "/";
  };

  const signup = async (data: Omit<User, "id" | "role">) => {
    try {
      // Assuming POST /admin/customers works for open signup too, or we have a generic register
      // The guide didn't specify a signup endpoint, so we fallback to a mock or just return true
      const newUser: User = {
        ...data,
        id: `cust-${Date.now()}`,
        role: "Customer",
      };
      // If we had a register endpoint: await api.register(data)
      setCurrentUser(newUser);
      return true;
    } catch (e) {
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    if (currentUser?.role !== "Admin") return;
    try {
      await api.deleteCustomer(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("Customer deleted");
    } catch (e) {
      toast.error("Failed to delete customer");
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      if (currentUser?.role === "Customer") {
        await api.updateCustomerProfile({
          phone: data.phone,
          address: data.address,
          tiffin_ids: data.tiffinIds
        });
        setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      } else {
        // Map frontend camelCase to backend snake_case
        const payload = { ...data };
        if (payload.tiffinIds) {
          payload.tiffin_ids = payload.tiffinIds;
          delete payload.tiffinIds;
        }
        if (payload.advancePayment !== undefined) {
          payload.advance_payment = payload.advancePayment;
          delete payload.advancePayment;
        }
        await api.updateCustomer(id, payload);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
      }
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const updateLogStatus = async (userId: string, tiffinId: string, date: string, status: TiffinStatus) => {
    try {
      // Find the log id. If not in state, this is tricky. We'll use a dummy ID and let backend handle it 
      // or if backend requires log_ids:
      const existing = logs.find(l => l.userId === userId && l.tiffinId === tiffinId && l.date === date);
      const logId = existing ? existing.id : userId + "-" + tiffinId + "-" + date; // Backend would need real ID or a way to update by date

      // Depending on API, you might need to send tiffin_id
      await api.bulkUpdateLogs({
        user_id: userId,
        tiffin_id: tiffinId,
        date: date,
        status: status,
      });

      setLogs(prev => {
        if (existing) {
          return prev.map(l => l.id === existing.id ? { ...l, status } : l);
        }
        return [...prev, { id: logId, userId, tiffinId, date, status }];
      });
    } catch (e) {
      toast.error("Status update failed");
    }
  };

  const cancelTiffinForDateRange = async (from: string, to: string) => {
    if (!currentUser) return;
    try {
      // The integration guide specifies /customer/leaves for scheduling a pause
      await api.scheduleLeave({ from_date: from, to_date: to });
      await fetchCustomerData(); // refresh data
      toast.success(`Tiffins cancelled from ${from} to ${to}`);
    } catch (e) {
      toast.error("Failed to cancel tiffins");
    }
  };

  const addLeave = async (from: string, to: string) => {
    if (!currentUser) return;
    try {
      await api.scheduleLeave({ from_date: from, to_date: to });
      await fetchCustomerData(); // refresh data
      toast.success("Leave marked successfully");
    } catch (e) {
      toast.error("Failed to mark leave");
    }
  };

  const deleteLeave = async (id: string) => {
    if (!currentUser) return;
    try {
      await api.cancelLeave(id);
      await fetchCustomerData(); // refresh data
      toast.success("Leave cancelled successfully");
    } catch (e) {
      toast.error("Failed to cancel leave");
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, signup,
      users, logs,
      deleteUser, updateUser, updateLogStatus, cancelTiffinForDateRange, addLeave, deleteLeave,
      fetchDailyLogs, fetchCustomers, fetchCustomerData
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

