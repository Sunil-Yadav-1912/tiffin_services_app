import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { Users, CalendarCheck, FileText, Trash2, Edit, Plane, UserIcon } from "lucide-react";
import { User, TiffinStatus } from "@/data/mockData";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { currentUser, users, logs, deleteUser, updateLogStatus, updateUser, fetchDailyLogs, fetchCustomers } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [generatingBills, setGeneratingBills] = useState(false);
  const [bills, setBills] = useState<any[]>([]);
  const [tiffins, setTiffins] = useState<any[]>([]);
  
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

  const handleGenerateBills = async () => {
    setGeneratingBills(true);
    try {
      const { api } = await import("@/api/client");
      const res = await api.generateBilling();
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
        tiffin_ids: custTiffins,
        advance_payment: custAdvance
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
                  <th className="px-4 py-3 font-semibold rounded-tl-xl">Customer - Tiffin</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Address</th>
                  <th className="px-2 py-3 font-semibold text-center">Status</th>
                  <th className="px-2 py-3 font-semibold rounded-tr-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {customers.flatMap(cust => {
                  const tids = cust.tiffinIds?.length ? cust.tiffinIds : ["1"]; // fallback to 1 if none
                  return tids.map(tId => ({ cust, tiffinId: tId }));
                }).map(({ cust, tiffinId }) => {
                  const log = logs.find(l => l.userId === cust.id && String(l.tiffinId) === String(tiffinId) && l.date === dateStr);
                  const onLeave = isCustomerOnLeave(cust, dateStr);
                  const status = onLeave ? "Cancelled" : (log ? log.status : "Pending");
                  const tiffinName = tiffins.find(t => String(t.id) === String(tiffinId))?.name || `Tiffin ${tiffinId}`;
                  
                  return (
                    <tr key={`${cust.id}-${tiffinId}`} className={`transition ${onLeave ? 'bg-blue-500/5' : 'hover:bg-foreground/5'}`}>
                      <td className="px-2 sm:px-4 py-3 font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span>{cust.name} - {tiffinName}</span>
                        {onLeave && <span className="inline-flex w-fit items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 rounded-full"><Plane size={10} /> On Leave</span>}
                      </td>
                      <td className="px-4 py-3 text-foreground/70 hidden sm:table-cell">{cust.address || "No address"}</td>
                      <td className="px-2 py-3 text-center">
                        <span className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-1 rounded-md ${
                          status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <div className="inline-flex flex-col sm:flex-row rounded-lg border border-border/50 bg-background overflow-hidden p-0.5 gap-0.5 sm:gap-0">
                          <button
                            onClick={() => handleMarkStatus(cust.id, tiffinId, "Delivered")}
                            disabled={onLeave}
                            className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold transition rounded-md ${status === 'Delivered' ? 'bg-green-500 text-white' : 'hover:bg-foreground/10 text-foreground/70'} disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            Delivered
                          </button>
                          <button
                            onClick={() => handleMarkStatus(cust.id, tiffinId, "Cancelled")}
                            className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold transition rounded-md ${status === 'Cancelled' ? 'bg-red-500 text-white' : 'hover:bg-foreground/10 text-foreground/70'}`}
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
                    <label className="text-sm font-semibold">Tiffins</label>
                    <div className="flex flex-col gap-2 p-3 bg-foreground/5 rounded-xl border-none">
                      {tiffins.map(tiffin => (
                        <label key={tiffin.id} className="flex items-center gap-2 cursor-pointer text-sm">
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
                          {tiffin.name} (₹{tiffin.price})
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
            <div className="flex items-center justify-between mb-4 bg-foreground/5 p-4 rounded-xl border border-border/50">
              <div>
                <p className="font-semibold text-sm">Monthly Billing</p>
                <p className="text-xs text-muted-foreground mt-1">Generate invoices for all active customers based on this month's deliveries.</p>
              </div>
              <button 
                onClick={handleGenerateBills} 
                disabled={generatingBills}
                className="rounded-lg bg-brand-deep px-4 py-2 text-xs font-bold text-white transition hover:bg-brand disabled:opacity-50"
              >
                {generatingBills ? "Generating..." : "Generate Bills"}
              </button>
            </div>
            
            <table className="w-full text-sm">
              <thead className="border-b border-border/50">
                <tr>
                  <th className="pb-2 text-left font-semibold text-muted-foreground">Customer</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">Total</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground" title="Amount deducted from total based on advance balance">Advance Applied</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {customers.map(cust => {
                  const bill = getCustomerBill(cust.id);
                  return (
                    <tr key={cust.id}>
                      <td className="py-2">{cust.name}</td>
                      <td className="py-2 text-right text-foreground">
                        {bill ? `₹${bill.total_amount}` : "--"}
                      </td>
                      <td className="py-2 text-right text-green-600">
                        {bill && bill.advance_deducted ? `-₹${bill.advance_deducted}` : "--"}
                      </td>
                      <td className="py-2 text-right font-bold text-brand-deep">
                        {bill ? `₹${bill.payable_amount}` : "Not generated"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center bg-brand/5 p-3 rounded-xl">
            <span className="font-bold">Total Revenue</span>
            <span className="font-display text-2xl font-bold text-brand-deep">
              {bills.length > 0 ? `₹${totalRevenue}` : "--"}
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
                <label className="text-sm font-semibold">Tiffins</label>
                <div className="flex flex-col gap-2 p-3 bg-foreground/5 rounded-xl border-none">
                  {tiffins.map(tiffin => (
                    <label key={tiffin.id} className="flex items-center gap-2 cursor-pointer text-sm">
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
                      {tiffin.name} (₹{tiffin.price})
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
    </main>
  );
}
