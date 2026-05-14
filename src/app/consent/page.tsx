import type { Metadata } from "next";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalDocFooterLinks } from "@/components/legal/LegalDocFooterLinks";
import { siteConfig } from "@/config/site";
import { legalConfig } from "@/config/legal";
import { siteLayout } from "@/theme/siteUi";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description: `Текст согласия субъекта персональных данных на обработку ПДн при заполнении формы на сайте ${siteConfig.brandName}.`,
  alternates: { canonical: "/consent" },
  openGraph: {
    title: `Согласие на обработку ПДн | ${siteConfig.brandName}`,
    url: `${siteConfig.siteUrl}/consent`,
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

export default function ConsentPage() {
  const site = `https://${siteConfig.siteDomain}`;
  const consentVersionLine = `Версия ${legalConfig.consentVersion} от ${new Date(
    `${legalConfig.consentEffectiveDate}T12:00:00`,
  ).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} г.`;

  return (
    <LegalPageShell
      title="Согласие на обработку персональных данных"
      subtitle="Действует при заполнении формы на сайте и проставлении отметки о согласии на обработку персональных данных."
    >
      <Stack spacing={2} sx={{ maxWidth: siteLayout.articleMaxPx }}>
        <P>
          Настоящим я, заполняя форму на сайте{" "}
          <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink> и проставляя отметку о согласии на обработку
          персональных данных, свободно, своей волей и в своём интересе даю согласие{" "}
          <strong>{legalConfig.operatorName}</strong> на обработку моих персональных данных.
        </P>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
          Оператор персональных данных: {legalConfig.operatorName}
        </Typography>
        <Stack component="dl" spacing={0.5} sx={{ m: 0 }}>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            ИНН
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.inn}
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            ОГРН
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.ogrn}
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            Адрес
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            {legalConfig.legalAddress}
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            Сайт
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink>
          </Typography>
          <Typography component="dt" variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
            Email для обращений
          </Typography>
          <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
            <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>
          </Typography>
        </Stack>

        <H3>1. Персональные данные, на обработку которых даётся согласие</H3>
        <P>Я даю согласие на обработку следующих персональных данных, которые указываю в форме на сайте:</P>
        <Ul>
          <li>имя;</li>
          <li>номер телефона;</li>
          <li>адрес электронной почты;</li>
          <li>наименование компании, если указано в форме;</li>
          <li>содержание обращения или сообщения;</li>
          <li>иные сведения, которые я добровольно указываю в форме.</li>
        </Ul>
        <P>
          Также в целях подтверждения факта получения согласия и обеспечения безопасности сайта могут
          обрабатываться технические сведения:
        </P>
        <Ul>
          <li>дата и время отправки формы;</li>
          <li>IP-адрес;</li>
          <li>адрес страницы, с которой отправлена форма;</li>
          <li>технические данные браузера и устройства.</li>
        </Ul>

        <H3>2. Цели обработки персональных данных</H3>
        <P>Персональные данные обрабатываются в следующих целях:</P>
        <Ul>
          <li>рассмотрение моего обращения и обработка заявки;</li>
          <li>связь со мной по указанным контактным данным;</li>
          <li>подготовка и направление ответа на обращение;</li>
          <li>
            подготовка и направление материалов, коммерческого предложения или иной информации, запрошенной
            мной в обращении;
          </li>
          <li>подтверждение факта получения согласия;</li>
          <li>обеспечение безопасности сайта и предотвращение злоупотреблений при отправке форм.</li>
        </Ul>
        <P>
          Настоящее согласие не распространяется на получение рекламных и информационных сообщений. Такое
          согласие оформляется отдельно.
        </P>

        <H3>3. Действия с персональными данными</H3>
        <P>В рамках настоящего согласия оператор вправе осуществлять следующие действия с персональными данными:</P>
        <Ul>
          <li>сбор;</li>
          <li>запись;</li>
          <li>систематизацию;</li>
          <li>накопление;</li>
          <li>хранение;</li>
          <li>уточнение, обновление и изменение;</li>
          <li>извлечение;</li>
          <li>использование;</li>
          <li>
            передачу, включая предоставление и доступ, в случаях, предусмотренных{" "}
            <Link href="/privacy" style={{ fontWeight: 600, textDecoration: "underline" }}>
              Политикой в отношении обработки персональных данных
            </Link>
            ;
          </li>
          <li>обезличивание;</li>
          <li>блокирование;</li>
          <li>удаление;</li>
          <li>уничтожение.</li>
        </Ul>
        <P>
          Обработка персональных данных может осуществляться как с использованием средств автоматизации, так и
          без использования таких средств.
        </P>

        <H3>4. Передача персональных данных третьим лицам</H3>
        <P>
          Оператор не продаёт персональные данные и не передаёт их третьим лицам для самостоятельного
          использования в рекламных целях.
        </P>
        <P>Передача персональных данных возможна:</P>
        <Ul>
          <li>с согласия субъекта персональных данных;</li>
          <li>
            если передача необходима для рассмотрения обращения, обработки заявки или обеспечения работы сайта;
          </li>
          <li>если передача предусмотрена законодательством Российской Федерации;</li>
          <li>
            подрядчикам и сервисам, привлечённым оператором для обеспечения работы сайта, обработки заявок,
            хранения данных и технической поддержки.
          </li>
        </Ul>
        <P>
          Оператор может поручать обработку персональных данных третьим лицам на основании договора или иного
          законного основания при условии соблюдения требований законодательства о персональных данных.
        </P>
        <P>Для работы сайта и обработки заявок оператор использует следующие сервисы:</P>
        <Ul>
          <li>
            хостинг сайта — <strong>{legalConfig.hostingProvider}</strong>;
          </li>
          <li>
            CRM для обработки заявок — <strong>«Битрикс24»</strong> / ООО «1С-Битрикс»;
          </li>
          <li>
            веб-аналитика — <strong>Яндекс.Метрика</strong> / ООО «ЯНДЕКС», только при наличии согласия
            пользователя на аналитические cookies.
          </li>
        </Ul>
        <P>
          По вопросам передачи и обработки персональных данных можно обратиться на адрес:{" "}
          <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>.
        </P>

        <H3>5. Срок действия согласия</H3>
        <P>
          Настоящее согласие действует до достижения целей обработки персональных данных либо до момента его
          отзыва, в зависимости от того, что наступит раньше.
        </P>
        <P>
          Персональные данные могут храниться не более 3 лет с момента последнего обращения, если более
          длительный срок хранения не предусмотрен законодательством Российской Федерации, договором или
          необходимостью защиты прав и законных интересов оператора.
        </P>

        <H3>6. Отзыв согласия</H3>
        <P>
          Пользователь вправе в любой момент отозвать настоящее согласие, направив обращение на адрес:{" "}
          <MuiLink href={`mailto:${legalConfig.privacyEmail}`}>{legalConfig.privacyEmail}</MuiLink>.
        </P>
        <P>В теме письма рекомендуется указать: «Отзыв согласия на обработку ПДн».</P>
        <P>
          Отзыв согласия не влияет на законность обработки персональных данных, осуществлённой до момента
          получения отзыва.
        </P>
        <P>
          После получения отзыва оператор прекращает обработку персональных данных и уничтожает их в срок, не
          превышающий 30 дней с момента получения отзыва, если иной срок не установлен законодательством
          Российской Федерации или если у оператора отсутствуют иные законные основания для дальнейшей
          обработки персональных данных.
        </P>

        <H3>7. Связь с Политикой обработки персональных данных</H3>
        <P>
          Я подтверждаю, что ознакомлен(а) с{" "}
          <Link href="/privacy" style={{ fontWeight: 600, textDecoration: "underline" }}>
            Политикой в отношении обработки персональных данных
          </Link>
          , размещённой на сайте <MuiLink href={site}>{siteConfig.siteDomain}</MuiLink>.
        </P>
        <P>
          Подробная информация об операторе, целях, способах, сроках обработки, правах субъекта персональных
          данных, порядке реализации прав и мерах защиты персональных данных указана в{" "}
          <Link href="/privacy" style={{ fontWeight: 600, textDecoration: "underline" }}>
            Политике в отношении обработки персональных данных
          </Link>
          .
        </P>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
        >
          {consentVersionLine}
        </Typography>

        <LegalDocFooterLinks />
      </Stack>
    </LegalPageShell>
  );
}
