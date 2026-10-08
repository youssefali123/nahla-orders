import { t as site } from "./site-DJJ-cs6K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp-DMocFZPX.js
function buildOrderMessage(items, customer, total) {
	const lines = [];
	lines.push(`🐝 طلب جديد من ${site.name}`, "");
	lines.push("👤 اسم العميل:", customer.name, "");
	lines.push("📱 رقم الهاتف:", customer.phone, "");
	lines.push("📍 العنوان:", customer.address, "");
	lines.push("🛒 تفاصيل الطلب:", "");
	items.forEach((item, index) => {
		if (item.note) lines.push(`${index + 1}. ${item.name}:`, `"${item.note}"`, "");
		else {
			const unit = item.price + (item.selectedOptions ?? []).reduce((n, s) => n + s.priceDelta, 0);
			lines.push(`${index + 1}. ${item.name} × ${item.qty}`, `السعر: ${item.qty * unit} ${site.currency}`);
			for (const s of item.selectedOptions ?? []) {
				const delta = s.priceDelta !== 0 ? ` (${s.priceDelta > 0 ? "+" : ""}${s.priceDelta})` : "";
				lines.push(`↳ ${s.groupName}: ${s.optionName}${delta}`);
			}
			lines.push("");
		}
	});
	lines.push(`💰 إجمالي الطلب:`, `${total} ${site.currency}`, "");
	lines.push(`🟢 ${site.slogan} 🐝`);
	return lines.join("\n");
}
function whatsappContactUrl(text = `مرحبًا ${site.name}! عندي استفسار.`) {
	return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
//#endregion
export { whatsappContactUrl as n, buildOrderMessage as t };
