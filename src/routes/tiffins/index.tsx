import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { MessageCircle, Search, FilterX } from "lucide-react";

import { tiffins, DietType, Category, MealType } from "@/data/tiffins";
import { getWhatsAppLink } from "@/config/business";

export const Route = createFileRoute("/tiffins/")({
  component: TiffinsPage,
});

function TiffinsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiet, setSelectedDiet] = useState<DietType | "All">("All");
  const [selectedMeal, setSelectedMeal] = useState<MealType | "All">("All");

  const filteredTiffins = useMemo(() => {
    return tiffins.filter((tiffin) => {
      const matchesSearch = tiffin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tiffin.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiet = selectedDiet === "All" || tiffin.dietType === selectedDiet;
      const matchesMeal = selectedMeal === "All" || tiffin.mealType === selectedMeal || tiffin.mealType === "Both";

      return matchesSearch && matchesDiet && matchesMeal;
    });
  }, [searchQuery, selectedDiet, selectedMeal]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDiet("All");
    setSelectedMeal("All");
  };

  return (
    <main className="pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Our Menu</h1>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">Explore our range of fresh, homemade tiffins. Prepared daily with love and the finest ingredients.</p>
        </div>

        {/* Filters and Search Area */}
        <div className="glass-panel mb-10 flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/50">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search tiffins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border-0 bg-foreground/5 py-2.5 pl-10 pr-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 placeholder:text-foreground/40 focus:ring-2 focus:ring-inset focus:ring-brand"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl bg-foreground/5 p-1 ring-1 ring-foreground/10">
              <FilterBtn active={selectedDiet === "All"} onClick={() => setSelectedDiet("All")}>All</FilterBtn>
              <FilterBtn active={selectedDiet === "Veg"} onClick={() => setSelectedDiet("Veg")}>Veg</FilterBtn>
              <FilterBtn active={selectedDiet === "Jain"} onClick={() => setSelectedDiet("Jain")}>Jain</FilterBtn>
            </div>

            <div className="flex items-center rounded-xl bg-foreground/5 p-1 ring-1 ring-foreground/10 hidden sm:flex">
              <FilterBtn active={selectedMeal === "All"} onClick={() => setSelectedMeal("All")}>Any Meal</FilterBtn>
              <FilterBtn active={selectedMeal === "Lunch"} onClick={() => setSelectedMeal("Lunch")}>Lunch</FilterBtn>
              <FilterBtn active={selectedMeal === "Dinner"} onClick={() => setSelectedMeal("Dinner")}>Dinner</FilterBtn>
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
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${active ? 'bg-background shadow-sm text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
    >
      {children}
    </button>
  );
}

function TiffinCard({ tiffin }: { tiffin: typeof tiffins[0] }) {
  const isPremium = tiffin.category === "Premium";

  return (
    <article className={`${isPremium ? "glass-strong ring-1 ring-accent/30 shadow-lg" : "glass-panel"} lift-card relative flex flex-col rounded-3xl p-5`}>
      <Link to={`/tiffins/$id`} params={{ id: tiffin.id }} className="group overflow-hidden rounded-2xl text-left relative aspect-[16/11]">
        <img src={tiffin.image} alt={tiffin.name} width={640} height={440} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Link to={`/tiffins/$id`} params={{ id: tiffin.id }} className="hover:underline">
          <h3 className="font-display text-xl font-bold line-clamp-1">{tiffin.name}</h3>
        </Link>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tiffin.dietType === 'Veg' ? 'bg-green-500/10 text-green-700' : tiffin.dietType === 'Jain' ? 'bg-yellow-500/10 text-yellow-700' : 'bg-red-500/10 text-red-700'}`}>
          {tiffin.dietType}
        </span>
        <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-bold text-foreground/70">
          {tiffin.mealType}
        </span>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand-deep">
          {tiffin.category}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/60 line-clamp-2 flex-1">{tiffin.description}</p>

      <div className="mt-5 border-t border-border/50 pt-4 flex items-center justify-between gap-4">
        <div>
          <span className="font-display text-2xl font-bold">₹{tiffin.price}</span>
        </div>

        <div className="flex gap-2 w-full justify-end">
          <Link to={`/tiffins/$id`} params={{ id: tiffin.id }} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-foreground/5 px-4 text-sm font-bold transition hover:bg-foreground/10">
            View
          </Link>
          <Link to={`/tiffins/$id`} params={{ id: tiffin.id }} className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-bold transition ${isPremium ? "bg-accent text-accent-foreground hover:brightness-105" : "bg-brand-deep text-primary-foreground hover:bg-brand"}`}>
            <MessageCircle size={16} /> Order
          </Link>
        </div>
      </div>
    </article>
  );
}
