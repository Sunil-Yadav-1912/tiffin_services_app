import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { MessageCircle, Search, FilterX, Clock, Sunrise, Sun, Moon, ArrowRight, ShieldCheck } from "lucide-react";

import { DietType, Category, MealType, Tiffin } from "@/data/tiffins";
import { api } from "@/api/client";
import { getWhatsAppLink } from "@/config/business";

export const Route = createFileRoute("/tiffins/")({
  component: TiffinsPage,
});

function TiffinsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiet, setSelectedDiet] = useState<DietType | "All">("All");
  const [selectedMeal, setSelectedMeal] = useState<MealType | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [tiffins, setTiffins] = useState<Tiffin[]>([]);

  useEffect(() => {
    api.getTiffins().then(data => {
      setTiffins(data);
    }).catch(console.error);
  }, []);

  const filteredTiffins = useMemo(() => {
    return tiffins.filter((tiffin) => {
      const matchesSearch = tiffin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tiffin.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiet = selectedDiet === "All" || tiffin.dietType === selectedDiet;
      
      let matchesMeal = true;
      if (selectedMeal === "All") {
        matchesMeal = true;
      } else if (selectedMeal === "Breakfast") {
        matchesMeal = tiffin.mealType === "Breakfast" || tiffin.name.toLowerCase().includes("breakfast");
      } else if (selectedMeal === "Lunch") {
        matchesMeal = tiffin.mealType === "Lunch" || tiffin.name.toLowerCase().includes("lunch");
      } else if (selectedMeal === "Dinner") {
        matchesMeal = tiffin.mealType === "Dinner" || tiffin.name.toLowerCase().includes("dinner");
      } else if (selectedMeal === "Both") {
        matchesMeal = tiffin.mealType === "Both" || tiffin.name.toLowerCase().includes("combo") || tiffin.name.toLowerCase().includes("all mess") || tiffin.name.toLowerCase().includes("full mess");
      }

      let matchesCategory = true;
      if (selectedCategory === "Monthly") {
        matchesCategory = tiffin.category === "Monthly" || tiffin.name.toLowerCase().includes("monthly") || tiffin.name.toLowerCase().includes("combo") || tiffin.name.toLowerCase().includes("plan");
      } else if (selectedCategory === "Daily") {
        matchesCategory = tiffin.category === "Daily" || (!tiffin.name.toLowerCase().includes("monthly") && !tiffin.name.toLowerCase().includes("combo"));
      }

      return matchesSearch && matchesDiet && matchesMeal && matchesCategory;
    });
  }, [searchQuery, selectedDiet, selectedMeal, selectedCategory, tiffins]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDiet("All");
    setSelectedMeal("All");
    setSelectedCategory("All");
  };

  return (
    <main className="pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold text-brand-deep shadow-sm">
            Hostel Mess &amp; Daily Tiffins
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Mess Menu &amp; Plans</h1>
          <p className="mt-3 text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
            Affordable monthly meal packages and fresh daily tiffins specially curated for hostel students. Made fresh, delivered warm.
          </p>
        </div>

        {/* Hostel Mess Timing Schedule Banner */}
        <div className="glass-panel lift-card rounded-3xl p-5 sm:p-6 mb-8 border border-border/50 bg-gradient-to-r from-amber-500/10 via-background to-brand/10 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-brand-deep text-white">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Hostel Mess Serving Timings &amp; Cutoff Schedule
                </h3>
                <p className="text-xs text-muted-foreground">
                  Follow cutoff rules to pause or skip meals using the app push button
                </p>
              </div>
            </div>
            <Link
              to="/terms"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-deep hover:underline"
            >
              <span>View Terms &amp; Conditions</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 pt-4">
            <div className="rounded-2xl bg-background/70 border border-border/40 p-3.5 flex items-center justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                  <Sunrise size={15} /> Breakfast
                </span>
                <span className="block font-display text-lg font-extrabold text-foreground mt-0.5">
                  8:30 – 9:30 AM
                </span>
              </div>
              <span className="text-[10px] font-semibold text-red-600 bg-red-500/10 px-2 py-1 rounded-md text-right">
                Skip before<br /><strong className="text-foreground">12:00 AM</strong>
              </span>
            </div>

            <div className="rounded-2xl bg-background/70 border border-border/40 p-3.5 flex items-center justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                  <Sun size={15} /> Lunch
                </span>
                <span className="block font-display text-lg font-extrabold text-foreground mt-0.5">
                  12:00 – 2:00 PM
                </span>
              </div>
              <span className="text-[10px] font-semibold text-red-600 bg-red-500/10 px-2 py-1 rounded-md text-right">
                Skip before<br /><strong className="text-foreground">10:00 AM</strong>
              </span>
            </div>

            <div className="rounded-2xl bg-background/70 border border-border/40 p-3.5 flex items-center justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                  <Moon size={15} /> Dinner
                </span>
                <span className="block font-display text-lg font-extrabold text-foreground mt-0.5">
                  8:00 – 9:30 PM
                </span>
              </div>
              <span className="text-[10px] font-semibold text-red-600 bg-red-500/10 px-2 py-1 rounded-md text-right">
                Skip before<br /><strong className="text-foreground">6:00 PM</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Area */}
        <div className="glass-panel mb-8 flex flex-col gap-4 rounded-2xl p-4 shadow-sm border border-border/40">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/50">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search tiffins or monthly plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-xl border-0 bg-foreground/5 py-2.5 pl-10 pr-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 placeholder:text-foreground/40 focus:ring-2 focus:ring-inset focus:ring-brand"
              />
            </div>

            {/* Plan Category Switcher */}
            <div className="flex items-center rounded-xl bg-foreground/5 p-1 ring-1 ring-foreground/10">
              <FilterBtn active={selectedCategory === "All"} onClick={() => setSelectedCategory("All")}>
                All Plans
              </FilterBtn>
              <FilterBtn active={selectedCategory === "Monthly"} onClick={() => setSelectedCategory("Monthly")}>
                🎓 Monthly Packages
              </FilterBtn>
              <FilterBtn active={selectedCategory === "Daily"} onClick={() => setSelectedCategory("Daily")}>
                Daily Meals
              </FilterBtn>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
            {/* Meal Time Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-foreground/60 mr-1">Meal:</span>
              <div className="flex items-center rounded-xl bg-foreground/5 p-1 ring-1 ring-foreground/10">
                <FilterBtn active={selectedMeal === "All"} onClick={() => setSelectedMeal("All")}>All</FilterBtn>
                <FilterBtn active={selectedMeal === "Breakfast"} onClick={() => setSelectedMeal("Breakfast")}>Breakfast</FilterBtn>
                <FilterBtn active={selectedMeal === "Lunch"} onClick={() => setSelectedMeal("Lunch")}>Lunch</FilterBtn>
                <FilterBtn active={selectedMeal === "Dinner"} onClick={() => setSelectedMeal("Dinner")}>Dinner</FilterBtn>
                <FilterBtn active={selectedMeal === "Both"} onClick={() => setSelectedMeal("Both")}>Combos</FilterBtn>
              </div>
            </div>

            {/* Diet Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground/60 mr-1">Diet:</span>
              <div className="flex items-center rounded-xl bg-foreground/5 p-1 ring-1 ring-foreground/10">
                <FilterBtn active={selectedDiet === "All"} onClick={() => setSelectedDiet("All")}>All</FilterBtn>
                <FilterBtn active={selectedDiet === "Veg"} onClick={() => setSelectedDiet("Veg")}>Veg</FilterBtn>
                <FilterBtn active={selectedDiet === "Jain"} onClick={() => setSelectedDiet("Jain")}>Jain</FilterBtn>
              </div>
            </div>
          </div>
        </div>

        {/* Tiffins Grid */}
        {filteredTiffins.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTiffins.map((tiffin) => (
              <TiffinCard key={tiffin.id} tiffin={tiffin} />
            ))}
          </div>
        ) : (
          <div className="glass-panel flex flex-col items-center justify-center rounded-3xl py-24 text-center px-4">
            <div className="mb-4 rounded-full bg-foreground/5 p-4 text-foreground/40">
              <FilterX size={48} />
            </div>
            <h3 className="font-display text-xl font-semibold">No tiffins found</h3>
            <p className="mt-2 text-sm text-foreground/60 max-w-md">We couldn't find any meals matching your current filters. Try adjusting your search or clearing the filters.</p>
            <button onClick={clearFilters} className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand/10 px-5 py-2.5 text-sm font-bold text-brand-deep transition hover:bg-brand/20">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${active ? 'bg-background shadow-sm text-foreground font-bold' : 'text-foreground/60 hover:text-foreground'}`}
    >
      {children}
    </button>
  );
}

function TiffinCard({ tiffin }: { tiffin: Tiffin }) {
  const isMonthly = tiffin.category === "Monthly" || tiffin.name.toLowerCase().includes("monthly") || tiffin.name.toLowerCase().includes("combo") || tiffin.name.toLowerCase().includes("plan");
  const isPremium = tiffin.category === "Premium";

  // Determine meal timing string
  let timingLabel = "";
  const lowerName = tiffin.name.toLowerCase();
  if (lowerName.includes("breakfast") && lowerName.includes("lunch") && lowerName.includes("dinner")) {
    timingLabel = "Breakfast, Lunch & Dinner";
  } else if (lowerName.includes("breakfast") && lowerName.includes("lunch")) {
    timingLabel = "8:30 AM & 12:00 PM";
  } else if (lowerName.includes("breakfast") && lowerName.includes("dinner")) {
    timingLabel = "8:30 AM & 8:00 PM";
  } else if (lowerName.includes("lunch") && lowerName.includes("dinner")) {
    timingLabel = "12:00 PM & 8:00 PM";
  } else if (tiffin.mealType === "Breakfast" || lowerName.includes("breakfast")) {
    timingLabel = "8:30 – 9:30 AM";
  } else if (tiffin.mealType === "Lunch" || lowerName.includes("lunch")) {
    timingLabel = "12:00 – 2:00 PM";
  } else if (tiffin.mealType === "Dinner" || lowerName.includes("dinner")) {
    timingLabel = "8:00 – 9:30 PM";
  }

  return (
    <article className={`${isMonthly ? "glass-strong ring-1 ring-brand/30 shadow-md" : "glass-panel"} lift-card relative flex flex-col rounded-3xl p-5 border border-border/40`}>
      <Link to={`/tiffins/$id`} params={{ id: tiffin.id }} className="group overflow-hidden rounded-2xl text-left relative aspect-[16/11]">
        <img
          src={tiffin.image || "/images/veg_lunch.jpg"}
          alt={tiffin.name}
          width={640}
          height={440}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
        {isMonthly && (
          <span className="absolute left-3 top-3 rounded-lg bg-brand-deep/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            Monthly Package
          </span>
        )}
      </Link>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Link to={`/tiffins/$id`} params={{ id: tiffin.id }} className="hover:underline">
          <h3 className="font-display text-xl font-bold line-clamp-1">{tiffin.name}</h3>
        </Link>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tiffin.dietType === 'Veg' ? 'bg-green-500/10 text-green-700' : tiffin.dietType === 'Jain' ? 'bg-yellow-500/10 text-yellow-700' : 'bg-red-500/10 text-red-700'}`}>
          {tiffin.dietType}
        </span>
        <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-bold text-foreground/70">
          {tiffin.mealType}
        </span>
        {timingLabel && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
            <Clock size={10} /> {timingLabel}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/65 line-clamp-2 flex-1">{tiffin.description}</p>

      <div className="mt-5 border-t border-border/50 pt-4 flex items-center justify-between gap-4">
        <div>
          <span className="font-display text-2xl font-extrabold text-foreground">₹{tiffin.price}</span>
          <span className="text-xs text-foreground/60 ml-1 font-medium">
            {isMonthly ? "/ month" : "/ meal"}
          </span>
        </div>

        <div className="flex gap-2 w-full justify-end">
          <Link
            to={`/tiffins/$id`}
            params={{ id: tiffin.id }}
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-foreground/5 px-3.5 text-xs font-bold transition hover:bg-foreground/10"
          >
            Details
          </Link>
          <a
            href={getWhatsAppLink(
              isMonthly 
                ? `Hi! I want to join hostel mess for ${tiffin.name} (₹${tiffin.price}/month).`
                : `Hi! I want to order 1 tiffin: ${tiffin.name} (₹${tiffin.price}).`
            )}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-bold text-white transition ${isMonthly ? "bg-accent text-accent-foreground hover:brightness-105" : "bg-brand-deep hover:bg-brand"}`}
          >
            <MessageCircle size={15} /> {isMonthly ? "Join Mess" : "Order Tiffin"}
          </a>
        </div>
      </div>
    </article>
  );
}
