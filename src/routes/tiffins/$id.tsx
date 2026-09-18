import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { MessageCircle, Check, ArrowLeft, Clock3, Utensils, Info } from "lucide-react";

import { tiffins } from "@/data/tiffins";
import { getWhatsAppLink } from "@/config/business";
import { OrderEnquiryForm } from "@/components/OrderEnquiryForm";

export const Route = createFileRoute("/tiffins/$id")({
  component: TiffinDetailPage,
});

function TiffinDetailPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  
  const tiffin = tiffins.find((t) => t.id === id);

  if (!tiffin) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="glass-panel flex flex-col items-center rounded-3xl p-8 text-center sm:p-12">
          <h1 className="font-display text-3xl font-bold">Tiffin Not Found</h1>
          <p className="mt-2 max-w-sm text-foreground/70">The meal plan you are looking for doesn't exist or has been removed.</p>
          <Link to="/tiffins" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-deep px-5 font-bold text-primary-foreground hover:bg-brand">
            Browse All Tiffins
          </Link>
        </div>
      </main>
    );
  }

  const isPremium = tiffin.category === "Premium";

  return (
    <main className="pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <button 
          onClick={() => router.history.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground/60 transition hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="glass-panel overflow-hidden rounded-3xl shadow-[0_20px_50px_-25px_oklch(0.255_0.045_155_/_20%)]">
          <div className="grid md:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-64 md:h-full min-h-[300px]">
              <img src={tiffin.image} alt={tiffin.name} className="absolute inset-0 h-full w-full object-cover" />
              {isPremium && (
                <span className="absolute left-6 top-6 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground shadow-md">
                  Premium Quality
                </span>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col p-6 sm:p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tiffin.dietType === 'Veg' ? 'bg-green-500/10 text-green-700' : tiffin.dietType === 'Jain' ? 'bg-yellow-500/10 text-yellow-700' : 'bg-red-500/10 text-red-700'}`}>
                  {tiffin.dietType}
                </span>
                <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-bold text-foreground/70">
                  {tiffin.mealType}
                </span>
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand-deep">
                  {tiffin.category}
                </span>
              </div>

              <h1 className="font-display text-3xl font-bold sm:text-4xl">{tiffin.name}</h1>
              
              <div className="mt-4 flex items-baseline gap-2 border-b border-border/50 pb-6">
                <span className="font-display text-4xl font-bold">₹{tiffin.price}</span>
                <span className="text-sm text-foreground/60">/ meal</span>
              </div>

              <div className="mt-6 flex-1">
                <p className="text-base leading-relaxed text-foreground/80">{tiffin.longDescription}</p>
                
                <div className="mt-8">
                  <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
                    <Utensils size={18} className="text-brand" /> What's Included
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {tiffin.itemsIncluded.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 rounded-xl bg-card/40 p-3 text-sm font-medium text-foreground/80 shadow-sm">
                        <Check size={16} className="mt-0.5 shrink-0 text-brand-deep" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-2xl bg-foreground/5 p-5 border border-foreground/10">
                <h3 className="font-bold mb-2 text-xl">Place an Enquiry</h3>
                <p className="text-sm text-foreground/70 mb-5">
                  Enter your details to check availability for your area and place an order directly with the kitchen via WhatsApp.
                </p>
                
                <OrderEnquiryForm 
                  tiffinId={tiffin.id} 
                  tiffinName={tiffin.name} 
                  tiffinPrice={tiffin.price} 
                  availableMeals={tiffin.mealType} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Info Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="glass-panel flex gap-4 rounded-3xl p-6">
            <div className="shrink-0 mt-1 text-brand"><Info size={24} /></div>
            <div>
              <h4 className="font-bold">Delivery Timings</h4>
              <p className="mt-1 text-sm text-foreground/70">Lunch: 11:30 AM - 1:30 PM<br/>Dinner: 7:30 PM - 9:30 PM</p>
            </div>
          </div>
          <div className="glass-panel flex gap-4 rounded-3xl p-6">
            <div className="shrink-0 mt-1 text-brand"><Info size={24} /></div>
            <div>
              <h4 className="font-bold">Packaging</h4>
              <p className="mt-1 text-sm text-foreground/70">Served in hygienic, food-grade containers that keep your food warm.</p>
            </div>
          </div>
          <div className="glass-panel flex gap-4 rounded-3xl p-6">
            <div className="shrink-0 mt-1 text-brand"><Info size={24} /></div>
            <div>
              <h4 className="font-bold">Customization</h4>
              <p className="mt-1 text-sm text-foreground/70">Need less spice or have allergies? Let us know on WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
