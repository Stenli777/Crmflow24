import { NextResponse } from "next/server";
import { submitSiteInquiryToBitrix, type SiteInquiryPayload } from "@/lib/server/bitrixSiteInquiry";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function bool(v: unknown): boolean {
  return v === true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.error("[api/contact] Некорректный JSON тела запроса");
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (!process.env.BITRIX_WEBHOOK_URL?.trim()) {
    console.error("[api/contact] Не задан BITRIX_WEBHOOK_URL");
    return NextResponse.json({ ok: false, error: "service_unavailable" }, { status: 503 });
  }

  const b = body as Record<string, unknown>;

  const name = trimStr(b.name);
  const company = trimStr(b.company);
  const phone = trimStr(b.phone);
  const email = trimStr(b.email);
  const message = trimStr(b.message);
  const service = trimStr(b.service);
  const pageUrl = trimStr(b.pageUrl);
  const consentPd = bool(b.consentPd);
  const consentMarketing = bool(b.consentMarketing);

  const utm_source = trimStr(b.utm_source);
  const utm_medium = trimStr(b.utm_medium);
  const utm_campaign = trimStr(b.utm_campaign);
  const utm_content = trimStr(b.utm_content);
  const utm_term = trimStr(b.utm_term);

  if (!consentPd) {
    console.warn("[api/contact] Отклонено: нет согласия на обработку ПДн");
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  if (!name) {
    console.warn("[api/contact] Валидация: пустое имя");
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const hasPhone = phone.length > 0;
  const hasEmail = email.length > 0;
  if (!hasPhone && !hasEmail) {
    console.warn("[api/contact] Валидация: нет телефона и email");
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  if (hasPhone && phone.length < 10) {
    console.warn("[api/contact] Валидация: телефон слишком короткий");
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  if (hasEmail && !EMAIL_RE.test(email)) {
    console.warn("[api/contact] Валидация: неверный формат email");
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  if (message.length < 10) {
    console.warn("[api/contact] Валидация: короткое сообщение");
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const payload: SiteInquiryPayload = {
    name,
    company,
    phone,
    email,
    message,
    service,
    pageUrl,
    consentMarketing,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  };

  try {
    const { dealId } = await submitSiteInquiryToBitrix(payload);
    console.info("[api/contact] Успех, сделка", dealId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/contact] Ошибка Bitrix24:", msg);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
