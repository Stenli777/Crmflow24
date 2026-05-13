"use client";

import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";
import { siteConfig } from "@/config/site";

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
};

/** Сохранено для будущей интеграции CRM / почты; не вызывается из submit (см. integration-status.md). */
function buildMailtoPayload(form: FormState) {
  const subject = `Заявка на консультацию: ${form.name || "без имени"}`;
  const body = [
    "Заявка с сайта",
    "",
    `Имя: ${form.name || "-"}`,
    `Компания: ${form.company || "-"}`,
    `Телефон: ${form.phone || "-"}`,
    `Email: ${form.email || "-"}`,
    "",
    "Сообщение:",
    form.message || "-",
    "",
    "---",
    `Отправлено с сайта ${siteConfig.siteDomain}`,
  ].join("\n");
  return { subject, body, mailto: `mailto:${siteConfig.contactEmail}?${new URLSearchParams({ subject, body }).toString()}` };
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [consentPd, setConsentPd] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [mockSuccess, setMockSuccess] = useState(false);

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

  const canSubmit = consentPd && fieldsOk;

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!canSubmit) return;
        const payload = {
          form,
          consentPd,
          consentMarketing,
          mailtoPreview: buildMailtoPayload(form),
        };
        // Mock: реальная отправка — TODO (CRM-форма Битрикс24), см. project-docs/private-audit/integration-status.md
        console.info("[ContactForm] mock submit", payload);
        setMockSuccess(true);
      }}
      noValidate
    >
      <Stack spacing={2.25}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Запишитесь на консультацию
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
            Опишите задачу — мы ответим и предложим план внедрения.
          </Typography>
        </Box>

        {mockSuccess ? (
          <Alert severity="success">
            Заявка принята (демо-режим: данные не отправлены на сервер). Подключение CRM-формы Битрикс24 —
            в работе.
          </Alert>
        ) : null}

        {submitted && !canSubmit && !mockSuccess ? (
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
            disabled={mockSuccess}
          />
          <TextField
            label="Компания"
            value={form.company}
            onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
            fullWidth
            disabled={mockSuccess}
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
            disabled={mockSuccess}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            error={submitted && Boolean(errors.email)}
            helperText={(submitted && errors.email) || " "}
            fullWidth
            disabled={mockSuccess}
          />
        </Stack>

        <TextField
          label="Коротко о задаче"
          value={form.message}
          onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
          error={submitted && Boolean(errors.message)}
          helperText={(submitted && errors.message) || " "}
          minRows={4}
          multiline
          fullWidth
          disabled={mockSuccess}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={consentPd}
              onChange={(e) => setConsentPd(e.target.checked)}
              disabled={mockSuccess}
            />
          }
          label={
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
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
              disabled={mockSuccess}
            />
          }
          label={
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              Согласен(на) на получение информационных и рекламных сообщений — на условиях{" "}
              <MuiLink component={Link} href="/marketing-consent" sx={{ fontWeight: 600 }}>
                отдельного согласия на рассылку
              </MuiLink>
              . Необязательно.
            </Typography>
          }
          sx={{ alignItems: "flex-start", ml: 0 }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.6 }}>
          Нажимая «Отправить заявку», вы подтверждаете достоверность указанных данных. Данные используются
          для обработки обращения и не передаются третьим лицам, кроме случаев, указанных в Политике.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!consentPd || mockSuccess}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Отправить заявку
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Политика cookie:{" "}
          <MuiLink component={Link} href="/cookies">
            /cookies
          </MuiLink>
          . Отправка через почтовый клиент (mailto) отключена до интеграции с CRM.
        </Typography>
      </Stack>
    </Box>
  );
}
