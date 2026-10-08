import whatsappIcon from "@/assets/whatsapp.png";
import { site } from "@/config/site";
import { whatsappContactUrl } from "@/lib/whatsapp";

/** Floating WhatsApp contact button, fixed bottom-right on store pages. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappContactUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل معنا على واتساب"
      className="fixed bottom-6 right-4 z-40 grid h-14 w-14 place-items-center overflow-hidden rounded-full shadow-[0_6px_16px_-4px_rgba(0,0,0,0.35),0_8px_28px_-4px_rgba(37,211,102,0.6)] transition-transform hover:scale-105 active:scale-95"
    >
      <img src={whatsappIcon} alt="" className="h-full w-full object-cover" />
      <span className="sr-only">{site.name} على واتساب</span>
    </a>
  );
}
