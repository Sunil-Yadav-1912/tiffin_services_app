import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { tiffins } from "@/data/tiffins";
import { useEffect, useState } from "react";
import { Calendar, User as UserIcon, MapPin, Phone, CreditCard, Ban, CheckCircle2, Circle, Edit, Plane } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/dashboard")({
  component: CustomerDashboard,
});

function CustomerDashboard() {
  const { currentUser, logs, cancelTiffinForDateRange, addLeave, updateUser } = useApp();
  const navigate = useNavigate();
  
  const [cancelDateRange, setCancelDateRange] = useState<DateRange | undefined>();
  const [leaveDateRange, setLeaveDateRange] = useState<DateRange | undefined>();
  const [isEditOpen, setIsEditOpen] = useState(false);

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
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const userLogs = logs.filter(l => l.userId === currentUser.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const selectedTiffin = tiffins.find(t => t.id === currentUser.selectedTiffinId);
  const mealPrice = selectedTiffin ? selectedTiffin.price : 100;

  // Calculate bill (Delivered meals)
  const deliveredMeals = userLogs.filter(l => l.status === "Delivered");
  const totalBill = deliveredMeals.length * mealPrice;

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (cancelDateRange?.from && cancelDateRange?.to) {
      const from = format(cancelDateRange.from, "yyyy-MM-dd");
      const to = format(cancelDateRange.to, "yyyy-MM-dd");
      cancelTiffinForDateRange(from, to);
      setCancelDateRange(undefined);
    } else {
      toast.error("Please select a valid date range to cancel.");
    }
  };

  const handleLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (leaveDateRange?.from && leaveDateRange?.to) {
      const from = format(leaveDateRange.from, "yyyy-MM-dd");
      const to = format(leaveDateRange.to, "yyyy-MM-dd");
      addLeave(from, to);
      setLeaveDateRange(undefined);
    } else {
      toast.error("Please select a valid date range for leave.");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      name: editName,
      phone: editPhone,
      address: editAddress
    });
    toast.success("Profile updated");
    setIsEditOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle2 className="text-green-500" size={18} />;
      case "Cancelled": return <Ban className="text-red-500" size={18} />;
      default: return <Circle className="text-yellow-500" size={18} />;
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
              <p className="font-medium text-brand-deep">{selectedTiffin?.name || "None Selected"}</p>
            </div>
          </div>
        </div>

        {/* Actions Col */}
        <div className="flex flex-col gap-6">
          {/* Billing Overview */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-brand-deep" /> Current Bill
            </h2>
            <div className="bg-foreground/5 rounded-2xl p-4 border border-border/50">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-foreground/70">Meals Delivered:</span>
                <span className="font-bold">{deliveredMeals.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-foreground/70">Price per meal:</span>
                <span className="font-bold">₹{mealPrice}</span>
              </div>
              <div className="pt-3 border-t border-border/50 flex justify-between items-end">
                <span className="font-bold text-foreground">Total Due:</span>
                <span className="font-display text-3xl font-bold text-brand-deep">₹{totalBill}</span>
              </div>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm flex-1">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
               <Ban size={18} className="text-brand-deep" /> Adjust Plan
            </h3>
            
            <div className="space-y-6">
              {/* Cancel Range */}
              <div>
                <p className="text-xs font-semibold mb-2 text-foreground/80">Cancel Tiffins (Range)</p>
                <form onSubmit={handleCancel} className="space-y-2">
                  <DatePickerWithRange 
                    date={cancelDateRange} 
                    setDate={setCancelDateRange} 
                    disabledDates={disablePastDates}
                  />
                  <button type="submit" className="w-full rounded-xl bg-foreground/10 px-4 py-2 text-sm font-bold transition hover:bg-foreground/20">
                    Cancel Dates
                  </button>
                </form>
              </div>

              <div className="h-px bg-border/50 w-full" />

              {/* Leave Range */}
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
                  <div key={leave.id} className="flex items-center gap-2 bg-blue-500/10 text-blue-700 text-xs px-3 py-2 rounded-lg font-medium border border-blue-500/20">
                    <Plane size={14} /> {format(new Date(leave.from), "MMM d")} - {format(new Date(leave.to), "MMM d")}
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4 mb-2">History</p>
            {userLogs.length === 0 ? (
              <p className="text-sm text-foreground/50 text-center py-8">No delivery logs found.</p>
            ) : (
              userLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition border border-border/50">
                  <div>
                    <p className="text-sm font-semibold">{log.date}</p>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{log.status}</p>
                  </div>
                  {getStatusIcon(log.status)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
