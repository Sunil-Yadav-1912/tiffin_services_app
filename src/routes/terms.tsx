import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CreditCard,
  Clock,
  PauseCircle,
  AlertTriangle,
  Receipt,
  CalendarCheck,
  PackageCheck,
  Wallet,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  ArrowLeft,
  Sunrise,
  Sun,
  Moon,
} from "lucide-react";
import { getWhatsAppLink } from "@/config/business";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

export function TermsPage() {
  const termsList = [
    {
      number: "1",
      title: "Advance Payment",
      icon: <CreditCard className="size-5 text-amber-500" />,
      content:
        "All customers must make full payment in advance before starting their meal plan.",
      highlight: "Payment must be completed prior to service start date.",
    },
    {
      number: "2",
      title: "Meal Skip / Push Button Timing Rules",
      icon: <Clock className="size-5 text-blue-500" />,
      content:
        "If you want to skip any meal, you must use the Push Button (Skip / Pause) option in the app within the specified deadlines:",
      subPoints: [
        { label: "Breakfast", text: "Skip request must be submitted before 12:00 AM (midnight)." },
        { label: "Lunch", text: "Skip request must be submitted before 10:00 AM." },
        { label: "Dinner", text: "Skip request must be submitted before 6:00 PM." },
      ],
      highlight: "Strict cutoff times apply to prevent food wastage in the mess.",
    },
    {
      number: "3",
      title: "Meal Delivery Pause and Resume",
      icon: <PauseCircle className="size-5 text-indigo-500" />,
      content:
        "Once you activate the skip (push button), tiffin delivery will stop until you click the button again to resume.",
      highlight: "Always click Resume when you return to hostel to restart deliveries.",
    },
    {
      number: "4",
      title: "Skipped Meals Without Push Button",
      icon: <AlertTriangle className="size-5 text-red-500" />,
      content:
        "If you skip or take a gap without using the push button, those meals will not be adjusted or compensated.",
      highlight: "Untracked leaves cannot be credited.",
    },
    {
      number: "5",
      title: "No Refund Policy & Next-Month Coupon",
      icon: <Receipt className="size-5 text-emerald-500" />,
      content:
        "Any skipped or unused meals will not be refunded in cash. However, for valid skipped days logged through the push button, a coupon will be provided which can be used next month only with the same vendor’s monthly plan.",
      highlight: "Coupons valid for subsequent month renewal only.",
    },
    {
      number: "6",
      title: "Meal Schedule Management",
      icon: <CalendarCheck className="size-5 text-purple-500" />,
      content:
        "Customers are fully responsible for managing their meal schedule and pause/resume statuses using the system.",
      highlight: "Hostel students are accountable for timely app updates.",
    },
    {
      number: "7",
      title: "Tiffin Box Responsibility",
      icon: <PackageCheck className="size-5 text-orange-500" />,
      content:
        "If a tiffin box is lost, damaged, or not returned, its replacement cost will be deducted from your monthly plan amount or advance deposit as per the box price.",
      highlight: "Return empty tiffin box during the next meal delivery.",
    },
    {
      number: "8",
      title: "Daily Meal Plan Payment",
      icon: <Wallet className="size-5 text-teal-500" />,
      content:
        "In daily meal plans, service will not continue until the next payment is completed.",
      highlight: "Pay-as-you-go requires active positive balance.",
    },
    {
      number: "9",
      title: "Order Verification",
      icon: <CheckCircle2 className="size-5 text-green-600" />,
      content:
        "Customers must check their order at the time of delivery and report any issue or discrepancy immediately to the mess staff.",
      highlight: "Prompt reporting ensures immediate resolution.",
    },
  ];

  return (
    <main className="pb-16 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition hover:text-brand-deep"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold text-brand-deep shadow-sm">
            Hostel Mess Policies
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-3 text-base text-foreground/70 max-w-2xl mx-auto">
            Rules and guidelines for hostel students subscribed to daily tiffin &amp; mess services.
          </p>
        </div>

        {/* Meal Timings & Skip Deadlines Card */}
        <div className="glass-panel lift-card rounded-3xl p-6 sm:p-8 mb-10 shadow-lg border border-border/40 bg-gradient-to-br from-amber-500/5 via-background to-brand/5">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="size-5 text-brand-deep" />
            Daily Meal Timings &amp; Skip Cutoff Deadlines
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <Sunrise size={18} />
                Breakfast
              </div>
              <div className="mt-2 text-2xl font-display font-extrabold text-foreground">
                8:30 – 9:30 AM
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground/70 bg-foreground/5 rounded-lg p-2">
                <span className="text-red-600 font-bold">Skip cutoff:</span> Before 12:00 AM (midnight)
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                <Sun size={18} />
                Lunch
              </div>
              <div className="mt-2 text-2xl font-display font-extrabold text-foreground">
                12:00 – 2:00 PM
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground/70 bg-foreground/5 rounded-lg p-2">
                <span className="text-red-600 font-bold">Skip cutoff:</span> Before 10:00 AM
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <Moon size={18} />
                Dinner
              </div>
              <div className="mt-2 text-2xl font-display font-extrabold text-foreground">
                8:00 – 9:30 PM
              </div>
              <div className="mt-2 text-xs font-semibold text-foreground/70 bg-foreground/5 rounded-lg p-2">
                <span className="text-red-600 font-bold">Skip cutoff:</span> Before 6:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* 9 Terms Cards */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Customer Terms &amp; Policies (Clauses 1 – 9)
          </div>

          {termsList.map((term) => (
            <div
              key={term.number}
              className="glass-panel lift-card rounded-2xl p-5 sm:p-6 transition border border-border/50 hover:border-brand/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 grid size-10 place-items-center rounded-xl bg-brand/10 text-brand-deep font-display font-bold text-lg">
                  {term.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-foreground/5">{term.icon}</span>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {term.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                    {term.content}
                  </p>

                  {term.subPoints && (
                    <ul className="mt-3 space-y-1.5 pl-2 text-sm text-foreground/80">
                      {term.subPoints.map((sp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="inline-block size-1.5 rounded-full bg-brand-deep mt-2" />
                          <span>
                            <strong className="text-foreground">{sp.label}:</strong> {sp.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {term.highlight && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
                      <span>Note:</span> {term.highlight}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Card */}
        <div className="mt-10 glass-panel rounded-3xl p-6 sm:p-8 text-center border border-border/60">
          <HelpCircle className="size-10 text-brand-deep mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold">Have Questions About Mess Policies?</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            Contact the mess management team directly via WhatsApp for any clarifications regarding subscriptions, meal skips, or deposits.
          </p>
          <div className="mt-5">
            <a
              href={getWhatsAppLink("Hi! I have a question regarding the hostel mess terms and conditions.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-deep px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-brand transition"
            >
              <MessageCircle size={16} /> Contact Mess Owner
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
