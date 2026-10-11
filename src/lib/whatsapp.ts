import { site } from "@/config/site";
import type { CartItem } from "@/lib/cart";

export type CustomerInfo = { name: string; phone: string; address: string };

export type DeliverySummary = {
  zoneName: string;
  fee: number;
  grandTotal: number;
  service?: { percent: number; amount: number } | undefined;
};

/** Order line optionally tagged with its catalog category for grouping. */
export type OrderLine = CartItem & { categoryName?: string; categoryOrder?: number };

export function buildOrderMessage(
  items: OrderLine[],
  customer: CustomerInfo,
  total: number,
  delivery?: DeliverySummary,
  orderNo?: string,
) {
  const lines: string[] = [];
  lines.push(`🐝 طلب جديد من ${site.name}`, "");
  if (orderNo) lines.push(`🔢 رقم الطلب:`, `${orderNo}`, "");
  lines.push("👤 اسم العميل:", customer.name, "");
  lines.push("📱 رقم الهاتف:", customer.phone, "");
  lines.push("📍 العنوان:", customer.address, "");
  lines.push("🛒 تفاصيل الطلب:", "");

  // Grouped by catalog category (caller sorts); custom notes trail at the end.
  let lastGroup: string | null = null;
  let n = 0;
  items.forEach((item) => {
    const group = item.note ? "✍️ طلب مخصص:" : item.categoryName ? `▪️ ${item.categoryName}:` : null;
    if (group !== lastGroup) {
      if (group) lines.push(group, "");
      lastGroup = group;
    }
    n += 1;
    if (item.note) {
      lines.push(
        `${n}. ${item.name}${item.subcategoryName ? ` (${item.subcategoryName})` : ""}:`,
        `"${item.note}"`,
        "",
      );
    } else {
      const unit = item.price + (item.selectedOptions ?? []).reduce((m, s) => m + s.priceDelta, 0);
      lines.push(`${n}. ${item.name} × ${item.qty}`, `السعر: ${item.qty * unit} ${site.currency}`);
      for (const s of item.selectedOptions ?? []) {
        const delta = s.priceDelta !== 0 ? ` (${s.priceDelta > 0 ? "+" : ""}${s.priceDelta})` : "";
        lines.push(`↳ ${s.groupName}: ${s.optionName}${delta}`);
      }
      lines.push("");
    }
  });

  lines.push(`💰 إجمالي الطلب:`, `${total} ${site.currency}`, "");
  if (delivery && delivery.zoneName) {
    lines.push(`📍 منطقة التوصيل:`, delivery.zoneName, "");
    lines.push(
      `🛵 رسوم التوصيل:`,
      delivery.fee === 0 ? "توصيل مجاني 🎉" : `${delivery.fee} ${site.currency}`,
      "",
    );
    if (delivery.service && delivery.service.percent > 0) {
      lines.push(
        `🧾 رسوم الخدمة (${delivery.service.percent}%):`,
        `${delivery.service.amount} ${site.currency}`,
        "",
      );
    }
    lines.push(`💰 الإجمالي الكلي:`, `${delivery.grandTotal} ${site.currency}`, "");
  }
  lines.push(`🟢 ${site.slogan} 🐝`);
  return lines.join("\n");
}

export function whatsappOrderUrl(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function whatsappContactUrl(text = `مرحبًا ${site.name}! عندي استفسار.`) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
