import { Phone, MessageCircle } from "lucide-react";
import { businessInfo, getWhatsAppLink } from "@/config/business";

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
      {/* Gradient overlay so the bar doesn't abruptly cut off content */}
      <div className="h-6 w-full bg-gradient-to-t from-background to-transparent" />
      
      <div className="glass-strong border-t border-border/40 bg-background/80 px-4 py-3 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-lg transition active:scale-[0.98]"
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>
          
          <a
            href={`tel:${businessInfo.phone.replace(/[^0-9+]/g, '')}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition active:scale-[0.98]"
          >
            <Phone size={18} />
            <span>Call</span>
          </a>
        </div>
      </div>
    </div>
  );
}
