import type { Metadata } from "next";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalDocFooterLinks } from "@/components/legal/LegalDocFooterLinks";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description:
    "Политика ООО «Лиса Эдженси» в отношении обработки персональных данных посетителей сайта CRM Flow 24 и заявок.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Политика обработки персональных данных | CRM Flow 24",
    description:
      "Порядок обработки персональных данных при использовании сайта и отправке заявок.",
    url: `${siteConfig.siteUrl}/privacy`,
  },
};

function P({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
      {children}
    </Typography>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h5" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
      {children}
    </Typography>
  );
}

export default function PrivacyPage() {
  const site = `https://${siteConfig.siteDomain}`;

  return (
    <LegalPageShell
      title="Политика в отношении обработки персональных данных"
      subtitle="Документ определяет порядок обработки персональных данных при использовании сайта и отправке заявок. Рассылка рекламных сообщений без отдельного согласия не выполняется."
    >
      <Stack spacing={2} sx={{ mt: 2, maxWidth: 900 }}>
        <P>
          Настоящая Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О
          персональных данных» и применяется к данным, которые оператор получает при работе сайта{" "}
          <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink> (далее — «Сайт»), в том числе через формы
          обратной связи.
        </P>

        <H3>1. Оператор персональных данных</H3>
        <Stack component="dl" spacing={1} sx={{ m: 0 }}>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700 }}>
            Полное наименование
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.operatorName}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Юридический адрес
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.legalAddress}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            ИНН / КПП / ОГРН
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.inn} / {legalConfig.kpp} / {legalConfig.ogrn}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Контакт по вопросам персональных данных
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>
          </Typography>
        </Stack>

        <H3>2. Какие данные обрабатываются</H3>
        <P>
          Мы обрабатываем данные, которые вы сами указываете в формах и сообщениях: имя, компания (если
          указана), телефон и/или email, текст обращения. При посещении Сайта могут обрабатываться
          технические данные (например, IP-адрес, тип браузера, дата и время запроса) в объёме, необходимом
          для работы Сайта и безопасности, а также с учётом настроек по файлам cookie (
          <Link href="/cookies" style={{ fontWeight: 600, textDecoration: "underline" }}>
            Политика в отношении cookie
          </Link>
          ).
        </P>

        <H3>3. Цели обработки</H3>
        <Box component="ul" sx={{ m: 0, pl: 2.5, color: "text.secondary", lineHeight: 1.7 }}>
          <li>рассмотрение заявки и обращения, связь с вами по контактам, которые вы указали;</li>
          <li>подготовка ответа и коммерческого предложения по вашему запросу;</li>
          <li>исполнение требований законодательства Российской Федерации.</li>
        </Box>
        <P>
          Целевая рассылка рекламных или информационных сообщений по данным заявки{" "}
          <strong>не осуществляется</strong> без отдельного согласия, оформляемого согласно{" "}
          <Link href="/marketing-consent" style={{ fontWeight: 600 }}>
            отдельному документу
          </Link>
          .
        </P>

        <H3>4. Правовые основания</H3>
        <P>
          Согласие субъекта персональных данных; исполнение договора, стороной которого является субъект (при
          его заключении); неотъемлемые права оператора в связи с вашим обращением; обязанности, установленные
          законом.
        </P>

        <H3>5. Условия согласия при отправке формы</H3>
        <P>
          Отправка формы на Сайте возможна после отметки о согласии с настоящей Политикой и обработкой
          персональных данных в целях рассмотрения обращения и связи. Текст у формы согласован с разделом{" "}
          <Link href="/consent" style={{ fontWeight: 600 }}>
            «Согласие на обработку ПДн»
          </Link>
          .
        </P>

        <H3>6. Действия с данными и сроки</H3>
        <P>
          Мы осуществляем сбор, запись, систематизацию, накопление, хранение, уточнение, использование,
          обезличивание, блокирование, удаление и уничтожение — в объёме, необходимом для целей из раздела 3.
          Срок хранения: до достижения целей обработки или отзыва согласия, но не более 3 лет с момента последнего
          обращения, если больший срок не требуется законом или договором.
        </P>

        <H3>7. Передача третьим лицам</H3>
        <P>
          Мы не продаём персональные данные. Передача возможна с вашего согласия, по требованию закона, а
          также привлечённым для работы Сайта и обработки заявок подрядчикам — на основании договоров и с соблюдением
          требований 152-ФЗ. Фактически используются: хостинг сайта — {legalConfig.hostingProvider}; CRM для обработки
          заявок — «Битрикс24» (ООО «1С-Битрикс»). Веб-аналитика — Яндекс.Метрика (ООО «ЯНДЕКС»): счётчик подключается
          только после вашего согласия на аналитические cookies в баннере (см.{" "}
          <Link href="/cookies" style={{ fontWeight: 600 }}>
            Политику cookie
          </Link>
          ). Google Analytics не используется. Cloudflare не используется. Сторонние чаты и виджеты на Сайте не
          используются, в том числе Telegram- и WhatsApp-виджеты. По запросам:{" "}
          <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>.
        </P>

        <H3>8. Трансграничная передача</H3>
        <P>
          Обработка ориентирована на использование сервисов с локализацией данных в Российской Федерации в
          части, касающейся заявок. При подключении сервисов с иной юрисдикцией Политика будет дополнена.
        </P>

        <H3>9. Права субъекта персональных данных</H3>
        <P>
          Вы вправе получать сведения об обработке, требовать уточнения, блокирования или удаления (если
          данные не обязаны храниться по закону), отозвать согласие, обжаловать действия оператора в
          Роскомнадзоре или в суде. Обращения — на{" "}
          <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>.
        </P>

        <H3>10. Меры защиты</H3>
        <P>
          Применяются организационные и технические меры, направленные на предотвращение неправомерного
          доступа, уничтожения, изменения, блокирования, копирования, предоставления и распространения
          персональных данных.
        </P>

        <H3>11. Изменение Политики</H3>
        <P>
          Мы можем обновлять Политику. Новая редакция действует с момента размещения на Сайте, если иное
          прямо не указано в тексте.
        </P>

        <H3>12. Возрастная категория</H3>
        <P>
          Сайт не предназначен для лиц младше 18 лет; мы не нацеливаем обработку на несовершеннолетних и не
          предлагаем им самостоятельно оставлять данные.
        </P>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
        >
          Версия {legalConfig.policyVersion} от {legalConfig.policyEffectiveDate}. Торговое обозначение
          сайта: {siteConfig.brandName}. Оператор сайта: {legalConfig.operatorName}.
        </Typography>

        <LegalDocFooterLinks />
      </Stack>
    </LegalPageShell>
  );
}
