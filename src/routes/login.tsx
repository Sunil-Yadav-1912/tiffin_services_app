import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { ArrowRight, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("admin@matka.com"); // Pre-filled for demo
  const [password, setPassword] = useState("password123");
  const { login, currentUser } = useApp();
  const navigate = useNavigate();

  // If already logged in, redirect
  if (currentUser) {
    navigate({ to: currentUser.role === "Admin" ? "/admin/dashboard" : "/customer/dashboard" });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      toast.success("Login successful");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-panel lift-card rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-25px_oklch(0.255_0.045_155_/_20%)]">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Sign in to manage your tiffin orders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
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
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
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
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand-deep/25 transition hover:bg-brand"
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-foreground/60">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-deep hover:underline">
              Sign up here
            </Link>
          </p>
          <div className="mt-6 border-t border-border/50 pt-6 text-center">
            <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="flex flex-col gap-1 text-xs font-mono bg-foreground/5 p-3 rounded-lg text-left text-foreground/70">
              <span>Admin: admin@matka.com / password123</span>
              <span>Customer: rahul@example.com / password123</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
