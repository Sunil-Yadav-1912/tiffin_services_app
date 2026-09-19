import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { ArrowRight, User, Mail, Lock, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const { signup, currentUser } = useApp();
  const navigate = useNavigate();

  if (currentUser) {
    navigate({ to: "/customer/dashboard" });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({
      name, email, password, phone, address
    });
    toast.success("Account created successfully!");
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-panel lift-card rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-25px_oklch(0.255_0.045_155_/_20%)]">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Start your daily tiffin journey with Matka
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
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand-deep/25 transition hover:bg-brand"
            >
              Sign Up <ArrowRight size={16} />
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
