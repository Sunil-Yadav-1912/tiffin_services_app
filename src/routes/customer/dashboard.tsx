import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { Calendar, User as UserIcon, MapPin, Phone, CreditCard, Ban, CheckCircle2, Edit, Plane, Trash2 } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { UPIPaymentModal } from "@/components/UPIPaymentModal";

export const Route = createFileRoute("/customer/dashboard")({
  component: CustomerDashboard,
});

function CustomerDashboard() {
  const { currentUser, logs, cancelTiffinForDateRange, addLeave, updateUser, deleteLeave } = useApp();
  const navigate = useNavigate();

  const [cancelDateRange, setCancelDateRange] = useState<DateRange | undefined>();
  const [leaveDateRange, setLeaveDateRange] = useState<DateRange | undefined>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tiffins, setTiffins] = useState<any[]>([]);
  const [customerBills, setCustomerBills] = useState<any[]>([]);
  const [billingTab, setBillingTab] = useState<"current" | "past">("current");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "Customer") {
      navigate({ to: "/login" });
    } else {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone || "");
      setEditAddress(currentUser.address || "");
      import("@/api/client").then(({ api }) => {
        api.getTiffins().then(data => setTiffins(data)).catch(console.error);
        api.getCustomerBills().then(data => setCustomerBills(data || [])).catch(console.error);
      });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const sortedLogs = [...logs].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
  });
  
  // Deduplicate logs by date and tiffin, picking the latest modified one
  const userLogs = Object.values(sortedLogs.reduce((acc, log) => {
    const key = `${log.date}-${log.tiffinId}`;
    if (!acc[key]) {
      acc[key] = log;
    }
    return acc;
  }, {} as Record<string, any>));

  const customerTiffins = tiffins.filter(t => 
    (currentUser.tiffinIds || []).includes(String(t.id)) &&
    (t.category === "Monthly" || Number(t.price) >= 500 || t.name.toLowerCase().includes("monthly") || t.name.toLowerCase().includes("combo") || t.name.toLowerCase().includes("plan"))
  );
  const tiffinNames = customerTiffins.map(t => t.name).join(", ");

  // Calculate monthly mess plan bill
  const now = new Date();
  const currentMonthLogs = userLogs.filter(l => {
    const d = new Date(l.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Count delivered vs cancelled meals
  let deliveredMealsCount = 0;
  let totalBill = 0;

  customerTiffins.forEach(t => {
    const tiffinLogs = currentMonthLogs.filter(l => String(l.tiffinId) === String(t.id));
    // Default is Delivered unless marked Cancelled
    const delivered = tiffinLogs.filter(l => l.status !== "Cancelled");
    deliveredMealsCount += delivered.length;
    // Fixed monthly mess subscription fee (No refund policy for skipping)
    totalBill += Number(t.price || 0);
  });

  const advanceDeducted = Math.min(totalBill, currentUser.advancePayment || 0);
  const payableAmount = Math.max(0, totalBill - advanceDeducted);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cancelDateRange?.from && cancelDateRange?.to) {
      const days = Math.ceil((cancelDateRange.to.getTime() - cancelDateRange.from.getTime()) / (1000 * 3600 * 24)) + 1;
      if (days < 4) {
        toast.error("Please select a minimum of 4 days.");
        return;
      }
      const from = format(cancelDateRange.from, "yyyy-MM-dd");
      const to = format(cancelDateRange.to, "yyyy-MM-dd");
      await cancelTiffinForDateRange(from, to);
      setCancelDateRange(undefined);
    } else {
      toast.error("Please select a valid date range to cancel.");
    }
  };

  const handleLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leaveDateRange?.from && leaveDateRange?.to) {
      const days = Math.ceil((leaveDateRange.to.getTime() - leaveDateRange.from.getTime()) / (1000 * 3600 * 24)) + 1;
      if (days < 4) {
        toast.error("Please select a minimum of 4 days.");
        return;
      }
      const from = format(leaveDateRange.from, "yyyy-MM-dd");
      const to = format(leaveDateRange.to, "yyyy-MM-dd");
      await addLeave(from, to);
      setLeaveDateRange(undefined);
    } else {
      toast.error("Please select a valid date range for leave.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(currentUser.id, {
      name: editName,
      phone: editPhone,
      address: editAddress
    });
    toast.success("Profile updated");
    setIsEditOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Cancelled": return <Ban className="text-red-500" size={18} />;
      default: return <CheckCircle2 className="text-green-500" size={18} />;
    }
  };

  const disablePastDates = (date: Date) => {
    // Don't allow selecting dates before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Customer Dashboard</h1>
        <p className="text-sm font-medium text-foreground/90 mt-1">Welcome back, {currentUser.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col h-full relative">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <UserIcon size={20} className="text-brand-deep" /> Profile
            </h2>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button className="text-foreground/50 hover:text-brand-deep transition p-1">
                  <Edit size={16} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-bold">Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Name</label>
                    <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Phone</label>
                    <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Address</label>
                    <textarea value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full rounded-xl bg-foreground/5 border-none px-4 py-3 text-sm focus:ring-2 focus:ring-brand-deep/50 min-h-[80px]" />
                  </div>
                  <button type="submit" className="w-full mt-4 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-brand">
                    Save Changes
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4 text-sm text-foreground/80 flex-1">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Name</p>
              <p className="font-medium">{currentUser.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email</p>
              <p className="font-medium">{currentUser.email}</p>
            </div>
            {currentUser.phone && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Phone</p>
                <p className="font-medium flex items-center gap-1.5"><Phone size={14} /> {currentUser.phone}</p>
              </div>
            )}
            {currentUser.address && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Address</p>
                <p className="font-medium flex items-start gap-1.5"><MapPin size={14} className="mt-0.5 shrink-0" /> {currentUser.address}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Plan</p>
              <p className="font-medium text-brand-deep">{tiffinNames || "None Selected"}</p>
            </div>
          </div>
        </div>

        {/* Actions Col */}
        <div className="flex flex-col gap-6">
          {/* Billing Overview */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <CreditCard size={20} className="text-brand-deep" /> Billing &amp; Invoices
              </h2>
              <div className="flex rounded-xl bg-foreground/5 p-1 border border-border/50 text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBillingTab("current")}
                  className={`px-3 py-1 rounded-lg transition ${
                    billingTab === "current" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Current Month
                </button>
                <button
                  type="button"
                  onClick={() => setBillingTab("past")}
                  className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                    billingTab === "past" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Past Invoices
                  {customerBills.length > 0 && (
                    <span className="bg-brand-deep text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {customerBills.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {billingTab === "current" ? (
              <div className="space-y-3">
                <div className="bg-foreground/5 rounded-2xl p-4 border border-border/50">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-2 font-semibold">
                    <span>Active Period</span>
                    <span className="text-brand-deep">{format(now, "MMMM yyyy")} (Ongoing)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-foreground/70">Plan Monthly Fee:</span>
                    <span className="font-bold">₹{totalBill}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-foreground/70">Meals Delivered:</span>
                    <span className="font-bold text-green-600">{deliveredMealsCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-foreground/70">Advance Applied:</span>
                    <span className="font-bold text-green-600">-₹{advanceDeducted}</span>
                  </div>
                  <div className="pt-3 border-t border-border/50 flex justify-between items-end">
                    <span className="font-bold text-foreground">Total Due:</span>
                    <span className="font-display text-3xl font-bold text-brand-deep">₹{payableAmount}</span>
                  </div>
                </div>

                {payableAmount > 0 && (
                  <button
                    type="button"
                    id="pay-now-btn"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full mt-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-deep px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-brand-deep/25 transition hover:bg-brand active:scale-[0.98]"
                  >
                    <CreditCard size={16} />
                    Pay Now ₹{payableAmount}
                  </button>
                )}

                {customerBills.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBillingTab("past")}
                    className="w-full text-left p-3 rounded-xl bg-brand/5 hover:bg-brand/10 border border-brand/20 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-foreground">
                        Last Month's Bill ({(() => {
                          const parts = (customerBills[0].month_year || "").split("-");
                          if (parts.length === 2) {
                            const m = parseInt(parts[0], 10) - 1;
                            const y = parseInt(parts[1], 10);
                            return new Date(y, m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
                          }
                          return customerBills[0].month_year;
                        })()}):
                      </span>
                      <span className="ml-1.5 font-bold text-brand-deep">₹{customerBills[0].payable_amount}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      customerBills[0].status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {customerBills[0].status} →
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {customerBills.length === 0 ? (
                  <div className="text-center py-8 bg-foreground/5 rounded-2xl border border-border/50">
                    <p className="text-sm text-foreground/60">No past monthly invoices found.</p>
                    <p className="text-xs text-muted-foreground mt-1">Previous month bills will appear here once generated by admin.</p>
                  </div>
                ) : (
                  customerBills.map(b => {
                    const label = (() => {
                      const parts = (b.month_year || "").split("-");
                      if (parts.length === 2) {
                        const m = parseInt(parts[0], 10) - 1;
                        const y = parseInt(parts[1], 10);
                        return new Date(y, m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
                      }
                      return b.month_year;
                    })();

                    return (
                      <div key={b.id} className="bg-foreground/5 rounded-2xl p-4 border border-border/50 space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-border/40">
                          <span className="font-bold text-sm text-foreground">
                            {label}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <span>Total Monthly Plan:</span>
                          <span className="font-semibold">₹{b.total_amount}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-green-600">
                          <span>Advance Deducted:</span>
                          <span>{b.advance_deducted > 0 ? `-₹${b.advance_deducted}` : "--"}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-border/30">
                          <span className="text-xs font-bold text-foreground">Amount Payable:</span>
                          <span className="font-bold text-base text-brand-deep">₹{b.payable_amount}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Action Tabs */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Ban size={18} className="text-brand-deep" /> Skip / Pause Tiffin
              </h3>
              <a href="/terms" className="text-xs font-bold text-brand-deep hover:underline">
                Cutoff Rules ↗
              </a>
            </div>

            {/* Cutoff Guidelines Banner */}
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 mb-4 text-xs text-foreground/80 space-y-1">
              <p className="font-bold text-amber-800 dark:text-amber-300">Push Button Skip Deadlines:</p>
              <div className="text-[11px] text-foreground/70">
                • <strong>Breakfast:</strong> Before 12:00 AM (Midnight)<br />
                • <strong>Lunch:</strong> Before 10:00 AM<br />
                • <strong>Dinner:</strong> Before 6:00 PM
              </div>
            </div>

            <div className="space-y-6">
              {/* Cancel Range */}
              <div>
                <p className="text-xs font-semibold mb-2 text-foreground/80">Pause Delivery (Select Dates)</p>
                <form onSubmit={handleCancel} className="space-y-2">
                  <DatePickerWithRange
                    date={cancelDateRange}
                    setDate={setCancelDateRange}
                    disabledDates={disablePastDates}
                    minDays={4}
                  />
                  <button type="submit" className="w-full rounded-xl bg-foreground/10 px-4 py-2 text-sm font-bold transition hover:bg-foreground/20">
                    Cancel Dates
                  </button>
                </form>
              </div>

              <div className="h-px bg-border/50 w-full" />

              {/* Leave Range (Commented out as requested, since Cancel Tiffins does the same) */}
              {/* 
              <div>
                <p className="text-xs font-semibold mb-2 text-foreground/80">Mark On Leave</p>
                <form onSubmit={handleLeave} className="space-y-2">
                  <DatePickerWithRange 
                    date={leaveDateRange} 
                    setDate={setLeaveDateRange}
                    disabledDates={disablePastDates}
                  />
                  <button type="submit" className="w-full rounded-xl bg-blue-500/10 text-blue-600 px-4 py-2 text-sm font-bold transition hover:bg-blue-500/20 flex justify-center items-center gap-2">
                    <Plane size={16} /> Submit Leave
                  </button>
                </form>
              </div> 
              */}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col h-full md:col-span-1">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-brand-deep" /> Delivery Logs
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2 max-h-[500px]">
            {/* Show active leaves */}
            {currentUser.leaves && currentUser.leaves.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Leaves</p>
                {currentUser.leaves.map(leave => (
                  <div key={leave.id} className="flex items-center justify-between bg-blue-500/10 text-blue-700 text-xs px-3 py-2 rounded-lg font-medium border border-blue-500/20">
                    <span className="flex items-center gap-2">
                      <Plane size={14} /> {format(new Date(leave.from), "MMM d")} - {format(new Date(leave.to), "MMM d")}
                    </span>
                    <button 
                      onClick={() => deleteLeave(leave.id)}
                      className="text-blue-500/50 hover:text-red-500 transition-colors p-1"
                      title="Delete Cancellation Request"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4 mb-2">History</p>
            {userLogs.length === 0 ? (
              <p className="text-sm text-foreground/50 text-center py-8">No delivery logs found.</p>
            ) : (
              userLogs.map(log => {
                const displayStatus = log.status === 'Cancelled' ? 'Cancelled' : 'Delivered';
                return (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition border border-border/50">
                    <div>
                      <p className="text-sm font-semibold">{log.date}</p>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                        {tiffins.find(t => String(t.id) === String(log.tiffinId))?.name || `Plan ${log.tiffinId}`} - {displayStatus}
                      </p>
                    </div>
                    {getStatusIcon(displayStatus)}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        customerName={currentUser.name}
        amount={payableAmount}
      />
    </main>
  );
}
