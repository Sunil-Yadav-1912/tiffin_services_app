import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Briefcase, GraduationCap, Leaf, PartyPopper } from "lucide-react";
import { getWhatsAppLink } from "@/config/business";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <main className="pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Our Services</h1>
          <p className="mt-4 text-foreground/70 text-lg">Beyond daily meals, we cater to a variety of needs. Find the plan that fits your lifestyle perfectly.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            icon={<CalendarDays size={24} />}
            title="Monthly Tiffin Plans"
            desc="Subscribe and forget. Get hot, fresh meals delivered daily for a month at discounted rates. Perfect for working professionals."
            actionText="View Plans"
          />
          <ServiceCard
            icon={<Briefcase size={24} />}
            title="Office Lunches"
            desc="Bulk orders for small teams and corporate offices. Nutritious, non-spicy food that keeps your team energized."
            actionText="Enquire Now"
          />
          <ServiceCard
            icon={<GraduationCap size={24} />}
            title="Student Tiffins"
            desc="Pocket-friendly meal plans designed specifically for students away from home. Comforting food without burning a hole in the pocket."
            actionText="View Student Plan"
          />
        </div>

        <div className="mt-16 glass-strong rounded-3xl p-8 text-center sm:p-12 shadow-lg">
          <h2 className="font-display text-3xl font-semibold">Looking for something custom?</h2>
          <p className="mt-3 text-foreground/70 max-w-lg mx-auto">We understand everyone has different dietary needs. Contact us directly and we'll see if we can accommodate your specific requirements.</p>
          <a href={getWhatsAppLink("Hi Matka! I have a custom requirement for tiffins.")} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-deep px-8 py-3 font-bold text-primary-foreground hover:bg-brand transition">
            Chat with us
          </a>
        </div>
      </div>
    </main>
  );
}

function ServiceCard({ icon, title, desc, actionText }: { icon: React.ReactNode, title: string, desc: string, actionText: string }) {
  return (
    <div className="glass-panel flex flex-col justify-between rounded-3xl p-6 sm:p-8 lift-card">
      <div>
        <div className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand-deep">
          {icon}
        </div>
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/70">{desc}</p>
      </div>
      <Link to="/tiffins" className="mt-8 flex items-center gap-1.5 text-sm font-bold text-brand-deep transition hover:text-brand">
        {actionText} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
