import type { Metadata } from "next";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalDocFooterLinks } from "@/components/legal/LegalDocFooterLinks";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { siteLayout } from "@/theme/siteUi";

export const metadata: Metadata = {
  title: "Согласие на получение рекламных и информационных сообщений",
  description:
    "Отдельное согласие на рассылку: каналы, цели, срок, отзыв. Без отметки в форме на crmflow24.ru рекламные сообщения не направляются.",
  alternates: { canonical: "/marketing-consent" },
  openGraph: {
    title: `Согласие на рекламные рассылки | ${siteConfig.brandName}`,
    url: `${siteConfig.siteUrl}/marketing-consent`,
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

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5, color: "text.secondary", lineHeight: 1.7 }}>
      {children}
    </Box>
  );
}

export default function MarketingConsentPage() {
  const site = `https://${siteConfig.siteDomain}`;
  const versionLine = `Версия ${legalConfig.marketingConsentVersion} от ${new Date(
    `${legalConfig.marketingConsentEffectiveDate}T12:00:00`,
  ).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} г.`;

  return (
    <LegalPageShell
      title="Согласие на получение рекламных и информационных сообщений"
      subtitle="Применяется только при отдельной отметке в форме на сайте. Без отметки рекламные и информационные сообщения не направляются."
    >
      <Stack spacing={2} sx={{ maxWidth: siteLayout.articleMaxPx }}>
        <P>
          Настоящее согласие применяется только в случае, если пользователь отдельно проставил отметку в форме
          сайта <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink> о согласии на получение рекламных и
          информационных сообщений.
        </P>
        <P>Без такой отдельной отметки рекламные и информационные сообщения пользователю не направляются.</P>
        <P>
          Настоящим я, заполняя форму на сайте <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink> и
          проставляя отдельную отметку о согласии на получение рекламных и информационных сообщений, даю
          согласие <strong>{legalConfig.operatorName}</strong>:
        </P>

        <Stack component="dl" spacing={0.5} sx={{ m: 0 }}>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Оператор
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.operatorName}
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            Юридический адрес
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.legalAddress}
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            ИНН / КПП / ОГРН
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.inn} / {legalConfig.kpp} / {legalConfig.ogrn}
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            Сайт
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink>
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            Торговое обозначение сайта
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            CRM Flow24
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            Контактный email
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>
          </Typography>
        </Stack>

        <P>
          на направление мне рекламных и информационных сообщений о продуктах, услугах, специальных
          предложениях, мероприятиях, новостях и материалах CRM Flow24 и {legalConfig.operatorName}.
        </P>

        <H3>1. Каналы направления сообщений</H3>
        <P>
          Сообщения могут направляться по тем контактным данным, которые я самостоятельно указал(а) в форме на
          сайте, включая:
        </P>
        <Ul>
          <li>адрес электронной почты;</li>
          <li>номер телефона;</li>
          <li>SMS-сообщения;</li>
          <li>телефонные звонки;</li>
          <li>
            мессенджеры, привязанные к указанному номеру телефона, если такой способ связи технически доступен
            и используется оператором.
          </li>
        </Ul>
        <P>
          Push-уведомления направляются только при наличии отдельного технического согласия пользователя в
          браузере или устройстве, если такой функционал будет реализован на сайте.
        </P>

        <H3>2. Содержание сообщений</H3>
        <P>Сообщения могут содержать:</P>
        <Ul>
          <li>информацию о продуктах и услугах CRM Flow24;</li>
          <li>информацию о новых возможностях, обновлениях и материалах;</li>
          <li>приглашения на консультации, мероприятия, вебинары или демонстрации;</li>
          <li>коммерческие предложения;</li>
          <li>рекламные и маркетинговые материалы.</li>
        </Ul>

        <H3>3. Персональные данные, используемые для рассылки</H3>
        <P>
          Для направления рекламных и информационных сообщений могут использоваться следующие персональные
          данные:
        </P>
        <Ul>
          <li>имя;</li>
          <li>номер телефона;</li>
          <li>адрес электронной почты;</li>
          <li>название компании, если оно указано пользователем;</li>
          <li>сведения о факте предоставления согласия;</li>
          <li>дата и время предоставления согласия;</li>
          <li>IP-адрес;</li>
          <li>технические сведения о форме, через которую было предоставлено согласие.</li>
        </Ul>
        <P>
          Обработка указанных персональных данных осуществляется в целях направления рекламных и
          информационных сообщений и подтверждения факта получения согласия.
        </P>

        <H3>4. Действия с персональными данными</H3>
        <P>
          В рамках настоящего согласия оператор вправе осуществлять следующие действия с персональными данными:
        </P>
        <Ul>
          <li>сбор;</li>
          <li>запись;</li>
          <li>систематизацию;</li>
          <li>накопление;</li>
          <li>хранение;</li>
          <li>уточнение;</li>
          <li>использование;</li>
          <li>
            передачу подрядчикам и сервисам, привлекаемым для технической отправки сообщений (сервисам
            email-рассылок, SMS-агрегаторам, CRM-системам, сервисам автоматизации маркетинга), на основании
            договоров и с соблюдением требований законодательства о персональных данных;
          </li>
          <li>блокирование;</li>
          <li>удаление;</li>
          <li>уничтожение.</li>
        </Ul>
        <P>
          Обработка может осуществляться с использованием средств автоматизации и без использования таких
          средств.
        </P>

        <H3>5. Срок действия согласия</H3>
        <P>
          Настоящее согласие действует в течение 5 лет с даты его предоставления, но в любом случае — до
          момента его отзыва пользователем либо до прекращения оператором направления рекламных и
          информационных сообщений, в зависимости от того, что наступит раньше.
        </P>
        <P>
          Если пользователь отзовёт согласие, оператор прекращает направление рекламных и информационных
          сообщений по контактным данным пользователя, за исключением сообщений, направление которых
          допускается без отдельного рекламного согласия в соответствии с законодательством Российской
          Федерации.
        </P>

        <H3>6. Отзыв согласия</H3>
        <P>
          Пользователь вправе в любой момент отозвать настоящее согласие, направив письменное обращение на
          адрес электронной почты оператора:{" "}
          <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>.
        </P>
        <P>Иные способы отзыва согласия настоящим документом не предусмотрены.</P>
        <P>
          Отзыв согласия не влияет на законность обработки персональных данных и направления сообщений,
          осуществлённых до момента получения отзыва.
        </P>
        <P>
          После получения отзыва оператор прекращает направление рекламных и информационных сообщений не
          позднее одного рабочего дня с момента получения отзыва, если иной срок не установлен
          законодательством Российской Федерации.
        </P>

        <H3>7. Связь с Политикой обработки персональных данных</H3>
        <P>
          Обработка персональных данных для рассмотрения заявки, подготовки ответа и связи по обращению
          регулируется отдельно:
        </P>
        <Ul>
          <li>
            <Link href="/privacy" style={{ fontWeight: 600, textDecoration: "underline" }}>
              Политикой в отношении обработки персональных данных
            </Link>
            ;
          </li>
          <li>
            <Link href="/consent" style={{ fontWeight: 600, textDecoration: "underline" }}>
              Согласием на обработку персональных данных
            </Link>
            .
          </li>
        </Ul>
        <P>
          Настоящее согласие не является условием отправки заявки на сайте и не влияет на возможность
          направить обращение через форму.
        </P>

        <H3>8. Фактическое состояние сайта</H3>
        <P>
          На момент публикации настоящего согласия отправка формы на сайте{" "}
          <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink> не приводит к добавлению пользователя в
          рекламную рассылку, если пользователь не проставил отдельную отметку о согласии на получение
          рекламных и информационных сообщений.
        </P>
        <P>
          Интеграция с CRM, сервисами отправки сообщений и сценарии рассылки настраиваются оператором
          отдельно. До начала фактической рассылки оператор обеспечивает наличие подтверждённого согласия
          пользователя на получение рекламных и информационных сообщений.
        </P>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
        >
          {versionLine}
        </Typography>

        <LegalDocFooterLinks />
      </Stack>
    </LegalPageShell>
  );
}
