"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import { legalConfig } from "@/config/legal";

const UTM_STORAGE_KEY = "crmflow_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type ContactFormInitialUtm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export type ContactFormProps = {
  initialUtm?: ContactFormInitialUtm;
  /** Тема/услуга из query (?service= / ?topic=) */
  serviceFromQuery?: string;
};

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
};

function mergeUtmsForSubmit(initial: ContactFormProps["initialUtm"]): Record<(typeof UTM_KEYS)[number], string> {
  let stored: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
  } catch {
    /* noop */
  }
  const fromUrl = new URLSearchParams(window.location.search);
  const out = {} as Record<(typeof UTM_KEYS)[number], string>;
  for (const k of UTM_KEYS) {
    const fromQuery = fromUrl.get(k)?.trim() || "";
    const fromStore = String(stored[k] ?? "").trim();
    const fromServer = initial?.[k]?.trim() || "";
    out[k] = fromQuery || fromStore || fromServer || "";
  }
  return out;
}

function getServiceFromQuery(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return (params.get("service") || params.get("topic") || "").trim();
}

export function ContactForm({ initialUtm, serviceFromQuery = "" }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  });
  const [messageBlurred, setMessageBlurred] = useState(false);
  const [_trap, setTrap] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [consentPd, setConsentPd] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => {
    const emailOk =
      form.email.trim().length === 0 ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

    return {
      email: emailOk ? "" : "Проверьте email",
      phone:
        form.phone.trim().length === 0 || form.phone.trim().length >= 10
          ? ""
          : "Укажите телефон в удобном формате",
      message:
        form.message.trim().length >= 10
          ? ""
          : "Опишите задачу хотя бы в 1–2 предложениях",
    };
  }, [form.email, form.message, form.phone]);

  const hasContact = form.phone.trim().length > 0 || form.email.trim().length > 0;
  const fieldsOk =
    hasContact &&
    form.name.trim().length > 0 &&
    !errors.email &&
    !errors.phone &&
    !errors.message;

  const showMessageError = (submitted || messageBlurred) && Boolean(errors.message);

  const canSubmit = consentPd && fieldsOk;

  return (
    <Box
      component="form"
      sx={{ position: "relative" }}
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setSubmitError(false);
        if (!canSubmit) return;

        setIsSubmitting(true);
        try {
          const utm = mergeUtmsForSubmit(initialUtm);
          const pageUrl =
            typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}${window.location.search}` : "";

          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              name: form.name,
              company: form.company,
              phone: form.phone,
              email: form.email,
              message: form.message,
              service: getServiceFromQuery() || serviceFromQuery,
              pageUrl,
              consentPersonalData: true,
              consentPd: true,
              consentMarketing,
              consentVersion: legalConfig.consentVersion,
              _trap,
              ...utm,
            }),
          });

          const data = (await res.json().catch(() => ({}))) as { ok?: boolean };

          if (!res.ok || !data.ok) {
            setSubmitError(true);
            return;
          }

          setSubmitSuccess(true);
          setForm({ name: "", company: "", phone: "", email: "", message: "" });
          setConsentPd(false);
          setConsentMarketing(false);
          setSubmitted(false);
          setMessageBlurred(false);
          setTrap("");
        } catch {
          setSubmitError(true);
        } finally {
          setIsSubmitting(false);
        }
      }}
      noValidate
    >
      <Stack spacing={2.25}>
        <Box
          aria-hidden
          sx={{ position: "absolute", left: -9999, top: 0, width: 1, height: 1, overflow: "hidden" }}
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={_trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Запишитесь на консультацию
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
            Укажите телефон или email и коротко опишите задачу — ответим и предложим следующий шаг.
          </Typography>
        </Box>

        {submitSuccess ? (
          <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
            Заявка отправлена. Мы свяжемся с вами по указанным контактам.
          </Alert>
        ) : null}

        {submitError ? (
          <Alert severity="error" onClose={() => setSubmitError(false)}>
            Не удалось отправить заявку. Попробуйте через минуту, позже или напишите на email из блока слева.
          </Alert>
        ) : null}

        {submitted && !canSubmit && !submitSuccess ? (
          <Alert severity="warning">
            Проверьте поля формы и отметьте обязательное согласие на обработку персональных данных.
          </Alert>
        ) : null}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Имя"
            required
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            fullWidth
            disabled={isSubmitting}
          />
          <TextField
            label="Компания"
            value={form.company}
            onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
            fullWidth
            disabled={isSubmitting}
          />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Телефон"
            value={form.phone}
            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            error={submitted && Boolean(errors.phone)}
            helperText={(submitted && errors.phone) || " "}
            fullWidth
            disabled={isSubmitting}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            error={submitted && Boolean(errors.email)}
            helperText={(submitted && errors.email) || " "}
            fullWidth
            disabled={isSubmitting}
          />
        </Stack>

        <TextField
          label="Коротко о задаче"
          value={form.message}
          onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
          onBlur={() => setMessageBlurred(true)}
          error={showMessageError}
          helperText={(showMessageError && errors.message) || " "}
          minRows={4}
          multiline
          fullWidth
          disabled={isSubmitting}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={consentPd}
              onChange={(e) => setConsentPd(e.target.checked)}
              disabled={isSubmitting}
            />
          }
          label={
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              Я ознакомлен(а) с{" "}
              <MuiLink component={Link} href="/privacy" sx={{ fontWeight: 600 }}>
                Политикой обработки персональных данных
              </MuiLink>
              ,{" "}
              <MuiLink component={Link} href="/consent" sx={{ fontWeight: 600 }}>
                Согласием на обработку ПДн
              </MuiLink>{" "}
              и{" "}
              <MuiLink component={Link} href="/terms" sx={{ fontWeight: 600 }}>
                Пользовательским соглашением
              </MuiLink>
              , и даю согласие на обработку моих персональных данных в целях рассмотрения обращения и связи
              со мной.
            </Typography>
          }
          sx={{ alignItems: "flex-start", ml: 0 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={consentMarketing}
              onChange={(e) => setConsentMarketing(e.target.checked)}
              disabled={isSubmitting}
            />
          }
          label={
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              Согласен(на) на получение информационных и рекламных сообщений — на условиях{" "}
              <MuiLink component={Link} href="/marketing-consent" sx={{ fontWeight: 600 }}>
                отдельного согласия на рассылку
              </MuiLink>
              . Необязательно.
            </Typography>
          }
          sx={{ alignItems: "flex-start", ml: 0 }}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: "center" }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!consentPd || isSubmitting}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Отправить заявку"}
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.6 }}>
          Нажимая «Отправить заявку», вы подтверждаете достоверность указанных данных. Данные используются для
          обработки обращения и не передаются третьим лицам, кроме случаев, указанных в{" "}
          <MuiLink component={Link} href="/privacy" sx={{ fontWeight: 600 }}>
            Политике
          </MuiLink>
          .
        </Typography>
      </Stack>
    </Box>
  );
}
