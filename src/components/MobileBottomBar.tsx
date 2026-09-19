import { Phone, MessageCircle, User as UserIcon } from "lucide-react";
import { businessInfo, getWhatsAppLink } from "@/config/business";
import { useApp } from "@/context/AppContext";
import { Link } from "@tanstack/react-router";

export function MobileBottomBar() {
  const { currentUser } = useApp();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
      {/* Gradient overlay so the bar doesn't abruptly cut off content */}
      <div className="h-6 w-full bg-gradient-to-t from-background to-transparent" />
      
      <div className="glass-strong border-t border-border/40 bg-background/80 px-4 py-3 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          {currentUser ? (
            <Link
              to={currentUser.role === "Admin" ? "/admin/dashboard" : "/customer/dashboard"}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground/10 px-2 py-3.5 text-xs sm:text-sm font-bold text-foreground shadow-sm transition active:scale-[0.98]"
            >
              <UserIcon size={16} />
              <span>Dash</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground/10 px-2 py-3.5 text-xs sm:text-sm font-bold text-foreground shadow-sm transition active:scale-[0.98]"
            >
              <UserIcon size={16} />
              <span>Login</span>
            </Link>
          )}

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
          >
            <MessageCircle size={16} />
            <span>WA</span>
          </a>
          
          <a
            href={`tel:${businessInfo.phone.replace(/[^0-9+]/g, '')}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent px-2 py-3.5 text-xs sm:text-sm font-bold text-accent-foreground shadow-sm transition active:scale-[0.98]"
          >
            <Phone size={16} />
            <span>Call</span>
          </a>
        </div>
      </div>
    </div>
  );
}
