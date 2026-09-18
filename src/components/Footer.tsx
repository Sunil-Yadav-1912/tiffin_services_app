import { MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { businessInfo } from "@/config/business";

export function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:pb-10 pt-10 sm:px-6">
      <div className="glass-panel flex flex-col items-start justify-between gap-6 rounded-2xl px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-8">
        <div className="flex flex-col gap-2">
          <p className="font-display text-lg font-semibold text-foreground">
            {businessInfo.name}
          </p>
          <p className="text-sm">Homemade tiffin, made with care.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold sm:gap-6">
          <Link to="/" className="transition-colors hover:text-brand-deep">Home</Link>
          <Link to="/tiffins" className="transition-colors hover:text-brand-deep">Tiffins</Link>
          <Link to="/services" className="transition-colors hover:text-brand-deep">Services</Link>
          <Link to="/about" className="transition-colors hover:text-brand-deep">About</Link>
          <Link to="/contact" className="transition-colors hover:text-brand-deep">Contact</Link>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-4 text-xs text-foreground/50 sm:flex-row sm:px-8">
        <p>&copy; {new Date().getFullYear()} {businessInfo.name}. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          <MapPin size={13} aria-hidden="true" /> {businessInfo.address}
        </p>
      </div>
    </footer>
  );
}
