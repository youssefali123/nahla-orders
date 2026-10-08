import { t as site } from "./site-DJJ-cs6K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp--tDt8L9p.js
function buildOrderMessage(items, customer, total, delivery) {
	const lines = [];
	lines.push(`🐝 طلب جديد من ${site.name}`, "");
	lines.push("👤 اسم العميل:", customer.name, "");
	lines.push("📱 رقم الهاتف:", customer.phone, "");
	lines.push("📍 العنوان:", customer.address, "");
	lines.push("🛒 تفاصيل الطلب:", "");
	let lastGroup = null;
	let n = 0;
	items.forEach((item) => {
		const group = item.note ? "✍️ طلب مخصص:" : item.categoryName ? `▪️ ${item.categoryName}:` : null;
		if (group !== lastGroup) {
			if (group) lines.push(group, "");
			lastGroup = group;
		}
		n += 1;
		if (item.note) lines.push(`${n}. ${item.name}:`, `"${item.note}"`, "");
		else {
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
		lines.push(`🛵 رسوم التوصيل:`, delivery.fee === 0 ? "توصيل مجاني 🎉" : `${delivery.fee} ${site.currency}`, "");
		lines.push(`💰 الإجمالي الكلي:`, `${delivery.grandTotal} ${site.currency}`, "");
	}
	lines.push(`🟢 ${site.slogan} 🐝`);
	return lines.join("\n");
}
function whatsappContactUrl(text = `مرحبًا ${site.name}! عندي استفسار.`) {
	return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
//#endregion
export { whatsappContactUrl as n, buildOrderMessage as t };
