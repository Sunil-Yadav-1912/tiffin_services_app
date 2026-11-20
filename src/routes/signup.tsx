import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { ArrowRight, User, Mail, Lock, Phone, MapPin, Loader2, Utensils, ChevronDown, CheckCircle2 } from "lucide-react";
import { tiffins as defaultTiffins, Tiffin } from "@/data/tiffins";
import { api } from "@/api/client";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [availablePlans, setAvailablePlans] = useState<Tiffin[]>(defaultTiffins);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup, currentUser, addLocalNotification } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch latest tiffins from API if available
    api.getTiffins().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setAvailablePlans(data);
      }
    }).catch(console.error);

    // Support preselection from URL, e.g. /signup?plan=2 or /signup?tiffin_id=2
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get("plan") || params.get("tiffin_id");
      if (planParam) {
        setSelectedPlanId(planParam);
      }
    }
  }, []);

  // Filter mess/monthly plans just like in admin dashboard
  const messPlans = useMemo(() => {
    return availablePlans.filter(t => 
      t.category === "Monthly" || 
      Number(t.price) >= 500 || 
      t.name.toLowerCase().includes("monthly") || 
      t.name.toLowerCase().includes("combo") || 
      t.name.toLowerCase().includes("plan")
    );
  }, [availablePlans]);

  const selectedPlan = useMemo(() => {
    return availablePlans.find(p => String(p.id) === String(selectedPlanId));
  }, [availablePlans, selectedPlanId]);

  if (currentUser) {
    navigate({ to: "/customer/dashboard" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await signup({
      name,
      email,
      password,
      phone,
      address,
      tiffinIds: selectedPlanId ? [selectedPlanId] : [],
      tiffin_id: selectedPlanId || undefined,
      tiffin_ids: selectedPlanId ? [selectedPlanId] : []
    });
    setIsLoading(false);
    if (success) {
      const planNotice = selectedPlan?.name ? ` with ${selectedPlan.name}` : "";
      // Fire a local notification so admin sees it immediately upon next login
      addLocalNotification({
        type: "new_customer",
        title: "New Customer Registered",
        message: `${name} (${email}) just signed up via the website${planNotice}.`,
        meta: { name, email, phone: phone || "", meal_plan: selectedPlan?.name || "None" }
      });
      toast.success("Account created successfully! Welcome aboard 🎉");
      navigate({ to: "/customer/dashboard" });
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-panel lift-card rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-25px_oklch(0.255_0.045_155_/_20%)]">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <img src="/logo_new.png" alt="Logo" className="h-14 w-auto mx-auto object-contain rounded-xl hover:opacity-90 transition" />
            </Link>
            <h1 className="font-display text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Start your daily meal journey with Crownora Group
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80" htmlFor="name">Full Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
                  <User size={16} />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border-none bg-foreground/5 py-3 pl-10 pr-4 text-sm font-medium transition focus:bg-background focus:ring-2 focus:ring-brand-deep/50"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80" htmlFor="email">Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-none bg-foreground/5 py-3 pl-10 pr-4 text-sm font-medium transition focus:bg-background focus:ring-2 focus:ring-brand-deep/50"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80" htmlFor="phone">Phone Number</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
                  <Phone size={16} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border-none bg-foreground/5 py-3 pl-10 pr-4 text-sm font-medium transition focus:bg-background focus:ring-2 focus:ring-brand-deep/50"
                  placeholder="10-digit number"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80" htmlFor="address">Delivery Address (Hostel/PG)</label>
              <div className="relative">
                <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-3 text-foreground/40">
                  <MapPin size={16} />
                </div>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border-none bg-foreground/5 py-3 pl-10 pr-4 text-sm font-medium transition focus:bg-background focus:ring-2 focus:ring-brand-deep/50 min-h-[80px] resize-none"
                  placeholder="Room no, Hostel name, Area"
                  required
                />
              </div>
            </div>

            {/* Meal Plan Dropdown Selection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground/80" htmlFor="meal-plan">
                  Hostel Mess / Meal Plan
                </label>
                <span className="text-[11px] text-muted-foreground font-medium">Optional</span>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
                  <Utensils size={16} />
                </div>
                <select
                  id="meal-plan"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-xl border-none bg-foreground/5 py-3 pl-10 pr-10 text-sm font-medium transition focus:bg-background focus:ring-2 focus:ring-brand-deep/50 appearance-none cursor-pointer"
                >
                  <option value="">-- Choose a Meal Plan (Optional) --</option>
                  {messPlans.map((plan) => (
                    <option key={plan.id} value={String(plan.id)}>
                      {plan.name} — ₹{plan.price}/mo
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/40">
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Selected Plan Details Preview Card */}
              {selectedPlan && (
                <div className="mt-2 rounded-2xl bg-brand-deep/5 border border-brand-deep/20 p-3 text-xs space-y-1.5 transition-all">
                  <div className="flex items-center justify-between font-bold text-brand-deep">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-brand-deep shrink-0" />
                      <span>{selectedPlan.name}</span>
                    </span>
                    <span className="text-xs font-extrabold bg-brand-deep/10 text-brand-deep px-2 py-0.5 rounded-full">
                      ₹{selectedPlan.price}/month
                    </span>
                  </div>
                  {selectedPlan.description && (
                    <p className="text-foreground/70 text-[11px] leading-relaxed">{selectedPlan.description}</p>
                  )}
                  {selectedPlan.itemsIncluded && selectedPlan.itemsIncluded.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedPlan.itemsIncluded.slice(0, 4).map((item: string, i: number) => (
                        <span key={i} className="inline-block px-1.5 py-0.5 bg-background rounded-md text-[10px] text-foreground/75 border border-border/50">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80" htmlFor="password">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-none bg-foreground/5 py-3 pl-10 pr-4 text-sm font-medium transition focus:bg-background focus:ring-2 focus:ring-brand-deep/50"
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand-deep/25 transition hover:bg-brand disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account...</>
              ) : (
                <>Sign Up <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-foreground/60">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-deep hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
