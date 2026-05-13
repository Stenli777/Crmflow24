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
  consentPersonalData: boolean;
  consentMarketing: boolean;
  consentVersion: string;
  timestamp: string;
  userAgent: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
};

/** Поля контакта CRM из заявки (trim внутри). PHONE/EMAIL только если непустые в форме. */
function buildContactCrmFields(p: SiteInquiryPayload): Record<string, unknown> {
  const name = p.name.trim();
  const phone = p.phone.trim();
  const email = p.email.trim();
  const company = p.company.trim();
  const message = p.message.trim();

  const fields: Record<string, unknown> = {
    NAME: name,
    ASSIGNED_BY_ID: ASSIGNED_BY_ID,
    COMMENTS: message,
  };
  if (company) {
    fields.COMPANY_TITLE = company;
  }
  if (phone) {
    fields.PHONE = [{ VALUE: phone, VALUE_TYPE: "WORK" }];
  }
  if (email) {
    fields.EMAIL = [{ VALUE: email, VALUE_TYPE: "WORK" }];
  }
  return fields;
}

function buildDealComments(p: SiteInquiryPayload): string {
  const name = p.name.trim();
  const phone = p.phone.trim();
  const email = p.email.trim();
  const company = p.company.trim();
  const service = p.service.trim();
  const pageUrl = p.pageUrl.trim();
  const message = p.message.trim();
  const lines = [
    `Имя: ${name}`,
    `Телефон: ${phone || "—"}`,
    `Email: ${email || "—"}`,
  ];
  if (company) lines.push(`Компания: ${company}`);
  if (service) lines.push(`Услуга: ${service}`);
  lines.push(`Страница: ${pageUrl || "—"}`);
  lines.push("", "Сообщение:", message);
  lines.push("", "Согласия и технические данные (сайт):");
  lines.push(`consentPersonalData: ${p.consentPersonalData ? "да" : "нет"}`);
  lines.push(`consentMarketing: ${p.consentMarketing ? "да" : "нет"}`);
  lines.push(`consentVersion: ${p.consentVersion}`);
  lines.push(`timestamp: ${p.timestamp}`);
  lines.push(`userAgent: ${p.userAgent || "—"}`);
  return lines.join("\n");
}

export async function submitSiteInquiryToBitrix(payload: SiteInquiryPayload): Promise<{ dealId: number }> {
  const base = normalizeWebhookBase(process.env.BITRIX_WEBHOOK_URL || "");

  let contactId: number | null = null;

  const phoneTrim = payload.phone.trim();
  const emailTrim = payload.email.trim();
  const emailForDuplicateSearch = emailTrim.toLowerCase();

  if (phoneTrim) {
    const dup = await bitrixCall<unknown>(base, "crm.duplicate.findbycomm", {
      entity_type: "CONTACT",
      type: "PHONE",
      values: [phoneTrim],
    });
    contactId = firstContactIdFromDuplicateResult(dup);
  }

  if (contactId === null && emailForDuplicateSearch) {
    const dup = await bitrixCall<unknown>(base, "crm.duplicate.findbycomm", {
      entity_type: "CONTACT",
      type: "EMAIL",
      values: [emailForDuplicateSearch],
    });
    contactId = firstContactIdFromDuplicateResult(dup);
  }

  const contactFields = buildContactCrmFields(payload);

  if (contactId === null) {
    const newId = await bitrixCall<number>(base, "crm.contact.add", { fields: contactFields });
    contactId = typeof newId === "number" ? newId : Number(newId);
    if (!Number.isFinite(contactId)) {
      throw new Error("crm.contact.add: некорректный ID контакта");
    }
  } else {
    await bitrixCall<boolean>(base, "crm.contact.update", {
      id: contactId,
      fields: contactFields,
    });
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
