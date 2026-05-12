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

function buildMailto({ name, company, phone, email, message }: FormState) {
  const subject = `Заявка на консультацию: ${name || "без имени"}`;
  const body = [
    "Заявка с сайта",
    "",
    `Имя: ${name || "-"}`,
    `Компания: ${company || "-"}`,
    `Телефон: ${phone || "-"}`,
    `Email: ${email || "-"}`,
    "",
    "Сообщение:",
    message || "-",
    "",
    "---",
    `Отправлено с сайта ${siteConfig.siteDomain} (mailto)`,
  ].join("\n");

  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${siteConfig.contactEmail}?${params.toString()}`;
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
  const canSubmit =
    consentPd &&
    hasContact &&
    form.name.trim().length > 0 &&
    !errors.email &&
    !errors.phone &&
    !errors.message;

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!canSubmit) return;
        window.location.href = buildMailto(form);
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

        {submitted && !canSubmit ? (
          <Alert severity="warning">
            Проверьте поля формы — не хватает данных для отправки.
          </Alert>
        ) : null}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Имя"
            required
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Компания"
            value={form.company}
            onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
            fullWidth
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
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            error={submitted && Boolean(errors.email)}
            helperText={(submitted && errors.email) || " "}
            fullWidth
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
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={consentPd}
              onChange={(e) => setConsentPd(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              Я ознакомлен(а) с{" "}
              <MuiLink component={Link} href="/privacy" sx={{ fontWeight: 600 }}>
                Политикой обработки персональных данных
              </MuiLink>{" "}
              и даю согласие на обработку моих персональных данных в целях рассмотрения обращения и связи
              со мной.
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
            disabled={!consentPd}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Отправить заявку
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Сейчас заявка уходит через почтовый клиент (mailto). Подключение CRM-формы Битрикс24 — в
          ближайшей доработке.
        </Typography>
      </Stack>
    </Box>
  );
}

