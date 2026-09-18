import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import heroImage from "@/assets/tiffin-hero.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Our Story</h1>
          <p className="mt-4 text-foreground/70 text-lg leading-relaxed">
            What started as a simple desire to provide wholesome, homemade meals to a few students 
            has grown into Pune's most loved tiffin service, serving hundreds of warm meals every day.
          </p>
        </div>

        {/* Image and Mission */}
        <div className="grid gap-12 md:grid-cols-2 items-center mb-20">
          <div className="glass-panel rounded-3xl p-3 shadow-lg">
            <img src={heroImage} alt="Our kitchen preparation" className="w-full aspect-[4/3] rounded-2xl object-cover" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              In a world of fast food and processed meals, we wanted to bring back the magic of "Ghar ka Khana". 
              Our mission is simple: provide nutritious, hygienic, and affordable homemade food that makes you 
              feel like you're eating at home, no matter where you are.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 grid size-5 place-items-center rounded-full bg-brand/20 text-brand-deep"><Check size={12} strokeWidth={3} /></span>
                <span className="text-sm font-medium">No artificial colors or preservatives</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 grid size-5 place-items-center rounded-full bg-brand/20 text-brand-deep"><Check size={12} strokeWidth={3} /></span>
                <span className="text-sm font-medium">Fresh, locally sourced vegetables daily</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 grid size-5 place-items-center rounded-full bg-brand/20 text-brand-deep"><Check size={12} strokeWidth={3} /></span>
                <span className="text-sm font-medium">Minimal oil and balanced spices</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quality & Hygiene */}
        <div className="glass-strong rounded-3xl p-8 sm:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-6">Uncompromising Quality & Hygiene</h2>
            <p className="text-foreground/80 leading-relaxed mb-8">
              We treat our kitchen exactly like we treat our home kitchen. We maintain strict hygiene protocols, 
              from daily deep cleaning of the premises to ensuring all staff wear hairnets and gloves. 
              Our food is cooked using pure filtered water and branded ingredients only.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div className="p-4">
              <h3 className="font-bold text-xl font-display mb-2">100%</h3>
              <p className="text-sm text-foreground/70">Sanitized Kitchen Area</p>
            </div>
            <div className="p-4 border-y sm:border-y-0 sm:border-x border-border/50">
              <h3 className="font-bold text-xl font-display mb-2">A-Grade</h3>
              <p className="text-sm text-foreground/70">Quality Ingredients</p>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl font-display mb-2">Zero</h3>
              <p className="text-sm text-foreground/70">Reuse of Cooking Oil</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
