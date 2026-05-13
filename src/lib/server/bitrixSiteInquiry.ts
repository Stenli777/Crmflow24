/**
 * Только сервер: не импортировать из клиентских компонентов (`"use client"`).
 */

const ASSIGNED_BY_ID = 1;
const DEAL_CATEGORY_ID = 14;

type BitrixSuccess<T> = { result: T; time?: unknown };
type BitrixError = { error: string; error_description?: string };

function normalizeWebhookBase(url: string): string {
  const t = url.trim();
  if (!t) throw new Error("BITRIX_WEBHOOK_URL пустой");
  return t.replace(/\/+$/, "");
}

async function bitrixCall<T>(baseUrl: string, method: string, body: Record<string, unknown>): Promise<T> {
  const url = `${baseUrl}/${method}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Bitrix24: не JSON (${method}), HTTP ${res.status}`);
  }
  if (!res.ok) {
    const err = json as BitrixError;
    const msg = err?.error ? `${err.error} — ${err.error_description ?? ""}` : text.slice(0, 200);
    throw new Error(`Bitrix24 ${method}: HTTP ${res.status} ${msg}`);
  }

  const data = json as BitrixSuccess<T> & BitrixError;
  if ("error" in data && data.error) {
    const msg = [data.error, data.error_description].filter(Boolean).join(" — ");
    throw new Error(`Bitrix24 ${method}: ${msg}`);
  }
  if (!("result" in data)) {
    throw new Error(`Bitrix24 ${method}: ответ без result, HTTP ${res.status}`);
  }
  return data.result as T;
}

function firstContactIdFromDuplicateResult(result: unknown): number | null {
  if (!result || typeof result !== "object") return null;
  const r = result as { CONTACT?: unknown };
  const list = r.CONTACT;
  if (!Array.isArray(list) || list.length === 0) return null;
  const first = list[0];
  if (typeof first === "number" && Number.isFinite(first)) return first;
  if (typeof first === "string" && /^\d+$/.test(first)) return Number(first);
  return null;
}

export type SiteInquiryPayload = {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  service: string;
  pageUrl: string;
  consentMarketing: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
};

function buildDealComments(p: SiteInquiryPayload): string {
  const lines = [
    `Имя: ${p.name}`,
    `Телефон: ${p.phone || "—"}`,
    `Email: ${p.email || "—"}`,
  ];
  if (p.company.trim()) lines.push(`Компания: ${p.company.trim()}`);
  if (p.service.trim()) lines.push(`Услуга: ${p.service.trim()}`);
  lines.push(`Страница: ${p.pageUrl || "—"}`);
  lines.push("", "Сообщение:", p.message.trim());
  lines.push("", `Согласие на рассылку: ${p.consentMarketing ? "да" : "нет"}`);
  return lines.join("\n");
}

export async function submitSiteInquiryToBitrix(payload: SiteInquiryPayload): Promise<{ dealId: number }> {
  const base = normalizeWebhookBase(process.env.BITRIX_WEBHOOK_URL || "");

  let contactId: number | null = null;

  const phoneTrim = payload.phone.trim();
  const emailTrim = payload.email.trim().toLowerCase();

  if (phoneTrim) {
    const dup = await bitrixCall<unknown>(base, "crm.duplicate.findbycomm", {
      entity_type: "CONTACT",
      type: "PHONE",
      values: [phoneTrim],
    });
    contactId = firstContactIdFromDuplicateResult(dup);
  }

  if (contactId === null && emailTrim) {
    const dup = await bitrixCall<unknown>(base, "crm.duplicate.findbycomm", {
      entity_type: "CONTACT",
      type: "EMAIL",
      values: [emailTrim],
    });
    contactId = firstContactIdFromDuplicateResult(dup);
  }

  if (contactId === null) {
    const fields: Record<string, unknown> = {
      NAME: payload.name.trim(),
      ASSIGNED_BY_ID: ASSIGNED_BY_ID,
      COMMENTS: payload.message.trim(),
    };
    if (payload.company.trim()) {
      fields.COMPANY_TITLE = payload.company.trim();
    }
    if (phoneTrim) {
      fields.PHONE = [{ VALUE: phoneTrim, VALUE_TYPE: "WORK" }];
    }
    if (emailTrim) {
      fields.EMAIL = [{ VALUE: emailTrim, VALUE_TYPE: "WORK" }];
    }

    const newId = await bitrixCall<number>(base, "crm.contact.add", { fields });
    contactId = typeof newId === "number" ? newId : Number(newId);
    if (!Number.isFinite(contactId)) {
      throw new Error("crm.contact.add: некорректный ID контакта");
    }
  }

  const servicePart = payload.service.trim() ? ` — ${payload.service.trim()}` : "";
  const dealFields: Record<string, unknown> = {
    TITLE: `Заявка с сайта${servicePart}`,
    CATEGORY_ID: DEAL_CATEGORY_ID,
    ASSIGNED_BY_ID: ASSIGNED_BY_ID,
    CONTACT_ID: contactId,
    SOURCE_ID: "WEB",
    COMMENTS: buildDealComments(payload),
  };

  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
  for (const key of utmKeys) {
    const v = payload[key].trim();
    if (v) {
      dealFields[key.replace("utm_", "UTM_").toUpperCase()] = v;
    }
  }

  const dealIdRaw = await bitrixCall<number>(base, "crm.deal.add", { fields: dealFields });
  const dealId = typeof dealIdRaw === "number" ? dealIdRaw : Number(dealIdRaw);
  if (!Number.isFinite(dealId)) {
    throw new Error("crm.deal.add: некорректный ID сделки");
  }

  return { dealId };
}
