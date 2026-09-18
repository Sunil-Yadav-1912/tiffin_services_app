import { Link } from "@tanstack/react-router";
import { MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { getWhatsAppLink } from "@/config/business";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tiffins", label: "Tiffins" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="relative z-50 mx-auto max-w-6xl px-4 pt-5 sm:px-6">
      <div className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3 shadow-[0_10px_40px_-15px_oklch(0.255_0.045_155_/_25%)] sm:px-5">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5" aria-label="Matka home">
          <img src="/logo_without_bg.png" alt="Matka Logo" className="h-11 sm:h-12 w-auto object-contain rounded-lg" />
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">Tiffin Service</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 text-sm font-semibold text-foreground/70 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition-colors hover:text-brand-deep [&.active]:text-brand-deep [&.active]:font-bold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-deep px-3.5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-brand-deep/25 transition hover:bg-brand sm:px-4"
          >
            <MessageCircle size={16} aria-hidden="true" />
            <span>Order on WhatsApp</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl bg-foreground/5 text-foreground/80 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute left-4 right-4 top-[85px] z-40 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/50 p-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-bold text-foreground/80 hover:bg-foreground/5 [&.active]:bg-brand/10 [&.active]:text-brand-deep"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-deep px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-brand"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Order on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
