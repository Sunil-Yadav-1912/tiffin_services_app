import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { useEffect, useState, useMemo } from "react";
import { Users, CalendarCheck, FileText, Trash2, Edit, Plane, UserIcon, CheckCircle2, Clock, Bell, BellDot, UserPlus, Check, Volume2 } from "lucide-react";
import { User, TiffinStatus, AppNotification } from "@/data/mockData";
import { DatePicker } from "@/components/ui/date-picker";
import { format, formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { requestNotificationPermission, getNotificationPermissionStatus, playNotificationSound, initPushNotifications } from "@/utils/notifications";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { currentUser, users, logs, deleteUser, updateLogStatus, updateUser, fetchDailyLogs, fetchCustomers,
    notifications, unreadCount, fetchNotifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [generatingBills, setGeneratingBills] = useState(false);
  const [bills, setBills] = useState<any[]>([]);
  const [tiffins, setTiffins] = useState<any[]>([]);
  
  // Notification Panel & Alert State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>("default");

  useEffect(() => {
    setNotifPermission(getNotificationPermissionStatus());
    initPushNotifications();
  }, []);

  const handleEnableAlerts = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    if (perm === "granted") {
      toast.success("Phone notification bar & background alerts enabled!");
    } else if (perm === "denied") {
      toast.error("Notification permission was blocked in browser. Please enable notifications in site settings.");
    } else {
      toast.info("Audio chime test played.");
    }
  };

  // Admin Profile Edit State
  const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Add Customer State
  const [isAddCustOpen, setIsAddCustOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addTiffins, setAddTiffins] = useState<string[]>([]);
  const [addAdvance, setAddAdvance] = useState<number>(0);

  // Customer Edit State
  const [isCustEditOpen, setIsCustEditOpen] = useState(false);
  const [editingCust, setEditingCust] = useState<User | null>(null);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custTiffins, setCustTiffins] = useState<string[]>([]);
  const [custAdvance, setCustAdvance] = useState<number>(0);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "Admin") {
      navigate({ to: "/login" });
    } else {
      setAdminName(currentUser.name);
      setAdminEmail(currentUser.email);
      // Fetch tiffins from API
      import("@/api/client").then(({ api }) => {
        api.getTiffins().then(data => setTiffins(data)).catch(console.error);
      });
      fetchNotifications();
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const customers = users.filter(u => u.role === "Customer");
  useEffect(() => {
    if (selectedDate) {
      fetchDailyLogs(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate]);

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const handleMarkStatus = async (userId: string, tiffinId: string, status: TiffinStatus) => {
    if (!dateStr) return;
    await updateLogStatus(userId, tiffinId, dateStr, status);
  };

  const [selectedBillingMonth, setSelectedBillingMonth] = useState<string>(format(new Date(), "MM-yyyy"));
  const [fetchingBills, setFetchingBills] = useState(false);

  const availableBillingMonths = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = format(d, "MM-yyyy");
      const label = format(d, "MMMM yyyy");
      list.push({ 
        value: val, 
        label: i === 0 ? `${label} (Current Month)` : (i === 1 ? `${label} (Last Month)` : label)
      });
    }
    return list;
  }, []);

  const fetchBillsForMonth = async (monthYear: string) => {
    setFetchingBills(true);
    try {
      const { api } = await import("@/api/client");
      const data = await api.getAdminBills(monthYear);
      setBills(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingBills(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "Admin") {
      fetchBillsForMonth(selectedBillingMonth);
    }
  }, [selectedBillingMonth, currentUser]);

  const handleGenerateBills = async () => {
    setGeneratingBills(true);
    try {
      const { api } = await import("@/api/client");
      const res = await api.generateBilling(selectedBillingMonth);
      if (res.bills) {
        setBills(res.bills);
      }
      toast.success(res.message || "Monthly bills generated successfully");
    } catch (e) {
      toast.error("Failed to generate bills");
    } finally {
      setGeneratingBills(false);
    }
  };

  const handleToggleBillStatus = async (billId: number | string, currentStatus: string) => {
    try {
      const { api } = await import("@/api/client");
      const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
      await api.updateBillStatus(billId, newStatus);
      setBills(prev => prev.map(b => b.id === billId ? { ...b, status: newStatus } : b));
      toast.success(`Bill marked as ${newStatus}`);
    } catch (e) {
      toast.error("Failed to update bill status");
    }
  };

  const getCustomerBill = (custId: string) => {
    return bills.find(b => String(b.user_id) === String(custId));
  };

  const totalRevenue = bills.reduce((sum, b) => sum + (Number(b.payable_amount || b.total_amount) || 0), 0);

  const isCustomerOnLeave = (cust: User, dStr: string) => {
    if (!cust.leaves || !dStr) return false;
    const checkDate = new Date(dStr);
    return cust.leaves.some(leave => {
      const from = new Date(leave.from);
      const to = new Date(leave.to);
      return checkDate >= from && checkDate <= to;
    });
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, { name: adminName, email: adminEmail });
    toast.success("Admin profile updated");
    setIsAdminEditOpen(false);
  };

  const openCustEdit = (cust: User) => {
    setEditingCust(cust);
    setCustName(cust.name);
    setCustPhone(cust.phone || "");
    setCustAddress(cust.address || "");
    setCustTiffins(cust.tiffinIds || []);
    setCustAdvance(cust.advancePayment || 0); 
    setIsCustEditOpen(true);
  };

  const handleSaveCust = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCust) {
      updateUser(editingCust.id, {
        name: custName,
        phone: custPhone,
        address: custAddress,
        tiffinIds: custTiffins,
        advancePayment: custAdvance
      });
      toast.success("Customer profile updated");
      setIsCustEditOpen(false);
    }
  };

  const handleAddCust = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { api } = await import("@/api/client");
      await api.createCustomer({
        name: addName,
        email: addEmail,
        password: addPassword,
        phone: addPhone,
        address: addAddress,
        tiffin_ids: addTiffins,
        advance_payment: addAdvance
      });
      toast.success("Customer added successfully");
      setIsAddCustOpen(false);
      // Reset form
      setAddName(""); setAddEmail(""); setAddPassword(""); setAddPhone(""); setAddAddress(""); setAddTiffins([]); setAddAdvance(0);
      await fetchCustomers();
    } catch (e) {
      toast.error("Failed to add customer");
    }
  };

  const messTiffins = tiffins.filter(t => 
    t.category === "Monthly" || 
    Number(t.price) >= 500 || 
    t.name.toLowerCase().includes("monthly") || 
    t.name.toLowerCase().includes("combo") || 
    t.name.toLowerCase().includes("plan")
  );

  const messCustomers = customers.filter(cust => 
    (cust.tiffinIds || []).some(tId => {
      const t = tiffins.find(item => String(item.id) === String(tId));
      return t ? (t.category === "Monthly" || Number(t.price) >= 500 || t.name.toLowerCase().includes("monthly") || t.name.toLowerCase().includes("combo") || t.name.toLowerCase().includes("plan")) : false;
    })
  );

  const calculatedRevenue = bills.length > 0 
    ? totalRevenue 
    : messCustomers.reduce((sum, cust) => {
        const custMessTiffins = tiffins.filter(t => (cust.tiffinIds || []).includes(String(t.id)));
        const monthlyTotal = custMessTiffins.reduce((s, t) => s + Number(t.price || 0), 0);
        const advanceApplied = Math.min(monthlyTotal, cust.advancePayment || 0);
        return sum + Math.max(0, monthlyTotal - advanceApplied);
      }, 0);

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-sm font-medium text-foreground/90 mt-1">Manage customers, tiffins, and billing.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Bell Notification Button */}
          <Dialog open={isNotifOpen} onOpenChange={setIsNotifOpen}>
            <DialogTrigger asChild>
              <button
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/5 transition hover:bg-foreground/10 border border-border/50"
                title="Notifications"
                onClick={() => { setIsNotifOpen(true); }}
              >
                {unreadCount > 0 ? (
                  <>
                    <BellDot size={18} className="text-brand-deep" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </>
                ) : (
                  <Bell size={18} className="text-foreground/70" />
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="w-[94vw] sm:max-w-[480px] p-4 sm:p-6 bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl max-h-[85vh] flex flex-col">
              <DialogHeader className="flex-shrink-0 pr-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <DialogTitle className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 flex-wrap">
                    <Bell size={18} className="text-brand-deep shrink-0" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                    )}
                  </DialogTitle>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs font-semibold text-brand-deep hover:underline flex items-center gap-1 w-fit"
                    >
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                </div>
              </DialogHeader>

              {/* Quick device alerts toggle banner */}
              {notifPermission !== "granted" && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2">
                  <p className="text-[11px] text-amber-800 font-medium leading-tight">Enable sound &amp; phone alerts for new signups</p>
                  <button
                    onClick={handleEnableAlerts}
                    className="shrink-0 text-[11px] font-bold bg-amber-500 text-white px-2.5 py-1 rounded-lg hover:bg-amber-600 transition shadow-sm"
                  >
                    Enable
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto mt-3 space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Bell size={36} className="text-foreground/20 mb-3" />
                    <p className="text-sm font-medium text-foreground/50">No notifications yet</p>
                    <p className="text-xs text-foreground/40 mt-1">New customer signups and events will appear here in real time.</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read && markNotificationRead(notif.id)}
                      className={`flex gap-2.5 sm:gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        notif.read
                          ? "bg-foreground/3 border-border/30 opacity-70"
                          : "bg-brand-deep/5 border-brand-deep/20 hover:bg-brand-deep/10"
                      }`}
                    >
                      <div className={`shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                        notif.type === "new_customer" ? "bg-green-100 text-green-600" : "bg-brand/10 text-brand-deep"
                      }`}>
                        {notif.type === "new_customer" ? <UserPlus size={15} /> : <Bell size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
                          <p className={`text-xs sm:text-sm font-semibold break-words sm:truncate ${notif.read ? "text-foreground/60" : "text-foreground"}`}>
                            {notif.title}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!notif.read && (
                              <span className="inline-block h-2 w-2 rounded-full bg-brand-deep" />
                            )}
                            <span className="text-[10px] text-foreground/40 whitespace-nowrap">
                              {(() => {
                                try {
                                  return formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true });
                                } catch {
                                  return notif.createdAt;
                                }
                              })()}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-foreground/60 mt-1 leading-snug break-words">{notif.message}</p>
                        {notif.meta && Object.keys(notif.meta).length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {notif.meta["phone"] && (
                              <span className="text-[10px] bg-foreground/5 rounded-md px-1.5 py-0.5 font-medium text-foreground/60">
                                📞 {notif.meta["phone"]}
                              </span>
                            )}
                            {notif.meta["email"] && (
                              <span className="text-[10px] bg-foreground/5 rounded-md px-1.5 py-0.5 font-medium text-foreground/60 truncate max-w-[190px]">
                                ✉️ {notif.meta["email"]}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Admin Profile Edit */}
          <Dialog open={isAdminEditOpen} onOpenChange={setIsAdminEditOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-xl bg-foreground/5 px-4 py-2 text-sm font-bold transition hover:bg-foreground/10 border border-border/50">
                <UserIcon size={16} /> Edit Profile
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-bold">Edit Admin Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveAdmin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Name</label>
                  <input type="text" required value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email</label>
                  <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
                </div>
                <button type="submit" className="w-full mt-4 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-brand">
                  Save Changes
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Daily Operations */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <CalendarCheck size={20} className="text-brand-deep" /> Daily Delivery Marking
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Select Date:</span>
              <DatePicker date={selectedDate} setDate={setSelectedDate} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-foreground/5 rounded-t-xl">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-xl">Customer - Tiffin</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Address</th>
                  <th className="px-2 py-3 font-semibold text-center">Status</th>
                  <th className="px-2 py-3 font-semibold rounded-tr-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(() => {
                  const deliveryRows = customers.flatMap(cust => {
                    const subscribedMessIds = (cust.tiffinIds || []).filter(tId => {
                      const t = tiffins.find(item => String(item.id) === String(tId));
                      return t ? (t.category === "Monthly" || Number(t.price) >= 500 || t.name.toLowerCase().includes("monthly") || t.name.toLowerCase().includes("combo") || t.name.toLowerCase().includes("plan")) : false;
                    });
                    return subscribedMessIds.map(tId => ({ cust, tiffinId: tId }));
                  });

                  if (deliveryRows.length === 0) {
                    return (
                      <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No hostel mess subscriptions found for this date.</td></tr>
                    );
                  }

                  return deliveryRows.map(({ cust, tiffinId }) => {
                    const log = logs.find(l => l.userId === cust.id && String(l.tiffinId) === String(tiffinId) && l.date === dateStr);
                    const onLeave = isCustomerOnLeave(cust, dateStr);
                    // Default status is 'Delivered' (unless on leave or cancelled manually)
                    const status = onLeave ? "Cancelled" : (log ? (log.status === "Cancelled" ? "Cancelled" : "Delivered") : "Delivered");
                    const tiffinName = tiffins.find(t => String(t.id) === String(tiffinId))?.name || `Plan ${tiffinId}`;
                    
                    return (
                      <tr key={`${cust.id}-${tiffinId}`} className={`transition ${onLeave ? 'bg-blue-500/5' : 'hover:bg-foreground/5'}`}>
                        <td className="px-2 sm:px-4 py-3 font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span>{cust.name} - {tiffinName}</span>
                          {onLeave && <span className="inline-flex w-fit items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 rounded-full"><Plane size={10} /> On Leave</span>}
                        </td>
                        <td className="px-4 py-3 text-foreground/70 hidden sm:table-cell">{cust.address || "Hostel Room"}</td>
                        <td className="px-2 py-3 text-center">
                          <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md ${
                            status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-right">
                          <div className="inline-flex flex-col sm:flex-row rounded-lg border border-border/50 bg-background overflow-hidden p-0.5 gap-0.5 sm:gap-0">
                            <button
                              onClick={() => handleMarkStatus(cust.id, tiffinId, "Delivered")}
                              disabled={onLeave}
                              className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold transition rounded-md ${status === 'Delivered' ? 'bg-green-500 text-white shadow-sm' : 'hover:bg-foreground/10 text-foreground/70'} disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                              Delivered
                            </button>
                            <button
                              onClick={() => handleMarkStatus(cust.id, tiffinId, "Cancelled")}
                              className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold transition rounded-md ${status === 'Cancelled' ? 'bg-red-500 text-white shadow-sm' : 'hover:bg-foreground/10 text-foreground/70'}`}
                            >
                              Cancelled
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer List */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Users size={20} className="text-brand-deep" /> Customer List
            </h2>
            <Dialog open={isAddCustOpen} onOpenChange={setIsAddCustOpen}>
              <DialogTrigger asChild>
                <button className="text-xs font-bold bg-brand-deep text-white px-3 py-1.5 rounded-lg hover:bg-brand transition shadow-sm">
                  + Add Customer
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-bold">Add New Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCust} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Name</label>
                    <input type="text" required value={addName} onChange={e => setAddName(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email</label>
                    <input type="email" required value={addEmail} onChange={e => setAddEmail(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Password</label>
                    <input type="password" required value={addPassword} onChange={e => setAddPassword(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Phone</label>
                    <input type="tel" value={addPhone} onChange={e => setAddPhone(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Address</label>
                    <textarea value={addAddress} onChange={e => setAddAddress(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50 min-h-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Hostel Mess Subscription</label>
                    <div className="flex flex-col gap-2 p-3 bg-foreground/5 rounded-xl border-none max-h-48 overflow-y-auto">
                      {messTiffins.map(tiffin => (
                        <label key={tiffin.id} className="flex items-center justify-between gap-2 cursor-pointer text-sm p-1.5 hover:bg-foreground/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              className="rounded text-brand-deep focus:ring-brand-deep/50"
                              checked={addTiffins.includes(String(tiffin.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAddTiffins([...addTiffins, String(tiffin.id)]);
                                } else {
                                  setAddTiffins(addTiffins.filter(id => id !== String(tiffin.id)));
                                }
                              }}
                            />
                            <span>{tiffin.name}</span>
                          </div>
                          <span className="font-semibold text-brand-deep text-xs">₹{tiffin.price}/mo</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Advance Payment</label>
                    <input 
                      type="number" 
                      value={addAdvance} 
                      onChange={e => setAddAdvance(Number(e.target.value) || 0)} 
                      className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" 
                      min="0"
                    />
                  </div>
                  <button type="submit" className="w-full mt-4 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-brand">
                    Add Customer
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3">
            {customers.map(cust => {
              const custPlanNames = tiffins
                .filter(t => (cust.tiffinIds || []).includes(String(t.id)))
                .map(t => t.name)
                .join(", ");

              return (
                <div key={cust.id} className="flex items-center justify-between p-3 rounded-xl bg-foreground/5 border border-border/50">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{cust.name}</p>
                    <p className="text-xs text-foreground/60">{cust.phone || cust.email} {cust.address ? `• ${cust.address}` : ''}</p>
                    {custPlanNames && (
                      <p className="text-[11px] font-semibold text-brand-deep">{custPlanNames}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openCustEdit(cust)} className="p-2 text-foreground/50 hover:text-brand-deep transition" title="Edit Customer">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteUser(cust.id)}
                      className="p-2 text-foreground/50 hover:text-red-500 transition" title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            {customers.length === 0 && <p className="text-sm text-muted-foreground">No customers available.</p>}
          </div>
        </div>

        {/* Billing Overview */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <FileText size={20} className="text-brand-deep" /> Billing Overview
            </h2>
            <div className="flex items-center gap-2 bg-foreground/5 p-1 rounded-xl border border-border/50">
              <label className="text-xs font-bold text-muted-foreground pl-2">Period:</label>
              <select
                value={selectedBillingMonth}
                onChange={e => setSelectedBillingMonth(e.target.value)}
                className="rounded-lg bg-background border border-border/60 px-3 py-1.5 text-xs font-bold text-foreground focus:ring-2 focus:ring-brand-deep/50 shadow-sm cursor-pointer"
              >
                {availableBillingMonths.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-foreground/5 p-4 rounded-xl border border-border/50">
              <div>
                <p className="font-semibold text-sm">
                  {availableBillingMonths.find(m => m.value === selectedBillingMonth)?.label || selectedBillingMonth} Invoicing
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {fetchingBills 
                    ? "Loading records..." 
                    : (bills.length > 0 
                      ? `${bills.length} finalized invoice(s) for this month.` 
                      : "No invoices generated yet for this period. Click generate to create or recalculate.")}
                </p>
              </div>
              <button 
                onClick={handleGenerateBills} 
                disabled={generatingBills}
                className="rounded-lg bg-brand-deep px-4 py-2 text-xs font-bold text-white transition hover:bg-brand disabled:opacity-50 shrink-0 self-start sm:self-center"
              >
                {generatingBills ? "Generating..." : `Generate / Update Invoices`}
              </button>
            </div>
            
            <table className="w-full text-sm">
              <thead className="border-b border-border/50">
                <tr>
                  <th className="pb-2 text-left font-semibold text-muted-foreground">Customer</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">Total</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground" title="Amount deducted from total based on advance balance">Advance</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">Payable</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {messCustomers.map(cust => {
                  const bill = getCustomerBill(cust.id);
                  const custMessTiffins = tiffins.filter(t => (cust.tiffinIds || []).includes(String(t.id)));
                  const monthlyTotal = custMessTiffins.reduce((s, t) => s + Number(t.price || 0), 0);
                  const advanceApplied = bill && bill.advance_deducted !== undefined 
                    ? bill.advance_deducted 
                    : Math.min(monthlyTotal, cust.advancePayment || 0);
                  const totalAmt = bill ? bill.total_amount : monthlyTotal;
                  const payable = bill ? bill.payable_amount : Math.max(0, totalAmt - advanceApplied);

                  return (
                    <tr key={cust.id} className="hover:bg-foreground/5 transition">
                      <td className="py-2.5 font-medium">
                        <div>{cust.name}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">
                          {custMessTiffins.map(t => t.name).join(", ")}
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-foreground">
                        ₹{totalAmt}
                      </td>
                      <td className="py-2.5 text-right text-green-600">
                        {advanceApplied > 0 ? `-₹${advanceApplied}` : "--"}
                      </td>
                      <td className="py-2.5 text-right font-bold text-brand-deep">
                        ₹{payable}
                      </td>
                      <td className="py-2.5 text-right">
                        {bill ? (
                          <button
                            type="button"
                            onClick={() => handleToggleBillStatus(bill.id, bill.status)}
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold transition shadow-sm ${
                              bill.status === "Paid" 
                                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            }`}
                            title="Click to toggle Paid/Unpaid"
                          >
                            {bill.status}
                          </button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">Live Est.</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {messCustomers.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-4 text-muted-foreground">No active mess subscribers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center bg-brand/5 p-3 rounded-xl">
            <div>
              <span className="font-bold">Total Revenue</span>
              <p className="text-[11px] text-muted-foreground">
                {availableBillingMonths.find(m => m.value === selectedBillingMonth)?.label || selectedBillingMonth}
              </p>
            </div>
            <span className="font-display text-2xl font-bold text-brand-deep">
              {calculatedRevenue > 0 ? `₹${calculatedRevenue}` : "--"}
            </span>
          </div>
        </div>

      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={isCustEditOpen} onOpenChange={setIsCustEditOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">Edit Customer</DialogTitle>
          </DialogHeader>
          {editingCust && (
            <form onSubmit={handleSaveCust} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Name</label>
                <input type="text" required value={custName} onChange={e => setCustName(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone</label>
                <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Address</label>
                <textarea value={custAddress} onChange={e => setCustAddress(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50 min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Hostel Mess Subscription</label>
                <div className="flex flex-col gap-2 p-3 bg-foreground/5 rounded-xl border-none max-h-48 overflow-y-auto">
                  {messTiffins.map(tiffin => (
                    <label key={tiffin.id} className="flex items-center justify-between gap-2 cursor-pointer text-sm p-1.5 hover:bg-foreground/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          className="rounded text-brand-deep focus:ring-brand-deep/50"
                          checked={custTiffins.includes(String(tiffin.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustTiffins([...custTiffins, String(tiffin.id)]);
                            } else {
                              setCustTiffins(custTiffins.filter(id => id !== String(tiffin.id)));
                            }
                          }}
                        />
                        <span>{tiffin.name}</span>
                      </div>
                      <span className="font-semibold text-brand-deep text-xs">₹{tiffin.price}/mo</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Advance Payment (Optional)</label>
                <input 
                  type="number" 
                  value={custAdvance} 
                  onChange={e => setCustAdvance(Number(e.target.value) || 0)} 
                  className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" 
                  min="0"
                />
              </div>
              <button type="submit" className="w-full mt-4 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-brand">
                Save Customer
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification History Panel */}
      <div className="mt-8 glass-panel rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
              <Bell size={20} className="text-brand-deep shrink-0" />
              <span>Notification History</span>
              {unreadCount > 0 && (
                <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} unread</span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {notifPermission !== "granted" && (
              <button
                onClick={handleEnableAlerts}
                className="text-xs font-bold text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg px-2.5 py-1.5 transition flex items-center gap-1"
                title="Enable browser sound & push alerts"
              >
                🔔 Enable Alerts
              </button>
            )}
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-brand-deep hover:underline flex items-center gap-1 bg-brand-deep/5 px-2.5 py-1.5 rounded-lg border border-brand-deep/20"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              className="text-xs font-semibold text-foreground/70 hover:text-foreground transition flex items-center gap-1 border border-border/50 rounded-lg px-2.5 py-1.5 bg-foreground/5"
            >
              Refresh
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Bell size={40} className="text-foreground/15 mb-3" />
            <p className="text-sm font-medium text-foreground/50">No notifications yet</p>
            <p className="text-xs text-foreground/40 mt-1">New customer signups and system events will appear here in real time.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => !notif.read && markNotificationRead(notif.id)}
                className={`flex gap-2.5 sm:gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  notif.read
                    ? "bg-foreground/3 border-border/30 opacity-60"
                    : "bg-brand-deep/5 border-brand-deep/15 hover:bg-brand-deep/10"
                }`}
              >
                <div className={`shrink-0 mt-0.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full ${
                  notif.type === "new_customer" ? "bg-green-100 text-green-600" : "bg-brand/10 text-brand-deep"
                }`}>
                  {notif.type === "new_customer" ? <UserPlus size={16} /> : <Bell size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${notif.read ? "text-foreground/60" : "text-foreground"}`}>
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!notif.read && (
                        <span className="inline-block h-2 w-2 rounded-full bg-brand-deep" />
                      )}
                      <span className="text-[10px] text-foreground/40 whitespace-nowrap">
                        {(() => {
                          try {
                            return formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true });
                          } catch {
                            return "";
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/60 mt-1 leading-snug break-words">{notif.message}</p>
                  {notif.meta && Object.keys(notif.meta).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {notif.meta["phone"] && (
                        <span className="text-[10px] bg-foreground/5 rounded-md px-1.5 py-0.5 font-medium text-foreground/60">
                          📞 {notif.meta["phone"]}
                        </span>
                      )}
                      {notif.meta["email"] && (
                        <span className="text-[10px] bg-foreground/5 rounded-md px-1.5 py-0.5 font-medium text-foreground/60 truncate max-w-[200px]">
                          ✉️ {notif.meta["email"]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
