const CHAT_ID = import.meta.env["VITE_TELEGRAM_CHAT_ID"] as string | undefined;
const BOT_TOKEN = import.meta.env["VITE_TELEGRAM_BOT_TOKEN"] as string | undefined;

export type SendOrderResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the order message to the store's Telegram chat via the Bot API.
 * Plain text (no parse mode) so Arabic copy and user input can never break
 * message formatting. Throws when configuration is missing; returns a
 * result object for API-level failures so callers never clear the cart
 * on an unsent order.
 */
const sendOrderMessage = async (message: string): Promise<SendOrderResult> => {
  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error("خدمة إرسال الطلبات غير مفعلة. أضف بيانات تيليجرام إلى ملف .env.local.");
  }
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });
    const data = (await response.json()) as { ok?: boolean; description?: string };
    if (!response.ok || data.ok !== true) {
      return { ok: false, error: data.description ?? `Telegram API error ${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    console.error("error sending message:", error);
    return { ok: false, error: error instanceof Error ? error.message : "تعذر إرسال الطلب." };
  }
};

export default sendOrderMessage;
