import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Clock3, MessageCircle, Star, X, Leaf, ShieldCheck, HeartHandshake, Utensils } from "lucide-react";
import { useState } from "react";

import heroImage from "@/assets/tiffin-hero.jpg";
import { tiffins, Tiffin } from "@/data/tiffins";
import { getWhatsAppLink } from "@/config/business";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [selectedPlan, setSelectedPlan] = useState<Tiffin | null>(null);

  // Show only featured or first few tiffins on homepage
  const featuredTiffins = tiffins.slice(0, 3);

  return (
    <main className="pb-10">
      <section id="top" className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 md:pb-10 md:pt-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-brand-deep">
              <span className="size-1.5 rounded-full bg-accent" /> Fresh from a home kitchen, every morning
            </span>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Fresh, Homemade Tiffins Delivered With Care.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/65">
              Delicious, hygienic and affordable homemade meals prepared fresh for your everyday needs. Order in one tap on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/tiffins" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition hover:brightness-105">
                Explore Tiffins <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <a href={getWhatsAppLink("Hi Matka! I would like to place an order.")} target="_blank" rel="noreferrer" className="glass-panel inline-flex min-h-12 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-foreground/80 transition hover:text-brand-deep">
                <MessageCircle size={16} /> Order on WhatsApp
              </a>
            </div>
            <div className="mt-8 flex w-full items-center justify-between divide-x divide-foreground/10 sm:w-auto sm:justify-start">
              <div className="flex-1 pr-2 sm:flex-none sm:pr-8">
                <Stat value="4.9" label="avg rating" icon={<Star size={13} fill="currentColor" aria-hidden="true" />} />
              </div>
              <div className="flex-1 px-2 sm:flex-none sm:px-8">
                <Stat value="12k+" label="tiffins served" />
              </div>
              <div className="flex-1 pl-2 sm:flex-none sm:pl-8">
                <Stat value="Daily" label="fresh delivery" />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-3 shadow-[0_30px_60px_-25px_oklch(0.255_0.045_155_/_35%)]">
            <img src={heroImage} alt="Open stainless steel tiffin filled with dal, rice and homemade curries" width={1024} height={1024} className="aspect-square w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Why Choose Us</h2>
          <p className="mt-2 text-sm text-muted-foreground">We promise quality in every bite.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={<Leaf />} title="Fresh Every Day" desc="Prepared daily with fresh, locally sourced ingredients." />
          <FeatureCard icon={<HeartHandshake />} title="Homemade Taste" desc="Authentic recipes that remind you of home." />
          <FeatureCard icon={<ShieldCheck />} title="Hygienic Prep" desc="Cooked in an impeccably clean and sanitized kitchen." />
          <FeatureCard icon={<Utensils />} title="Affordable" desc="Quality meals at prices that fit your daily budget." />
        </div>
      </section>

      {/* POPULAR TIFFINS */}
      <section id="plans" className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Popular Tiffins</h2>
            <p className="mt-1 text-sm text-muted-foreground">Our most loved meal plans.</p>
          </div>
          <Link to="/tiffins" className="text-sm font-semibold text-brand-deep hover:underline">View all</Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredTiffins.map((plan) => (
            <MealCard key={plan.id} plan={plan} onView={() => setSelectedPlan(plan)} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="glass-panel rounded-3xl p-6 shadow-[0_20px_50px_-25px_oklch(0.255_0.045_155_/_20%)] sm:p-10">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">How It Works</h2>
            <p className="mt-2 text-sm text-muted-foreground">3 simple steps to your daily meals.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand-deep font-display text-xl font-bold mb-4">1</div>
              <h3 className="font-bold text-lg">Choose Your Tiffin</h3>
              <p className="mt-2 text-sm text-foreground/70">Browse our menu and pick the plan that suits your needs.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand-deep font-display text-xl font-bold mb-4">2</div>
              <h3 className="font-bold text-lg">Contact Us</h3>
              <p className="mt-2 text-sm text-foreground/70">Message us directly on WhatsApp to check availability.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand-deep font-display text-xl font-bold mb-4">3</div>
              <h3 className="font-bold text-lg">Confirm & Enjoy</h3>
              <p className="mt-2 text-sm text-foreground/70">We confirm your order and deliver your hot tiffin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">What People Say</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Testimonial text="The Ghar Ka Swad tiffin really lives up to its name. Best homemade food in Pune!" name="Rahul S." role="Software Engineer" />
          <Testimonial text="I've been ordering the Light Diet Plate for a month. Perfect portion sizes and very healthy." name="Priya M." role="Banker" />
          <Testimonial text="Finally found a reliable tiffin service that provides truly authentic Jain food." name="Amit J." role="Student" />
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Frequently Asked Questions</h2>
        </div>
        <div className="glass-panel rounded-2xl p-5 sm:p-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">What areas do you deliver to?</AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                We currently deliver across major areas in Pune including Shivaji Nagar, Kothrud, Baner, and Viman Nagar. Please WhatsApp us with your exact location to confirm.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold">Do you provide daily tiffins?</AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                Yes, you can order for a single day, or opt for our weekly and monthly plans for better value.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold">Is Jain food available?</AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                Absolutely. We have a dedicated Jain Tiffin prepared in a separate section without any onion, garlic, or root vegetables.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-semibold">How do I place an order?</AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                Simply browse our tiffins, choose what you like, and tap the WhatsApp button. You'll be connected directly to us to confirm your order and delivery details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-semibold">Do you accept online payment?</AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                This website doesn't process payments directly. Once you contact us on WhatsApp, we will share our UPI details or you can opt for Cash on Delivery.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="glass-strong rounded-3xl p-8 text-center sm:p-12 shadow-[0_20px_50px_-25px_oklch(0.255_0.045_155_/_30%)]">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Ready to taste the difference?</h2>
          <p className="mt-3 text-foreground/70 max-w-lg mx-auto">Skip the junk food. Get wholesome, nutritious, and delicious meals delivered to your doorstep.</p>
          <a href={getWhatsAppLink("Hi Matka! I want to start a tiffin plan.")} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand-deep px-8 py-3 text-base font-bold text-primary-foreground transition hover:bg-brand">
            <MessageCircle size={20} /> Order on WhatsApp
          </a>
        </div>
      </section>

      {selectedPlan ? <PlanDialog plan={selectedPlan} onClose={() => setSelectedPlan(null)} /> : null}
    </main>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center sm:items-start">
      <p className="flex items-center gap-1 font-display text-xl sm:text-2xl font-bold">{icon}{value}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel flex flex-col items-center text-center rounded-3xl p-6 lift-card">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-accent/15 text-accent">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-foreground/70">{desc}</p>
    </div>
  );
}

function Testimonial({ text, name, role }: { text: string; name: string; role: string }) {
  return (
    <div className="glass-panel flex flex-col justify-between rounded-3xl p-6 lift-card">
      <div className="text-brand-deep mb-4">
        <Star size={16} fill="currentColor" className="inline" />
        <Star size={16} fill="currentColor" className="inline" />
        <Star size={16} fill="currentColor" className="inline" />
        <Star size={16} fill="currentColor" className="inline" />
        <Star size={16} fill="currentColor" className="inline" />
      </div>
      <p className="text-sm italic text-foreground/80">"{text}"</p>
      <div className="mt-6">
        <p className="font-bold text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

function MealCard({ plan, onView }: { plan: Tiffin; onView: () => void }) {
  const isPremium = plan.category === "Premium";

  return (
    <article className={`${isPremium ? "glass-strong ring-1 ring-accent/30 shadow-[0_30px_60px_-25px_oklch(0.68_0.145_55_/_45%)]" : "glass-panel"} lift-card relative flex flex-col rounded-3xl p-5 sm:p-6`}>
      {isPremium && <span className="absolute -top-3 left-5 z-20 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground shadow-sm">Premium</span>}
      <Link to={`/tiffins/$id`} params={{ id: plan.id }} className="group overflow-hidden rounded-2xl text-left relative" aria-label={`View details for ${plan.name}`}>
        <img src={plan.image} alt={plan.name} width={1024} height={640} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
      <div className="mt-5 flex items-center justify-between gap-3">
        <Link to={`/tiffins/$id`} params={{ id: plan.id }} className="hover:underline">
          <h3 className="font-display text-lg font-bold line-clamp-1">{plan.name}</h3>
        </Link>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${plan.dietType === 'Veg' ? 'bg-green-500/10 text-green-700' : 'bg-orange-500/10 text-orange-700'}`}>
          {plan.dietType}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/60 line-clamp-2">{plan.description}</p>

      <div className="mt-4 border-t border-border/50 pt-4 flex items-baseline justify-between">
        <div>
          <span className="font-display text-2xl font-bold">₹{plan.price}</span>
          <span className="text-xs text-muted-foreground ml-1">/ meal</span>
        </div>
        <span className="text-xs font-semibold text-foreground/50">{plan.mealType}</span>
      </div>
      <div className="mt-5 flex gap-2">
        <Link to={`/tiffins/$id`} params={{ id: plan.id }} className="flex-1 inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground/5 px-4 py-2 text-sm font-bold transition hover:bg-foreground/10">
          Details
        </Link>
        <Link to={`/tiffins/$id`} params={{ id: plan.id }} className={`flex-1 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition ${isPremium ? "bg-accent text-accent-foreground hover:brightness-105" : "bg-brand-deep text-primary-foreground hover:bg-brand"}`}>
          <MessageCircle size={16} aria-hidden="true" /> Order
        </Link>
      </div>
    </article>
  );
}

// Keeping this component for backward compatibility if it's used elsewhere, but ideally we link to the detail page.
function PlanDialog({ plan, onClose }: { plan: Tiffin; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brand-deep/35 p-4 backdrop-blur-sm animate-in fade-in duration-200" role="presentation" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="plan-dialog-title" className="glass-strong max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-4 shadow-2xl sm:p-6" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Plan details</p>
            <h2 id="plan-dialog-title" className="mt-1 font-display text-2xl font-semibold">{plan.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-foreground/5 text-foreground/60 transition hover:bg-foreground/10" aria-label="Close plan details">
            <X size={18} />
          </button>
        </div>
        <img src={plan.image} alt={plan.name} width={1024} height={640} className="mt-5 aspect-[16/9] w-full rounded-2xl object-cover" />
        <p className="mt-5 text-sm leading-relaxed text-foreground/65">{plan.longDescription}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {plan.itemsIncluded.map((detail) => (
            <div key={detail} className="flex items-start gap-2 rounded-xl bg-card/60 p-3 text-xs text-foreground/70">
              <Check size={14} className="mt-0.5 shrink-0 text-brand" />{detail}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-display text-3xl font-bold">₹{plan.price}</span>
            <span className="ml-1 text-sm text-muted-foreground">/meal</span>
          </div>
          <Link to={`/tiffins/$id`} params={{ id: plan.id }} className="inline-flex min-h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition hover:brightness-105">
            <MessageCircle size={16} /> Place Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
