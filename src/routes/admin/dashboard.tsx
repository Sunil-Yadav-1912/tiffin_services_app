import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { Users, CalendarCheck, FileText, Trash2, Edit, Plane, UserIcon } from "lucide-react";
import { tiffins } from "@/data/tiffins";
import { User, TiffinStatus } from "@/data/mockData";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { currentUser, users, logs, deleteUser, updateLogStatus, updateUser } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Admin Profile Edit State
  const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Customer Edit State
  const [isCustEditOpen, setIsCustEditOpen] = useState(false);
  const [editingCust, setEditingCust] = useState<User | null>(null);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "Admin") {
      navigate({ to: "/login" });
    } else {
      setAdminName(currentUser.name);
      setAdminEmail(currentUser.email);
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const customers = users.filter(u => u.role === "Customer");
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const handleMarkStatus = (userId: string, status: TiffinStatus) => {
    if (!dateStr) return;
    updateLogStatus(userId, dateStr, status);
  };

  const calculateUserBill = (user: User) => {
    const userLogs = logs.filter(l => l.userId === user.id && l.status === "Delivered");
    const plan = tiffins.find(t => t.id === user.selectedTiffinId);
    const price = plan ? plan.price : 100;
    return userLogs.length * price;
  };

  const totalRevenue = customers.reduce((sum, cust) => sum + calculateUserBill(cust), 0);

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
    setIsCustEditOpen(true);
  };

  const handleSaveCust = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCust) {
      updateUser(editingCust.id, {
        name: custName,
        phone: custPhone,
        address: custAddress
      });
      toast.success("Customer profile updated");
      setIsCustEditOpen(false);
    }
  };

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-sm font-medium text-foreground/90 mt-1">Manage customers, tiffins, and billing.</p>
        </div>
        
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
                  <th className="px-4 py-3 font-semibold rounded-tl-xl">Customer</th>
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {customers.map(cust => {
                  const log = logs.find(l => l.userId === cust.id && l.date === dateStr);
                  const status = log ? log.status : "Pending";
                  const onLeave = isCustomerOnLeave(cust, dateStr);
                  
                  return (
                    <tr key={cust.id} className={`transition ${onLeave ? 'bg-blue-500/5' : 'hover:bg-foreground/5'}`}>
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        {cust.name}
                        {onLeave && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full"><Plane size={10} /> On Leave</span>}
                      </td>
                      <td className="px-4 py-3 text-foreground/70">{cust.address || "No address"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex rounded-lg border border-border/50 bg-background overflow-hidden p-0.5">
                          <button
                            onClick={() => handleMarkStatus(cust.id, "Delivered")}
                            disabled={onLeave}
                            className={`px-3 py-1.5 text-xs font-bold transition rounded-md ${status === 'Delivered' ? 'bg-green-500 text-white' : 'hover:bg-foreground/10 text-foreground/70'} disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            Delivered
                          </button>
                          <button
                            onClick={() => handleMarkStatus(cust.id, "Cancelled")}
                            className={`px-3 py-1.5 text-xs font-bold transition rounded-md ${status === 'Cancelled' ? 'bg-red-500 text-white' : 'hover:bg-foreground/10 text-foreground/70'}`}
                          >
                            Cancelled
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {customers.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-4 text-muted-foreground">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer List */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Users size={20} className="text-brand-deep" /> Customer List
          </h2>
          <div className="space-y-3">
            {customers.map(cust => (
              <div key={cust.id} className="flex items-center justify-between p-3 rounded-xl bg-foreground/5 border border-border/50">
                <div>
                  <p className="text-sm font-semibold">{cust.name}</p>
                  <p className="text-xs text-foreground/60">{cust.phone || cust.email}</p>
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
            ))}
            {customers.length === 0 && <p className="text-sm text-muted-foreground">No customers available.</p>}
          </div>
        </div>

        {/* Billing Overview */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-brand-deep" /> Billing Overview
          </h2>
          <div className="flex-1 overflow-y-auto pr-2">
            <table className="w-full text-sm">
              <thead className="border-b border-border/50">
                <tr>
                  <th className="pb-2 text-left font-semibold text-muted-foreground">Customer</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">Total Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {customers.map(cust => (
                  <tr key={cust.id}>
                    <td className="py-2">{cust.name}</td>
                    <td className="py-2 text-right font-bold">₹{calculateUserBill(cust)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center bg-brand/5 p-3 rounded-xl">
            <span className="font-bold">Total Revenue</span>
            <span className="font-display text-2xl font-bold text-brand-deep">₹{totalRevenue}</span>
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
              <button type="submit" className="w-full mt-4 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-brand">
                Save Customer
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
