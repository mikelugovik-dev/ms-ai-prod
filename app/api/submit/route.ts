import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export async function POST(request: Request) {
  try {
    const { name, phone, telegram, message } = await request.json();

    if (!name || !phone || !telegram) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const text = [
      "📩 *Новая заявка с сайта MS AI*",
      "",
      `👤 *Имя:* ${name}`,
      `📱 *Телефон:* ${phone}`,
      `✈️ *Telegram:* ${telegram}`,
      message ? `💬 *Сообщение:* ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: "Markdown",
          }),
        }
      );
    } else {
      console.log("Telegram not configured. Form data:", { name, phone, telegram, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
