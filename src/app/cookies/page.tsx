import type { Metadata } from "next";
import {
  Box,
  Link as MuiLink,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalDocFooterLinks } from "@/components/legal/LegalDocFooterLinks";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { ANALYTICS_COOKIE_NAME } from "@/lib/cookieConsentStorage";
import { YANDEX_METRIKA_ID } from "@/lib/yandexMetrika";
import { siteLayout } from "@/theme/siteUi";

export const metadata: Metadata = {
  title: "Политика использования cookie",
  description: `Порядок использования cookie, localStorage и аналитики (Яндекс.Метрика) на сайте ${siteConfig.brandName} после согласия в баннере.`,
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: `Политика cookie | ${siteConfig.brandName}`,
    description: "Категории cookie, Яндекс.Метрика, управление согласием и отзыв.",
    url: `${siteConfig.siteUrl}/cookies`,
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

function H4({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 0.5 }}>
      {children}
    </Typography>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5, color: "text.secondary", lineHeight: 1.7 }}>
      {children}
    </Box>
  );
}

const yandexMetricaHelpHref = "https://yandex.ru/support/metrica/";

export default function CookiesPage() {
  const site = `https://${siteConfig.siteDomain}`;
  const cookieVersionLine = `Версия ${legalConfig.cookiePolicyVersion} от ${new Date(
    `${legalConfig.cookiePolicyEffectiveDate}T12:00:00`,
  ).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} г.`;

  return (
    <LegalPageShell
      title="Политика в отношении использования файлов cookie"
      subtitle="Определяет порядок использования cookie, localStorage и аналогичных технологий на сайте. Аналитика (Яндекс.Метрика) подключается только после согласия в cookie-баннере."
    >
      <Stack spacing={2} sx={{ maxWidth: siteLayout.articleMaxPx }}>
        <P>
          Настоящая Политика в отношении использования файлов cookie определяет порядок использования
          cookie, localStorage и аналогичных технологий на сайте{" "}
          <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink>.
        </P>

        <P>Настоящая Политика применяется к сайту {siteConfig.siteDomain} и действует в отношении оператора сайта:</P>

        <Stack component="dl" spacing={1} sx={{ m: 0 }}>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700 }}>
            Оператор
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.operatorName}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            ИНН
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.inn}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            ОГРН
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.ogrn}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Адрес
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.legalAddress}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Сайт
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink>
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Email для обращений
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Торговое обозначение сайта
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            CRM Flow24
          </Typography>
        </Stack>

        <P>
          Обработка персональных данных пользователей также регулируется{" "}
          <Link href="/privacy" style={{ fontWeight: 600, textDecoration: "underline" }}>
            Политикой в отношении обработки персональных данных
          </Link>
          .
        </P>

        <H3>1. Что такое cookie и аналогичные технологии</H3>
        <P>
          Cookie — это небольшие фрагменты данных, которые сайт может сохранить в браузере пользователя.
        </P>
        <P>
          Также сайт может использовать localStorage и иные аналогичные технологии браузера. Они позволяют
          сохранять технические настройки сайта, запоминать выбор пользователя в cookie-баннере и, при наличии
          отдельного согласия, подключать инструменты веб-аналитики.
        </P>
        <P>Cookie и аналогичные технологии могут использоваться для:</P>
        <Ul>
          <li>обеспечения корректной работы сайта;</li>
          <li>сохранения выбора пользователя по настройкам cookie;</li>
          <li>обеспечения безопасности и стабильности работы сайта;</li>
          <li>
            анализа посещаемости и поведения пользователей на сайте — только после согласия пользователя на
            аналитические cookies.
          </li>
        </Ul>

        <H3>2. Категории используемых cookie</H3>
        <P>На сайте могут использоваться следующие категории cookie и аналогичных технологий.</P>

        <H4>2.1. Необходимые cookie и технические записи</H4>
        <P>
          Необходимые cookie и технические записи используются для корректной работы сайта, сохранения выбора
          пользователя по cookie-баннеру и обеспечения стабильности сайта.
        </P>
        <P>
          Эти технологии не отключаются через cookie-баннер, поскольку без них невозможно сохранить выбор
          пользователя и обеспечить базовую работу сайта.
        </P>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          К необходимым техническим записям относятся:
        </Typography>
        <TableContainer
          sx={{
            mt: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            overflow: "auto",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700 }}>Название / ключ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Тип</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Назначение</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Срок хранения</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Box component="code" sx={{ fontSize: "0.85em" }}>
                    crmflow24_cookie_consent_v1
                  </Box>
                </TableCell>
                <TableCell>localStorage</TableCell>
                <TableCell>Сохранение выбора пользователя по cookie-баннеру</TableCell>
                <TableCell>
                  До изменения выбора пользователем или удаления данных сайта в браузере
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box component="code" sx={{ fontSize: "0.85em" }}>
                    {ANALYTICS_COOKIE_NAME}
                  </Box>
                </TableCell>
                <TableCell>first-party cookie</TableCell>
                <TableCell>
                  Фиксация согласия на подключение аналитики на уровне запроса к серверу
                </TableCell>
                <TableCell>
                  Используется только при включённой аналитике; срок хранения определяется техническими
                  настройками сайта, но не более срока действия согласия
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <P>
          При необходимости сайт также может использовать иные технически необходимые cookie, если они
          требуются для стабильной и безопасной работы сайта.
        </P>

        <H4>2.2. Аналитические cookie</H4>
        <P>
          Аналитические cookie используются для сбора статистики посещений сайта и анализа поведения
          пользователей на сайте.
        </P>
        <P>
          Аналитика подключается только после согласия пользователя в cookie-баннере, включая выбор через
          кнопку «Принять все» или через раздел «Настроить».
        </P>
        <P>До получения согласия пользователя скрипт Яндекс.Метрики не загружается.</P>

        <H3>3. Яндекс.Метрика</H3>
        <P>После включения аналитики на сайте подключается сервис Яндекс.Метрика.</P>
        <P>
          Поставщик сервиса: <strong>ООО «ЯНДЕКС», Российская Федерация</strong>
        </P>
        <P>
          Идентификатор счётчика: <strong>{YANDEX_METRIKA_ID}</strong>
        </P>
        <P>
          Данные счётчика Яндекс.Метрики хранятся и обрабатываются на территории Российской Федерации в
          соответствии с требованиями статьи 18 Федерального закона № 152-ФЗ «О персональных данных».
        </P>
        <P>
          Яндекс.Метрика может использовать cookie и localStorage для учёта посетителей, анализа источников
          переходов, посещаемости страниц и взаимодействия пользователей с сайтом. Яндекс указывает, что
          Метрика использует анонимные идентификаторы браузеров, сохраняемые в cookie и localStorage-свойствах.
        </P>
        <P>В зависимости от настроек счётчика Яндекс.Метрика может использовать, в том числе:</P>
        <Ul>
          <li>оценку посещаемости сайта;</li>
          <li>анализ источников переходов;</li>
          <li>анализ действий пользователей на страницах сайта;</li>
          <li>карту кликов;</li>
          <li>Вебвизор — если он включён в настройках счётчика.</li>
        </Ul>
        <P>
          Вебвизор и карта кликов используются только в объёме настроек счётчика Яндекс.Метрики и только после
          согласия пользователя на аналитические cookies.
        </P>
        <P>
          Перечень cookie Яндекс.Метрики, их назначение и сроки хранения определяются Яндексом и могут
          изменяться. Актуальная информация о временных файлах Яндекс.Метрики размещается в{" "}
          <MuiLink href={yandexMetricaHelpHref} target="_blank" rel="noopener noreferrer">
            справке Яндекса
          </MuiLink>
          .
        </P>

        <H3>4. Цели использования cookie</H3>
        <P>Cookie и аналогичные технологии используются в следующих целях:</P>
        <Ul>
          <li>обеспечение корректной работы сайта;</li>
          <li>сохранение выбора пользователя по cookie-баннеру;</li>
          <li>защита сайта от технических сбоев и злоупотреблений;</li>
          <li>подключение веб-аналитики после согласия пользователя;</li>
          <li>оценка посещаемости сайта;</li>
          <li>улучшение структуры, содержания и удобства сайта.</li>
        </Ul>
        <P>Cookie не используются для автоматического добавления пользователя в рекламную рассылку.</P>

        <H3>5. Управление cookie</H3>
        <P>При первом посещении сайта пользователь может выбрать один из вариантов в cookie-баннере:</P>
        <Ul>
          <li>«Принять все» — разрешить необходимые и аналитические cookie;</li>
          <li>«Только необходимые» — использовать только необходимые cookie и технические записи;</li>
          <li>«Настроить» — выбрать категории cookie вручную.</li>
        </Ul>
        <P>
          Пользователь может в любое время изменить ранее выбранные настройки через ссылку в подвале сайта.
        </P>
        <P>
          Также пользователь может удалить cookie и данные сайта в настройках браузера. После удаления данных
          сайта cookie-баннер может появиться повторно, поскольку ранее сохранённый выбор будет удалён.
        </P>

        <H3>6. Отзыв согласия на аналитические cookie</H3>
        <P>Пользователь вправе в любой момент отозвать согласие на использование аналитических cookie.</P>
        <P>
          Отзыв согласия осуществляется через настройки cookie на сайте или путём удаления cookie и данных
          сайта в настройках браузера.
        </P>
        <P>
          После отзыва согласия сайт прекращает дальнейшую загрузку скрипта Яндекс.Метрики, если для этого
          отсутствует новое согласие пользователя.
        </P>
        <P>
          Удаление ранее установленных сторонних cookie Яндекс.Метрики может потребовать очистки cookie и
          данных сайта в настройках браузера пользователя.
        </P>

        <H3>7. Сроки хранения</H3>
        <P>Срок хранения cookie и записей localStorage зависит от их категории и технических настроек.</P>
        <P>
          Необходимые технические записи хранятся до изменения выбора пользователем, удаления данных сайта в
          браузере или истечения технически установленного срока хранения.
        </P>
        <P>
          Аналитические cookie Яндекс.Метрики хранятся в течение сроков, определяемых Яндексом и настройками
          счётчика. Эти сроки могут изменяться Яндексом. Актуальная информация о cookie Яндекс.Метрики
          указывается в справочных материалах Яндекса.
        </P>

        <H3>8. Связь с персональными данными</H3>
        <P>
          Некоторые cookie и технические данные могут относиться к персональным данным, если позволяют прямо
          или косвенно определить пользователя.
        </P>
        <P>
          В таком случае обработка данных осуществляется в соответствии с{" "}
          <Link href="/privacy" style={{ fontWeight: 600, textDecoration: "underline" }}>
            Политикой в отношении обработки персональных данных
          </Link>
          .
        </P>
        <P>
          Для аналитических cookie правовым основанием обработки является согласие пользователя, выраженное
          через cookie-баннер.
        </P>

        <H3>9. Изменение Политики</H3>
        <P>Оператор вправе изменять настоящую Политику.</P>
        <P>
          Новая редакция Политики вступает в силу с момента её размещения на сайте, если иное не указано в
          новой редакции.
        </P>
        <P>Пользователям рекомендуется периодически проверять актуальную редакцию Политики на сайте.</P>

        <H3>10. Контактная информация</H3>
        <P>По вопросам использования cookie и обработки персональных данных пользователь может обратиться к оператору:</P>
        <Stack component="dl" spacing={1} sx={{ m: 0 }}>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700 }}>
            Наименование
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.operatorName}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Адрес
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.legalAddress}
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Email
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>
          </Typography>
          <Typography component="dt" variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
            Сайт
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink>
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
        >
          {cookieVersionLine}
        </Typography>

        <LegalDocFooterLinks />
      </Stack>
    </LegalPageShell>
  );
}
